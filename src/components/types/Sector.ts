export interface StartSector {
  type: 'start'
}

export interface FinishSector {
  type: 'finish'
  x: number
  z: number
}

export interface DefaultSector {
  type: 'default'
  sizeX: number
  sizeZ: number
  x: number
  z: number
}

export type Sector =
  | StartSector
  | FinishSector
  | DefaultSector
