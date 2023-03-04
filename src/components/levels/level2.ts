import { Level } from '../types/Level'

export const level2: Level = {
  sectors: [
    { x: 0, z: 1, sizeX: 1, sizeZ: 6, type: 'static' },
    { x: -1, z: 6, sizeX: 1, sizeZ: 2, type: 'static' },
    { x: -2, z: 7, sizeX: 1, sizeZ: 2, type: 'static' },
    { x: -3, z: 8, sizeX: 1, sizeZ: 3, type: 'static' },
    { x: -2, z: 10, sizeX: 1, sizeZ: 2, type: 'static' },
    { x: -1, z: 11, sizeX: 1, sizeZ: 2, type: 'static' },
    { x: 0, z: 12, sizeX: 1, sizeZ: 2, type: 'static' },
    { x: 1, z: 13, sizeX: 1, sizeZ: 2, type: 'static' },
  ],
  finish: {
    x: 2, z: 14, type: 'finish'
  },
}