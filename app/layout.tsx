import "../styles/globals.css";
import { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Start UPC - Incubadora de Negocios",
  openGraph: {
    title: "Start UPC - Incubadora de Negocios",
    description:
      "Start UPC es una plataforma de incubación de startups peruanas que te ayuda a hacer crecer tu negocio.",
    images: [
      {
        url: "/opengraph-image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Start UPC - Incubadora de Negocios",
    description:
      "Start UPC es una plataforma de incubación de startups peruanas que te ayuda a hacer crecer tu negocio.",
    images: ["/opengraph-image"],
  },
  metadataBase: new URL("http://localhost:3000"),
};

import { auth } from "@/auth";
import { Session } from "next-auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const session = await auth();
  return (
    <html lang="es">
      <body className="scroll-smooth antialiased [font-feature-settings:'ss01']">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
