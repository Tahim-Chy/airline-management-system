import 'bootstrap/dist/css/bootstrap.min.css';
import "@/styles/globals.css";
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>BRAC Airline Booking Service</title>
      </Head>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1">
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </>
  );
}
