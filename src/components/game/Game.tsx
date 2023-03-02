import {
  Fragment,
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
import { HideMouse } from './HideMouse'

const isDev = process.env.NODE_ENV === 'development'
const isPhysicsDebug = isDev && process.env.NEXT_PUBLIC_DEV_PHYSICS_DEBUG === '1'

const cameraShiftX = 0
const cameraShiftY = 4
const cameraShiftZ = 9

const material = {
  name: 'defaultMaterial',
  restitution: 0.6,
  friction: 1.1,
}

enum Controls {
  forward = 'forward',
  left = 'left',
  right = 'right',
  back = 'back',
  jump = 'jump',
}

const keyboardControlsMap: KeyboardControlsEntry<Controls>[] = [
  { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
  { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
  { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
  { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
  { name: Controls.jump, keys: ['Space'] },
]

const Player = () => {
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

    const {
      forward,
      left,
      right,
      back,
      jump,
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
    if (jump) {
      api.applyImpulse([0, 1, 0], centerPoint)
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

export const Game = () => {
  const CannonDebug = isPhysicsDebug ? Debug : Fragment

  return (
    <div className='h-screen'>
      <HideMouse/>
      <KeyboardControls map={keyboardControlsMap}>
        <Canvas
          camera={{
            position: [cameraShiftX, cameraShiftY, cameraShiftZ],
          }}
        >
          <ambientLight />
          <Physics>
            <CannonDebug color="green" scale={1.01}>
              <Player/>
              <Sector type='start'/>
              <Sector z={1} sizeZ={8}/>
              <Sector z={9} sizeX={4}/>
              <Sector type='finish' z={9} x={4}/>
            </CannonDebug>
          </Physics>
        </Canvas>
      </KeyboardControls>
    </div>
  )
}
