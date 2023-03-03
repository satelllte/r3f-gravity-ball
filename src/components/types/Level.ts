import {
  FinishSector,
  StaticSector,
} from './Sector'

type InBetweenSector = StaticSector

export interface Level {
  sectors: InBetweenSector[]
  finish: FinishSector
}
