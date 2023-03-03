import { Fragment, useRef } from 'react'
import { Mesh } from 'three'
import { Physics, Debug } from '@react-three/cannon'
import { useRecoilValue } from 'recoil'
import {
  gameState,
  levelState,
  GameState,
} from './state'
import { isPhysicsDebug } from './constants'
import { Player } from './Player'
import { Sector } from './Sector'
import { levels } from './levels'

const LevelObjects = () => {
  const playerRef = useRef<Mesh>(null)

  const _gameState = useRecoilValue(gameState)
  const isPlaying = _gameState === GameState.playing

  const currentLevel = useRecoilValue(levelState)
  const { sectors, finish } = levels[currentLevel - 1]

  return (
    <>
      {isPlaying && <Player ref={playerRef}/>}
      <Sector
        playerRef={playerRef}
        type='start'
      />
      {sectors.map((sector) => {
        const key = `${isPlaying}_${currentLevel}_${sector.x}_${sector.z}`
        if (sector.type === 'static') {
          return (
            <Sector
              key={key}
              playerRef={playerRef}
              type={sector.type}
              x={sector.x}
              z={sector.z}
              sizeX={sector.sizeX}
              sizeZ={sector.sizeZ}
            />
          )
        }
        return (
          <Sector
            key={key}
            playerRef={playerRef}
            type={sector.type}
            x={sector.x}
            z={sector.z}
          />
        )
      })}
      <Sector
        key={`${isPlaying}_${currentLevel}_${finish.x}_${finish.z}`}
        playerRef={playerRef}
        type='finish'
        x={finish.x}
        z={finish.z}
      />
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
