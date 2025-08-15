import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
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

  if (!isVisible) return null

  return (
    <div className="message-thread-container">
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
    </div>
  )
}

export default MessageThread