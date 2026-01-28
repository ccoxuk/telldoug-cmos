import { ReactNode, useEffect, useMemo, useState } from "react";
import { useLogin, useRegister, useSession } from "../helpers/useAuthApi";
import { Input } from "./Input";
import { Button } from "./Button";
import styles from "./AuthGate.module.css";

export function AuthGate({ children }: { children: ReactNode }) {
  const { data, isLoading, isError } = useSession();
  const login = useLogin();
  const register = useRegister();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isAuthed = Boolean(data?.user);

  useEffect(() => {
    if (isAuthed) {
      setErrorMessage(null);
      setPassword("");
    }
  }, [isAuthed]);

  const submitDisabled = useMemo(() => {
    return !email.trim() || password.length < 8 || login.isPending || register.isPending;
  }, [email, password, login.isPending, register.isPending]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    try {
      if (mode === "login") {
        await login.mutateAsync({ email, password });
      } else {
        await register.mutateAsync({ email, password });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed";
      setErrorMessage(message);
    }
  };

  if (isAuthed) return <>{children}</>;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p className={styles.loading}>Checking session…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Something went wrong</h2>
          <p className={styles.subtitle}>We couldn't verify your session.</p>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome to TellDoug</h2>
        <p className={styles.subtitle}>
          {mode === "login"
            ? "Log in to continue building your career OS."
            : "Create your account to get started."}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
          />

          {errorMessage ? <div className={styles.error}>{errorMessage}</div> : null}

          <Button type="submit" disabled={submitDisabled}>
            {mode === "login" ? "Log In" : "Create Account"}
          </Button>
        </form>

        <p className={styles.helper}>
          {mode === "login" ? "No account yet?" : "Already have an account?"} {" "}
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Create one" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
