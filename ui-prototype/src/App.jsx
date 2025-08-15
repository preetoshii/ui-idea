import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import speechService from './services/speechService'
import Sidebar from './components/Sidebar/Sidebar'
import DotGridBackground from './components/DotGrid/DotGridBackground'
import Cards from './components/Cards/Cards'
import NewChatInput from './components/ChatInput/NewChatInput'
import CanvasToggle from './components/CanvasToggle/CanvasToggle'
import CanvasBorder from './components/CanvasBorder/CanvasBorder'
import AIOrb from './components/AIOrb/AIOrb'
import MessageThread from './components/MessageThread/MessageThread'
import './App.css'

function App() {
  const [sidebarHovered, setSidebarHovered] = useState(false)
  const [whiteboardMode, setWhiteboardMode] = useState(false)
  const [grayscale, setGrayscale] = useState(true)
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'user',
      content: 'Hey, can you help me understand how quantum computing works?',
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: '2',
      type: 'ai',
      content: 'Of course! Quantum computing uses quantum bits (qubits) instead of classical bits. While classical bits can only be 0 or 1, qubits can exist in a superposition of both states simultaneously.',
      timestamp: new Date(Date.now() - 50000),
      isStreaming: false
    },
    {
      id: '3',
      type: 'user',
      content: 'That sounds interesting! How does superposition actually work?',
      timestamp: new Date(Date.now() - 40000)
    },
    {
      id: '4',
      type: 'ai',
      content: 'Think of it like a coin spinning in the air - it\'s neither heads nor tails until it lands. Similarly, a qubit can be in multiple states at once until measured. This allows quantum computers to process many possibilities simultaneously, making them potentially much faster for certain types of problems.',
      timestamp: new Date(Date.now() - 30000),
      isStreaming: false
    }
  ])
  const [chatExpanded, setChatExpanded] = useState(false)
  const [singleDisplayMode, setSingleDisplayMode] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [audioLevels, setAudioLevels] = useState({ level: 0, lowFreq: 0, highFreq: 0 })

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '/') {
        e.preventDefault()
        setGrayscale(!grayscale)
      } else if (e.key === 's' && e.metaKey) {
        e.preventDefault()
        setSpeechEnabled(!speechEnabled)
        if (!speechEnabled) {
          speechService.stop()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      speechService.stop() // Stop speech on unmount
    }
  }, [grayscale, speechEnabled])
  
  // Set up audio level callback once
  useEffect(() => {
    speechService.setAudioLevelCallback((levels) => {
      setAudioLevels(levels)
    })
  }, [])

  const sendMessage = (content) => {
    if (!content.trim()) return
    
    if (!singleDisplayMode) {
      // Normal mode: Add user message
      const userMessage = {
        id: Date.now().toString(),
        type: 'user',
        content,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
    }
    
    // Simulate AI response with streaming
    setTimeout(() => {
      const responses = [
        // Super short
        "Got it! Yes, that makes sense.",
        "Absolutely! Here's how.",
        
        // Short
        "That's a great point. The key is to focus on simplicity and clarity in your approach.",
        "I understand. This typically happens when the system detects an inconsistency in the data flow.",
        
        // Medium
        "That's an interesting question! Let me think about that for a moment. The answer involves several interconnected concepts that I'll explain step by step. First, we need to understand the foundation.",
        "Great observation! This is actually quite common in distributed systems. The pattern emerges when you have multiple nodes trying to coordinate their actions. Let me break down the mechanism for you.",
        
        // Long
        "You've touched on something really fascinating here. This concept has evolved significantly over the past decade, and there are now multiple schools of thought on the best approach. The traditional method involves setting up a hierarchical structure, but newer methodologies favor a more distributed approach. Each has its trade-offs in terms of performance, maintainability, and scalability.",
        
        // Very long
        "That's an excellent question that gets to the heart of modern system design. To fully understand this, we need to consider multiple layers of abstraction. At the lowest level, we're dealing with fundamental constraints of distributed computing - things like network latency, partial failures, and the CAP theorem. Moving up a layer, we encounter architectural patterns that attempt to work within these constraints: event sourcing, CQRS, saga patterns, and more. At the application level, these patterns manifest as specific implementation choices that affect everything from user experience to operational complexity. The interplay between these layers creates emergent behaviors that can be both powerful and challenging to manage. What's particularly interesting is how different organizations have evolved different solutions to these same fundamental problems, leading to a rich ecosystem of approaches we can learn from."
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: randomResponse,
        timestamp: new Date(),
        isStreaming: true
      }
      
      if (singleDisplayMode) {
        // Single display mode: Add user message temporarily for processing
        const userMessage = {
          id: Date.now().toString(),
          type: 'user',
          content,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, userMessage, aiMessage])
      } else {
        setMessages(prev => [...prev, aiMessage])
      }
      
      // Speak the AI response if enabled
      if (speechEnabled) {
        speechService.speak(randomResponse)
      }
      
      // No need to update streaming state - the animation completes on its own
    }, 1000)
  }

  return (
    <div className={`app-container ${grayscale ? 'grayscale' : ''}`}>
      <DotGridBackground isWhiteboardMode={whiteboardMode} />
      
      <Sidebar 
        sidebarHovered={sidebarHovered}
        setSidebarHovered={setSidebarHovered}
      />

      <div 
        className="sidebar-hover-area"
        onMouseEnter={() => setSidebarHovered(true)}
      />

      <div className="main-content">
        <CanvasToggle 
          whiteboardMode={whiteboardMode}
          setWhiteboardMode={(mode) => {
            setWhiteboardMode(mode)
            setSingleDisplayMode(mode) // Activate single display when entering canvas mode
            if (mode) {
              speechService.stop() // Stop speech when entering canvas mode
            }
          }}
        />

        <AnimatePresence>
          {!whiteboardMode && <AIOrb chatExpanded={chatExpanded} audioLevels={audioLevels} />}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {whiteboardMode && <Cards />}
        </AnimatePresence>

        <AnimatePresence>
          {whiteboardMode && <CanvasBorder />}
        </AnimatePresence>

        <MessageThread 
          messages={messages} 
          isVisible={chatExpanded}
          singleDisplayMode={singleDisplayMode}
        />
        
        <NewChatInput 
          onSendMessage={sendMessage}
          onExpandedChange={setChatExpanded}
        />
      </div>
    </div>
  )
}

export default App