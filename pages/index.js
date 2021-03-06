import Head from 'next/head';
import Sidebar from '../components/Sidebar/Sidebar';

const Home = () => {
  return (
    <div>
      <Head>
        <title>Whats App Clone</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />
    </div>
  )
}

export default Home;
