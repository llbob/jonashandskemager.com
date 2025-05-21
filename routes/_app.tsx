import { PageProps } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { getSiteSettings, SiteSettings } from "../utils/siteSettings.ts";

interface AppData {
  settings: SiteSettings;
}

export const handler: Handlers<AppData> = {
  async GET(req, ctx) {
    const settings = await getSiteSettings();
    return ctx.render({ settings });
  },
};

export default function App({ Component, data }: PageProps<AppData>) {
  // Extract settings or use defaults
  const settings = data?.settings || {
    font: "Times New Roman",
    backgroundColor: "#EEEEEE"
  };
  
  // Create CSS variables for the settings
  const styleVariables = `
    :root {
      --font-family: "${settings.font}", serif;
      --background-color: ${settings.backgroundColor};
    }
    
    body {
      font-family: var(--font-family);
      background-color: var(--background-color);
    }
    
    .font-serif {
      font-family: var(--font-family);
    }
    
    .bg-backgroundColor {
      background-color: var(--background-color);
    }
  `;
  
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content={settings.backgroundColor} />
        <link rel="stylesheet" href="/style.css" />
        <link rel="icon" href="/favicon.ico" />
        <title>Jonas Handskemager</title>
        <style dangerouslySetInnerHTML={{ __html: styleVariables }} />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
