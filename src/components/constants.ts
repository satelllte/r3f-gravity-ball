// for development
export const isDev = process.env.NODE_ENV === 'development'
export const isPhysicsDebug = isDev && process.env.NEXT_PUBLIC_DEV_PHYSICS_DEBUG === '1'
export const isLightDebug = isDev && process.env.NEXT_PUBLIC_DEV_LIGHT_DEBUG === '1'

// camera position relative to the player
export const cameraShiftX = 0
export const cameraShiftY = 4
export const cameraShiftZ = 9

// point light position relative to the camera
export const pointLightShiftX = 3
export const pointLightShiftY = 1
export const pointLightShiftZ = -2

export const material = {
  name: 'defaultMaterial',
  restitution: 0.6,
  friction: 1.1,
}
