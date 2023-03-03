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
import { Sector as SectorProps } from './types/Sector'

export const Sector = (props: SectorProps) => {
  const x = props.type === 'start' ? 0 : props.x
  const z = props.type === 'start' ? 0 : props.z
  const sizeX = props.type !== 'static' ? 1 : props.sizeX
  const sizeZ = props.type !== 'static' ? 1 : props.sizeZ
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
        if (props.type !== 'finish') {
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
  if (props.type === 'start') {
    color = 'cyan'
  } else if (props.type === 'finish') {
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
