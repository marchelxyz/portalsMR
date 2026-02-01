"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  fetchAiTickets,
  fetchFranchiseSummary,
  fetchCurrentUser,
  fetchKpis,
  fetchWeeklyChart,
} from "@/lib/api";
import type {
  AiTicket,
  FranchiseSummary,
  KpiSummary,
  UserProfile,
  WeeklyChartPoint,
} from "@/types/dashboard";

import styles from "./Dashboard.module.css";
type DashboardState = {
  kpis: KpiSummary | null;
  tickets: AiTicket[];
  franchise: FranchiseSummary | null;
  weekly: WeeklyChartPoint[];
  user: UserProfile | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [state, setState] = useState<DashboardState>({
    kpis: null,
    tickets: [],
    franchise: null,
    weekly: [],
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const token = window.localStorage.getItem("portal_token");
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([
      fetchKpis(token),
      fetchAiTickets(token),
      fetchFranchiseSummary(token),
      fetchWeeklyChart(token),
      fetchCurrentUser(token),
    ])
      .then(([kpis, tickets, franchise, weekly, user]) => {
        setState({ kpis, tickets, franchise, weekly, user });
      })
      .catch(() => {
        window.localStorage.removeItem("portal_token");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    const updateScale = () => {
      const scaleByWidth = window.innerWidth / FRAME_WIDTH;
      const scaleByHeight = window.innerHeight / FRAME_HEIGHT;
      const nextScale = Math.max(scaleByWidth, scaleByHeight);
      setScale(nextScale);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  if (loading) {
    return <main className={styles.page}>Загрузка...</main>;
  }

  return (
    <main className={styles.page}>
      <div className={styles.scaleStage} style={{ transform: `scale(${scale})` }}>
        <div className={styles.frame}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarLogo}>
              <img src="/figma/logo.png" alt="Portal 2.0" />
            </div>
            <SidebarItem label="Главная" iconType="home" position="home" />
            <SidebarItem label="Отчеты" iconType="report" position="reports" />
            <SidebarItem label="База знаний" iconType="knowledge" position="knowledge" />
          </aside>
          <TopKpiRow kpis={state.kpis} />
          <BalanceCard franchise={state.franchise} />
          <MarketingCard />
          <WeeklyChart weekly={state.weekly} />
          <CostStructure />
          <AiAlerts tickets={state.tickets} />
        </div>
      </div>
    </main>
  );
}

function TopKpiRow({ kpis }: { kpis: KpiSummary | null }) {
  const revenueValue = kpis ? formatCurrency(kpis.revenue_today) : "—";
  const forecastValue = kpis ? formatCurrency(kpis.profit_forecast) : "—";
  const laborPercent = kpis ? formatPercent(kpis.labor_cost_percent) : "—";
  const foodPercent = kpis ? formatPercent(kpis.food_cost_percent) : "—";
  const planPercent = kpis ? `+${kpis.revenue_plan_percent.toFixed(0)}% план` : "—";
  const lflPercent = kpis ? `LFL ${kpis.lfl_percent.toFixed(1)}%` : "—";

  const laborCritical = kpis ? kpis.labor_cost_percent > 28 : false;

  return (
    <>
      <TopKpiCard
        title="Выручка (Сегодня)"
        value={revenueValue}
        hint={planPercent}
        iconType="revenue"
        tone="success"
        className={`${styles.card} ${styles.topCard} ${styles.topRevenue}`}
      />
      <TopKpiCard
        title="ФОТ"
        value={laborPercent}
        hint={laborCritical ? "Критично! Норма 28%" : "В норме"}
        iconType="labor"
        tone={laborCritical ? "critical" : "success"}
        className={`${styles.card} ${styles.topCard} ${styles.topLabor}`}
      />
      <TopKpiCard
        title="Food Cost"
        value={foodPercent}
        hint={lflPercent}
        iconType="food"
        tone="default"
        className={`${styles.card} ${styles.topCard} ${styles.topFood}`}
      />
      <TopKpiCard
        title="Чистая прибыль (прогноз)"
        value={forecastValue}
        hint="Прогноз месяца"
        iconType="profit"
        tone="default"
        className={`${styles.card} ${styles.topCard} ${styles.topProfit}`}
      />
    </>
  );
}

function TopKpiCard({
  title,
  value,
  hint,
  iconType,
  tone,
  className,
}: {
  title: string;
  value: string;
  hint: string;
  iconType: "revenue" | "labor" | "food" | "profit";
  tone: "default" | "critical" | "success";
  className: string;
}) {
  const iconClass =
    tone === "critical" ? styles.iconCritical : styles.iconDefault;
  const hintClass =
    tone === "critical" ? styles.cardHintCritical : styles.cardHint;
  return (
    <div className={className}>
      <div className={`${styles.iconTile} ${iconClass}`}>
        <KpiIcon iconType={iconType} />
      </div>
      <div className={styles.cardTitle}>{title}</div>
      <div className={styles.cardValue}>{value}</div>
      <div className={hintClass}>{hint}</div>
    </div>
  );
}

function BalanceCard({ franchise }: { franchise: FranchiseSummary | null }) {
  return (
    <div className={`${styles.card} ${styles.balanceCard}`}>
      <div className={styles.blockTitle}>Баланс с УК</div>
      <div>
        <div>К оплате:</div>
        <div className={styles.cardValue}>
          {formatCurrency(franchise?.supplies_due)}
        </div>
      </div>
      <div className={styles.divider} />
      <div>Роялти: {formatCurrency(franchise?.royalty_due)}</div>
      <div>Маркетинг: {formatCurrency(franchise?.marketing_due)}</div>
      <button className={styles.payButton} type="button">
        Оплатить
      </button>
    </div>
  );
}

function WeeklyChart({ weekly }: { weekly: WeeklyChartPoint[] }) {
  const { linePath, dots } = buildLineChart(weekly);
  return (
    <div className={`${styles.card} ${styles.centerChart}`}>
      <div className={styles.blockTitle}>Динамика Выручки и Чеков (Неделя)</div>
      {weekly.length === 0 ? (
        <div className={styles.cardHintGray}>Данные не загружены.</div>
      ) : (
        <>
          <svg className={styles.chartCanvas} viewBox="0 0 300 90">
            <path d={linePath} fill="none" stroke="#2170e6" strokeWidth="2" />
            {dots.map((dot, index) => (
              <circle key={index} cx={dot.x} cy={dot.y} r="3" fill="#2170e6" />
            ))}
          </svg>
          <div className={styles.chartLegend}>
            <span>Выручка</span>
            <span>Чеки: {sumChecks(weekly)}</span>
          </div>
        </>
      )}
    </div>
  );
}

function CostStructure() {
  return (
    <div className={`${styles.card} ${styles.centerDonut}`}>
      <div className={styles.blockTitle}>Структура Расходов</div>
      <div className={styles.donutRow}>
        <svg className={styles.donut} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="42" fill="none" stroke="#e6eef9" strokeWidth="12" />
          <circle
            cx="60"
            cy="60"
            r="42"
            fill="none"
            stroke="#2170e6"
            strokeWidth="12"
            strokeDasharray="79 263"
            strokeDashoffset="-10"
          />
          <circle
            cx="60"
            cy="60"
            r="42"
            fill="none"
            stroke="#6ea4f5"
            strokeWidth="12"
            strokeDasharray="73 263"
            strokeDashoffset="-100"
          />
          <circle
            cx="60"
            cy="60"
            r="42"
            fill="none"
            stroke="#9cc7ff"
            strokeWidth="12"
            strokeDasharray="47 263"
            strokeDashoffset="-180"
          />
        </svg>
        <div>
          <div className={styles.legendRow}>
            <span className={styles.legendDot} style={{ background: "#2170e6" }} />
            <span>ФОТ (31%)</span>
          </div>
          <div className={styles.legendRow}>
            <span className={styles.legendDot} style={{ background: "#6ea4f5" }} />
            <span>Продукты (28.5%)</span>
          </div>
          <div className={styles.legendRow}>
            <span className={styles.legendDot} style={{ background: "#9cc7ff" }} />
            <span>Аренда</span>
          </div>
          <div className={styles.legendRow}>
            <span className={styles.legendDot} style={{ background: "#c8defc" }} />
            <span>Прочее</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value?: number | null) {
  if (value === undefined || value === null) {
    return "—";
  }
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number | null | undefined) {
  if (value === undefined || value === null) {
    return "—";
  }
  return `${value.toFixed(1)}%`;
}

function formatDay(value: string) {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
  });
}

const FRAME_WIDTH = 741;
const FRAME_HEIGHT = 447;

function KpiIcon({ iconType }: { iconType: "revenue" | "labor" | "food" | "profit" }) {
  if (iconType === "labor") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M8 12h8" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  if (iconType === "food") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
        <path
          d="M7 3v8M11 3v8M9 3v8M9 11v10"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M16 3v7a3 3 0 003 3v8"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }
  if (iconType === "profit") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
        <path
          d="M12 3v18M16 7c0-2-2-3-4-3s-4 1-4 3 2 3 4 3 4 1 4 3-2 3-4 3-4-1-4-3"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
      <path
        d="M4 14l4-4 4 3 6-6"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="18" cy="7" r="2" fill="currentColor" />
    </svg>
  );
}

function SidebarItem({
  label,
  iconType,
  position,
}: {
  label: string;
  iconType: "home" | "report" | "knowledge";
  position: "home" | "reports" | "knowledge";
}) {
  const positionClass =
    position === "home"
      ? styles.sidebarItemHome
      : position === "reports"
      ? styles.sidebarItemReports
      : styles.sidebarItemKnowledge;
  return (
    <div className={`${styles.sidebarItem} ${positionClass}`}>
      <SidebarIcon iconType={iconType} />
      <span>{label}</span>
    </div>
  );
}

function SidebarIcon({ iconType }: { iconType: "home" | "report" | "knowledge" }) {
  if (iconType === "home") {
    return <img src="/figma/sidebar-home.svg" alt="" width={14} height={14} />;
  }
  if (iconType === "report") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
        <path
          d="M5 4h9l5 5v11a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M9 13h6M9 17h6" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  if (iconType === "knowledge") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
        <path
          d="M4 6h7a3 3 0 013 3v9H7a3 3 0 01-3-3V6z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M20 6h-7a3 3 0 00-3 3v9h7a3 3 0 003-3V6z"
          stroke="currentColor"
          strokeWidth="2"
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

function buildLineChart(data: WeeklyChartPoint[]) {
  if (data.length === 0) {
    return { linePath: "", dots: [] as { x: number; y: number }[] };
  }

  const width = 300;
  const height = 90;
  const padding = 10;
  const values = data.map((item) => item.revenue);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;

  const step =
    data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;
  const points = data.map((item, index) => {
    const x = data.length > 1 ? padding + index * step : width / 2;
    const y = height - padding - ((item.revenue - minValue) / range) * (height - padding * 2);
    return { x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");

  return { linePath, dots: points };
}

function sumChecks(data: WeeklyChartPoint[]) {
  return data.reduce((total, item) => total + item.checks, 0);
}

function MarketingCard() {
  return (
    <div className={`${styles.card} ${styles.marketingCard}`}>
      <div className={styles.blockTitle}>Маркетинг</div>
      <div>Расход:</div>
      <div className={styles.cardValue}>60,000 ₽</div>
      <div className={styles.divider} />
      <div>VK реклама: 25,000 ₽</div>
      <div>Блогеры: 15,000 ₽</div>
      <div>Карты: 20,000 ₽</div>
      <button className={styles.marketingButton} type="button">
        Посмотреть отчет
      </button>
    </div>
  );
}

function AiAlerts({ tickets }: { tickets: AiTicket[] }) {
  const critical = tickets.find((ticket) => ticket.severity === "critical");
  const advice = tickets.find((ticket) => ticket.severity === "advice");

  return (
    <div className={`${styles.card} ${styles.rightPanel}`}>
      <div className={`${styles.alertCard} ${styles.alertCritical}`}>
        <div className={styles.alertTitle}>Внимание</div>
        <div>{critical?.body ?? "ФОТ превышен. Проверьте смены."}</div>
        <div className={styles.alertTitle}>Рекомендация</div>
        <div>{critical?.action_label ?? "Пересмотреть график"}</div>
      </div>
      <div className={`${styles.alertCard} ${styles.alertAdvice}`}>
        <div className={styles.alertTitle}>Совет</div>
        <div>{advice?.body ?? "Продажи сезонных позиций снизились."}</div>
        <div className={styles.alertTitle}>Рекомендация</div>
        <div>{advice?.action_label ?? "Запустить промо"}</div>
      </div>
      <div className={styles.ghostButton}>Задать вопрос</div>
    </div>
  );
}
