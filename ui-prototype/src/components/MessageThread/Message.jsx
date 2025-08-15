import { motion } from 'framer-motion'

const Message = ({ message, children }) => {
  return (
    <motion.div
      className={`message message-${message.type}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

export default Message