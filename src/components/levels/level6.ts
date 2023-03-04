import { Level } from '../types/Level'

export const level6: Level = {
  sectors: [
    { x: 0, z: 1, sizeX: 1, sizeZ: 1, type: 'static' },
    { x: 0, z: 3, type: 'fall' },
    { x: 0, z: 5, type: 'fall' },
    { x: 0, z: 7, type: 'fall' },
    { x: 0, z: 9, type: 'fall' },
    { x: 0, z: 11, type: 'fall' },
    { x: 0, z: 13, type: 'fall' },
    { x: 0, z: 15, type: 'fall' },
    { x: 0, z: 17, sizeX: 5, sizeZ: 1, type: 'static' },
  ],
  finish: {
    x: 5, z: 17, type: 'finish'
  },
}
