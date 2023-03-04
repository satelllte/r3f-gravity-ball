import { useEffect } from "react"

export const DisablePageScroll = () => {
  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
    }
    
    const onKeyDown = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', ' ', 'Space'].includes(event.key)) {
        event.preventDefault()
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])
  
  return null
}
