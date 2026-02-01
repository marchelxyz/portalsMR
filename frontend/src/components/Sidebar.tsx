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
      <svg
        viewBox="0 0 20 22"
        width={18}
        height={18}
        className={iconClass}
        fill="none"
      >
        <path
          d="M7 21V11H13V21M1 8L10 1L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (iconType === "report") {
    return (
      <svg
        viewBox="0 0 20.0003 22.0779"
        width={18}
        height={18}
        className={iconClass}
        fill="none"
      >
        <path
          d="M5.50017 3.20795L10.0002 5.80795L14.5002 3.20795M5.50017 18.788V13.5979L1.00017 10.9979M19.0002 10.9979L14.5002 13.5979V18.788M1.27017 5.95795L10.0002 11.0079L18.7302 5.95795M10.0002 21.0779V10.9979M19.0002 14.9979V6.99795C18.9998 6.64722 18.9072 6.30276 18.7317 5.99911C18.5562 5.69546 18.3039 5.44331 18.0002 5.26795L11.0002 1.26795C10.6961 1.09241 10.3512 1 10.0002 1C9.64909 1 9.30421 1.09241 9.00017 1.26795L2.00017 5.26795C1.69643 5.44331 1.44415 5.69546 1.26863 5.99911C1.09311 6.30276 1.00053 6.64722 1.00017 6.99795V14.9979C1.00053 15.3487 1.09311 15.6931 1.26863 15.9968C1.44415 16.3004 1.69643 16.5526 2.00017 16.7279L9.00017 20.7279C9.30421 20.9035 9.64909 20.9959 10.0002 20.9959C10.3512 20.9959 10.6961 20.9035 11.0002 20.7279L18.0002 16.7279C18.3039 16.5526 18.5562 16.3004 18.7317 15.9968C18.9072 15.6931 18.9998 15.3487 19.0002 14.9979Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (iconType === "knowledge") {
    return (
      <svg
        viewBox="0 0 22 20"
        width={18}
        height={18}
        className={iconClass}
        fill="none"
      >
        <path
          d="M11 5C11 3.93913 10.5786 2.92172 9.82843 2.17157C9.07828 1.42143 8.06087 1 7 1H1V16H8C8.79565 16 9.55871 16.3161 10.1213 16.8787C10.6839 17.4413 11 18.2044 11 19M11 5V19M11 5C11 3.93913 11.4214 2.92172 12.1716 2.17157C12.9217 1.42143 13.9391 1 15 1H21V16H14C13.2044 16 12.4413 16.3161 11.8787 16.8787C11.3161 17.4413 11 18.2044 11 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
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
