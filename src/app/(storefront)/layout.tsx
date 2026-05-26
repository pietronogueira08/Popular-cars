import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { BottomNav } from "@/components/BottomNav";
import { Navbar } from "@/components/Navbar";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <WhatsAppFAB />
      <BottomNav />
    </>
  );
}
