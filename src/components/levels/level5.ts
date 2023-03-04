import { Level } from '../types/Level'

export const level5: Level = {
  sectors: [
    { x: 0, z: 1, sizeX: 1, sizeZ: 1, type: 'static' },
    { x: 0, z: 2, type: 'fall' },
    { x: 0, z: 3, type: 'fall' },
    { x: 0, z: 4, sizeX: 1, sizeZ: 1, type: 'static' },
    { x: 0, z: 5, type: 'fall' },
    { x: 0, z: 6, type: 'fall' },
    { x: 0, z: 7, sizeX: 1, sizeZ: 1, type: 'static' },
    { x: 0, z: 8, shift: 0, type: 'moving' },
    { x: 0, z: 9, sizeX: 1, sizeZ: 1, type: 'static' },
    { x: 0, z: 10, shift: Math.PI, type: 'moving' },
    { x: 0, z: 11, sizeX: 1, sizeZ: 1, type: 'static' },
    { x: 0, z: 12, shift: Math.PI / 4, type: 'moving' },
    { x: 0, z: 13, sizeX: 1, sizeZ: 1, type: 'static' },
  ],
  finish: {
    x: 0, z: 14, type: 'finish'
  },
}
