import { Canvas } from '@react-three/fiber'
import { Light } from './Light'
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
      <Light/>
      <GameplayComponents/>
    </Canvas>
  )
}
