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
      <motion.div 
        className="wireframe-sphere"
        animate={{
          rotateY: [0, 360]
        }}
        transition={{
          rotateY: {
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      >
        {/* Latitude lines (horizontal) */}
        {[...Array(7)].map((_, i) => {
          const angle = (i - 3) * 30; // -90, -60, -30, 0, 30, 60, 90
          const scale = Math.cos((angle * Math.PI) / 180);
          return (
            <div
              key={`lat-${i}`}
              className="latitude-line"
              style={{
                width: `${scale * 100}%`,
                top: `${50 + (angle / 90) * 50}%`
              }}
            />
          );
        })}
        
        {/* Longitude lines (vertical) */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`long-${i}`}
            className="longitude-line"
            style={{
              transform: `rotateY(${i * 30}deg)`
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

export default AIOrb