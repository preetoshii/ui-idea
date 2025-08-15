import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
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

  const scrollToHideLastMessage = () => {
    const messageThread = messagesEndRef.current?.parentElement
    if (messageThread && messages.length > 1) {
      // Get all message elements except the new one (which hasn't rendered yet)
      const messageElements = messageThread.querySelectorAll('.message-wrapper')
      if (messageElements.length >= messages.length - 1) {
        const secondToLastMessage = messageElements[messageElements.length - 2]
        if (secondToLastMessage) {
          const secondToLastBottom = secondToLastMessage.offsetTop + secondToLastMessage.offsetHeight
          // Scroll to position where the last message is just out of view
          messageThread.scrollTo({
            top: secondToLastBottom + 40, // +40 to account for gap between messages
            behavior: 'smooth'
          })
        }
      }
    }
  }

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      
      // If the last message is from the user and there were previous messages
      if (lastMessage.type === 'user' && messages.length > 1) {
        // First scroll to hide the previous last message
        scrollToHideLastMessage()
        // Then after a delay, scroll to show the new message normally
        setTimeout(() => {
          scrollToBottom()
        }, 800)
      } else {
        // For AI messages or first message, scroll to bottom as usual
        setTimeout(() => {
          scrollToBottom()
        }, 100)
      }
    }
  }, [messages])

  // Message wrapper component with intersection observer
  const MessageWrapper = ({ message, isLastInPair }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { 
      amount: 0.75, // Trigger when 75% is visible (fade out when 25% is out of view)
      margin: "0px"
    })
    
    return (
      <motion.div 
        ref={ref}
        className={`message-wrapper ${isLastInPair ? 'last-in-pair' : ''}`}
        animate={{ 
          opacity: isInView ? 1 : 0,
          transition: { duration: 0.5, ease: "easeInOut" }
        }}
      >
        {message.type === 'ai' ? (
          <AIMessage message={message} />
        ) : (
          <UserMessage message={message} />
        )}
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="message-thread-container"
          initial={{ y: '150vh', x: '-50%', opacity: 0 }}
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
          {messages.map((message, index) => (
            <MessageWrapper 
              key={message.id} 
              message={message} 
              isLastInPair={message.type === 'ai'}
            />
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