import { Level } from '../types/Level'

export const level4: Level = {
  sectors: [
    { x: 0, z: 1, sizeX: 1, sizeZ: 1, type: 'static' },
    { x: 0, z: 2, type: 'fall' },
    { x: 0, z: 3, sizeX: 1, sizeZ: 1, type: 'static' },
    { x: 0, z: 4, type: 'fall' },
    { x: 0, z: 5, type: 'fall' },
    { x: 0, z: 6, type: 'fall' },
    { x: 0, z: 7, type: 'fall' },
    { x: -4, z: 8, sizeX: 5, sizeZ: 1, type: 'static' },
    { x: -4, z: 9, sizeX: 1, sizeZ: 2, type: 'static' },
    { x: -4, z: 11, type: 'fall' },
    { x: -4, z: 12, type: 'fall' },
    { x: -4, z: 13, type: 'fall' },
    { x: -4, z: 14, sizeX: 3, sizeZ: 1, type: 'static' },
  ],
  finish: {
    x: -1, z: 14, type: 'finish'
  },
}
