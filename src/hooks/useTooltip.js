import { useCallback } from 'react'

const useTooltip = (text) => {
  const showTooltip = useCallback((e) => {
    if (!text) return
    
    const event = new CustomEvent('show-tooltip', {
      detail: { text, x: e.clientX, y: e.clientY }
    })
    window.dispatchEvent(event)
  }, [text])

  const hideTooltip = useCallback(() => {
    const event = new CustomEvent('hide-tooltip')
    window.dispatchEvent(event)
  }, [])

  return {
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip
  }
}

export default useTooltip