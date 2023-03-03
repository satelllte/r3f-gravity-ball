import { Level } from '../types/Level'

export const level3: Level = {
  sectors: [
    { x: 0, z: 1, sizeX: 1, sizeZ: 1, type: 'static' },
    { x: 0, z: 2, type: 'fall' },
    { x: 0, z: 3, sizeX: 1, sizeZ: 1, type: 'static' },
    { x: 0, z: 4, type: 'fall' },
    { x: 0, z: 5, sizeX: 1, sizeZ: 1, type: 'static' },
    { x: 0, z: 6, type: 'fall' },
    { x: 0, z: 7, sizeX: 1, sizeZ: 1, type: 'static' },
  ],
  finish: {
    x: 0, z: 8, type: 'finish'
  },
}
