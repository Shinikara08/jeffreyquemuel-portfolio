"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  baseRadius: number;
  rgb: string;
}

// Three smoke tones for visual variety
const SMOKE_PALETTE = [
  { rgb: "0, 0, 0", weight: 0.5 },           // black shadow (50%)
  { rgb: "30, 35, 45", weight: 0.25 },       // dark smoke (25%)
  { rgb: "200, 210, 225", weight: 0.25 },    // white smoke (25%)
];

function pickSmokeColor(): string {
  const r = Math.random();
  let cumulative = 0;
  for (const tone of SMOKE_PALETTE) {
    cumulative += tone.weight;
    if (r < cumulative) return tone.rgb;
  }
  return SMOKE_PALETTE[0].rgb;
}

export default function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const points: Point[] = [];
    let animationId = 0;
    let lastX = -1;
    let lastY = -1;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (lastX === -1) {
        lastX = e.clientX;
        lastY = e.clientY;
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.floor(dist / 10));
      const dirX = dist > 0 ? dx / dist : 0;
      const dirY = dist > 0 ? dy / dist : 0;

      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const perpX = -dirY;
        const perpY = dirX;
        const spread = (Math.random() - 0.5) * 2;
        points.push({
          x: lastX + dx * t,
          y: lastY + dy * t,
          vx: dirX * 0.7 + perpX * spread,
          vy: dirY * 0.7 + perpY * spread,
          age: 0,
          baseRadius: 20 + Math.random() * 15,
          rgb: pickSmokeColor(),
        });
      }
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const draw = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(10, 15, 30, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.age += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;

        const life = 120;
        if (p.age > life) {
          points.splice(i, 1);
          continue;
        }
        const lifeRatio = 1 - p.age / life;
        const alpha = Math.pow(lifeRatio, 1.5) * 0.45;
        const expansion = 1 + (1 - lifeRatio) * 2.2;
        const radius = p.baseRadius * expansion;

        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0, p.x, p.y, radius
        );
        gradient.addColorStop(0, `rgba(${p.rgb}, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(${p.rgb}, ${alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(${p.rgb}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ filter: "blur(14px)" }}
      aria-hidden="true"
    />
  );
}
