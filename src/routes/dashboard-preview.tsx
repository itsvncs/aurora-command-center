import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard-preview")({
  component: DashboardPreview,
  head: () => ({
    meta: [
      { title: "Aurora Dashboard · Preview" },
      { name: "description", content: "Preview ao vivo da dashboard Aurora em modo demo." },
    ],
  }),
});

function DashboardPreview() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0b0d10",
      }}
    >
      <iframe
        src="/dashboard/index.html"
        title="Aurora Dashboard (Demo)"
        style={{
          width: "100%",
          height: "100%",
          border: 0,
          display: "block",
        }}
        allow="autoplay; fullscreen; microphone"
      />
    </div>
  );
}
