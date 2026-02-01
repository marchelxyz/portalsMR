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
import WatermarkOverlay from "@/components/WatermarkOverlay";

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
  const [timestamp, setTimestamp] = useState(getTimestamp());

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
    const interval = window.setInterval(() => {
      setTimestamp(getTimestamp());
    }, 60000);
    return () => window.clearInterval(interval);
  }, []);

  if (loading) {
    return <main className={styles.page}>Загрузка...</main>;
  }

  return (
    <main className={styles.page}>
      {shouldShowWatermark() && state.user ? (
        <WatermarkOverlay
          partnerName={state.user.partner?.name ?? state.user.full_name}
          outletId={
            state.user.outlet?.external_id ??
            `OUT-${state.user.outlet?.id ?? state.user.id}`
          }
          timestamp={timestamp}
        />
      ) : null}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>AI</div>
        <SidebarItem label="Главная" iconType="home" />
        <SidebarItem label="Отчеты" iconType="report" />
        <SidebarItem label="База" iconType="knowledge" />
      </aside>
      <section className={styles.content}>
        <KpiRow kpis={state.kpis} />
        <div className={styles.centerRow}>
          <TicketsPanel tickets={state.tickets} />
          <SideCards franchise={state.franchise} />
        </div>
        <div className={styles.bottomRow}>
          <WeeklyChart weekly={state.weekly} />
          <CostStructure />
        </div>
      </section>
    </main>
  );
}

function KpiRow({ kpis }: { kpis: KpiSummary | null }) {
  const revenueValue = kpis ? formatCurrency(kpis.revenue_today) : "—";
  const forecastValue = kpis ? formatCurrency(kpis.profit_forecast) : "—";
  const laborPercent = kpis ? formatPercent(kpis.labor_cost_percent) : "—";
  const foodPercent = kpis ? formatPercent(kpis.food_cost_percent) : "—";
  const planPercent = kpis ? `+${kpis.revenue_plan_percent.toFixed(0)}% план` : "—";
  const lflPercent = kpis ? `LFL ${kpis.lfl_percent.toFixed(1)}%` : "—";

  const laborCritical = kpis ? kpis.labor_cost_percent > 28 : false;

  return (
    <div className={styles.kpiRow}>
      <KpiCard
        title="Выручка (Сегодня)"
        value={revenueValue}
        hint={planPercent}
        iconType="revenue"
        tone="success"
      />
      <KpiCard
        title="ФОТ"
        value={laborPercent}
        hint={laborCritical ? "Критично! Норма 28%" : "В норме"}
        iconType="labor"
        tone={laborCritical ? "critical" : "success"}
      />
      <KpiCard
        title="Food Cost"
        value={foodPercent}
        hint={lflPercent}
        iconType="food"
        tone="default"
      />
      <KpiCard
        title="Чистая прибыль (прогноз)"
        value={forecastValue}
        hint="Прогноз месяца"
        iconType="profit"
        tone="default"
      />
    </div>
  );
}

function KpiCard({
  title,
  value,
  hint,
  iconType,
  tone,
}: {
  title: string;
  value: string;
  hint: string;
  iconType: "revenue" | "labor" | "food" | "profit";
  tone: "default" | "critical" | "success";
}) {
  const iconClass =
    tone === "critical"
      ? styles.kpiIconCritical
      : tone === "success"
      ? styles.kpiIconSuccess
      : "";
  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiHeader}>
        <div className={[styles.kpiIcon, iconClass].join(" ")}>
          <KpiIcon iconType={iconType} />
        </div>
        <div className={styles.kpiTitle}>{title}</div>
      </div>
      <div className={styles.kpiValue}>{value}</div>
      <div className={tone === "critical" ? styles.kpiHintCritical : styles.kpiHint}>
        {hint}
      </div>
    </div>
  );
}

function TicketsPanel({ tickets }: { tickets: AiTicket[] }) {
  return (
    <div className={styles.tickets}>
      <div className={styles.ticketsHeader}>AI Кубер — подсказки</div>
      {tickets.length === 0 ? (
        <div>Нет активных задач.</div>
      ) : (
        tickets.map((ticket) => (
          <div
            key={ticket.id}
            className={[
              styles.ticket,
              ticket.severity === "critical" ? styles.ticketCritical : "",
              ticket.severity === "advice" ? styles.ticketAdvice : "",
            ].join(" ")}
          >
            <div className={styles.ticketTitle}>{ticket.title}</div>
            <div className={styles.ticketBody}>{ticket.body}</div>
            <span className={styles.ticketAction}>{ticket.action_label}</span>
          </div>
        ))
      )}
    </div>
  );
}

function SideCards({ franchise }: { franchise: FranchiseSummary | null }) {
  return (
    <div className={styles.sideCards}>
      <div className={styles.sideCard}>
        <div className={styles.sideCardTitle}>Баланс с УК</div>
        <div className={styles.financeRow}>
          <span className={styles.financeLabel}>Роялти</span>
          <span>{formatCurrency(franchise?.royalty_due)}</span>
        </div>
        <div className={styles.financeRow}>
          <span className={styles.financeLabel}>Маркетинг</span>
          <span>{formatCurrency(franchise?.marketing_due)}</span>
        </div>
        <div className={styles.financeRow}>
          <span className={styles.financeLabel}>Закупки</span>
          <span>{formatCurrency(franchise?.supplies_due)}</span>
        </div>
        <button className={styles.buttonPrimary} type="button">
          Оплатить
        </button>
      </div>
      <div className={styles.sideCard}>
        <div className={styles.sideCardTitle}>QSC индекс</div>
        <div className={styles.kpiValue}>
          {franchise ? `${franchise.qsc_index.toFixed(1)}%` : "—"}
        </div>
        <div className={styles.kpiHint}>Рейтинг по стандартам сети</div>
      </div>
    </div>
  );
}

function WeeklyChart({ weekly }: { weekly: WeeklyChartPoint[] }) {
  const { linePath, dots } = buildLineChart(weekly);
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>Динамика недели</div>
      {weekly.length === 0 ? (
        <div className={styles.chartList}>Данные не загружены.</div>
      ) : (
        <>
          <svg className={styles.chartCanvas} viewBox="0 0 320 120">
            <path
              d={linePath}
              fill="none"
              stroke="#2170e6"
              strokeWidth="2"
            />
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
    <div className={styles.structureCard}>
      <div className={styles.chartHeader}>Структура расходов</div>
      <div className={styles.structureContent}>
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
        <div className={styles.structureLegend}>
          <div className={styles.legendRow}>
            <span className={styles.legendDot} style={{ background: "#2170e6" }} />
            <span>ФОТ 31%</span>
          </div>
          <div className={styles.legendRow}>
            <span className={styles.legendDot} style={{ background: "#6ea4f5" }} />
            <span>Продукты 28.5%</span>
          </div>
          <div className={styles.legendRow}>
            <span className={styles.legendDot} style={{ background: "#9cc7ff" }} />
            <span>Аренда 18%</span>
          </div>
          <div className={styles.legendRow}>
            <span className={styles.legendDot} style={{ background: "#c8defc" }} />
            <span>Прочее 22.5%</span>
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

function getTimestamp() {
  return new Date().toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shouldShowWatermark() {
  return process.env.NEXT_PUBLIC_WATERMARK_ENABLED !== "false";
}

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
}: {
  label: string;
  iconType: "home" | "report" | "knowledge";
}) {
  return (
    <div className={styles.sidebarItem}>
      <SidebarIcon iconType={iconType} />
      <span>{label}</span>
    </div>
  );
}

function SidebarIcon({ iconType }: { iconType: "home" | "report" | "knowledge" }) {
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

  const width = 320;
  const height = 120;
  const padding = 16;
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
