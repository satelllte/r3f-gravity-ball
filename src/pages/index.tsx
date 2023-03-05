import Head from 'next/head'
import { Game } from '@/components'

const HomePage = () => {
  return (
    <>
      <Head>
        <title>Gravity Ball</title>
        <meta name="description" content="Gravity Ball browser game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Game/>
    </>
  )
}

export default HomePage
