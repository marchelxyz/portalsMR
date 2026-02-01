import type {
  AiTicket,
  FranchiseSummary,
  KpiSummary,
  UserProfile,
  WeeklyChartPoint,
} from "@/types/dashboard";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
}

async function request<T>(path: string, token?: string): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function login(email: string, password: string): Promise<string> {
  const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ username: email, password }),
  });

  if (!response.ok) {
    throw new Error("Неверный email или пароль");
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export function fetchKpis(token: string): Promise<KpiSummary> {
  return request<KpiSummary>("/dashboard/kpis", token);
}

export function fetchAiTickets(token: string): Promise<AiTicket[]> {
  return request<AiTicket[]>("/dashboard/ai-tickets", token);
}

export function fetchFranchiseSummary(token: string): Promise<FranchiseSummary> {
  return request<FranchiseSummary>("/franchise/summary", token);
}

export function fetchWeeklyChart(token: string): Promise<WeeklyChartPoint[]> {
  return request<WeeklyChartPoint[]>("/charts/weekly", token);
}

export function fetchCurrentUser(token: string): Promise<UserProfile> {
  return request<UserProfile>("/auth/me", token);
}
