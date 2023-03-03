export type SectorType =
  | 'default'
  | 'start'
  | 'finish'

export interface Sector {
  type: SectorType
  sizeX: number
  sizeZ: number
  x: number
  z: number
}
