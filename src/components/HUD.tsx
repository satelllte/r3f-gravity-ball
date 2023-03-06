import { useContext, useEffect, useState } from 'react'
import { Joystick } from 'react-joystick-component'
import type { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick'
import { JoystickContext } from './JoystickControls'

const isTouchDevice = () => 'ontouchstart' in window

export const HUD = () => {
  const [visible, setVisible] = useState(false)
  
  useEffect(() => {
    if (isTouchDevice()) {
      setVisible(true)
    }
  }, [])

  const joystickInputRef = useContext(JoystickContext)

  const updateInput = ({ x, y }: IJoystickUpdateEvent) => {
    joystickInputRef.current = { x, y }
  }

  if (!visible) {
    return null
  }

  return (
    <div className='absolute left-0 bottom-0 z-10 p-8'>
      <Joystick
        baseColor='#FBFBF255'
        stickColor='#3B99FC'
        size={50}
        start={updateInput}
        move={updateInput}
        stop={updateInput}
      />
    </div>
  )
}
