import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title: 'Omar Bacho — Architecture & Design',
 description: 'Architecture, interiors, objects and spatial research by Omar Bacho. Selected built work and unbuilt proposals.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return <html lang="en"><body>{children}</body></html>;
}
