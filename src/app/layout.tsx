import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Career Translation Diagnostic | The Prescription",
  description:
    "For NHS professionals who know they have valuable experience, but cannot yet see where else it might fit.",
  openGraph: {
    title: "Career Translation Diagnostic | The Prescription",
    description:
      "Translate your NHS experience into transferable capabilities. A reflective diagnostic tool.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
