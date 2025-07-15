import "../styles/globals.css";
import { Metadata } from "next";
import { ClientProvider } from "./client-provider";

export const metadata: Metadata = {
  title: "Start UPC",
  description: "Incubadora de Negocios"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="scroll-smooth antialiased" suppressHydrationWarning>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
