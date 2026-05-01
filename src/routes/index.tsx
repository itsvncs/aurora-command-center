import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Casa · Home Assistant Dashboard" },
      { name: "description", content: "Dashboard premium para Home Assistant em tablet horizontal." },
    ],
  }),
});

function Index() {
  useEffect(() => {
    if (typeof window !== "undefined") window.location.replace("/dashboard/index.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0a0c0f", color: "#f4f6f8", fontFamily: "Inter, system-ui" }}>
      <p>Abrindo dashboard…</p>
    </div>
  );
}
