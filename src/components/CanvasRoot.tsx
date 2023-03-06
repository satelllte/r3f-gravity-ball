import { createContext, createRef, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { FullGestureState, useDrag } from '@use-gesture/react'
import { GameplayComponents } from './GameplayComponents'
import {
  cameraShiftX,
  cameraShiftY,
  cameraShiftZ,
} from './constants'

type DragState = Omit<FullGestureState<"drag">, "event"> & {
  event: PointerEvent | MouseEvent | TouchEvent | KeyboardEvent
}

export const CanvasDragContext = createContext<React.RefObject<DragState | null>>(createRef())

export const CanvasRoot = () => {
  const dragRef = useRef<DragState | null>(null)

  const bind = useDrag((args) => {
    dragRef.current = args
  })

  return (
    <Canvas
      camera={{
        position: [cameraShiftX, cameraShiftY, cameraShiftZ],
      }}
      className='touch-none'
      {...bind()}
    >
      <CanvasDragContext.Provider value={dragRef}>
        <ambientLight intensity={0.9}/>
        <GameplayComponents/>
      </CanvasDragContext.Provider>
    </Canvas>
  )
}
