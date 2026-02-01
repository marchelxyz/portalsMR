import Sidebar from "@/components/Sidebar";

import styles from "../dashboard/Dashboard.module.css";

export default function KnowledgePage() {
  return (
    <main className={styles.page}>
      <div className={styles.frame}>
        <Sidebar currentPath="/knowledge" />
        <div className={styles.contentArea}>
          <h1>База знаний</h1>
          <p>Раздел базы знаний в разработке.</p>
        </div>
      </div>
    </main>
  );
}
