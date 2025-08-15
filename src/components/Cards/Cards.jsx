import { motion } from 'framer-motion'
import './Cards.css'

const Cards = () => {
  return (
    <motion.div 
      className="cards-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: 0.4
      }}
    >
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="card"
          initial={{ 
            opacity: 0, 
            z: -600,
            scale: 0.5,
            rotateY: -30 + (i * 20)
          }}
          animate={{ 
            opacity: 1, 
            z: 0,
            scale: 1,
            rotateY: 0
          }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.3, delay: 0 }
          }}
          transition={{ 
            opacity: { 
              delay: 0.4 + (i * 0.15),
              duration: 0.6
            },
            z: { 
              delay: 0.4 + (i * 0.15),
              duration: 0.8,
              ease: [0.43, 0.13, 0.23, 0.96]
            },
            scale: {
              delay: 0.4 + (i * 0.15),
              duration: 0.8,
              ease: [0.43, 0.13, 0.23, 0.96]
            },
            rotateY: {
              delay: 0.4 + (i * 0.15),
              duration: 0.8,
              ease: [0.43, 0.13, 0.23, 0.96]
            }
          }}
          whileHover={{ 
            y: -5,
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
        >
          <motion.div
            animate={{
              rotateY: [0, 10, -10, 0],
              rotateX: [0, -5, 5, 0]
            }}
            transition={{
              rotateY: {
                delay: 1.5 + (i * 0.3),
                duration: 5 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              },
              rotateX: {
                delay: 1.5 + (i * 0.3),
                duration: 5 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default Cards