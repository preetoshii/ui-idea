import { motion } from 'framer-motion'
import './CanvasToggle.css'

const CanvasToggle = ({ whiteboardMode, setWhiteboardMode }) => {
  return (
    <motion.div
      className={`whiteboard-toggle ${whiteboardMode ? 'active' : 'inactive'}`}
      onClick={() => setWhiteboardMode(!whiteboardMode)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        opacity: whiteboardMode ? 1 : 0.7
      }}
    >
      <div className={`led-indicator ${whiteboardMode ? 'active' : ''}`} />
      Canvas Mode
    </motion.div>
  )
}

export default CanvasToggle