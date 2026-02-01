"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./Sidebar.module.css";

type SidebarProps = {
  currentPath?: string;
};

export default function Sidebar({ currentPath }: SidebarProps) {
  const pathname = usePathname();
  const activePath = currentPath ?? pathname ?? "";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <img src="/figma/logo.png" alt="Portal 2.0" />
      </div>
      <SidebarItem
        label="Главная"
        iconType="home"
        position="home"
        href="/dashboard"
        isActive={activePath === "/" || activePath === "/dashboard"}
      />
      <SidebarItem
        label="Отчеты"
        iconType="report"
        position="reports"
        href="/reports"
        isActive={activePath === "/reports"}
      />
      <SidebarItem
        label="База знаний"
        iconType="knowledge"
        position="knowledge"
        href="/knowledge"
        isActive={activePath === "/knowledge"}
      />
    </aside>
  );
}

type SidebarItemProps = {
  label: string;
  iconType: "home" | "report" | "knowledge";
  position: "home" | "reports" | "knowledge";
  href: string;
  isActive: boolean;
};

function SidebarItem({
  label,
  iconType,
  position,
  href,
  isActive,
}: SidebarItemProps) {
  const positionClass =
    position === "home"
      ? styles.sidebarItemHome
      : position === "reports"
      ? styles.sidebarItemReports
      : styles.sidebarItemKnowledge;
  const stateClass = isActive ? styles.sidebarItemActive : styles.sidebarItemInactive;
  return (
    <Link className={`${styles.sidebarItem} ${positionClass} ${stateClass}`} href={href}>
      <SidebarIcon iconType={iconType} isActive={isActive} />
      <span>{label}</span>
    </Link>
  );
}

type SidebarIconProps = {
  iconType: "home" | "report" | "knowledge";
  isActive: boolean;
};

function SidebarIcon({ iconType, isActive }: SidebarIconProps) {
  const iconClass = isActive ? styles.sidebarIconActive : styles.sidebarIconInactive;
  if (iconType === "home") {
    return (
      <img
        src="/figma/sidebar-home.svg"
        alt=""
        width={18}
        height={18}
        className={iconClass}
      />
    );
  }
  if (iconType === "report") {
    return (
      <img
        src="/figma/sidebar-report.svg"
        alt=""
        width={18}
        height={18}
        className={iconClass}
      />
    );
  }
  if (iconType === "knowledge") {
    return (
      <img
        src="/figma/sidebar-knowledge.svg"
        alt=""
        width={18}
        height={18}
        className={iconClass}
      />
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
      <path
        d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
