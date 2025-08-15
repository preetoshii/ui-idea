import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useTooltip from '../../hooks/useTooltip'
import './NewChatInput.css'

const NewChatInput = React.memo(({ onSendMessage, onExpandedChange }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldPop, setShouldPop] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [shouldAnimateToggle, setShouldAnimateToggle] = useState(false)
  const inputRef = useRef(null)
  
  const chatTooltipProps = useTooltip('Switch to text mode')
  const voiceTooltipProps = useTooltip('Switch to voice mode')
  const sendTooltipProps = useTooltip('Send message')
  const pauseTooltipProps = useTooltip('Pause the session')
  const muteTooltipProps = useTooltip('Mute your mic')
  
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
    onExpandedChange?.(isExpanded)
  }, [isExpanded, onExpandedChange])
  
  const handleToggle = () => {
    setShouldAnimateToggle(true)
    setIsExpanded(!isExpanded)
    setShouldPop(true)
    setTimeout(() => {
      setShouldPop(false)
      setShouldAnimateToggle(false)
    }, 800)
    // Clear input when switching to voice mode
    if (isExpanded) {
      setInputValue('')
    }
  }
  
  return (
    <motion.div 
      className="new-chat-input"
      animate={{
        height: isExpanded ? 60 : 72,
        scale: shouldPop ? [1, 1.05, 1] : 1,
        x: '-50%'
      }}
      transition={{ 
        height: { duration: 0.2 },
        scale: { duration: 0.3, times: [0, 0.5, 1] }
      }}
    >
      <motion.div 
        style={{ display: 'flex', gap: '8px', position: 'absolute', left: '20px' }}
        animate={{ 
          opacity: isExpanded ? 0 : 1, 
          scale: isExpanded ? 0.8 : 1,
          pointerEvents: isExpanded ? 'none' : 'auto'
        }}
        transition={{ duration: 0.2 }}
      >
        <button className="voice-control-button" {...pauseTooltipProps}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <rect x="6" y="5" width="4" height="14"/>
            <rect x="14" y="5" width="4" height="14"/>
          </svg>
        </button>
        
        <button className="voice-control-button" {...muteTooltipProps}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z"/>
            <path d="M17 11a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93V21h2v-3.07A7 7 0 0 0 19 11h-2z"/>
          </svg>
        </button>
      </motion.div>
      
      <motion.div 
        className="voice-waveform-mini"
        animate={{ 
          opacity: isExpanded ? 0 : 1,
          pointerEvents: isExpanded ? 'none' : 'auto'
        }}
        transition={{ duration: 0.2 }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="waveform-bar-mini"
            animate={{
              height: isExpanded ? 10 : [10, Math.random() * 26 + 10, 10],
            }}
            transition={{
              duration: 1.5,
              repeat: isExpanded ? 0 : Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </motion.div>
      
      <motion.input
        ref={inputRef}
        className="new-chat-input-field"
        placeholder="Type something..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (inputValue.trim()) {
              onSendMessage?.(inputValue)
              setInputValue('')
            }
          }
        }}
        animate={{ 
          opacity: isExpanded ? 1 : 0,
          pointerEvents: isExpanded ? 'auto' : 'none'
        }}
        transition={{ duration: 0.2, delay: isExpanded ? 0.1 : 0 }}
      />
      
      <motion.div 
        className="mode-toggle-container" 
        onClick={isExpanded && inputValue ? undefined : handleToggle}
        whileHover={{ opacity: 0.8 }}
        transition={{ duration: 0.2 }}
        style={{ cursor: isExpanded && inputValue ? 'default' : 'pointer' }}
        {...(!isExpanded ? chatTooltipProps : (isExpanded && !inputValue ? voiceTooltipProps : {}))}
      >
        <AnimatePresence mode="wait">
          {isExpanded && inputValue ? (
            <motion.button
              key="send-button"
              className="send-button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1, background: '#555' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              onClick={(e) => {
                e.stopPropagation()
                onSendMessage?.(inputValue)
                setInputValue('')
              }}
              {...sendTooltipProps}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                <path d="M7 14l5-5 5 5M12 19V9" strokeWidth="2" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          ) : (
            <motion.div 
              key="toggle-track"
              className="mode-toggle-track"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <motion.div 
                className="mode-toggle-icon"
                initial={{
                  y: isExpanded ? 24 : 0,
                  opacity: isExpanded ? 0 : 1
                }}
                animate={{
                  y: isExpanded ? 24 : 0,
                  opacity: isExpanded ? 0 : 1
                }}
                whileHover={{ scale: 1.25 }}
                transition={{ 
                  y: { duration: 0.2 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.1 }
                }}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </motion.div>
              <motion.div 
                className="mode-toggle-icon"
                initial={{
                  y: isExpanded ? 0 : -24,
                  opacity: isExpanded ? 1 : 0
                }}
                animate={{
                  y: isExpanded ? 0 : -24,
                  opacity: isExpanded ? 1 : 0
                }}
                whileHover={{ scale: 1.25 }}
                transition={{ 
                  y: { duration: 0.2 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.1 }
                }}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 2v20M8 6v12M16 6v12M4 10v4M20 10v4" strokeLinecap="round" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
})

export default NewChatInput