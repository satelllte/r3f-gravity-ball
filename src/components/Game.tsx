import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import {
  Mesh,
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
  useBox,
  Triplet,
} from '@react-three/cannon'
import {
  RecoilRoot,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
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
  material,
} from './constants'
import {
  KeyboardControlsRoot,
} from './KeyboardControls'
import { HideMouse } from './HideMouse'
import { Player } from './Player'

/**
 * Sector component
 */
type SectorType =
  | 'default'
  | 'start'
  | 'finish'

interface SectorProps {
  type?: SectorType
  sizeX?: number
  sizeZ?: number
  x?: number
  z?: number
}

const Sector = ({
  type = 'default',
  sizeX = 1,
  sizeZ = 1,
  x = 0,
  z = 0,
}: SectorProps) => {
  const size = 5
  const args: Triplet = [size * sizeX, 0.75, size * sizeZ]
  const setGameState = useSetRecoilState(gameState)
  const [ref] = useBox(() => ({
      args,
      material,
      position: [
        x * size + (size * (sizeX - 1) * 0.5),
        -2,
        -z * size - (size * (sizeZ - 1) * 0.5),
      ],
      onCollideBegin: () => {
        if (type !== 'finish') {
          return
        }
        setTimeout(() => {
          setGameState(GameState.won)
        }, 200)
      },
    }),
    useRef<Mesh>(null),
  )

  let color = 'gray'
  if (type === 'start') {
    color = 'cyan'
  } else if (type === 'finish') {
    color = 'lime'
  }

  return (
    <mesh
      ref={ref}
      receiveShadow
    >
      <boxGeometry args={args}/>
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

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
