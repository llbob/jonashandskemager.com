import { JSX } from "preact";
import { StripeScript } from "./StripeScript.tsx";
import Navigation from "../islands/Navigation.tsx";

// Define the layout component that accepts children
export function MainLayout({ children }: { children: JSX.Element }) {
  return (
    <html>
      <head>
        <StripeScript />
      </head>
      <body class="font-serif leading-relaxed bg-backgroundColor">
        <div class="max-w-none mx-4 my-4">
          <div class="sticky top-0 left-0 w-full bg-backgroundColor z-50">
            <div class="flex justify-between items-center mb-2 md:mb-4 lg:mb-8">
              <a href="/" class="block">
                <div class="text-lg font-serif relative overflow-hidden">
                  <span class="inline-block">Jonas Handskemager</span>
                </div>
              </a>
              {/* <div class="flex items-center">
                <div class="md:hidden">
                  <Navigation />
                </div>
              </div> */}
            </div>
          </div>
          <div class="">
            {/* <div class="hidden md:block">
              <Navigation />
            </div> */}
            <main class="">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
