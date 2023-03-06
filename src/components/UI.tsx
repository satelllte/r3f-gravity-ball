import { useCallback, useEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import {
  gameState,
  GameState,
  levelSeedState,
  levelState,
} from './state'

export const UI = () => {
  const [_gameState, setGameState] = useRecoilState(gameState)
  const setLevel = useSetRecoilState(levelState)
  const setLevelSeed = useSetRecoilState(levelSeedState)
  const initial = _gameState === GameState.initial
  const lost = _gameState === GameState.lost
  const won = _gameState === GameState.won
  const skip = !initial && !lost && !won

  const start = useCallback(() => {
    if (won) {
      setLevel(l => l + 1)
    }
    setGameState(GameState.playing)
  }, [won, setLevel, setGameState])

  const regenerateLevel = () => {
    setLevelSeed(seed => seed + 1)
  }

  useEffect(() => {
    if (skip) {
      return
    }
    
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        start()
      }
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
    <div className='absolute inset-0 z-20 bg-black/80 p-12 flex flex-col text-center items-center justify-between'>
      <h1 className='uppercase text-5xl'>Gravity Ball</h1>

      <div>
        {won && <div className='uppercase text-3xl text-green-500'>Won</div>}
        {lost && <div className='uppercase text-3xl text-red-500'>Lost</div>}

        <button
          onClick={start}
          className='uppercase text-xl border border-white py-1 p-4 my-4'
        >
          Play
        </button>
      </div>

      <div>
        {lost && (
          <button
            onClick={regenerateLevel}
            className='uppercase text-xl border border-white py-1 p-4'
          >
            Regenerate Level
          </button>
        )}
      </div>
    </div>
  )
}
