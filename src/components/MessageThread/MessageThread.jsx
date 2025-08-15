import React, { useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AIMessage from './AIMessage'
import UserMessage from './UserMessage'
import './MessageThread.css'

const MessageThread = ({ messages, isVisible, onFocusPositionChange, waitingForAI, onTransitioningInChange }) => {
  const messagesEndRef = useRef(null)
  const [hasInitialized, setHasInitialized] = useState(false)
  const messageThreadRef = useRef(null)
  const previousMessageCount = useRef(messages.length)
  const [currentPairIndex, setCurrentPairIndex] = useState(null)
  const [dynamicPadding, setDynamicPadding] = useState(100)
  const [showDebug, setShowDebug] = useState(false)
  const [focusedAIPosition, setFocusedAIPosition] = useState(null)
  const [isTransitioningIn, setIsTransitioningIn] = useState(false)
  const previousIsVisible = useRef(isVisible)
  
  
  useEffect(() => {
    if (isVisible && !hasInitialized) {
      setHasInitialized(true)
    }
  }, [isVisible, hasInitialized])
  
  // Set up debug toggle
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ']') {
        e.preventDefault()
        setShowDebug(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])
  
  // Calculate dynamic padding based on viewport and last pair
  useEffect(() => {
    const PADDING_MODIFIER = 1.8 // Increase this to add more padding (1.0 = centered, 1.5 = 50% more padding, etc.)
    
    const calculatePadding = () => {
      const scrollWrapper = messageThreadRef.current?.parentElement
      if (!scrollWrapper) return
      
      const messagePairs = scrollWrapper.querySelectorAll('.message-pair')
      const lastPair = messagePairs[messagePairs.length - 1]
      
      if (lastPair) {
        // Get viewport height and last pair height
        const viewportHeight = scrollWrapper.clientHeight
        const lastPairHeight = lastPair.offsetHeight
        
        // Calculate padding needed to center the last pair when scrolled to bottom
        // We want the last pair to be centered, so we need (viewport - pairHeight) / 2
        const basePadding = (viewportHeight - lastPairHeight) / 2
        const modifiedPadding = basePadding * PADDING_MODIFIER
        const idealPadding = Math.max(100, modifiedPadding)
        
        setDynamicPadding(Math.round(idealPadding))
      }
    }
    
    // Calculate on mount and when messages change
    const timer = setTimeout(calculatePadding, 100)
    
    // Also recalculate on window resize
    window.addEventListener('resize', calculatePadding)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', calculatePadding)
    }
  }, [messages, isVisible])

  const scrollToLatestPair = () => {
    const scrollWrapper = messagesEndRef.current?.parentElement?.parentElement
    if (scrollWrapper) {
      // Find the last message pair
      const messagePairs = scrollWrapper.querySelectorAll('.message-pair')
      const lastPair = messagePairs[messagePairs.length - 1]
      
      if (lastPair) {
        // Get the position of the last pair
        const pairTop = lastPair.offsetTop
        // Calculate scroll position to put the pair 20vh from top
        const viewportOffset = scrollWrapper.clientHeight * 0.2 // 20vh
        const targetScroll = pairTop - viewportOffset
        
        scrollWrapper.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        })
      }
    }
  }
  
  const scrollToMessage = (messageId) => {
    const scrollWrapper = messagesEndRef.current?.parentElement?.parentElement
    if (scrollWrapper) {
      const messageElement = document.querySelector(`[data-message-id="${messageId}"]`)
      if (messageElement) {
        const containerTop = scrollWrapper.offsetTop
        const messageTop = messageElement.offsetTop
        // Scroll so the message appears at the top of the container
        scrollWrapper.scrollTo({
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
    
    if (isNewMessage && messages.length > 0) {
      // Calculate the index of the last pair
      const totalPairs = Math.floor(messages.length / 2)
      const lastPairIndex = totalPairs - 1
      
      // Set focus mode to the newest pair
      setCurrentPairIndex(lastPairIndex)
      
      // Scroll to position the latest pair near the top
      setTimeout(() => {
        scrollToLatestPair()
      }, 50) // Minimal delay just to ensure DOM is updated
    }
  }, [messages])
  
  
  // Set up intersection observer for fade effect
  useEffect(() => {
    const scrollWrapper = messagesEndRef.current?.parentElement?.parentElement
    if (!scrollWrapper) return
    
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
        root: scrollWrapper,
        threshold: 0.75, // Trigger when 75% visible
        rootMargin: '0px'
      }
    )
    
    // Observe all message wrappers
    const messageWrappers = scrollWrapper.querySelectorAll('.message-wrapper')
    messageWrappers.forEach(wrapper => observer.observe(wrapper))
    
    return () => observer.disconnect()
  }, [messages])
  
  // Detect which message pair is currently in view
  useEffect(() => {
    if (!isVisible) return
    
    const scrollWrapper = messageThreadRef.current?.parentElement
    if (!scrollWrapper) return
    
    // Track scroll direction
    let lastScrollTop = scrollWrapper.scrollTop
    
    // Function to find the most centered pair
    const findCenteredPair = () => {
      const currentScrollTop = scrollWrapper.scrollTop
      const isScrollingUp = currentScrollTop < lastScrollTop
      lastScrollTop = currentScrollTop
      
      const messagePairs = scrollWrapper.querySelectorAll('.message-pair')
      let bestIndex = null
      let bestDistance = Infinity
      
      messagePairs.forEach((pair, index) => {
        const rect = pair.getBoundingClientRect()
        const scrollRect = scrollWrapper.getBoundingClientRect()
        
        // Calculate relative position
        const pairCenter = rect.top + rect.height / 2
        const viewportCenter = scrollRect.top + scrollRect.height / 2
        let distance = Math.abs(pairCenter - viewportCenter)
        
        // Bias distance based on scroll direction
        if (isScrollingUp && pairCenter < viewportCenter) {
          // When scrolling up, favor pairs above center
          distance *= 0.8 // Make upper pairs more attractive
        } else if (!isScrollingUp && pairCenter > viewportCenter) {
          // When scrolling down, slightly penalize pairs below center
          distance *= 1.1 // Make lower pairs less attractive
        }
        
        // Check if pair is reasonably visible
        const visibleTop = Math.max(0, rect.top - scrollRect.top)
        const visibleBottom = Math.min(scrollRect.height, rect.bottom - scrollRect.top)
        const visibleHeight = visibleBottom - visibleTop
        const visibilityRatio = visibleHeight / rect.height
        
        // Use different thresholds based on scroll direction
        const minVisibility = isScrollingUp ? 0.15 : 0.25
        
        if (visibilityRatio > minVisibility && distance < bestDistance) {
          bestDistance = distance
          bestIndex = index
        }
      })
      
      if (bestIndex !== null) {
        setCurrentPairIndex(bestIndex)
      }
    }
    
    // Intersection observer with dual thresholds
    const observer = new IntersectionObserver(
      (entries) => {
        // When any threshold is crossed, re-evaluate all pairs
        findCenteredPair()
      },
      {
        root: scrollWrapper,
        threshold: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7] // More thresholds for higher sensitivity
      }
    )
    
    // Lightweight scroll handler for additional robustness
    let scrollTimeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(findCenteredPair, 30) // Faster response
    }
    
    // Initial evaluation
    findCenteredPair()
    
    // Observe all message pairs
    const messagePairs = scrollWrapper.querySelectorAll('.message-pair')
    messagePairs.forEach(pair => observer.observe(pair))
    
    // Add scroll listener
    scrollWrapper.addEventListener('scroll', handleScroll)
    
    return () => {
      observer.disconnect()
      scrollWrapper.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [messages, isVisible])

  // Find the latest AI message
  const latestAIMessage = messages.filter(m => m.type === 'ai').slice(-1)[0]
  
  // Update AI position to track focused pair's AI message
  useEffect(() => {
    const totalPairs = Math.floor(messages.length / 2)
    const isInFocusMode = currentPairIndex === totalPairs - 1
    
    // Detect if we're transitioning from hidden to visible while in focus mode
    const isOpeningInFocusMode = !previousIsVisible.current && isVisible && isInFocusMode
    previousIsVisible.current = isVisible
    
    if (isOpeningInFocusMode) {
      setIsTransitioningIn(true)
      if (onTransitioningInChange) {
        onTransitioningInChange(true)
      }
      // Clear the transition flag after delay
      setTimeout(() => {
        setIsTransitioningIn(false)
        if (onTransitioningInChange) {
          onTransitioningInChange(false)
        }
      }, 1000)
    }
    
    // When waiting for AI response, maintain the current position
    if (waitingForAI && focusedAIPosition) {
      // Keep the orb where it is - don't update or reset
      return
    }
    
    if (!isVisible || !isInFocusMode) {
      // Not in focus mode and not waiting - reset position
      setFocusedAIPosition(null)
      if (onFocusPositionChange) {
        onFocusPositionChange(null)
      }
      return
    }
    
    let scrollTimeout = null
    
    const updateAIPosition = () => {
      // Find the AI message in the last pair
      const messagePairs = messageThreadRef.current?.querySelectorAll('.message-pair')
      const lastPair = messagePairs?.[totalPairs - 1]
      
      if (lastPair) {
        const aiMessage = lastPair.querySelector('.ai-message-content')
        if (aiMessage) {
          const rect = aiMessage.getBoundingClientRect()
          const newPosition = {
            left: rect.left - 150 - 100, // Position orb to the left (150px gap) and center it (100px for half orb width)
            top: rect.top + rect.height / 2 - 100 // Center vertically on AI message (100px for half orb height)
          }
          setFocusedAIPosition(newPosition)
          // Notify parent component of position change
          if (onFocusPositionChange) {
            onFocusPositionChange(newPosition)
          }
        }
      }
    }
    
    // Debounced scroll handler for smoother updates
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(updateAIPosition, 100) // Update after 100ms
    }
    
    // Update position with a slight delay to ensure DOM is ready
    // Add extra delay when transitioning in from hidden state
    const positionDelay = isOpeningInFocusMode ? 1000 : 100
    const timer = setTimeout(updateAIPosition, positionDelay)
    
    // Also update on scroll to track position changes
    const scrollWrapper = messageThreadRef.current?.parentElement
    if (scrollWrapper) {
      scrollWrapper.addEventListener('scroll', handleScroll)
    }
    
    return () => {
      clearTimeout(timer)
      if (scrollTimeout) clearTimeout(scrollTimeout)
      if (scrollWrapper) {
        scrollWrapper.removeEventListener('scroll', handleScroll)
      }
    }
  }, [currentPairIndex, messages, isVisible, onFocusPositionChange, waitingForAI, focusedAIPosition])

  return (
    <>
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="message-thread-container"
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
          <motion.div 
            className="message-thread-scroll-wrapper"
            animate={{
              opacity: waitingForAI ? 0 : 1
            }}
            transition={{
              opacity: {
                duration: waitingForAI ? 0.3 : 0.5,
                delay: waitingForAI ? 0 : 0.4
              }
            }}
          >
            <div className="message-thread" ref={messageThreadRef} style={{ paddingBottom: `${dynamicPadding}px` }}>
            {/* Debug indicator */}
            {showDebug && (
              <>
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
                
                {/* Viewport center indicator */}
                <div style={{
                  position: 'absolute',
                  left: '0',
                  right: '0',
                  top: '50%',
                  height: '2px',
                  background: 'rgba(255, 0, 0, 0.5)',
                  pointerEvents: 'none',
                  zIndex: 999
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '-10px',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255, 0, 0, 0.8)',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}>
                    CENTER
                  </div>
                </div>
                
                {/* 30% visibility threshold indicators */}
                <div style={{
                  position: 'absolute',
                  left: '0',
                  right: '0',
                  top: '35%',
                  height: '1px',
                  background: 'rgba(0, 255, 0, 0.3)',
                  pointerEvents: 'none',
                  zIndex: 999
                }} />
                <div style={{
                  position: 'absolute',
                  left: '0',
                  right: '0',
                  bottom: '35%',
                  height: '1px',
                  background: 'rgba(0, 255, 0, 0.3)',
                  pointerEvents: 'none',
                  zIndex: 999
                }} />
              </>
            )}
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
            
            // Show all pairs
            return messagePairs.map((pair, pairIndex) => {
              const isLatestPair = pairIndex === messagePairs.length - 1
              const isCurrentPair = pairIndex === currentPairIndex
              
              // Focus mode when viewing the last pair
              const focusModeActive = currentPairIndex === messagePairs.length - 1
              
              const scale = isLatestPair && focusModeActive ? 1.15 : 1
              const opacity = !isLatestPair && focusModeActive ? 0.05 : 1 // Use 0.05 instead of 0 for observer compatibility
              
              return (
                <motion.div
                  key={`pair-${pair.user.id}-${pair.ai.id}`}
                  className={`message-pair ${isLatestPair ? 'latest-pair' : ''} ${focusModeActive ? 'focus-active' : ''}`}
                  data-pair-index={pairIndex}
                  animate={{
                    scale,
                    opacity
                  }}
                  transition={{
                    scale: { 
                      duration: 0.6, 
                      ease: "easeInOut"
                    },
                    opacity: { 
                      duration: 0.5, 
                      ease: "easeInOut" 
                    }
                  }}
                  style={{
                    transformOrigin: 'center center'
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
        </motion.div>
      )}
    </AnimatePresence>
  </>
  )
}

export default React.memo(MessageThread)