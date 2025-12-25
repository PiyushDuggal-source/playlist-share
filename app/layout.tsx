import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Navbar } from "@/components/Navbar";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Academic Playlist Share",
  description: "Share and discover academic playlists for your courses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="mx-auto sm:px-4 py-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
