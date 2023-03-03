import dynamic from 'next/dynamic'
import { RecoilRoot } from 'recoil'
import { KeyboardControlsRoot } from './KeyboardControls'
import { UI } from './UI'
import { HideMouse } from './HideMouse'

const CanvasRootLazy = dynamic(() =>
  import('./CanvasRoot').then((mod) => mod.CanvasRoot),
  // TODO: add level loading screen
  // {
  //   loading: () => <>Loading...</>,
  // }
)

export const Game = () => {
  return (
    <RecoilRoot>
      <div className='h-screen'>
        <UI/>
        <HideMouse/>
        <KeyboardControlsRoot>
          <CanvasRootLazy/>
        </KeyboardControlsRoot>
      </div>
    </RecoilRoot>
  )
}
