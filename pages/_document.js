import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        <meta name="description" content="BRAC Airline Booking Service — book flights, manage trips, and track your journey." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
