import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Mesh, RepeatWrapping, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useSphere, Triplet } from '@react-three/cannon'
import { useTexture } from '@react-three/drei'
import { useRecoilState } from 'recoil'
import { useGetKeyboardControls } from './KeyboardControls'
import { gameState, GameState } from './state'
import {
  cameraShiftX,
  cameraShiftY,
  cameraShiftZ,
  material,
} from './constants'

export const Player = forwardRef<Mesh>((_, forwardedRef) => {
  const [_gameState, setGameState] = useRecoilState(gameState)
  const isPlaying = _gameState === GameState.playing

  const [ref, api] = useSphere(
    () => ({
      type: 'Dynamic',
      mass: 1,
      material,
      position: [0, 1, 0],
      linearDamping: 0.15,
      angularDamping: 0.25,
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

  const vec3Ref = useRef(new Vector3())
  useFrame((_, delta) => {
    if (!isPlaying) {
      return
    }

    if (positionRef.current[1] > -2.5) {
      camera.position.lerp(
        vec3Ref.current.set(
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
    const force = 0.45

    if (forward) {
      api.applyImpulse([0, 0, -force], centerPoint)
    }
    if (back) {
      api.applyImpulse([0, 0, force], centerPoint)
    }
    if (left) {
      api.applyImpulse([-force, 0, 0], centerPoint)
    }
    if (right) {
      api.applyImpulse([force, 0, 0], centerPoint)
    }
  })

  const texture = useTexture('/texture-ball.png', (texture) => {
    if (Array.isArray(texture)) {
      return
    }
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(1, 4)
  })

  return (
    <mesh
      ref={ref}
      receiveShadow
      castShadow
    >
      <sphereGeometry />
      <meshStandardMaterial
        map={texture}
        color='#FFA500'
      />
    </mesh>
  )
})

Player.displayName = 'Player'
