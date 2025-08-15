import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AIMessage from '../MessageThread/AIMessage'
import './MicroText.css'

const MicroText = ({ messages, isVisible }) => {
  // Find the latest AI message
  const latestAIMessage = messages
    .filter(m => m.type === 'ai')
    .slice(-1)[0]
  
  if (!latestAIMessage) return null
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="micro-text-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.5,
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
          <div className="micro-text-wrapper">
            <AIMessage message={latestAIMessage} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default React.memo(MicroText)