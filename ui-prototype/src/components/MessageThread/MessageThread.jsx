import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AIMessage from './AIMessage'
import UserMessage from './UserMessage'
import './MessageThread.css'

const MessageThread = ({ messages, isVisible, singleDisplayMode }) => {
  const messagesEndRef = useRef(null)
  const [hasInitialized, setHasInitialized] = useState(false)
  
  useEffect(() => {
    if (isVisible && !hasInitialized) {
      setHasInitialized(true)
    }
  }, [isVisible, hasInitialized])

  const scrollToBottom = () => {
    const messageThread = messagesEndRef.current?.parentElement
    if (messageThread) {
      messageThread.scrollTo({
        top: messageThread.scrollHeight,
        behavior: 'smooth'
      })
    }
  }
  
  const scrollToMessage = (messageId) => {
    const messageThread = messagesEndRef.current?.parentElement
    if (messageThread) {
      const messageElement = document.querySelector(`[data-message-id="${messageId}"]`)
      if (messageElement) {
        const containerTop = messageThread.offsetTop
        const messageTop = messageElement.offsetTop
        // Scroll so the message appears at the top of the container
        messageThread.scrollTo({
          top: messageTop - containerTop,
          behavior: 'smooth'
        })
      }
    }
  }

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      const secondToLastMessage = messages[messages.length - 2]
      
      // If the last message is from the user, scroll to show it at the top
      if (lastMessage.type === 'user') {
        setTimeout(() => {
          scrollToMessage(lastMessage.id)
        }, 100)
      } 
      // If last message is AI and previous is user, scroll to show the user message at top
      else if (lastMessage.type === 'ai' && secondToLastMessage?.type === 'user') {
        setTimeout(() => {
          scrollToMessage(secondToLastMessage.id)
        }, 100)
      } 
      // Otherwise just scroll to bottom
      else {
        setTimeout(() => {
          scrollToBottom()
        }, 100)
      }
    }
  }, [messages])
  
  // Set up intersection observer for fade effect
  useEffect(() => {
    const messageThread = messagesEndRef.current?.parentElement
    if (!messageThread) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          } else {
            entry.target.classList.remove('in-view')
          }
        })
      },
      {
        root: messageThread,
        threshold: 0.75, // Trigger when 75% visible
        rootMargin: '0px'
      }
    )
    
    // Observe all message wrappers
    const messageWrappers = messageThread.querySelectorAll('.message-wrapper')
    messageWrappers.forEach(wrapper => observer.observe(wrapper))
    
    return () => observer.disconnect()
  }, [messages])

  // Find the latest AI message
  const latestAIMessage = messages.filter(m => m.type === 'ai').slice(-1)[0]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className={`message-thread-container ${singleDisplayMode ? 'single-display' : ''}`}
          initial={hasInitialized ? false : { y: '150vh', x: '-50%', opacity: 0 }}
          animate={{ 
            y: 0, 
            x: '-50%',
            opacity: 1,
            transition: {
              duration: 2.0,
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 1.5, ease: "easeOut" }
            }
          }}
          exit={{ 
            y: '150vh', 
            x: '-50%',
            opacity: 0,
            transition: {
              duration: 3.5,
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 2.5, ease: "easeIn" }
            }
          }}
        >
          <div className="message-thread">
        <AnimatePresence>
          {messages.map((message) => {
            const isLastInPair = message.type === 'ai'
            const isLatestAI = latestAIMessage && message.id === latestAIMessage.id
            const shouldShow = !singleDisplayMode || isLatestAI
            
            if (!shouldShow) return null
            
            return (
              <div 
                key={message.id} 
                data-message-id={message.id}
                className={`message-wrapper in-view ${isLastInPair ? 'last-in-pair' : ''}`}
              >
                {message.type === 'ai' ? (
                  <AIMessage message={message} />
                ) : (
                  <UserMessage message={message} />
                )}
              </div>
            )
          })}
        </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MessageThread