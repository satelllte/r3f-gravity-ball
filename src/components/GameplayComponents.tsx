import {
  Fragment,
} from 'react'
import {
  Physics,
  Debug,
} from '@react-three/cannon'
import {
  useRecoilValue,
} from 'recoil'
import {
  gameState,
  GameState,
} from './state'
import {
  isPhysicsDebug,
} from './constants'
import { Player } from './Player'
import { Sector } from './Sector'

export const GameplayComponents = () => {
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
