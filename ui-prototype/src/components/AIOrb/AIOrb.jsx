import { motion } from 'framer-motion'
import './AIOrb.css'

const AIOrb = ({ chatExpanded }) => {
  return (
    <motion.div 
      className="ai-orb-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1,
        scale: chatExpanded ? 0.5 : 1,
        y: chatExpanded ? 'calc(-45vh + 100px)' : [0, -10, 0],
        x: chatExpanded ? 0 : 0,
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        opacity: { duration: 0.3, delay: 0.6 },
        scale: { 
          duration: 2.0, 
          delay: 0,
          ease: [0.16, 1, 0.3, 1]
        },
        y: chatExpanded ? {
          duration: 2.0,
          ease: [0.16, 1, 0.3, 1]
        } : {
          duration: 7.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
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
          y: [0, -15, 0, 15, 0],
          scale: [1, 1.05, 1, 0.95, 1]
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
          },
          scale: {
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <path
          d="M100,20 C125,20 150,35 160,65 C170,95 165,125 155,155 C145,185 125,195 100,195 C75,195 55,185 45,155 C35,125 30,95 40,65 C50,35 75,20 100,20 Z"
          fill="#FF6B58"
          filter="url(#motionBlurRed)"
        />
      </motion.svg>
      
      <motion.svg
        className="blob blob-small"
        viewBox="0 0 100 100"
        animate={{
          rotate: [0, -360],
          x: [0, 15, 0, -15, 0],
          y: [0, 10, 0, -10, 0],
          scale: [1, 0.9, 1, 1.1, 1]
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
          },
          scale: {
            duration: 12.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <path
          d="M50,20 C65,20 75,30 75,45 C75,60 65,75 50,75 C35,75 20,65 20,50 C20,35 30,20 45,20 C47,20 49,20 50,20 Z"
          fill="#4BA3F5"
          filter="url(#motionBlurBlue)"
        />
      </motion.svg>
    </motion.div>
  )
}

export default AIOrb