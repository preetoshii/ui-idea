class SpeechService {
  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY
    this.voiceId = 'L0Dsvb3SLTyegXwtm47J'
    this.modelId = 'eleven_turbo_v2'
    this.voiceSettings = {
      stability: 0.7,
      similarity_boost: 0.6,
      style: 0.4,
      use_speaker_boost: true
    }
    this.optimizeStreamingLatency = 4
    this.outputFormat = 'mp3_22050_32'
    this.defaultVolume = 0.7
    this.defaultPlaybackRate = 0.95
    
    this.currentAudio = null
    this.audioContext = null
    this.analyser = null
    this.dataArray = null
    this.audioLevelCallback = null
  }

  async speak(text) {
    try {
      // Stop any currently playing audio
      this.stop()
      
      // Make API request to ElevenLabs
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}/stream`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey
          },
          body: JSON.stringify({
            text: text,
            model_id: this.modelId,
            voice_settings: this.voiceSettings,
            optimize_streaming_latency: this.optimizeStreamingLatency,
            output_format: this.outputFormat
          })
        }
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Convert response to blob
      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      // Create and configure audio
      this.currentAudio = new Audio(audioUrl)
      this.currentAudio.volume = this.defaultVolume
      this.currentAudio.playbackRate = this.defaultPlaybackRate
      this.currentAudio.preload = 'auto'
      
      // Start playback first
      try {
        // Set up audio analysis after play is called but before it completes
        const playPromise = this.currentAudio.play()
        this.setupAudioAnalysis()
        await playPromise
        console.log('Audio playback started')
      } catch (error) {
        // Handle autoplay policy blocks
        console.warn('Audio playback blocked:', error)
      }
      
      // Clean up URL when done
      this.currentAudio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl)
        this.currentAudio = null
        // Reset audio levels
        if (this.audioLevelCallback) {
          this.audioLevelCallback({ level: 0, lowFreq: 0, highFreq: 0 })
        }
      })
      
    } catch (error) {
      console.error('Speech synthesis error:', error)
    }
  }
  
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio = null
    }
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
      this.analyser = null
    }
  }
  
  setupAudioAnalysis() {
    if (!this.currentAudio) return
    
    console.log('Setting up audio analysis')
    
    try {
      // Create audio context and analyser
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 256
      this.analyser.smoothingTimeConstant = 0.8
      
      // Connect audio element to analyser
      const source = this.audioContext.createMediaElementSource(this.currentAudio)
      source.connect(this.analyser)
      this.analyser.connect(this.audioContext.destination)
      
      // Create data array for frequency data
      const bufferLength = this.analyser.frequencyBinCount
      this.dataArray = new Uint8Array(bufferLength)
      
      console.log('Audio analysis setup complete, starting update loop')
      
      // Start animation loop
      this.updateAudioLevels()
    } catch (error) {
      console.error('Error setting up audio analysis:', error)
    }
  }
  
  updateAudioLevels() {
    if (!this.analyser || !this.currentAudio) {
      return
    }
    
    // Check if audio is actually playing
    if (this.currentAudio.paused || this.currentAudio.ended) {
      // Try again in a moment
      setTimeout(() => this.updateAudioLevels(), 100)
      return
    }
    
    if (!this.audioLevelCallback) {
      console.log('No audio level callback set')
      // Try again in case callback is set later
      setTimeout(() => this.updateAudioLevels(), 100)
      return
    }
    
    // Get frequency data
    this.analyser.getByteFrequencyData(this.dataArray)
    
    // Calculate overall level
    let sum = 0
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i]
    }
    const level = sum / (this.dataArray.length * 255)
    
    // Calculate low and high frequency levels
    const lowEnd = Math.floor(this.dataArray.length * 0.3)
    const highStart = Math.floor(this.dataArray.length * 0.7)
    
    let lowSum = 0
    let highSum = 0
    
    for (let i = 0; i < lowEnd; i++) {
      lowSum += this.dataArray[i]
    }
    for (let i = highStart; i < this.dataArray.length; i++) {
      highSum += this.dataArray[i]
    }
    
    const lowFreq = lowSum / (lowEnd * 255)
    const highFreq = highSum / ((this.dataArray.length - highStart) * 255)
    
    // Call callback with audio data
    if (this.audioLevelCallback) {
      this.audioLevelCallback({ level, lowFreq, highFreq })
      // Debug log occasionally
      if (Math.random() < 0.1) {
        console.log('Audio analysis:', { level, lowFreq, highFreq })
      }
    }
    
    // Continue animation loop
    requestAnimationFrame(() => this.updateAudioLevels())
  }
  
  setAudioLevelCallback(callback) {
    this.audioLevelCallback = callback
  }
  
  setVolume(volume) {
    this.defaultVolume = volume
    if (this.currentAudio) {
      this.currentAudio.volume = volume
    }
  }
  
  setPlaybackRate(rate) {
    this.defaultPlaybackRate = rate
    if (this.currentAudio) {
      this.currentAudio.playbackRate = rate
    }
  }
}

// Create singleton instance
const speechService = new SpeechService()

export default speechService