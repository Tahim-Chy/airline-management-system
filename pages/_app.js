import "@/styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
