import { Fragment, useEffect, useMemo, useRef } from 'react'
import { Mesh } from 'three'
import { useThree } from '@react-three/fiber'
import { Physics, Debug, useContactMaterial } from '@react-three/cannon'
import { useRecoilValue } from 'recoil'
import {
  gameState,
  levelState,
  GameState,
  levelSeedState,
} from './state'
import {
  cameraShiftX,
  cameraShiftY,
  cameraShiftZ,
  isPhysicsDebug,
  material,
} from './constants'
import { generateLevel } from './levels'
import { Player } from './Player'
import { Sector } from './Sector'

const LevelObjects = () => {
  const playerRef = useRef<Mesh>(null)

  const _gameState = useRecoilValue(gameState)
  const isPlaying = _gameState === GameState.playing

  const level = useRecoilValue(levelState)
  const levelSeed = useRecoilValue(levelSeedState)
  const { sectors, finish } = useMemo(() => {
    const generatedLevel = generateLevel(level)
    return generatedLevel
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelSeed, level])

  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(cameraShiftX, cameraShiftY, cameraShiftZ)
    camera.lookAt(0, 0, 0)
  }, [camera, level, levelSeed])

  return (
    <>
      {isPlaying && <Player ref={playerRef}/>}
      <Sector
        playerRef={playerRef}
        type='start'
      />
      {sectors.map((sector) => {
        const key = `${isPlaying}_${level}_${levelSeed}_${sector.x}_${sector.z}`
        return (
          <Sector
            key={key}
            playerRef={playerRef}
            {...sector}
          />
        )
      })}
      <Sector
        key={`${isPlaying}_${level}_${levelSeed}_${finish.x}_${finish.z}`}
        playerRef={playerRef}
        type='finish'
        x={finish.x}
        z={finish.z}
      />
    </>
  )
}

const PhysicsContacts = () => {
  useContactMaterial(material, material, {
    restitution: 0.01,
    friction: 0.8,
    frictionEquationStiffness: 1e9,
    frictionEquationRelaxation: 3,
    contactEquationStiffness: 1e9,
    contactEquationRelaxation: 10,
  })
  return null
}

export const GameplayComponents = () => {
  const CannonDebug = isPhysicsDebug ? Debug : Fragment
  const cannonDebugProps = isPhysicsDebug ? { color: 'green', scale: 1.01 } : {}

  return (
    <Physics>
      <CannonDebug {...cannonDebugProps}>
        <PhysicsContacts/>
        <LevelObjects/>
      </CannonDebug>
    </Physics>
  )
}
