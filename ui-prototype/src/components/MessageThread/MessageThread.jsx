import React, { useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AIMessage from './AIMessage'
import UserMessage from './UserMessage'
import './MessageThread.css'

const MessageThread = ({ messages, isVisible, singleDisplayMode }) => {
  const messagesEndRef = useRef(null)
  const [hasInitialized, setHasInitialized] = useState(false)
  const messageThreadRef = useRef(null)
  const previousMessageCount = useRef(messages.length)
  const [currentPairIndex, setCurrentPairIndex] = useState(null)
  
  
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
  }, [messages, singleDisplayMode])
  
  
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
  
  // Detect which message pair is currently in view
  useEffect(() => {
    if (!isVisible) {
      console.log('Component not visible, skipping observer setup')
      return
    }
    
    // Add a small delay to ensure DOM is ready and animations are complete
    const timer = setTimeout(() => {
      const messageThread = messageThreadRef.current
      if (!messageThread) {
        console.log('No messageThread ref after timeout!')
        return
      }
      
      console.log('Setting up intersection observer on:', messageThread)
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible entry
        let mostVisibleEntry = null
        let maxRatio = 0
        
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            mostVisibleEntry = entry
          }
        })
        
        // Only update if we have a clearly most visible entry (>50% visible)
        if (mostVisibleEntry && mostVisibleEntry.intersectionRatio > 0.5) {
          const pairIndex = parseInt(mostVisibleEntry.target.dataset.pairIndex)
          setCurrentPairIndex(prevIndex => {
            // Only update if it's actually different
            if (prevIndex !== pairIndex) {
              console.log('Current pair changed from', prevIndex, 'to', pairIndex)
              return pairIndex
            }
            return prevIndex
          })
        }
      },
      {
        root: messageThread,
        rootMargin: '-20% 0px -20% 0px', // Only consider the middle 60% of viewport
        threshold: [0.5] // Only fire when crossing 50% visibility
      }
    )
    
    // Observe all message pairs
    const messagePairs = messageThread.querySelectorAll('.message-pair')
    messagePairs.forEach(pair => observer.observe(pair))
    
    return () => observer.disconnect()
    }, 100) // 100ms delay
    
    return () => {
      clearTimeout(timer)
    }
  }, [messages, isVisible])

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
          <div className="message-thread" ref={messageThreadRef}>
            {/* Debug indicator */}
            <div style={{
              position: 'fixed',
              top: '10px',
              right: '10px',
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '14px',
              fontFamily: 'monospace',
              zIndex: 1000
            }}>
              <div>Current Pair: {currentPairIndex !== null ? currentPairIndex + 1 : 'None'}</div>
              <div>Total Pairs: {Math.floor(messages.length / 2)}</div>
              <div style={{color: currentPairIndex === Math.floor(messages.length / 2) - 1 ? '#4CAF50' : '#f44336'}}>
                Focus: {currentPairIndex === Math.floor(messages.length / 2) - 1 ? 'ON' : 'OFF'}
              </div>
            </div>
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
              const isCurrentPair = pairIndex === currentPairIndex
              
              // Focus mode when viewing the last pair
              const focusModeActive = currentPairIndex === messagePairs.length - 1
              
              const scale = isLatestPair && focusModeActive ? 1.15 : 1
              const opacity = !isLatestPair && focusModeActive ? 0.3 : 1
              
              return (
                <motion.div
                  key={`pair-${pair.user.id}-${pair.ai.id}`}
                  className={`message-pair ${isLatestPair ? 'latest-pair' : ''}`}
                  data-pair-index={pairIndex}
                  animate={{
                    scale,
                    opacity
                  }}
                  transition={{
                    scale: { duration: 0.3, ease: "easeOut" },
                    opacity: { duration: 0.3, ease: "easeOut" }
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