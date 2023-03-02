import { useEffect } from 'react'
import debounce from 'lodash-es/debounce'

const delay = 2000

export const HideMouse = () => {
  useEffect(() => {
    let isIdle = true

    const hideMouse = () => {
      isIdle = true
      document.documentElement.style.cursor = 'none'
    }

    const showMouse = () => {
      isIdle = false
      document.documentElement.style.cursor = ''
    }

    const hideMouseDebounced = debounce(hideMouse, delay)

    const onMouseMovement = () => {
      if (isIdle) {
        showMouse()
      }
      hideMouseDebounced()
    }

    window.addEventListener('mousemove', onMouseMovement, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMovement)
      showMouse()
    }
  }, [])

  return null
}
