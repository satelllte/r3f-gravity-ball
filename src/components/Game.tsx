import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import {
  Vector3,
  PointLight,
  PointLightHelper,
} from 'three'
import {
  Canvas,
  useFrame,
  useThree,
} from '@react-three/fiber'
import {
  useHelper,
} from '@react-three/drei'
import {
  Physics,
  Debug,
} from '@react-three/cannon'
import {
  RecoilRoot,
  useRecoilState,
  useRecoilValue,
} from 'recoil'
import {
  gameState,
  GameState,
} from './state'
import {
  isPhysicsDebug,
  isLightDebug,
  cameraShiftX,
  cameraShiftY,
  cameraShiftZ,
  pointLightShiftX,
  pointLightShiftY,
  pointLightShiftZ,
} from './constants'
import {
  KeyboardControlsRoot,
} from './KeyboardControls'
import { HideMouse } from './HideMouse'
import { Player } from './Player'
import { Sector } from './Sector'

const GamePhysicsComponents = () => {
  const CannonDebug = isPhysicsDebug ? Debug : Fragment
  const cannonDebugProps = isPhysicsDebug ? { color: 'green', scale: 1.01 } : {} 

  const _gameState = useRecoilValue(gameState)
  const isPlaying = _gameState === GameState.playing

  return (
    <Physics>
      <CannonDebug {...cannonDebugProps}>
        {isPlaying && <Player/>}
        <Sector type='start'/>
        <Sector z={1} sizeZ={8}/>
        <Sector z={9} sizeX={4}/>
        <Sector type='finish' z={9} x={4}/>
      </CannonDebug>
    </Physics>
  )
}

const Light = () => {
  const { camera } = useThree()
  const pointLightRef = useRef<PointLight>(null)

  useHelper(
    isLightDebug && pointLightRef as React.MutableRefObject<PointLight>,
    PointLightHelper,
    2,
    'red',
  )

  useFrame((_, delta) => {
    if (!pointLightRef.current) {
      return
    }

    const pointLight = pointLightRef.current

    pointLight.position.lerp(
      new Vector3(
        camera.position.x + pointLightShiftX,
        camera.position.y + pointLightShiftY,
        camera.position.z + pointLightShiftZ,
      ),
      delta * 5,
    )
  })

  return (
    <>
      <pointLight
        ref={pointLightRef}
        intensity={0.9}
        castShadow
        position={[3, 4, 3]}
      />
      <ambientLight intensity={0.05}/>
    </>
  )
}

/**
 * UI component
 */
const UI = () => {
  const [_gameState, setGameState] = useRecoilState(gameState)
  const initial = _gameState === GameState.initial
  const lost = _gameState === GameState.lost
  const won = _gameState === GameState.won
  const skip = !initial && !lost && !won

  const start = useCallback(() => {
    setGameState(GameState.playing)
  }, [setGameState])

  useEffect(() => {
    if (skip) {
      return
    }
    
    const onKeyDown = () => {
      start()
    }

    document.addEventListener('keydown', onKeyDown, { passive: true })

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [skip, start])

  if (skip) {
    return null
  }

  return (
    <div onClick={start} className='absolute inset-0 z-10 bg-black/50 flex flex-col justify-center items-center'>
      {lost && <div>LOST</div>}
      {won && <div>WON</div>}
      <div>Press any key to play</div>
    </div>
  )
}

/**
 * Game entry
 */
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
            <GamePhysicsComponents/>
          </Canvas>
        </KeyboardControlsRoot>
      </div>
    </RecoilRoot>
  )
}
