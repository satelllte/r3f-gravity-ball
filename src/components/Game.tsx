import { Canvas } from '@react-three/fiber'
import { RecoilRoot } from 'recoil'
import { KeyboardControlsRoot } from './KeyboardControls'
import { UI } from './UI'
import { HideMouse } from './HideMouse'
import { Light } from './Light'
import { GameplayComponents } from './GameplayComponents'
import {
  cameraShiftX,
  cameraShiftY,
  cameraShiftZ,
} from './constants'

export const Game = () => {
  return (
    <RecoilRoot>
      <div className='h-screen'>
        <UI/>
        <HideMouse/>
        <KeyboardControlsRoot>
          <Canvas
            shadows='basic'
            camera={{
              position: [cameraShiftX, cameraShiftY, cameraShiftZ],
            }}
          >
            <Light/>
            <GameplayComponents/>
          </Canvas>
        </KeyboardControlsRoot>
      </div>
    </RecoilRoot>
  )
}
