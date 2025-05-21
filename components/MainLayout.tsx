import { JSX } from "preact";
import { StripeScript } from "./StripeScript.tsx";

// Define the layout component that accepts children
export function MainLayout({ children }: { children: JSX.Element }) {
  return (
    <div className="font-serif leading-relaxed bg-backgroundColor">
      <div className="max-w-none mx-4 my-2">
        <div className="top-0 left-0 w-full bg-backgroundColor z-50">
          <div className="flex justify-between items-center mb-2 md:mb-4 lg:mb-8">
            <a href="/" className="block">
              <div className="text-lg font-serif relative overflow-hidden">
                <span className="inline-block">Jonas Handskemager</span>
              </div>
            </a>
          </div>
        </div>
        <div className="">
          <main className="">
            {children}
          </main>
        </div>
      </div>
      <StripeScript />
    </div>
  );
}
