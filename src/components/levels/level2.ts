import { Level } from '../types/Level'

export const level2: Level = {
  start: {
    x: 0, z: 0,
  },
  sectors: [
    { x: 0, z: 1, sizeX: 1, sizeZ: 7, type: 'default' },
    // TODO: finish level
  ],
  finish: {
    x: 4, z: 9,
  },
}
