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
  const [messages, setMessages] = useState([])
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
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      }
      setMessages(prev => [...prev, aiMessage])
      
      // Simulate streaming text
      const fullResponse = "I'm processing your message. This is a simulated streaming response that will appear character by character."
      let index = 0
      
      const streamInterval = setInterval(() => {
        if (index < fullResponse.length) {
          const chunk = fullResponse.slice(0, index + 5) // Stream 5 chars at a time
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, content: chunk }
              : msg
          ))
          index += 5
        } else {
          // Mark streaming complete
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, isStreaming: false }
              : msg
          ))
          clearInterval(streamInterval)
        }
      }, 50)
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
          {!whiteboardMode && <AIOrb />}
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