export function setupBackendSessionMonitor(token, onLogout) {
  if (!token) return;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const ping = async () => {
    try {
      const res = await fetch(`${API_URL}/api/sessions/ping`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (res.status === 401) {
        console.warn("⛔ Sesión expirada por backend");
        onLogout(true);
      }
    } catch (err) {
      console.error("Ping error:", err);
    }
  };

  const interval = setInterval(ping, 2 * 60 * 1000);
  ping();
  return () => clearInterval(interval);
}
