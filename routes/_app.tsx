import { PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#EEE" />
        <link rel="stylesheet" href="/style.css" />
        <link rel="icon" href="/favicon.ico" />
        <title>Jonas Handskemager</title>
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
