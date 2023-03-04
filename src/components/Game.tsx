import dynamic from 'next/dynamic'
import { RecoilRoot } from 'recoil'
import { KeyboardControlsRoot } from './KeyboardControls'
import { UI } from './UI'
import { DisablePageScroll } from './DisablePageScroll'
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
      <DisablePageScroll/>
      <HideMouse/>
      <div className='h-screen'>
        <UI/>
        <KeyboardControlsRoot>
          <CanvasRootLazy/>
        </KeyboardControlsRoot>
      </div>
    </RecoilRoot>
  )
}
