import { motion } from 'framer-motion'
import useTooltip from '../../hooks/useTooltip'
import './CanvasToggle.css'

const CanvasToggle = ({ whiteboardMode, setWhiteboardMode }) => {
  const tooltipProps = useTooltip(
    whiteboardMode ? 'Exit canvas mode' : 'Switch to canvas mode for visual exploration'
  )
  
  return (
    <motion.div
      className={`whiteboard-toggle ${whiteboardMode ? 'active' : 'inactive'}`}
      onClick={() => setWhiteboardMode(!whiteboardMode)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        opacity: whiteboardMode ? 1 : 0.7
      }}
      {...tooltipProps}
    >
      <div className={`led-indicator ${whiteboardMode ? 'active' : ''}`} />
      Canvas Mode
    </motion.div>
  )
}

export default CanvasToggle