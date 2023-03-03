export interface StartSector {
  type: 'start'
}

export interface FinishSector {
  type: 'finish'
  x: number
  z: number
}

export interface StaticSector {
  type: 'static'
  sizeX: number
  sizeZ: number
  x: number
  z: number
}

export interface FallSector {
  type: 'fall'
  x: number
  z: number
}

export type Sector =
  | StartSector
  | FinishSector
  | StaticSector
  | FallSector
