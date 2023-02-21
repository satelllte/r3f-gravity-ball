import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  KeyboardControls,
  KeyboardControlsEntry,
  PointerLockControls,
  useKeyboardControls,
} from '@react-three/drei'
import { Debug, Physics, RigidBody } from '@react-three/rapier'

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

const Camera = () => {
  const speed = 5
  const { camera } = useThree()

  const [, getControls] = useKeyboardControls<Controls>()

  useFrame((_, delta) => {
    const {
      forward,
      left,
      right,
      back,
    } = getControls()

    let z = 0
    let x = 0

    z -= forward ? 1 : 0
    z += back ? 1 : 0
    x -= left ? 1 : 0
    x += right ? 1 : 0

    if (z !== 0) {
      z = speed * delta * z
    }
    if (x !== 0) {
      x = speed * delta * x
    }

    camera.translateZ(z)
    camera.translateX(x)
  })

  return (
    null
  )
}

export const Game = () => {
  return (
    <div className='h-screen'>
      <KeyboardControls map={keyboardControlsMap}>
        <Canvas>
          <Physics>
            {process.env.NODE_ENV === 'development' && <Debug/>}
            <Camera/>
            <PointerLockControls/>
            <ambientLight />
            <RigidBody>
              <mesh position={[0, 4, 0]} rotation={[0, Math.PI / 6, Math.PI / 6]}>
                <boxGeometry />
                <meshStandardMaterial color="hotpink" />
              </mesh>
            </RigidBody>
            <RigidBody type='fixed'>
              <mesh position={[0, 0, 0]} scale={[10, 10, 10]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry />
                <meshStandardMaterial color="cyan" />
              </mesh>
            </RigidBody>
          </Physics>
        </Canvas>
      </KeyboardControls>
    </div>
  )
}
