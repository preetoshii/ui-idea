import { motion } from 'framer-motion'
import Message from './Message'

const AIMessage = ({ message }) => {
  // Split content into words for streaming animation
  const words = message.content.split(' ')
  
  return (
    <Message message={message}>
      <div className="ai-message-content">
        <div className="message-bubble ai-bubble">
          <span className="message-text">
            {message.isStreaming ? (
              words.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 1.2,
                    delay: index * 0.15,
                    ease: "easeOut"
                  }}
                  style={{ display: 'inline-block', marginRight: '0.25em' }}
                >
                  {word}
                </motion.span>
              ))
            ) : (
              message.content
            )}
          </span>
        </div>
      </div>
    </Message>
  )
}

export default AIMessage