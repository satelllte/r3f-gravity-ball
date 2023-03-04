import { useRef } from 'react'
import {
  Vector3,
  PointLight,
  PointLightHelper,
} from 'three'
import {
  useFrame,
  useThree,
} from '@react-three/fiber'
import {
  useHelper,
} from '@react-three/drei'
import {
  isLightDebug,
  pointLightShiftX,
  pointLightShiftY,
  pointLightShiftZ,
} from './constants'

export const Light = () => {
  const { camera } = useThree()
  const pointLightRef = useRef<PointLight>(null)

  useHelper(
    isLightDebug && pointLightRef as React.MutableRefObject<PointLight>,
    PointLightHelper,
    2,
    'red',
  )

  const vec3Ref = useRef(new Vector3())

  useFrame((_, delta) => {
    if (!pointLightRef.current) {
      return
    }

    const pointLight = pointLightRef.current

    pointLight.position.lerp(
      vec3Ref.current.set(
        camera.position.x + pointLightShiftX,
        camera.position.y + pointLightShiftY,
        camera.position.z + pointLightShiftZ,
      ),
      delta * 5,
    )
  })

  return (
    <>
      <pointLight
        ref={pointLightRef}
        intensity={0.9}
        castShadow
        position={[3, 4, 3]}
      />
      <ambientLight intensity={0.05}/>
    </>
  )
}
