import {
  useKeyboardControls,
  KeyboardControls,
  KeyboardControlsEntry,
} from '@react-three/drei'

enum Controls {
  forward = 'forward',
  left = 'left',
  right = 'right',
  back = 'back',
}

const keyboardControlsMap: KeyboardControlsEntry<Controls>[] = [
  { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
  { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
  { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
  { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
]

export const useGetKeyboardControls = () => {
  const [, getControls] = useKeyboardControls<Controls>()
  return getControls
}

interface KeyboardControlsRootProps {
  children: React.ReactNode
}

export const KeyboardControlsRoot = ({
  children,
}: KeyboardControlsRootProps) => {
  return (
    <KeyboardControls map={keyboardControlsMap}>
      {children}
    </KeyboardControls>
  )
}
