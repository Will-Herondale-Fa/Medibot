import '../styles/globals.css';
import Header from '../components/Header';

export default function App({ Component, pageProps }: any) {
  return (
    <>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
