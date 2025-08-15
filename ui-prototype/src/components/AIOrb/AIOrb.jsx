import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import useTooltip from '../../hooks/useTooltip'
import './AIOrb.css'

const AIOrb = ({ chatExpanded, audioLevels = { level: 0, lowFreq: 0, highFreq: 0 } }) => {
  // Create lagged versions of audio levels for different blob behaviors
  const [laggedLevels, setLaggedLevels] = useState({ level: 0, lowFreq: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [previousVolume, setPreviousVolume] = useState(1)
  const [shouldPop, setShouldPop] = useState(false)
  
  const tooltipProps = useTooltip('Maz the Coach')
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLaggedLevels({
        level: audioLevels.level,
        lowFreq: audioLevels.lowFreq
      })
    }, 100) // 100ms lag
    return () => clearTimeout(timer)
  }, [audioLevels])
  
  const handleMuteToggle = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation()
    }
    
    // Trigger pop animation
    setShouldPop(true)
    setTimeout(() => setShouldPop(false), 400)
    
    if (!isMuted) {
      // Store current volume before muting
      const currentVolume = window.speechSynthesis?.volume || 1
      setPreviousVolume(currentVolume)
      if (window.speechSynthesis) {
        window.speechSynthesis.volume = 0
      }
    } else {
      // Restore previous volume
      if (window.speechSynthesis) {
        window.speechSynthesis.volume = previousVolume
      }
    }
    setIsMuted(!isMuted)
  }
  
  return (
    <motion.div 
      className="ai-orb-container"
      initial={{ 
        opacity: 0, 
        top: '50vh',
        left: '50%',
        x: '-50%',
        y: '-50%'
      }}
      animate={{ 
        opacity: 1,
        top: chatExpanded ? '11vh' : '50vh',
        left: '50%',
        x: '-50%',
        y: '-50%'
      }}
      exit={{ opacity: 0 }}
      transition={{
        opacity: { duration: 0.3 },
        top: {
          type: "spring",
          stiffness: 100,
          damping: 25
        },
        left: {
          type: "spring",
          stiffness: 100,
          damping: 25
        },
        x: { duration: 0 }, // Instant
        y: { duration: 0 }  // Instant
      }}
    >
      <motion.div
        className="ai-orb-scale-wrapper"
        onMouseEnter={(e) => {
          setIsHovered(true)
          tooltipProps.onMouseEnter(e)
        }}
        onMouseLeave={() => {
          setIsHovered(false)
          tooltipProps.onMouseLeave()
        }}
        onClick={handleMuteToggle}
        animate={{
          scale: shouldPop 
            ? 1.2 
            : isHovered 
              ? (chatExpanded ? 0.55 : 1.1) 
              : (chatExpanded ? 0.5 : 1)
        }}
        transition={{
          scale: { 
            type: "spring",
            stiffness: shouldPop ? 300 : 120,
            damping: 20,
            mass: 1
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      >
      <motion.div
        animate={{
          y: !chatExpanded ? [0, -10, 0] : 0
        }}
        transition={{
          y: {
            duration: 7.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
      <motion.div
        animate={{
          scale: 1 + audioLevels.level * 0.3,
          rotate: audioLevels.level * 10
        }}
        transition={{
          duration: 0.08,
          ease: "easeOut"
        }}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="motionBlurRed" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0,4" />
          </filter>
          <filter id="motionBlurBlue" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1,0" />
          </filter>
        </defs>
      </svg>
      <motion.svg
        className="blob blob-large"
        viewBox="0 0 200 200"
        animate={{
          rotate: [-10, 10, -10],
          x: [0, -10, 0, 10, 0],
          y: [0, -15, 0, 15, 0]
        }}
        style={{
          transform: `scale(${1 + audioLevels.lowFreq * 0.7})`
        }}
        transition={{
          rotate: {
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          },
          x: {
            duration: 17.5,
            repeat: Infinity,
            ease: "easeInOut"
          },
          y: {
            duration: 12.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <path
          d="M100,20 C125,20 150,35 160,65 C170,95 165,125 155,155 C145,185 125,195 100,195 C75,195 55,185 45,155 C35,125 30,95 40,65 C50,35 75,20 100,20 Z"
          fill="#FF6B58"
          filter="url(#motionBlurRed)"
          style={{
            opacity: 0.85 + audioLevels.lowFreq * 0.15,
            filter: `brightness(${1 + audioLevels.lowFreq * 0.4})`
          }}
        />
      </motion.svg>
      
      <motion.svg
        className="blob blob-small"
        viewBox="0 0 100 100"
        animate={{
          rotate: [0, -360],
          x: [0, 15, 0, -15, 0],
          y: [0, 10, 0, -10, 0]
        }}
        style={{
          transform: `scale(${1 + laggedLevels.level * 1.2})`,
          opacity: 0.8 + laggedLevels.level * 0.2
        }}
        transition={{
          rotate: {
            duration: 37.5,
            repeat: Infinity,
            ease: "linear"
          },
          x: {
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          },
          y: {
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <path
          d="M50,20 C65,20 75,30 75,45 C75,60 65,75 50,75 C35,75 20,65 20,50 C20,35 30,20 45,20 C47,20 49,20 50,20 Z"
          fill="#4BA3F5"
          filter="url(#motionBlurBlue)"
          style={{
            filter: `brightness(${1 + laggedLevels.level * 0.6})`
          }}
        />
      </motion.svg>
      </motion.div>
      </motion.div>
      
      <motion.button
        className="mute-button"
        onClick={handleMuteToggle}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
          pointerEvents: isHovered ? 'auto' : 'none'
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut"
        }}
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          {isMuted ? (
            <>
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </>
          ) : (
            <>
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </>
          )}
        </svg>
      </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default AIOrb