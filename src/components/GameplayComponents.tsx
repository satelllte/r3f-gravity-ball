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
  levelState,
  GameState,
} from './state'
import {
  isPhysicsDebug,
} from './constants'
import { Player } from './Player'
import { Sector } from './Sector'
import { levels } from './levels'

const LevelObjects = () => {
  const _gameState = useRecoilValue(gameState)
  const isPlaying = _gameState === GameState.playing

  const currentLevel = useRecoilValue(levelState)
  const level = levels[currentLevel - 1]

  return (
    <>
      {isPlaying && <Player/>}
      <Sector type='start' {...level.start}/>
      {level.sectors.map((sector) => {
        const key = `${currentLevel}_${sector.x}_${sector.z}`
        return (
          <Sector
            key={key}
            {...sector}
          />
        )
      })}
      <Sector type='finish' {...level.finish}/>
    </>
  )
}

export const GameplayComponents = () => {
  const CannonDebug = isPhysicsDebug ? Debug : Fragment
  const cannonDebugProps = isPhysicsDebug ? { color: 'green', scale: 1.01 } : {}

  return (
    <Physics>
      <CannonDebug {...cannonDebugProps}>
        <LevelObjects/>
      </CannonDebug>
    </Physics>
  )
}
