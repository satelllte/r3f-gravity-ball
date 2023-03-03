import { Sector } from './Sector'

export interface Level {
  start: Omit<Sector, 'type' | 'sizeX' | 'sizeZ'>
  sectors: Sector[]
  finish: Omit<Sector, 'type' | 'sizeX' | 'sizeZ'>
}
