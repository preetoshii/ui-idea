import { motion } from 'framer-motion'

const Message = ({ message, children }) => {
  return (
    <motion.div
      className={`message message-${message.type}`}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ 
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      layout
    >
      {children}
    </motion.div>
  )
}

export default Message