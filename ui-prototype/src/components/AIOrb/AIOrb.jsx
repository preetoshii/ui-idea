import { motion } from 'framer-motion'
import './AIOrb.css'

const AIOrb = () => {
  return (
    <motion.div 
      className="ai-orb-container"
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
    >
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
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          },
          x: {
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          },
          y: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          },
          scale: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <path
          d="M100,20 C125,20 150,35 160,65 C170,95 165,125 155,155 C145,185 125,195 100,195 C75,195 55,185 45,155 C35,125 30,95 40,65 C50,35 75,20 100,20 Z"
          fill="#FF6B58"
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
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          },
          x: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          },
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          },
          scale: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <path
          d="M50,20 C65,20 75,30 75,45 C75,60 65,75 50,75 C35,75 20,65 20,50 C20,35 30,20 45,20 C47,20 49,20 50,20 Z"
          fill="#4BA3F5"
        />
      </motion.svg>
    </motion.div>
  )
}

export default AIOrb