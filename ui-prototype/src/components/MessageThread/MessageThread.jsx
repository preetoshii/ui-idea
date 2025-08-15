import React, { useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AIMessage from './AIMessage'
import UserMessage from './UserMessage'
import './MessageThread.css'

const MessageThread = ({ messages, isVisible, singleDisplayMode }) => {
  const messagesEndRef = useRef(null)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const messageThreadRef = useRef(null)
  const previousMessageCount = useRef(messages.length)
  
  // Disable focus mode when entering single display mode
  useEffect(() => {
    if (singleDisplayMode) {
      setFocusMode(false)
    }
  }, [singleDisplayMode])
  
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
    // Only process if this is a new message (not initial load)
    const isNewMessage = messages.length > previousMessageCount.current
    previousMessageCount.current = messages.length
    
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
        // Enter focus mode for new AI responses
        if (!singleDisplayMode) {
          setFocusMode(true)
          // Don't scroll in focus mode
        } else {
          setTimeout(() => {
            scrollToMessage(secondToLastMessage.id)
          }, 100)
        }
      } 
      // Otherwise just scroll to bottom
      else {
        setTimeout(() => {
          scrollToBottom()
        }, 100)
      }
    }
  }, [messages, singleDisplayMode])
  
  // Set up scroll detection to break focus mode
  useEffect(() => {
    if (!focusMode) return
    
    const handleWheel = (e) => {
      // Any scroll breaks focus mode
      if (e.deltaY !== 0) {
        setFocusMode(false)
      }
    }
    
    // Add listener to the document to catch all wheel events
    // Use capture phase for wheel to get it before any other handler
    document.addEventListener('wheel', handleWheel, { capture: true, passive: false })
    
    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true })
    }
  }, [focusMode])
  
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
    <>
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
          <div className={`message-thread ${focusMode ? 'has-focus' : ''}`} ref={messageThreadRef}>
        <AnimatePresence>
          {(() => {
            // Group messages into pairs
            const messagePairs = []
            for (let i = 0; i < messages.length; i++) {
              if (messages[i].type === 'user' && messages[i + 1]?.type === 'ai') {
                messagePairs.push({
                  user: messages[i],
                  ai: messages[i + 1],
                  pairIndex: messagePairs.length
                })
                i++ // Skip the AI message since we already paired it
              }
            }
            
            if (singleDisplayMode) {
              // In single display mode, only show the latest AI message
              const lastPair = messagePairs[messagePairs.length - 1]
              if (!lastPair) return null
              
              return (
                <div className="message-wrapper in-view">
                  <AIMessage message={lastPair.ai} />
                </div>
              )
            }
            
            // Regular mode: show all pairs
            return messagePairs.map((pair, pairIndex) => {
              const isLatestPair = pairIndex === messagePairs.length - 1
              const shouldHide = focusMode && !isLatestPair
              
              // Debug
              if (isLatestPair) {
                console.log('Latest pair rendering:', { 
                  focusMode, 
                  isLatestPair, 
                  pairIndex,
                  shouldApplyTransform: focusMode && isLatestPair,
                  transform: focusMode && isLatestPair ? 'translateY(-75%)' : 'none'
                })
              }
              
              return (
                <motion.div
                  key={`pair-${pair.user.id}-${pair.ai.id}`}
                  className={`message-pair ${focusMode && isLatestPair ? 'focus-mode' : ''}`}
                  animate={{
                    y: shouldHide ? '-150%' : focusMode && isLatestPair ? '-75%' : 0,
                    opacity: shouldHide ? 0 : 1
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  style={{
                    position: focusMode && isLatestPair ? 'fixed' : 'relative',
                    top: focusMode && isLatestPair ? '50%' : 'auto',
                    left: focusMode && isLatestPair ? '0' : 'auto',
                    right: focusMode && isLatestPair ? '0' : 'auto',
                    margin: focusMode && isLatestPair ? '0 auto' : '0',
                    zIndex: focusMode && isLatestPair ? 100 : 1,
                    width: focusMode && isLatestPair ? '900px' : '100%',
                    maxWidth: focusMode && isLatestPair ? '90vw' : '100%',
                  }}
                >
                  <div className="message-wrapper in-view" data-message-id={pair.user.id}>
                    <UserMessage message={pair.user} />
                  </div>
                  <div className="message-wrapper in-view last-in-pair" data-message-id={pair.ai.id}>
                    <AIMessage message={pair.ai} />
                  </div>
                </motion.div>
              )
            })
          })()}
        </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  )
}

export default React.memo(MessageThread)