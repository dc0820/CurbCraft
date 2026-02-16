// curb-craft/src/app/HomePreviewRotator.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Category = "basic" | "sports" | "custom";

const PREVIEW_IMAGES: Record<Category, string[]> = {
  basic: [
    "/Logos/previews/basic.png",
    "/Logos/previews/basic-flag.png",
    "/Logos/previews/basic-top-flag.png",
    "/Logos/previews/texas-flag.png",
  ],
  sports: [
    "/Logos/previews/sports-cowboys-full.png",
    "/Logos/previews/sports-eagles-full-flag.png",
    "/Logos/previews/sports-spurs.png",
    "/Logos/previews/half-sports.png",
  ],
  custom: [
    "/Logos/previews/custom-beach-sun-set-flag.png",
    "/Logos/previews/custom-pine-tree-buck.png",
  ],
};

export default function HomePreviewRotator({
  category,
  intervalMs = 3200,
}: {
  category: Category;
  intervalMs?: number;
}) {
  const images = useMemo(() => PREVIEW_IMAGES[category], [category]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % images.length);
        setVisible(true);
      }, 180);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Image
        src={images[index]}
        alt={`${category} preview`}
        fill
        sizes="(max-width: 860px) 100vw, 280px"
       style={{
        objectFit: "cover",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1.05)" : "scale(1)",
        transition: "opacity 300ms ease, transform 2500ms ease",
      }}
        priority={category === "basic"}
      />
    </div>
  );
}
