import { useEffect, useRef, useState } from 'react'
import { Mesh } from 'three'
import { useBox, Triplet } from '@react-three/cannon'
import { useSetRecoilState } from 'recoil'
import { gameState, GameState } from './state'
import { material } from './constants'
import { Sector as ISector } from './types/Sector'
import { randFloat } from 'three/src/math/MathUtils'
import { useFrame } from '@react-three/fiber'

type InnerProps = SectorProps & {
  onDestroy: () => void
}

const Inner = (props: InnerProps) => {
  const x = props.type === 'start' ? 0 : props.x
  const z = props.type === 'start' ? 0 : props.z
  const sizeX = props.type !== 'static' ? 1 : props.sizeX
  const sizeZ = props.type !== 'static' ? 1 : props.sizeZ
  const size = 4
  const args: Triplet = [size * sizeX, 0.75, size * sizeZ]
  const initialPosition: Triplet = [
    x * size + (size * (sizeX - 1) * 0.5),
    -2,
    -z * size - (size * (sizeZ - 1) * 0.5),
  ]
  const setGameState = useSetRecoilState(gameState)
  const hasCollidedRef = useRef<boolean>(false)
  const [ref, api] = useBox(() => ({
      allowSleep: true,
      args,
      material,
      type: 'Kinematic',
      position: initialPosition,
      onCollideBegin: ({ body }) => {
        if (hasCollidedRef.current || body !== props.playerRef.current) {
          return
        }

        hasCollidedRef.current = true

        if (props.type === 'finish') {
          setTimeout(() => {
            setGameState(GameState.won)
          }, 200)
          return
        }

        if (props.type === 'fall') {
          api.angularVelocity.set(
            randFloat(-Math.PI / 12, Math.PI / 12),
            0,
            randFloat(-Math.PI / 18, Math.PI / 18),
          )
          setTimeout(() => {
            api.velocity.set(0, randFloat(-25, -20), 0)
            api.angularVelocity.set(
              randFloat(0, Math.PI),
              randFloat(0, Math.PI),
              randFloat(0, Math.PI),
            )
          }, 500)
        }
      },
    }),
    useRef<Mesh>(null),
  )

  const positionRef = useRef<Triplet>(initialPosition)

  useEffect(() => {
    const unsubscribe = api.position.subscribe((position) => {
      positionRef.current = position
    })
    return unsubscribe
  }, [api])

  useFrame(() => {
    if (positionRef.current[1] > -50) {
      return
    }
    props.onDestroy()
  })

  useFrame(({ clock }) => {
    if (props.type !== 'moving') {
      return
    }

    const speed = 2

    api.position.set(
      initialPosition[0] + Math.sin(props.shift + speed * clock.getElapsedTime()) * size,
      positionRef.current[1],
      positionRef.current[2],
    )
  })

  let color = '#FBFBF2'
  if (props.type === 'start') {
    color = '#3B99FC'
  } else if (props.type === 'finish') {
    color = '#10a37f'
  } else if (props.type === 'fall') {
    color = '#a62929'
  }

  return (
    <mesh
      ref={ref}
      receiveShadow
    >
      <boxGeometry args={args}/>
      <meshStandardMaterial color={color}/>
    </mesh>
  )
}

type SectorProps = ISector & {
  playerRef: React.RefObject<Mesh>
}

export const Sector = (props: SectorProps) => {
  const [destroyed, setDestroyed] = useState<boolean>(false)

  if (destroyed) {
    return null
  }

  return (
    <Inner
      onDestroy={() => setDestroyed(true)}
      {...props}  
    />
  )
}
