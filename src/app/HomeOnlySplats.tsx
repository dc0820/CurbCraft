/* src/app/HomeOnlySplats.tsx */
"use client";

import { usePathname } from "next/navigation";

export default function HomeOnlySplats() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <div className="cc-splats-front" aria-hidden="true">
      <img className="cc-splat cc-splat-pink" src="/Logos/paint/paint-pink.png" alt="" />
      <img className="cc-splat cc-splat-purple" src="/Logos/paint/paint-purple.png" alt="" />
      <img className="cc-splat cc-splat-yellow" src="/Logos/paint/paint-yellow.png" alt="" />
      <img className="cc-splat cc-splat-green" src="/Logos/paint/paint-green.png" alt="" />
    </div>
  );
}

