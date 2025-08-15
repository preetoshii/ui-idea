import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AIMessage from './AIMessage'
import UserMessage from './UserMessage'
import './MessageThread.css'

const MessageThread = ({ messages, isVisible }) => {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="message-thread-container"
          initial={{ y: '150vh' }}
          animate={{ y: 0 }}
          exit={{ y: '150vh' }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 200,
            mass: 0.8
          }}
        >
          <div className="message-thread">
        <AnimatePresence>
          {messages.map((message) => (
            message.type === 'ai' ? (
              <AIMessage key={message.id} message={message} />
            ) : (
              <UserMessage key={message.id} message={message} />
            )
          ))}
        </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MessageThread