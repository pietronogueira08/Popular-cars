import { Phone, Mail, MapPin, Share2, Users } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer id="contato" className="bg-[#141414] border-t border-[#2A2A2A] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-10 w-40">
                <Image 
                  src="/logo.png" 
                  alt="Popular Veículos" 
                  fill 
                  sizes="160px"
                  className="object-contain object-left drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                />
              </div>
            </div>
            <p className="text-[#6B6B6B] font-body text-sm leading-relaxed max-w-sm">
              Especialistas em venda, revenda e avaliação justa na troca do seu
              veículo. Procedência, garantia e transparência em cada negociação.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#FFD700] hover:border-[#FFD700]/40 transition-all"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#FFD700] hover:border-[#FFD700]/40 transition-all"
              >
                <Users className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="font-heading font-bold text-white mb-4">Navegação</p>
            <ul className="space-y-2">
              {[
                { label: "Estoque", href: "#estoque" },
                { label: "Avaliação de Troca", href: "#avaliacao" },
                { label: "Depoimentos", href: "#" },
                { label: "Admin", href: "/admin/dashboard" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#6B6B6B] font-body text-sm hover:text-[#FFD700] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-heading font-bold text-white mb-4">Contato</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-[#6B6B6B] text-sm font-body">
                <Phone className="w-4 h-4 text-[#FFD700] mt-0.5 flex-shrink-0" />
                (11) 99999-9999
              </li>
              <li className="flex items-start gap-3 text-[#6B6B6B] text-sm font-body">
                <Mail className="w-4 h-4 text-[#FFD700] mt-0.5 flex-shrink-0" />
                contato@popularveiculos.com.br
              </li>
              <li className="flex items-start gap-3 text-[#6B6B6B] text-sm font-body">
                <MapPin className="w-4 h-4 text-[#FFD700] mt-0.5 flex-shrink-0" />
                Av. dos Veículos, 1234<br />São Paulo - SP
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#2A2A2A] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#6B6B6B] text-xs font-body">
            © {new Date().getFullYear()} Popular Veículos. Todos os direitos reservados.
          </p>
          <p className="text-[#6B6B6B] text-xs font-body">
            CNPJ: 00.000.000/0001-00
          </p>
        </div>
      </div>
    </footer>
  );
}
