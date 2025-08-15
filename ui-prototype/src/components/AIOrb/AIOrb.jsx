import { motion } from 'framer-motion'
import './AIOrb.css'

const AIOrb = () => {
  return (
    <motion.div 
      className="ai-orb"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1,
        scale: 1,
        y: [0, -10, 0],
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        opacity: { duration: 0.3, delay: 0.6 },
        scale: { duration: 0.3, delay: 0.6 },
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    />
  )
}

export default AIOrb