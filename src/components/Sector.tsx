import {
  useRef,
} from 'react'
import {
  Mesh,
} from 'three'
import {
  useBox,
  Triplet,
} from '@react-three/cannon'
import {
  useSetRecoilState,
} from 'recoil'
import {
  gameState,
  GameState,
} from './state'
import {
  material,
} from './constants'

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

export const Sector = ({
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
