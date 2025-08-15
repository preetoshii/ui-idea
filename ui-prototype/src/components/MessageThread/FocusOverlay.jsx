import { motion, AnimatePresence } from 'framer-motion'
import AIMessage from './AIMessage'
import UserMessage from './UserMessage'
import './FocusOverlay.css'

const FocusOverlay = ({ messages, focusMode }) => {
  // Get the latest exchange
  const lastUserIndex = messages.findLastIndex(m => m.type === 'user')
  const focusedMessages = lastUserIndex >= 0 ? messages.slice(lastUserIndex) : []
  
  return (
    <AnimatePresence>
      {focusMode && (
        <motion.div 
          className="focus-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="focus-content"
            initial={{ scale: 0.8, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 100 }}
            transition={{ 
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {focusedMessages.map((message) => (
              <div 
                key={message.id} 
                className="focus-message-wrapper"
              >
                {message.type === 'ai' ? (
                  <AIMessage message={message} />
                ) : (
                  <UserMessage message={message} />
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FocusOverlay