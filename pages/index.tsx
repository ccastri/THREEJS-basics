import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import StlViewer from '../components/StlViewer'
import StlViewerAgain from '../components/StlViewerAgain'
import StlViewerFiber from '../components/StlViewerFiber'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
     <StlViewerFiber/>
    </div>
  )
}

export default Home
