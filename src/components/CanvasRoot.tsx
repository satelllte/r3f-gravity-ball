import { Canvas } from '@react-three/fiber'
import { GameplayComponents } from './GameplayComponents'
import {
  cameraShiftX,
  cameraShiftY,
  cameraShiftZ,
} from './constants'

export const CanvasRoot = () => {
  return (
    <Canvas
      shadows='basic'
      camera={{
        position: [cameraShiftX, cameraShiftY, cameraShiftZ],
      }}
    >
      <ambientLight/>
      <GameplayComponents/>
    </Canvas>
  )
}
