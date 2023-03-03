import { atom } from 'recoil'

export enum GameState {
  initial = 'initial',
  playing = 'playing',
  lost = 'lost',
  won = 'won',
}

export const gameState = atom<GameState>({
  key: 'gameState',
  default: GameState.initial,
})
