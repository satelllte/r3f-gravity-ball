import { useCallback, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import {
  gameState,
  GameState,
} from './state'

export const UI = () => {
  const [_gameState, setGameState] = useRecoilState(gameState)
  const initial = _gameState === GameState.initial
  const lost = _gameState === GameState.lost
  const won = _gameState === GameState.won
  const skip = !initial && !lost && !won

  const start = useCallback(() => {
    setGameState(GameState.playing)
  }, [setGameState])

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
    <div onClick={start} className='absolute inset-0 z-10 bg-black/50 flex flex-col justify-center items-center'>
      {lost && <div>LOST</div>}
      {won && <div>WON</div>}
      <div>Press any key to play</div>
    </div>
  )
}
