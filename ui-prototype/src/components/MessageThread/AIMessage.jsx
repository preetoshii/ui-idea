import { motion } from 'framer-motion'
import Message from './Message'

const AIMessage = ({ message }) => {
  return (
    <Message message={message}>
      <div className="ai-message-content">
        <div className="message-bubble ai-bubble">
          <span className="message-text">{message.content}</span>
          {message.isStreaming && (
            <motion.span
              className="typing-cursor"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              |
            </motion.span>
          )}
        </div>
      </div>
    </Message>
  )
}

export default AIMessage