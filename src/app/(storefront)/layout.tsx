import { WhatsAppFAB } from "@/components/WhatsAppFAB";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <WhatsAppFAB />
    </>
  );
}
