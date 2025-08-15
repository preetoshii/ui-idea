import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
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

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '/') {
        e.preventDefault()
        setGrayscale(!grayscale)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [grayscale])

  const sendMessage = (content) => {
    if (!content.trim()) return
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    
    // Simulate AI response with streaming
    setTimeout(() => {
      const fullResponse = "I understand your question. Let me process that for you. This response will fade in word by word to create a smooth streaming effect."
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: fullResponse,
        timestamp: new Date(),
        isStreaming: true
      }
      setMessages(prev => [...prev, aiMessage])
      
      // Mark streaming complete after animation duration
      const wordCount = fullResponse.split(' ').length
      const animationDuration = wordCount * 80 + 800 // delay + fade duration
      
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessage.id 
            ? { ...msg, isStreaming: false }
            : msg
        ))
      }, animationDuration)
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
          setWhiteboardMode={setWhiteboardMode}
        />

        <AnimatePresence>
          {!whiteboardMode && <AIOrb chatExpanded={chatExpanded} />}
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