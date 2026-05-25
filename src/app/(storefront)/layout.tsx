import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { BottomNav } from "@/components/BottomNav";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <WhatsAppFAB />
      <BottomNav />
    </>
  );
}
