import { Level } from '../types/Level'

export const level1: Level = {
  sectors: [
    { x: 0, z: 1, sizeX: 1, sizeZ: 8, type: 'static' },
    { x: 0, z: 9, sizeX: 4, sizeZ: 1, type: 'static' },
  ],
  finish: {
    x: 4, z: 9, type: 'finish'
  },
}