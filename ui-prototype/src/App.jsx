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
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: '2',
      type: 'ai',
      content: 'Of course! Quantum computing uses quantum bits (qubits) instead of classical bits. While classical bits can only be 0 or 1, qubits can exist in a superposition of both states simultaneously.',
      timestamp: new Date(Date.now() - 590000),
      isStreaming: false
    },
    {
      id: '3',
      type: 'user',
      content: 'That sounds interesting! How does superposition actually work?',
      timestamp: new Date(Date.now() - 580000)
    },
    {
      id: '4',
      type: 'ai',
      content: 'Think of it like a coin spinning in the air - it\'s neither heads nor tails until it lands. Similarly, a qubit can be in multiple states at once until measured. This allows quantum computers to process many possibilities simultaneously, making them potentially much faster for certain types of problems.',
      timestamp: new Date(Date.now() - 570000),
      isStreaming: false
    },
    {
      id: '5',
      type: 'user',
      content: 'What kind of problems are quantum computers best at solving?',
      timestamp: new Date(Date.now() - 560000)
    },
    {
      id: '6',
      type: 'ai',
      content: 'Quantum computers excel at specific types of problems: cryptography (breaking encryption), drug discovery (simulating molecular interactions), optimization problems (finding the best solution among many possibilities), and artificial intelligence (processing complex patterns). They\'re not universally faster, but for these specific domains, they can be exponentially more powerful.',
      timestamp: new Date(Date.now() - 550000),
      isStreaming: false
    },
    {
      id: '7',
      type: 'user',
      content: 'How far are we from having practical quantum computers?',
      timestamp: new Date(Date.now() - 540000)
    },
    {
      id: '8',
      type: 'ai',
      content: 'We\'re in the "noisy intermediate-scale quantum" (NISQ) era. Companies like IBM, Google, and others have working quantum computers, but they\'re still limited by errors and can only maintain quantum states for short periods. We\'re probably 5-10 years away from truly practical, error-corrected quantum computers that can solve real-world problems better than classical computers.',
      timestamp: new Date(Date.now() - 530000),
      isStreaming: false
    },
    {
      id: '9',
      type: 'user',
      content: 'What\'s the biggest challenge in building quantum computers?',
      timestamp: new Date(Date.now() - 520000)
    },
    {
      id: '10',
      type: 'ai',
      content: 'The biggest challenge is quantum decoherence - qubits are extremely fragile and lose their quantum properties when they interact with the environment. Even tiny vibrations or temperature changes can cause errors. That\'s why quantum computers operate near absolute zero temperature and require sophisticated error correction.',
      timestamp: new Date(Date.now() - 510000),
      isStreaming: false
    },
    {
      id: '11',
      type: 'user',
      content: 'Can quantum computers replace regular computers?',
      timestamp: new Date(Date.now() - 500000)
    },
    {
      id: '12',
      type: 'ai',
      content: 'No, quantum computers won\'t replace classical computers. They\'re specialized tools for specific problems. For everyday tasks like browsing the web, writing documents, or playing games, classical computers are more practical and efficient. Think of quantum computers as powerful supplements to classical computing, not replacements.',
      timestamp: new Date(Date.now() - 490000),
      isStreaming: false
    },
    {
      id: '13',
      type: 'user',
      content: 'How do you program a quantum computer?',
      timestamp: new Date(Date.now() - 480000)
    },
    {
      id: '14',
      type: 'ai',
      content: 'Quantum programming uses specialized languages like Qiskit (IBM), Cirq (Google), or Q# (Microsoft). Instead of traditional logic gates, you work with quantum gates that manipulate qubit states. You design quantum circuits that prepare qubits, apply operations, and measure results. It requires understanding quantum mechanics principles like entanglement and interference.',
      timestamp: new Date(Date.now() - 470000),
      isStreaming: false
    },
    {
      id: '15',
      type: 'user',
      content: 'What\'s quantum entanglement?',
      timestamp: new Date(Date.now() - 460000)
    },
    {
      id: '16',
      type: 'ai',
      content: 'Quantum entanglement is when two or more qubits become correlated in such a way that the quantum state of one qubit instantly affects the other, regardless of distance. Einstein called it "spooky action at a distance." It\'s like having two coins that always land on opposite sides, no matter how far apart they are when flipped.',
      timestamp: new Date(Date.now() - 450000),
      isStreaming: false
    },
    {
      id: '17',
      type: 'user',
      content: 'Could quantum computers break current encryption?',
      timestamp: new Date(Date.now() - 440000)
    },
    {
      id: '18',
      type: 'ai',
      content: 'Yes, large-scale quantum computers could break RSA and other current encryption methods using Shor\'s algorithm. This is why there\'s a race to develop "quantum-resistant" cryptography. The good news is that we\'re likely years away from quantum computers powerful enough to break current encryption, giving us time to transition to quantum-safe algorithms.',
      timestamp: new Date(Date.now() - 430000),
      isStreaming: false
    },
    {
      id: '19',
      type: 'user',
      content: 'What companies are leading in quantum computing?',
      timestamp: new Date(Date.now() - 420000)
    },
    {
      id: '20',
      type: 'ai',
      content: 'The quantum computing race includes tech giants like IBM (with their Quantum Network), Google (achieved "quantum supremacy" in 2019), Microsoft (Azure Quantum), and Amazon (Braket). There are also specialized startups like Rigetti, IonQ, and D-Wave. Each uses different approaches - superconducting qubits, trapped ions, or quantum annealing.',
      timestamp: new Date(Date.now() - 410000),
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