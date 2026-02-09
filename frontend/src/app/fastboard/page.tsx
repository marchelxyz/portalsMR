"use client";

import { useMemo, useState } from "react";

import styles from "./Fastboard.module.css";

type FilterId = "filter1" | "filter2" | "filter3";

type BoardMetric = {
  label: string;
  value: string;
  delta: string;
  tone: "up" | "down" | "neutral";
};

type ChartPoint = {
  x: number;
  earned: number;
  spent: number;
};

type ChartData = {
  points: ChartPoint[];
  maxY: number;
};

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "filter1", label: "Фильтр 1" },
  { id: "filter2", label: "Фильтр 2" },
  { id: "filter3", label: "Фильтр 3" },
];

export default function FastboardPage() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("filter1");
  const metrics = useMemo(() => getMetrics(activeFilter), [activeFilter]);
  const chartData = useMemo(() => getChartData(activeFilter), [activeFilter]);

  return (
    <main className={styles.page}>
      <div className={styles.appFrame}>
        <header className={styles.topBar}>
          <div className={styles.topLeft}>
            <button className={styles.iconButton} type="button" aria-label="Назад">
              <ArrowLeftIcon className={styles.icon} />
            </button>
            <button className={styles.titleButton} type="button">
              <span>Лояльность</span>
              <ChevronDownIcon className={styles.iconSmall} />
            </button>
          </div>
          <div className={styles.topCenter}>
            <button className={styles.iconButton} type="button" aria-label="Добавить">
              <PlusIcon className={styles.icon} />
            </button>
          </div>
          <div className={styles.topRight}>
            <div className={styles.avatar}>A</div>
            <button className={styles.iconButton} type="button" aria-label="Сообщения">
              <ChatIcon className={styles.icon} />
            </button>
            <button className={styles.iconButton} type="button" aria-label="Настройки">
              <SettingsIcon className={styles.icon} />
            </button>
          </div>
        </header>

        <div className={styles.bodyGrid}>
          <nav className={styles.leftRail}>
            <RailButton label="Дашборд">
              <PieIcon className={styles.railIcon} />
            </RailButton>
            <RailButton label="Документы">
              <DocIcon className={styles.railIcon} />
            </RailButton>
            <RailButton label="Блоки" isActive>
              <GridIcon className={styles.railIcon} />
            </RailButton>
          </nav>

          <section className={styles.content}>
            <div className={styles.headerRow}>
              <div className={styles.brand}>
                <div className={styles.brandBadge}>БЕТХОВЕН</div>
                <span className={styles.brandCaption}>Сеть зоомагазинов</span>
              </div>
              <div className={styles.headerActions}>
                <button className={styles.iconButton} type="button" aria-label="Переключить">
                  <SwapIcon className={styles.icon} />
                </button>
              </div>
            </div>

            <div className={styles.metricsGrid}>
              {metrics.map((metric) => (
                <div key={metric.label} className={styles.metricCard}>
                  <div className={styles.metricLabel}>{metric.label}</div>
                  <div className={styles.metricValueRow}>
                    <div className={styles.metricValue}>{metric.value}</div>
                    <div
                      className={`${styles.metricDelta} ${styles[`metricDelta${metric.tone}`]}`}
                    >
                      {metric.delta}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>Начисления и списания бонусов</div>
              <LineChart data={chartData} />
            </div>

            <div className={styles.filterRow}>
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  className={`${styles.filterButton} ${
                    filter.id === activeFilter ? styles.filterButtonActive : ""
                  }`}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </section>

          <aside className={styles.rightRail}>
            <RailButton label="Настройки">
              <SettingsIcon className={styles.railIcon} />
            </RailButton>
            <RailButton label="API">
              <CodeIcon className={styles.railIcon} />
            </RailButton>
            <RailButton label="Сохранить">
              <SaveIcon className={styles.railIcon} />
            </RailButton>
          </aside>
        </div>
      </div>
    </main>
  );
}

type RailButtonProps = {
  label: string;
  isActive?: boolean;
  children: React.ReactNode;
};

/**
 * Renders a rail button for the side toolbar.
 */
function RailButton({ label, isActive = false, children }: RailButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.railButton} ${isActive ? styles.railButtonActive : ""}`}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

type LineChartProps = {
  data: ChartData;
};

/**
 * Renders a dual-line chart using SVG paths.
 */
function LineChart({ data }: LineChartProps) {
  const width = 560;
  const height = 220;
  const padding = 24;
  const earnedPath = buildLinePath(data.points, "earned", width, height, padding, data.maxY);
  const spentPath = buildLinePath(data.points, "spent", width, height, padding, data.maxY);
  const xLabels = data.points.map((point) => point.x);
  return (
    <div className={styles.chartWrapper}>
      <svg className={styles.chartSvg} viewBox={`0 0 ${width} ${height}`}>
        {renderGridLines(height, padding, 4).map((line) => (
          <line
            key={line.key}
            x1={padding}
            y1={line.y}
            x2={width - padding}
            y2={line.y}
            className={styles.chartGridLine}
          />
        ))}
        <path d={earnedPath} className={styles.chartLinePrimary} />
        <path d={spentPath} className={styles.chartLineSecondary} />
      </svg>
      <div className={styles.chartXAxis}>
        {xLabels.map((label) => (
          <span key={label} className={styles.chartXAxisLabel}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

type GridLine = {
  key: string;
  y: number;
};

/**
 * Builds horizontal grid lines for the chart.
 */
function renderGridLines(height: number, padding: number, count: number): GridLine[] {
  return Array.from({ length: count }).map((_, index) => {
    const ratio = index / (count - 1);
    return {
      key: `grid-${index}`,
      y: padding + ratio * (height - padding * 2),
    };
  });
}

/**
 * Builds a polyline path for the given chart series.
 */
function buildLinePath(
  points: ChartPoint[],
  key: "earned" | "spent",
  width: number,
  height: number,
  padding: number,
  maxY: number,
) {
  const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;
  return points
    .map((point, index) => {
      const x = padding + index * step;
      const value = point[key];
      const y = height - padding - (value / maxY) * (height - padding * 2);
      return `${index === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");
}

/**
 * Returns metrics based on the active filter.
 */
function getMetrics(filterId: FilterId): BoardMetric[] {
  if (filterId === "filter2") {
    return [
      { label: "Участников программы лояльности", value: "9 812", delta: "+9% ▲", tone: "up" },
      { label: "Сумма отложенной скидки", value: "2 640", delta: "+4% ▲", tone: "up" },
      { label: "Оплачено покупок бонусами", value: "7 120", delta: "+3% ▲", tone: "up" },
      { label: "Активных участников", value: "4 380", delta: "-1% ▼", tone: "down" },
    ];
  }
  if (filterId === "filter3") {
    return [
      { label: "Участников программы лояльности", value: "8 940", delta: "-2% ▼", tone: "down" },
      { label: "Сумма отложенной скидки", value: "2 180", delta: "+1% ▲", tone: "up" },
      { label: "Оплачено покупок бонусами", value: "6 840", delta: "0% ▴", tone: "neutral" },
      { label: "Активных участников", value: "4 120", delta: "+2% ▲", tone: "up" },
    ];
  }
  return [
    { label: "Участников программы лояльности", value: "9 292", delta: "+7% ▲", tone: "up" },
    { label: "Сумма отложенной скидки", value: "2 400", delta: "+5% ▲", tone: "up" },
    { label: "Оплачено покупок бонусами", value: "7 420", delta: "+15% ▲", tone: "up" },
    { label: "Активных участников", value: "4 700", delta: "+7% ▼", tone: "down" },
  ];
}

/**
 * Returns chart data for the active filter.
 */
function getChartData(filterId: FilterId): ChartData {
  const data =
    filterId === "filter2"
      ? {
          earned: [240, 360, 120, 280, 220, 180, 420, 140, 320, 380, 260, 310],
          spent: [120, 190, 80, 160, 210, 140, 310, 60, 200, 300, 150, 110],
        }
      : filterId === "filter3"
      ? {
          earned: [200, 150, 280, 120, 260, 180, 300, 190, 240, 210, 170, 260],
          spent: [90, 220, 140, 80, 160, 110, 260, 130, 180, 150, 140, 120],
        }
      : {
          earned: [210, 430, 90, 260, 180, 420, 140, 360, 230, 310, 200, 380],
          spent: [120, 280, 70, 210, 160, 90, 330, 140, 250, 190, 150, 80],
        };

  const points = data.earned.map((earned, index) => ({
    x: index + 1,
    earned,
    spent: data.spent[index] ?? 0,
  }));
  const maxY = Math.max(...data.earned, ...data.spent) * 1.1;
  return { points, maxY };
}

type IconProps = {
  className?: string;
};

/**
 * Arrow-left icon.
 */
function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M15 6L9 12L15 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Chevron-down icon.
 */
function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Plus icon.
 */
function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Chat icon.
 */
function ChatIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M7 18L4 20V6C4 4.9 4.9 4 6 4H18C19.1 4 20 4.9 20 6V14C20 15.1 19.1 16 18 16H8L7 18Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Settings icon.
 */
function SettingsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 8.5C10.1 8.5 8.5 10.1 8.5 12C8.5 13.9 10.1 15.5 12 15.5C13.9 15.5 15.5 13.9 15.5 12C15.5 10.1 13.9 8.5 12 8.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M19.4 15.5L21 12L19.4 8.5L15.8 7.6L12 4L8.2 7.6L4.6 8.5L3 12L4.6 15.5L8.2 16.4L12 20L15.8 16.4L19.4 15.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

/**
 * Pie icon.
 */
function PieIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2V12H22C22 6.5 17.5 2 12 2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M11 13V4C6.6 4 3 7.6 3 12C3 16.4 6.6 20 11 20C15.4 20 19 16.4 19 12H11Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

/**
 * Document icon.
 */
function DocIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3H15L19 7V21H7V3Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M15 3V7H19" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/**
 * Grid icon.
 */
function GridIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14H20V20H14V14Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

/**
 * Swap icon.
 */
function SwapIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M7 7H20L16.5 3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17 17H4L7.5 20.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Code icon.
 */
function CodeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M8 16L4 12L8 8" stroke="currentColor" strokeWidth="2" />
      <path d="M16 8L20 12L16 16" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/**
 * Save icon.
 */
function SaveIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 4H17L20 7V20H5V4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M8 20V13H16V20" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
