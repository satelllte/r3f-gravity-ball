import Head from 'next/head'
import { Game } from '@/components'
import { useLayoutEffect } from 'react'

const HomePage = () => {
  useLayoutEffect(() => {
    // @ts-expect-error
    window.CrazyGames.CrazySDK.getInstance().init()
  }, [])
  return (
    <>
      <Head>
        <title>Dark Ball</title>
        <meta name="description" content="Dark Ball" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src='https://sdk.crazygames.com/crazygames-sdk-v1.js'/>
      </Head>
      <Game/>
    </>
  )
}

export default HomePage
