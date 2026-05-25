"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useInView } from "framer-motion";

interface StatItemProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description: string;
}

function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });
    return unsubscribe;
  }, [spring]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

const stats: StatItemProps[] = [
  {
    value: 847,
    suffix: "+",
    label: "Veículos Vendidos",
    description: "Negócios fechados com sucesso",
  },
  {
    value: 1200,
    suffix: "+",
    label: "Clientes Satisfeitos",
    description: "Famílias atendidas com excelência",
  },
  {
    value: 12,
    label: "Anos de Mercado",
    description: "Tradição e experiência no setor",
  },
  {
    value: 98,
    suffix: "%",
    label: "Taxa de Satisfação",
    description: "Clientes que nos recomendam",
  },
];

export function StatsCounter() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-[#141414] relative overflow-hidden"
      aria-label="Estatísticas Popular Veículos"
    >
      {/* Gold top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-heading font-black text-[#FFD700] mb-2">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </p>
              <p className="font-heading font-bold text-white text-base mb-1">
                {stat.label}
              </p>
              <p className="text-[#6B6B6B] text-xs font-body">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
