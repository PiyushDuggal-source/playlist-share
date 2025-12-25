import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Navbar } from "@/components/Navbar";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StudyStack - Organize Your Coursework",
  description:
    "Transform scattered study materials into organized learning stacks. Share and discover curated academic content for better learning.",
  keywords: [
    "study",
    "learning",
    "coursework",
    "academic",
    "playlist",
    "education",
    "students",
  ],
  authors: [{ name: "Piyush Duggal" }],
  creator: "StudyStack",
  publisher: "StudyStack",
  openGraph: {
    title: "StudyStack - Organize Your Coursework",
    description:
      "Transform scattered study materials into organized learning stacks. Share and discover curated academic content for better learning.",
    url: "https://studystack-iitm.vercel.app",
    siteName: "StudyStack",
    images: [
      {
        url: "/studystack.png",
        width: 1200,
        height: 630,
        alt: "StudyStack Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyStack - Organize Your Coursework",
    description:
      "Transform scattered study materials into organized learning stacks. Share and discover curated academic content for better learning.",
    images: ["/studystack.png"],
    creator: "@duggal_piyush",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code",
  },
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
