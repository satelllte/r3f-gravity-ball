import { randInt } from 'three/src/math/MathUtils'
import { Level, InBetweenSector } from '../types/Level'

type Direction = 'vertical' | 'horizontal'
type HorizontalDirection = 'left' | 'right'
type Type = 'static' | 'fall' | 'gap'

const generateType = (forbidden?: Type): Type => {
  let type: Type | null = null
  if (Math.random() > 0.66) {
    type = 'static'
  }
  if (!type) {
    type = Math.random() > 0.25 ? 'fall' : 'gap'
  }
  if (type === forbidden) {
    return generateType(forbidden)
  }
  return type
}

export const generateLevel = (index: number): Level => {
  let x = 0
  let z = 1
  let direction: Direction = 'vertical'
  let horizonalDirection: HorizontalDirection = 'right'

  const steps = Math.min(5 + index, 100)
  let step = 0

  let lastType: Type | undefined

  const sectors: InBetweenSector[] = []
  while (step < steps) {
    let forbidden: Type | undefined = undefined
    if (lastType === 'gap' || index < 5) {
      forbidden = 'gap'
    }
    const type = generateType(forbidden)
    lastType = type

    switch (type) {
      case 'static':
        const sizeZ = direction === 'vertical' ? randInt(1, 3) : 1
        const sizeX = direction === 'horizontal' ? randInt(1, 3) : 1
        const diffX = direction !== 'horizontal' ? 0 : (
          horizonalDirection === 'right' ? 0 : -(sizeX - 1)
        )
        sectors.push({ type, x: x + diffX, z, sizeX, sizeZ })
        z += direction !== 'vertical' ? 0 : sizeZ
        x += direction !== 'horizontal' ? 0 : (
          horizonalDirection === 'right' ? sizeX : -sizeX
        )
        break
      case 'fall':
        sectors.push({ type, x, z })
        z += direction !== 'vertical' ? 0 : 1
        x += direction !== 'horizontal' ? 0 : 1
        break
      case 'gap':
        const gapZ = direction !== 'vertical' ? 0 : randInt(1, 2)
        const gapX = direction !== 'horizontal' ? 0 : (
          horizonalDirection === 'right' ? randInt(1, 2) : -randInt(1, 2)
        )
        z += gapZ
        x += gapX
        break
    }

    direction = direction === 'vertical' ? (
      Math.random() > 0.4 ? 'vertical' : 'horizontal'
    ) : 'vertical'

    if (direction === 'vertical') {
      horizonalDirection = Math.random() > 0.5 ? 'left' : 'right'
    }

    step++
  }

  return {
    sectors,
    finish: { type: 'finish', x, z }
  }
}
