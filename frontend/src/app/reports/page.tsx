import Sidebar from "@/components/Sidebar";

import styles from "../dashboard/Dashboard.module.css";

export default function ReportsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.frame}>
        <Sidebar currentPath="/reports" />
        <div className={styles.contentArea}>
          <h1>Отчеты</h1>
          <p>Страница отчетов в разработке.</p>
        </div>
      </div>
    </main>
  );
}
