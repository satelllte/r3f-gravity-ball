import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
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
      <ambientLight intensity={0.9}/>
      <GameplayComponents/>
      <EffectComposer>
        <Bloom intensity={0.1} luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <Vignette offset={0.1} darkness={1.1} />
        <Noise opacity={0.1} />
      </EffectComposer>
    </Canvas>
  )
}
