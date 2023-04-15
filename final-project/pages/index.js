import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter();
  if(typeof window != 'undefined'){
    router.push('/homePage')
  }

  return (
    <>
    </>
  )
}
