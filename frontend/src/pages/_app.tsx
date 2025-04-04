import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar'; // ✅ Import global navbar

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}
