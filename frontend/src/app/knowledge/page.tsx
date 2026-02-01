import Sidebar from "@/components/Sidebar";
import ScaledFrame from "@/components/ScaledFrame";

import styles from "../dashboard/Dashboard.module.css";

export default function KnowledgePage() {
  return (
    <main className={styles.page}>
      <ScaledFrame>
        <Sidebar currentPath="/knowledge" />
        <div className={styles.contentArea}>
          <h1>База знаний</h1>
          <p>Раздел базы знаний в разработке.</p>
        </div>
      </ScaledFrame>
    </main>
  );
}
