import { motion } from 'framer-motion'
import './Sidebar.css'

const Sidebar = ({ sidebarHovered, setSidebarHovered }) => {
  return (
    <motion.div 
      className="sidebar"
      initial={{ x: -80 }}
      animate={{ x: sidebarHovered ? 0 : -80 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={() => setSidebarHovered(true)}
      onMouseLeave={() => setSidebarHovered(false)}
    >
      <div className="sidebar-content">
        <div className="add-button">+</div>
        
        <div className="nav-items">
          <div className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="nav-label">Home</span>
          </div>
          
          <div className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24">
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="nav-label">Journey</span>
          </div>
          
          <div className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="nav-label">Explore</span>
          </div>
          
          <div className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="nav-label">Schedule</span>
          </div>
        </div>
        
        <div className="user-profile">
          <div className="user-avatar"></div>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar