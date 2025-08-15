import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './CursorTooltip.css'

const CursorTooltip = () => {
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const showTimeoutRef = useRef(null)
  const hideTimeoutRef = useRef(null)
  const pendingTooltipRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    const handleTooltipShow = (e) => {
      // Clear any existing timeouts
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current)
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
      
      // Store pending tooltip data
      pendingTooltipRef.current = {
        text: e.detail.text,
        x: e.clientX,
        y: e.clientY
      }
      
      // Show tooltip after 1 second delay
      showTimeoutRef.current = setTimeout(() => {
        setTooltip({
          visible: true,
          text: pendingTooltipRef.current.text,
          x: pendingTooltipRef.current.x,
          y: pendingTooltipRef.current.y
        })
        
        // Hide tooltip after 5 seconds
        hideTimeoutRef.current = setTimeout(() => {
          setTooltip(prev => ({ ...prev, visible: false }))
        }, 5000)
      }, 1000)
    }

    const handleTooltipHide = () => {
      // Clear any pending show timeout
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current)
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
      setTooltip(prev => ({ ...prev, visible: false }))
    }
    
    const handleClick = () => {
      handleTooltipHide()
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('show-tooltip', handleTooltipShow)
    window.addEventListener('hide-tooltip', handleTooltipHide)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('show-tooltip', handleTooltipShow)
      window.removeEventListener('hide-tooltip', handleTooltipHide)
      window.removeEventListener('click', handleClick)
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  return (
    <AnimatePresence>
      {tooltip.visible && (
        <motion.div
          className="cursor-tooltip"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          style={{
            left: mousePos.x > window.innerWidth * 0.7 
              ? mousePos.x - 20 - (tooltip.text.length * 8) // Rough estimate of tooltip width
              : mousePos.x + 20,
            top: mousePos.y - 10,
          }}
        >
          {tooltip.text}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CursorTooltip