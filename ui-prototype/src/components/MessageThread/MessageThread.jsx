import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AIMessage from './AIMessage'
import UserMessage from './UserMessage'
import './MessageThread.css'

const MessageThread = ({ messages, isVisible }) => {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    const messageThread = messagesEndRef.current?.parentElement
    if (messageThread) {
      messageThread.scrollTo({
        top: messageThread.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    // Delay scroll to allow message animation to start
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [messages])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="message-thread-container"
          initial={{ y: '150vh', x: '-50%' }}
          animate={{ y: 0, x: '-50%' }}
          exit={{ y: '150vh', x: '-50%' }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 50,
            mass: 2
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