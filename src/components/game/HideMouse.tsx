import { useEffect } from 'react'
import debounce from 'lodash-es/debounce'

const delay = 2000

export const HideMouse = () => {
  useEffect(() => {
    let isIdle = true

    const hideMouse = debounce(() => {
      isIdle = true
      document.documentElement.style.cursor = 'none'
    }, delay)

    const onMouseMovement = () => {
      if (isIdle) {
        isIdle = false
        document.documentElement.style.cursor = ''
      }
      hideMouse()
    }

    window.addEventListener('mousemove', onMouseMovement, { passive: true })

    return () => window.removeEventListener('mousemove', onMouseMovement)
  }, [])

  return null
}
