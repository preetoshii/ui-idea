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
      
      // Start playback
      try {
        await this.currentAudio.play()
      } catch (error) {
        // Handle autoplay policy blocks
        console.warn('Audio playback blocked:', error)
      }
      
      // Clean up URL when done
      this.currentAudio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl)
        this.currentAudio = null
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