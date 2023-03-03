import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import {
  Mesh,
  TextureLoader,
  Vector3,
  PointLight,
  PointLightHelper,
} from 'three'
import {
  Canvas,
  useFrame,
  useThree,
  useLoader,
} from '@react-three/fiber'
import {
  KeyboardControls,
  KeyboardControlsEntry,
  useHelper,
  useKeyboardControls,
} from '@react-three/drei'
import {
  Physics,
  Debug,
  useBox,
  useSphere,
  Triplet,
} from '@react-three/cannon'
import {
  RecoilRoot,
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'
import { HideMouse } from './HideMouse'

/**
 * Constants (development only)
 */
const isDev = process.env.NODE_ENV === 'development'
const isPhysicsDebug = isDev && process.env.NEXT_PUBLIC_DEV_PHYSICS_DEBUG === '1'
const isLightDebug = isDev && process.env.NEXT_PUBLIC_DEV_LIGHT_DEBUG === '1'

/**
 * Constants
 */
const cameraShiftX = 0
const cameraShiftY = 4
const cameraShiftZ = 9

// point light position shift is relative to camera position
const pointLightShiftX = 3
const pointLightShiftY = 1
const pointLightShiftZ = -2

const material = {
  name: 'defaultMaterial',
  restitution: 0.6,
  friction: 1.1,
}

/**
 * State
 */
enum GameState {
  initial = 'initial',
  playing = 'playing',
  lost = 'lost',
  won = 'won',
}
const gameState = atom<GameState>({
  key: 'gameState',
  default: GameState.initial,
});

/**
 * Keyboard input
 */
enum Controls {
  forward = 'forward',
  left = 'left',
  right = 'right',
  back = 'back',
}

const keyboardControlsMap: KeyboardControlsEntry<Controls>[] = [
  { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
  { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
  { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
  { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
]

/**
 * Player component
 */
const Player = () => {
  const [_gameState, setGameState] = useRecoilState(gameState)
  const isPlaying = _gameState === GameState.playing

  const colorMap = useLoader(TextureLoader, '/ball-texture.png')

  const [ref, api] = useSphere(
    () => ({
      mass: 1,
      material,
      position: [0, 1, 0],
      // linearDamping: 0.5,
      angularDamping: 0.35,
    }),
    useRef<Mesh>(null),
  )

  const { camera } = useThree()
  const positionRef = useRef<Triplet>([0, 1, 0])

  const [, getControls] = useKeyboardControls<Controls>()

  useEffect(() => {
    camera.position.set(cameraShiftX, cameraShiftY, cameraShiftZ)
    camera.lookAt(
      positionRef.current[0],
      positionRef.current[1],
      positionRef.current[2],
    )
  }, [camera])

  useEffect(() => {
    const unsubscribe = api.position.subscribe((position) => {
      positionRef.current = position
    })
    return unsubscribe
  }, [api])

  useFrame((_, delta) => {
    if (!isPlaying) {
      return
    }

    if (positionRef.current[1] > -2.5) {
      camera.position.lerp(
        new Vector3(
          positionRef.current[0] + cameraShiftX,
          positionRef.current[1] + cameraShiftY,
          positionRef.current[2] + cameraShiftZ,
        ),
        delta * 10,
      )
    } else {
      camera.lookAt(
        positionRef.current[0],
        positionRef.current[1],
        positionRef.current[2],
      )
    }

    if (positionRef.current[1] < -12.5) {
      setGameState(GameState.lost)
    }

    const {
      forward,
      left,
      right,
      back,
    } = getControls()

    const centerPoint: Triplet = [0, 0, 0]

    if (forward) {
      api.applyImpulse([0, 0, -1], centerPoint)
    }
    if (back) {
      api.applyImpulse([0, 0, 1], centerPoint)
    }
    if (left) {
      api.applyImpulse([-1, 0, 0], centerPoint)
    }
    if (right) {
      api.applyImpulse([1, 0, 0], centerPoint)
    }
  })

  return (
    <mesh
      ref={ref}
      receiveShadow
      castShadow
    >
      <sphereGeometry />
      <meshStandardMaterial map={colorMap} />
    </mesh>
  )
}

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
        <KeyboardControls map={keyboardControlsMap}>
          <Canvas
            shadows='basic'
            camera={{
              position: [cameraShiftX, cameraShiftY, cameraShiftZ],
            }}
          >
            <Light/>
            <GamePhysicsComponents/>
          </Canvas>
        </KeyboardControls>
      </div>
    </RecoilRoot>
  )
}
