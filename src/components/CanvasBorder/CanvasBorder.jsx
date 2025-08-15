import { motion } from 'framer-motion'
import './CanvasBorder.css'

const CanvasBorder = () => {
  return (
    <motion.div 
      className="canvas-border"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.6,
        ease: "easeInOut"
      }}
    />
  )
}

export default CanvasBorder