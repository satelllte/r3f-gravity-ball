import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import {
  Mesh,
  TextureLoader,
  Vector3,
} from 'three'
import {
  useFrame,
  useThree,
  useLoader,
} from '@react-three/fiber'
import {
  useSphere,
  Triplet,
} from '@react-three/cannon'
import {
  useRecoilState,
} from 'recoil'
import {
  gameState,
  GameState,
} from './state'
import {
  cameraShiftX,
  cameraShiftY,
  cameraShiftZ,
  material,
} from './constants'
import {
  useGetKeyboardControls,
} from './KeyboardControls'

export const Player = forwardRef<Mesh>((_, forwardedRef) => {
  const [_gameState, setGameState] = useRecoilState(gameState)
  const isPlaying = _gameState === GameState.playing

  const colorMap = useLoader(TextureLoader, '/ball-texture.png')

  const [ref, api] = useSphere(
    () => ({
      mass: 1,
      material,
      position: [0, 1, 0],
      linearDamping: 0.2,
      angularDamping: 0.35,
    }),
    useRef<Mesh>(null),
  )

  useImperativeHandle(forwardedRef, () => ref.current as Mesh, [ref])

  const { camera } = useThree()
  const positionRef = useRef<Triplet>([0, 1, 0])

  const getKeyboardControls = useGetKeyboardControls()

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
    } = getKeyboardControls()

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
})

Player.displayName = 'Player'
