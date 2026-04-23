"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  hue: number;
  baseRadius: number;
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
    let hue = 180;
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
          hue: (hue + i * 5) % 360,
          baseRadius: 20 + Math.random() * 15,
        });
      }
      hue = (hue + 2) % 360;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const draw = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(10, 15, 30, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = "lighter";
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
        const alpha = Math.pow(lifeRatio, 1.8) * 0.22;
        const expansion = 1 + (1 - lifeRatio) * 2.2;
        const radius = p.baseRadius * expansion;

        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0, p.x, p.y, radius
        );
        gradient.addColorStop(0, `hsla(${p.hue}, 85%, 60%, ${alpha})`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 85%, 55%, ${alpha * 0.35})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 85%, 50%, 0)`);
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
      style={{ filter: "blur(14px) contrast(1.1) saturate(1.1)" }}
      aria-hidden="true"
    />
  );
}
