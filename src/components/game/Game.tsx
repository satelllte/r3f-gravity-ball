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
} from 'recoil'
import { HideMouse } from './HideMouse'

/**
 * Constants (development only)
 */
const isDev = process.env.NODE_ENV === 'development'
const isPhysicsDebug = isDev && process.env.NEXT_PUBLIC_DEV_PHYSICS_DEBUG === '1'

/**
 * Constants
 */
const cameraShiftX = 0
const cameraShiftY = 4
const cameraShiftZ = 9

const material = {
  name: 'defaultMaterial',
  restitution: 0.6,
  friction: 1.1,
}

/**
 * State
 */
enum GameState {
  inMenu = 'inMenu',
  playing = 'playing',
}
const gameState = atom<GameState>({
  key: 'gameState',
  default: GameState.inMenu,
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
      setGameState(GameState.inMenu)
    }

    if (!isPlaying) {
      return
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
  const size = 6
  const args: Triplet = [size * sizeX, 0.75, size * sizeZ]
  const [ref] = useBox(() => ({
      args,
      material,
      position: [
        x * size + (size * (sizeX - 1) * 0.5),
        -2,
        -z * size - (size * (sizeZ - 1) * 0.5),
      ],
      onCollideBegin: (e) => {
        if (type === 'finish') {
          console.info('finish')
        }
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
    >
      <boxGeometry args={args}/>
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

const GamePhysicsComponents = () => {
  const CannonDebug = isPhysicsDebug ? Debug : Fragment

  const _gameState = useRecoilValue(gameState)
  const isPlaying = _gameState === GameState.playing

  return (
    <Physics>
      <CannonDebug color="green" scale={1.01}>
        {isPlaying && <Player/>}
        <Sector type='start'/>
        <Sector z={1} sizeZ={8}/>
        <Sector z={9} sizeX={4}/>
        <Sector type='finish' z={9} x={4}/>
      </CannonDebug>
    </Physics>
  )
}

/**
 * UI component
 */
const UI = () => {
  const [_gameState, setGameState] = useRecoilState(gameState)
  const inMenu = _gameState === GameState.inMenu
  
  const start = useCallback(() => {
    setGameState(GameState.playing)
  }, [setGameState])

  useEffect(() => {
    if (!inMenu) {
      return
    }
    
    const onKeyDown = () => {
      start()
    }

    document.addEventListener('keydown', onKeyDown, { passive: true })

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [inMenu, start])

  if (!inMenu) {
    return null
  }

  return (
    <div onClick={start} className='absolute inset-0 z-10 bg-black/50 flex flex-col justify-center items-center'>
      <h1>Press any key to play</h1>
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
            camera={{
              position: [cameraShiftX, cameraShiftY, cameraShiftZ],
            }}
          >
            <ambientLight />
            <GamePhysicsComponents/>
          </Canvas>
        </KeyboardControls>
      </div>
    </RecoilRoot>
  )
}
