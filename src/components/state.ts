import { atom } from 'recoil'

export enum GameState {
  initial = 'initial',
  playing = 'playing',
  lost = 'lost',
  won = 'won',
}

export const gameState = atom<GameState>({
  key: 'game',
  default: GameState.initial,
})

export const levelState = atom<number>({
  key: 'level',
  default: 1,
})
