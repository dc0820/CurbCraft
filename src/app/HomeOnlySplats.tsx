/* curb-craft/src/app/HomeOnlySplats.tsx */
"use client";

import { usePathname } from "next/navigation";

type Splat = {
  key: string;
  className: string;
  src: string;
};

const SPLATS: Splat[] = [
  { key: "pink", className: "cc-splat cc-splat-pink", src: "/Logos/paint/paint-pink.png" },
  { key: "purple", className: "cc-splat cc-splat-purple", src: "/Logos/paint/paint-purple.png" },
  { key: "yellow", className: "cc-splat cc-splat-yellow", src: "/Logos/paint/paint-yellow.png" },
  { key: "green", className: "cc-splat cc-splat-green", src: "/Logos/paint/paint-green.png" },
];

export default function HomeOnlySplats() {
  const pathname = usePathname();

  // Only show the "front" splats on the home page
  if (pathname !== "/") return null;

  return (
    <div
      className="cc-splats-front"
      aria-hidden="true"
      style={{
        pointerEvents: "none",
        position: "absolute",
        left: "50%",
        top: 0,
        transform: "translateX(-50%)",
        width: "min(1040px, calc(100% - 28px))",
        height: 300,
        zIndex: 10, // above hero bg, below header (header is z=200)
      }}
    >
      {SPLATS.map((s) => (
        <img key={s.key} className={s.className} src={s.src} alt="" />
      ))}
    </div>
  );
}
