export function setupBackendSessionMonitor(token, onLogout) {
  if (!token) return;

  const ping = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/session/ping", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        console.warn("⛔ Sesión expirada por backend");
        onLogout(true);
      }
    } catch (err) {
      console.error("Ping error:", err);
    }
  };

  // PING cada 2 minutos
  const interval = setInterval(ping, 2 * 60 * 1000);

  // Ejecutar ahora mismo
  ping();

  return () => clearInterval(interval);
}
