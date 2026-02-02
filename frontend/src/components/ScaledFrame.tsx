"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import styles from "@/app/dashboard/Dashboard.module.css";

type ScaledFrameProps = {
  children: ReactNode;
};

/**
 * Renders the dashboard frame scaled to the viewport.
 */
export default function ScaledFrame({ children }: ScaledFrameProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      setScale(getNextScale(window.innerWidth, window.innerHeight));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div className={styles.scaleStage} style={{ transform: `scale(${scale})` }}>
      <div className={styles.frame}>{children}</div>
    </div>
  );
}

/**
 * Calculates the next scale for the fixed-size frame.
 */
function getNextScale(viewportWidth: number, viewportHeight: number) {
  const scaleByWidth = viewportWidth / FRAME_WIDTH;
  const scaleByHeight = viewportHeight / FRAME_HEIGHT;
  return Math.min(scaleByWidth, scaleByHeight);
}

const FRAME_WIDTH = 741;
const FRAME_HEIGHT = 447;
