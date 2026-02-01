export type KpiSummary = {
  revenue_today: number;
  revenue_plan_percent: number;
  labor_cost_percent: number;
  food_cost_percent: number;
  profit_forecast: number;
  lfl_percent: number;
};

export type AiTicket = {
  id: number;
  severity: "critical" | "warning" | "advice";
  status: "open" | "done";
  title: string;
  body: string;
  action_label: string;
};

export type FranchiseSummary = {
  royalty_due: number;
  marketing_due: number;
  supplies_due: number;
  qsc_index: number;
};

export type WeeklyChartPoint = {
  day: string;
  revenue: number;
  checks: number;
};

export type UserProfile = {
  id: number;
  email: string;
  full_name: string;
  partner: {
    id: number;
    name: string;
  } | null;
  outlet: {
    id: number;
    name: string;
    external_id: string | null;
  } | null;
};
