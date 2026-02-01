import styles from "./WatermarkOverlay.module.css";

type WatermarkOverlayProps = {
  partnerName: string;
  outletId: string;
  timestamp: string;
  tiles?: number;
};

export default function WatermarkOverlay({
  partnerName,
  outletId,
  timestamp,
  tiles = 24,
}: WatermarkOverlayProps) {
  const label = `${partnerName} • ${outletId} • ${timestamp}`;
  const items = Array.from({ length: tiles }, (_, index) => (
    <div key={index} className={styles.tile}>
      {label}
    </div>
  ));

  return <div className={styles.overlay}>{items}</div>;
}
