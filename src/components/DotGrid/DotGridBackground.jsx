import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import './DotGridBackground.css'

const DotGridBackground = ({ isWhiteboardMode }) => {
  const controls = useAnimation()
  
  useEffect(() => {
    // Force explicit animation in both directions
    controls.set({
      rotateX: isWhiteboardMode ? 0 : 65,
      y: isWhiteboardMode ? 0 : 100,
      z: isWhiteboardMode ? 0 : -200,
      opacity: isWhiteboardMode ? 0.6 : 0.5
    })
    
    controls.start({
      rotateX: isWhiteboardMode ? 65 : 0,
      y: isWhiteboardMode ? 100 : 0,
      z: isWhiteboardMode ? -200 : 0,
      opacity: isWhiteboardMode ? 0.5 : 0.6,
      transition: {
        duration: 1.2,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    })
  }, [isWhiteboardMode, controls])
  
  return (
    <div className="dot-grid-background">
      <motion.div 
        className={`dot-grid-surface ${isWhiteboardMode ? 'scrolling' : ''}`}
        animate={controls}
      />
    </div>
  )
}

export default DotGridBackground