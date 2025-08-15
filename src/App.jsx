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
import MicroText from './components/MicroText/MicroText'
import CursorTooltip from './components/CursorTooltip/CursorTooltip'
import './App.css'

function App() {
  const [sidebarHovered, setSidebarHovered] = useState(false)
  const [whiteboardMode, setWhiteboardMode] = useState(false)
  const [grayscale, setGrayscale] = useState(true)
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'user',
      content: 'I feel stuck in my career and I\'m not sure what to do next.',
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: '2',
      type: 'ai',
      content: 'I hear that you\'re feeling stuck. That\'s a challenging place to be. Before we explore what\'s next, I\'m curious - what does "stuck" feel like for you right now? What specific aspects of your career are creating this feeling?',
      timestamp: new Date(Date.now() - 590000),
      isStreaming: false
    },
    {
      id: '3',
      type: 'user',
      content: 'I\'ve been in the same role for 3 years. I\'m good at it, but I don\'t feel excited anymore. I wake up dreading work.',
      timestamp: new Date(Date.now() - 580000)
    },
    {
      id: '4',
      type: 'ai',
      content: 'Thank you for sharing that. The shift from excitement to dread is significant. It sounds like you\'ve mastered your current role - which is an achievement - but you\'re no longer growing. When you think back, what initially excited you about this work? And what\'s changed for you since then?',
      timestamp: new Date(Date.now() - 570000),
      isStreaming: false
    },
    {
      id: '5',
      type: 'user',
      content: 'I used to love the problem-solving aspect and working with my team. Now everything feels routine and political.',
      timestamp: new Date(Date.now() - 560000)
    },
    {
      id: '6',
      type: 'ai',
      content: 'It sounds like your core values - problem-solving and meaningful collaboration - aren\'t being fulfilled anymore. When you imagine your ideal workday, what would you be doing? What kinds of problems would you be solving, and who would you be working with?',
      timestamp: new Date(Date.now() - 550000),
      isStreaming: false
    },
    {
      id: '7',
      type: 'user',
      content: 'I\'d love to work on something that actually makes a difference. Maybe mentoring others or building something new.',
      timestamp: new Date(Date.now() - 540000)
    },
    {
      id: '8',
      type: 'ai',
      content: 'There\'s something powerful in what you just shared - "making a difference" and "building something new." These speak to a desire for impact and creation. Have you had any experiences, even small ones, where you\'ve mentored someone or initiated something new? How did those moments feel?',
      timestamp: new Date(Date.now() - 530000),
      isStreaming: false
    },
    {
      id: '9',
      type: 'user',
      content: 'Actually, yes. I helped onboard two junior colleagues last year and loved it. They still come to me for advice.',
      timestamp: new Date(Date.now() - 520000)
    },
    {
      id: '10',
      type: 'ai',
      content: 'That\'s beautiful - and notice how your energy shifted when you mentioned it. You\'ve already been creating the kind of impact you\'re seeking. What if this "stuck" feeling is actually your inner wisdom telling you it\'s time to expand this part of yourself? What small step could you take this week to explore this further?',
      timestamp: new Date(Date.now() - 510000),
      isStreaming: false
    },
    {
      id: '11',
      type: 'user',
      content: 'I could volunteer to lead our new hire training program. They\'ve been looking for someone.',
      timestamp: new Date(Date.now() - 500000)
    },
    {
      id: '12',
      type: 'ai',
      content: 'Look at that - you\'ve just identified a concrete opportunity that aligns with what lights you up! How does it feel to consider taking this on? And what support would you need to make this happen while managing your current responsibilities?',
      timestamp: new Date(Date.now() - 490000),
      isStreaming: false
    },
    {
      id: '13',
      type: 'user',
      content: 'It feels scary but exciting. I\'d need to talk to my manager about adjusting my workload.',
      timestamp: new Date(Date.now() - 480000)
    },
    {
      id: '14',
      type: 'ai',
      content: 'Scary but exciting - that\'s often the feeling that comes right before growth. You\'re already thinking strategically about making it work. What would you need to believe about yourself to have that conversation with your manager? What\'s the worst that could happen, and how would you handle it?',
      timestamp: new Date(Date.now() - 470000),
      isStreaming: false
    },
    {
      id: '15',
      type: 'user',
      content: 'I guess I need to believe that my development matters too. Worst case, they say no and I\'m where I am now.',
      timestamp: new Date(Date.now() - 460000)
    },
    {
      id: '16',
      type: 'ai',
      content: 'What a powerful realization - "my development matters too." That\'s not just about career; that\'s about honoring who you\'re becoming. And you\'re right - a "no" leaves you exactly where you are, but a "yes" opens new doors. What would it mean for you to fully embrace that your growth and fulfillment matter?',
      timestamp: new Date(Date.now() - 450000),
      isStreaming: false
    },
    {
      id: '17',
      type: 'user',
      content: 'I think I\'ve been putting everyone else\'s needs first. Maybe it\'s time to advocate for myself.',
      timestamp: new Date(Date.now() - 440000)
    },
    {
      id: '18',
      type: 'ai',
      content: 'This is a profound shift you\'re describing. Moving from "everyone else first" to "my growth matters too" is transformational. As you prepare to advocate for yourself, what strengths do you already have that will support you? And how do you want to feel after that conversation, regardless of the outcome?',
      timestamp: new Date(Date.now() - 430000),
      isStreaming: false
    },
    {
      id: '19',
      type: 'user',
      content: 'I\'m good at presenting ideas clearly. I want to feel proud that I spoke up for what I want.',
      timestamp: new Date(Date.now() - 420000)
    },
    {
      id: '20',
      type: 'ai',
      content: 'You\'ve just defined success beautifully - it\'s not about the outcome, it\'s about showing up authentically for yourself. You have the skills (clear communication) and the vision (feeling proud for speaking up). When will you have this conversation? And how will you celebrate taking this step, regardless of the result?',
      timestamp: new Date(Date.now() - 410000),
      isStreaming: false
    }
  ])
  const [chatExpanded, setChatExpanded] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [audioLevels, setAudioLevels] = useState({ level: 0, lowFreq: 0, highFreq: 0 })
  const [focusPosition, setFocusPosition] = useState(null)
  const [waitingForAI, setWaitingForAI] = useState(false)
  const [isTransitioningIn, setIsTransitioningIn] = useState(false)
  const [collapsedMode, setCollapsedMode] = useState(false)

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
      } else if (e.key === '[') {
        e.preventDefault()
        setCollapsedMode(!collapsedMode)
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
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    
    // Set waiting state
    setWaitingForAI(true)
    
    // Simulate AI response with streaming
    setTimeout(() => {
      const responses = [
        "I hear that you're feeling stuck. That takes courage to admit. What's one small thing that used to bring you joy that you've stopped doing?",
        
        "It sounds like you're ready for a change but unsure where to start. That's completely normal. What would your ideal day look like if there were no limitations?",
        
        "Thank you for sharing something so vulnerable. The exhaustion you're describing is real. When was the last time you did something just for yourself?",
        
        "What you're experiencing is more common than you think. Many people feel this disconnect between who they are and who they're expected to be. What part of yourself do you miss the most?",
        
        "I'm hearing that you want more meaning in your life. That's a powerful realization. If you could change one thing about your daily routine tomorrow, what would it be?",
        
        "It's brave to acknowledge when things aren't working. Your feelings are valid and important. What would 'success' mean to you if no one else's opinion mattered?",
        
        "The fact that you're questioning things shows growth is already happening. Change doesn't have to be dramatic. What's one boundary you wish you could set?",
        
        "I can sense the weight you're carrying. You don't have to have all the answers right now. What would it feel like to give yourself permission to not be perfect?"
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: randomResponse,
        timestamp: new Date(),
        isStreaming: true
      }
      
      setMessages(prev => [...prev, aiMessage])
      
      // Speak the AI response if enabled
      if (speechEnabled) {
        speechService.speak(randomResponse)
      }
      
      // Clear waiting state with delay to ensure position is calculated
      setTimeout(() => {
        setWaitingForAI(false)
      }, 200) // Additional delay for position calculation
      
      // No need to update streaming state - the animation completes on its own
    }, 1000)
  }

  return (
    <div className={`app-container ${grayscale ? 'grayscale' : ''}`}>
      <CursorTooltip />
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
            if (mode) {
              speechService.stop() // Stop speech when entering canvas mode
            }
          }}
        />

        <AnimatePresence>
          {!whiteboardMode && <AIOrb key="ai-orb" chatExpanded={chatExpanded} audioLevels={audioLevels} focusPosition={focusPosition} waitingForAI={waitingForAI} isTransitioningIn={isTransitioningIn} />}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {whiteboardMode && <Cards />}
        </AnimatePresence>

        <AnimatePresence>
          {whiteboardMode && <CanvasBorder />}
        </AnimatePresence>

        <MessageThread 
          messages={messages} 
          isVisible={chatExpanded && !whiteboardMode && !collapsedMode}
          onFocusPositionChange={setFocusPosition}
          waitingForAI={waitingForAI}
          onTransitioningInChange={setIsTransitioningIn}
        />
        
        <MicroText 
          messages={messages}
          isVisible={chatExpanded && (collapsedMode || whiteboardMode)}
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