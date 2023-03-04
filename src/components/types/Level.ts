import {
  FinishSector,
  StaticSector,
  FallSector,
  MovingSector,
} from './Sector'

type InBetweenSector =
  | StaticSector
  | FallSector
  | MovingSector

export interface Level {
  sectors: InBetweenSector[]
  finish: FinishSector
}
