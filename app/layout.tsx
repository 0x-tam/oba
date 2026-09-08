import type { Metadata, Viewport } from 'next';
import './globals.css';
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#f9f9f6' };
export const metadata: Metadata = {
 title: 'Omar Bacho — Architecture & Design',
 description: 'Architecture, interiors, objects and spatial research by Omar Bacho. Selected built work and unbuilt proposals.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return <html lang="en"><body>{children}</body></html>;
}
