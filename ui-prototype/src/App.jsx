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
  const [singleDisplayMode, setSingleDisplayMode] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [audioLevels, setAudioLevels] = useState({ level: 0, lowFreq: 0, highFreq: 0 })
  const [focusPosition, setFocusPosition] = useState(null)
  const [waitingForAI, setWaitingForAI] = useState(false)

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
    
    // Set waiting state
    setWaitingForAI(true)
    
    // Simulate AI response with streaming
    setTimeout(() => {
      const responses = [
        // Medium
        "What I'm hearing in your words is a deep yearning for something more meaningful. That feeling of restlessness you're describing often emerges when we've outgrown our current situation but haven't yet stepped into what's next. Tell me, when you imagine yourself five years from now, living a life that truly lights you up - what do you see? What are you doing differently, and perhaps more importantly, who have you become?",
        
        "That's a powerful realization you've just shared. The gap between who we are and who we're expected to be can feel overwhelming. But here's what I'm curious about - what if that discomfort is actually your inner wisdom speaking? What if it's pointing you toward a more authentic version of yourself? What would it look like to honor that voice, even in small ways?",
        
        // Long
        "I'm struck by the courage it takes to admit you're not where you want to be. That awareness itself is the beginning of transformation. What you're describing - this feeling of going through the motions, of living someone else's definition of success - is something many people experience but few have the bravery to confront. You mentioned feeling disconnected from your true self. I'm wondering if we could explore that together. What parts of yourself have you had to dim or hide to fit into your current life? And what would it mean to slowly start turning those lights back on?",
        
        "Thank you for trusting me with something so vulnerable. The pattern you're describing - giving so much of yourself that there's nothing left - is something I see in many caring, capable people. It often starts from a beautiful place of wanting to help and support others. But somewhere along the way, we can lose ourselves in the process. I'm curious about your relationship with boundaries. When you think about saying 'no' to protect your own energy and wellbeing, what comes up for you? What stories do you tell yourself about what might happen?",
        
        // Very long
        "What you're experiencing right now - this crossroads moment - is actually sacred territory. It's the space between who you've been and who you're becoming. I know it feels uncomfortable, maybe even scary, but these threshold moments are where the most profound growth happens. You mentioned feeling like you're wearing a mask, playing a role that no longer fits. That's such an important awareness. Many people go through their entire lives without recognizing that disconnect. The fact that you're feeling it, naming it, means something in you is ready for change. But here's what I want you to consider: transformation doesn't have to be dramatic or sudden. Sometimes the most sustainable changes happen through small, consistent choices that honor your authentic self. What would it look like to remove that mask for just five minutes a day? Who would you be in those moments? What would you say, do, or choose differently? And how might those five minutes gradually expand into a life that feels genuinely yours?",
        
        "I'm really moved by what you've shared. The journey you're describing - from external achievement to internal fulfillment - is one of the most important transitions we can make as human beings. You've spent years building a life that looks successful from the outside, and now you're brave enough to ask whether it actually feels successful on the inside. That takes tremendous courage. What strikes me is that you already know something needs to change. Your body knows it - you mentioned the exhaustion, the tension. Your emotions know it - the Sunday night dread, the morning heaviness. Your spirit knows it - that sense of something missing, something calling you forward. The question isn't whether to change, but how to honor this knowing in a way that feels sustainable and true to who you are. I'm wondering if we could start by exploring what 'success' actually means to you - not what you've been told it should mean, not what others expect, but what would make you feel truly alive and fulfilled. What comes up when you sit with that question?"
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
      
      // Clear waiting state
      setWaitingForAI(false)
      
      // Speak the AI response if enabled
      if (speechEnabled) {
        speechService.speak(randomResponse)
      }
      
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
            setSingleDisplayMode(mode) // Activate single display when entering canvas mode
            if (mode) {
              speechService.stop() // Stop speech when entering canvas mode
            }
          }}
        />

        <AnimatePresence>
          {!whiteboardMode && <AIOrb key="ai-orb" chatExpanded={chatExpanded} audioLevels={audioLevels} focusPosition={focusPosition} />}
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
          onFocusPositionChange={setFocusPosition}
          waitingForAI={waitingForAI}
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