import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AIMessage from '../MessageThread/AIMessage'
import UserMessage from '../MessageThread/UserMessage'
import './MicroText.css'

const MicroText = ({ messages, isVisible, waitingForAI }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  // Find the latest AI message
  const latestAIMessage = messages
    .filter(m => m.type === 'ai')
    .slice(-1)[0]
  
  // Find the user message that preceded the latest AI message
  const latestUserMessage = (() => {
    const aiIndex = messages.findIndex(m => m.id === latestAIMessage?.id)
    if (aiIndex > 0 && messages[aiIndex - 1]?.type === 'user') {
      return messages[aiIndex - 1]
    }
    return null
  })()
  
  if (!latestAIMessage) return null
  
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="micro-text-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
          
          <motion.div 
            className="micro-text-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.8,
                delay: 0.5,
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            exit={{ 
              opacity: 0,
              y: 20,
              transition: {
                duration: 0.3,
                ease: "easeIn"
              }
            }}
          >
          <div className="micro-text-content">
            <AnimatePresence>
              {isHovered && latestUserMessage && (
                <motion.div
                  className="micro-text-user-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <UserMessage message={latestUserMessage} />
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div 
              className="micro-text-wrapper"
              animate={{
                opacity: waitingForAI ? 0 : 1
              }}
              transition={{
                opacity: {
                  duration: waitingForAI ? 0.3 : 0.5,
                  delay: waitingForAI ? 0 : 0.4
                }
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <AIMessage message={latestAIMessage} />
            </motion.div>
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default React.memo(MicroText)