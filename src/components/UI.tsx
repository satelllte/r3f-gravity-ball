import { useCallback, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { levels } from './levels'
import {
  gameState,
  GameState,
  levelState,
} from './state'

export const UI = () => {
  const [_gameState, setGameState] = useRecoilState(gameState)
  const [, setLevel] = useRecoilState(levelState)
  const initial = _gameState === GameState.initial
  const lost = _gameState === GameState.lost
  const won = _gameState === GameState.won
  const skip = !initial && !lost && !won

  const start = useCallback(() => {
    if (won) {
      setLevel((lvl) => {
        const hasMoreLevels = lvl < levels.length
        if (hasMoreLevels) {
          return lvl + 1
        }
        return 1
      })
    }
    setGameState(GameState.playing)
  }, [won, setLevel, setGameState])

  useEffect(() => {
    if (skip) {
      return
    }
    
    const onKeyDown = () => {
      start()
    }

    document.addEventListener('keydown', onKeyDown, { passive: true })

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [skip, start])

  if (skip) {
    return null
  }

  return (
    <div onClick={start} className='absolute inset-0 z-10 bg-black/75 p-12 flex flex-col items-center justify-between'>
      <h1 className='uppercase text-5xl'>Gravity Ball</h1>
      {lost && <div className='text-2xl text-red-500'>LOST</div>}
      {won && <div className='text-2xl text-green-500'>WON</div>}
      <div>Press any key to play</div>
    </div>
  )
}
