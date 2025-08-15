import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Tooltip.css'

const Tooltip = ({ 
  children, 
  content, 
  position = 'auto', // 'top', 'bottom', 'left', 'right', 'auto'
  delay = 500 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [actualPosition, setActualPosition] = useState(position)
  const tooltipRef = useRef(null)
  const triggerRef = useRef(null)
  const timeoutRef = useRef(null)

  const calculatePosition = () => {
    if (position !== 'auto') return position
    
    const trigger = triggerRef.current
    if (!trigger) return 'top'
    
    const rect = trigger.getBoundingClientRect()
    const spaceAbove = rect.top
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceLeft = rect.left
    const spaceRight = window.innerWidth - rect.right
    
    // Prefer top/bottom over left/right
    if (spaceAbove > 100 && spaceAbove >= spaceBelow) return 'top'
    if (spaceBelow > 100) return 'bottom'
    if (spaceLeft > 150) return 'left'
    if (spaceRight > 150) return 'right'
    return 'top' // fallback
  }

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setActualPosition(calculatePosition())
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const getTooltipVariants = () => {
    const offset = 12
    const variants = {
      top: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 }
      },
      bottom: {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
      },
      left: {
        initial: { opacity: 0, x: 10 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 10 }
      },
      right: {
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -10 }
      }
    }
    return variants[actualPosition] || variants.top
  }

  return (
    <div 
      className="tooltip-wrapper"
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={`tooltip tooltip-${actualPosition}`}
            variants={getTooltipVariants()}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="tooltip-content">
              {content}
            </div>
            <div className="tooltip-arrow" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Tooltip