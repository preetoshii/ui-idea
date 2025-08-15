import { motion } from 'framer-motion'
import useTooltip from '../../hooks/useTooltip'
import './CanvasToggle.css'

const CanvasToggle = ({ whiteboardMode, setWhiteboardMode }) => {
  const tooltipProps = useTooltip(
    whiteboardMode ? 'Exit activity mode' : 'Jump into interactive exercises'
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
      <div className="toggle-text">
        Activity Mode
        <span className="toggle-status">{whiteboardMode ? 'ON' : 'OFF'}</span>
      </div>
    </motion.div>
  )
}

export default CanvasToggle