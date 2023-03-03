import {
  FinishSector,
  DefaultSector,
} from './Sector'

type InBetweenSector = DefaultSector

export interface Level {
  sectors: InBetweenSector[]
  finish: FinishSector
}
