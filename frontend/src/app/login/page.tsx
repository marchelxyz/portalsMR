"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { login } from "@/lib/api";
import styles from "./Login.module.css";

type FormState = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = await login(form.email, form.password);
      window.localStorage.setItem("portal_token", token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  return (
    <main className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.title}>Вход для партнера</div>
        <div className={styles.subtitle}>
          Используйте учетные данные, чтобы открыть пульт управления.
        </div>
        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input
            className={styles.input}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Пароль</span>
          <input
            className={styles.input}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Входим..." : "Войти"}
        </button>
        {error ? <div className={styles.error}>{error}</div> : null}
      </form>
    </main>
  );
}
