import Head from 'next/head'
import { Home } from '@/components/pages/Home'

const HomePage = () => {
  return (
    <>
      <Head>
        <title>Dark Ball</title>
        <meta name="description" content="Dark Ball" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Home/>
    </>
  )
}

export default HomePage
