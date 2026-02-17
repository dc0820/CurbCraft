/* curb-craft/src/app/HomeOnlySplats.tsx */
"use client";

import { usePathname } from "next/navigation";

const SPLATS = [
  { cls: "cc-splat-pink", src: "/Logos/paint/paint-pink.png" },
  { cls: "cc-splat-purple", src: "/Logos/paint/paint-purple.png" },
  { cls: "cc-splat-yellow", src: "/Logos/paint/paint-yellow.png" },
  { cls: "cc-splat-green", src: "/Logos/paint/paint-green.png" },
];

function SplatLayer({ className }: { className: string }) {
  return (
    <div className={className} aria-hidden="true">
      {SPLATS.map((s) => (
        <img key={s.cls} className={`cc-splat ${s.cls}`} src={s.src} alt="" />
      ))}
    </div>
  );
}

export default function HomeOnlySplats() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <>
      {/* BACK splats (behind everything) */}
      <SplatLayer className="cc-splats-back" />

      {/* FRONT splats (same exact coords, just higher z-index) */}
      <SplatLayer className="cc-splats-front" />
    </>
  );
}
