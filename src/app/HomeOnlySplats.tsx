/* src/app/HomeOnlySplats.tsx */
"use client";

import { usePathname } from "next/navigation";

type HomeOnlySplatsProps = {
  variant?: "header" | "hero";
};

export default function HomeOnlySplats({ variant = "header" }: HomeOnlySplatsProps) {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <div className={`cc-splats-front cc-splats-front--${variant}`} aria-hidden="true">
      <img className="cc-splat cc-splat-pink" src="/Logos/paint/paint-pink.png" alt="" />
      <img className="cc-splat cc-splat-purple" src="/Logos/paint/paint-purple.png" alt="" />
      <img className="cc-splat cc-splat-yellow" src="/Logos/paint/paint-yellow.png" alt="" />
      <img className="cc-splat cc-splat-green" src="/Logos/paint/paint-green.png" alt="" />
    </div>
  );
}

