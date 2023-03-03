import {
  FinishSector,
  StaticSector,
  FallSector,
} from './Sector'

type InBetweenSector =
  | StaticSector
  | FallSector

export interface Level {
  sectors: InBetweenSector[]
  finish: FinishSector
}
