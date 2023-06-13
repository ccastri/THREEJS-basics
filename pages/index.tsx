import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';

const StlViewer = dynamic(
  () => import('../components/StlViewerFiber'),
  { ssr: false }
);

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <StlViewer />
    </div>
  );
}

export default Home;