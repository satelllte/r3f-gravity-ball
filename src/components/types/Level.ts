import {
  FinishSector,
  StaticSector,
  FallSector,
  MovingSector,
} from './Sector'

export type InBetweenSector =
  | StaticSector
  | FallSector
  | MovingSector

export interface Level {
  sectors: InBetweenSector[]
  finish: FinishSector
}
