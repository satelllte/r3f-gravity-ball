import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  KeyboardControls,
  KeyboardControlsEntry,
  PointerLockControls,
  useKeyboardControls,
} from '@react-three/drei'

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
          <Camera/>
          <PointerLockControls/>
          <ambientLight />
          <mesh position={[0, 0, 1]}>
            <boxGeometry />
            <meshStandardMaterial color="hotpink" />
          </mesh>
        </Canvas>
      </KeyboardControls>
    </div>
  )
}
