// app/layout.jsx
import '../styles/globals.css';
import { Footer } from '../components/footer';
import { RainbowHeader } from '../components/rainbow-header';

export const metadata = {
  title: {
    template: '%s | Netlify',
    default: 'Netlify Starter'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="lofi">
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body className="antialiased bg-white"> {/* Changed from text-white bg-blue-900 */}
        {/* Header outside of width constraints */}
        <RainbowHeader />
        
        <div className="flex flex-col min-h-screen px-6 sm:px-12">
          <div className="flex flex-col w-full max-w-5xl mx-auto grow">
            <div className="grow">{children}</div>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}