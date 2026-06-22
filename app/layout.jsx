import './globals.css';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import ConsentGate from './lib/ConsentGate';
import StatusBar from './lib/StatusBar';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-jakarta',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata = {
  title: 'AIgent Impact — AI Visibility for Allstate Agents',
  description:
    'AIgent Impact scores how visible an insurance agent is inside AI answers — and shows you how to dominate your local market.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          // bind next/font families to the design tokens used throughout the CSS
          '--font': `${jakarta.style.fontFamily}, ui-sans-serif, system-ui, sans-serif`,
          '--mono': `${jetbrains.style.fontFamily}, ui-monospace, "SF Mono", monospace`,
        }}
        className={`${jakarta.variable} ${jetbrains.variable}`}
      >
        <ConsentGate>
          <StatusBar />
          {children}
        </ConsentGate>
      </body>
    </html>
  );
}
