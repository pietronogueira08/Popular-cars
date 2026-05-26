import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { VehicleProvider } from "@/context/VehicleContext";
import { AuthProvider } from "@/context/AuthContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Popular Veículos",
    default: "Popular Veículos — Sua Próxima Conquista Está Aqui",
  },
  description:
    "Especialistas em venda, revenda e avaliação justa na troca do seu veículo. Carros e motos com procedência, garantia e transparência.",
  keywords: [
    "concessionária",
    "carros usados",
    "motos usadas",
    "troca de veículos",
    "Popular Veículos",
    "revenda",
    "tuning",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://popularveiculos.com.br",
    siteName: "Popular Veículos",
    title: "Popular Veículos — Sua Próxima Conquista Está Aqui",
    description:
      "Especialistas em venda, revenda e avaliação justa na troca do seu veículo.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "Popular Veículos",
  description:
    "Especialistas em venda, revenda e avaliação justa na troca do seu veículo.",
  url: "https://popularveiculos.com.br",
  telephone: "+55-11-99999-9999",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressCountry: "BR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "13:00",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0A0A0A] text-[#E0E0E0] font-body antialiased">
        <AuthProvider>
          <VehicleProvider>{children}</VehicleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

