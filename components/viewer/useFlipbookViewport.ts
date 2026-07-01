"use client";

import { useEffect, useState, type RefObject } from "react";

export function useFlipbookViewport(containerRef: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let frame = 0;

    const update = (width: number, height: number) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setSize((prev) =>
          prev.width === width && prev.height === height ? prev : { width, height }
        );
      });
    };

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      update(width, height);
    });

    ro.observe(el);
    update(el.clientWidth, el.clientHeight);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [containerRef]);

  return size;
}
