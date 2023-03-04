// for development
export const isDev = process.env.NODE_ENV === 'development'
export const isPhysicsDebug = isDev && process.env.NEXT_PUBLIC_DEV_PHYSICS_DEBUG === '1'

// camera position relative to the player
export const cameraShiftX = 0
export const cameraShiftY = 4
export const cameraShiftZ = 9

export const material = {
  name: 'defaultMaterial',
  restitution: 0.6,
  friction: 1.1,
}
