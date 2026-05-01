import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { title: "Casa · Home Assistant Dashboard" },
      { name: "description", content: "Dashboard premium para Home Assistant em tablet horizontal." },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" },
    ],
  }),
});

function Index() {
  // Renderiza o dashboard standalone em fullscreen, sem container nem chrome do React.
  return (
    <iframe
      src="/dashboard/index.html"
      title="Casa · Home Assistant"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        border: 0,
        margin: 0,
        padding: 0,
        background: "#0a0c0f",
        display: "block",
      }}
      allow="autoplay; fullscreen; camera; microphone"
    />
  );
}
