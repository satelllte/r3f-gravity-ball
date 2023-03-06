import Head from 'next/head'
import { useLayoutEffect } from 'react'
import { Game } from '@/components'

const HomePage = () => {

  useLayoutEffect(() => {
    // @ts-expect-error
    const crazysdk = window.CrazyGames.CrazySDK.getInstance()
    crazysdk.init()
  }, [])

  return (
    <>
      <Head>
        <title>Gravity Ball</title>
        <meta name="description" content="Gravity Ball browser game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://sdk.crazygames.com/crazygames-sdk-v1.js"/>
      </Head>
      <Game/>
    </>
  )
}

export default HomePage
