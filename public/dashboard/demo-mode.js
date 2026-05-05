/* =========================================================
   Aurora Demo Mode
   ---------------------------------------------------------
   Simulates Home Assistant when no token is available
   (e.g. Lovable preview, GitHub Pages, local static serve).

   Activation:
   - Auto: hostname is not HA (lovable.app, github.io, localhost
     without HA) AND no token in localStorage.
   - Manual force: localStorage.setItem("auroraDemoMode", "1")
   - Manual disable: localStorage.setItem("auroraDemoMode", "0")

   When active, it patches:
   - window.fetch — intercepts /api/states, /api/services/*,
     /api/camera_proxy/* with simulated payloads.
   - window.WebSocket — replaces /api/websocket with a stub
     that emits auth_ok and periodic state_changed events.

   When inactive, it does NOTHING — real HA flow is untouched.
   ========================================================= */

(function () {
  "use strict";

  const HA_HOST_HINTS = ["homeassistant", "hass", ".local", "duckdns.org", "ts.net", "nabu.casa"];
  const PREVIEW_HOST_HINTS = ["lovable.app", "lovableproject.com", "github.io", "vercel.app", "netlify.app"];

  function shouldEnableDemo() {
    try {
      const forced = localStorage.getItem("auroraDemoMode");
      if (forced === "1") return true;
      if (forced === "0") return false;
    } catch {}
    const host = (location.hostname || "").toLowerCase();
    const looksLikeHA = HA_HOST_HINTS.some((h) => host.includes(h));
    if (looksLikeHA) return false;
    const looksLikePreview = PREVIEW_HOST_HINTS.some((h) => host.includes(h)) || host === "localhost" || host === "127.0.0.1";
    if (!looksLikePreview) return false;
    // If user already has a real token, respect it.
    try {
      const t = localStorage.getItem("auroraHaToken");
      if (t && t.trim()) return false;
    } catch {}
    return true;
  }

  if (!shouldEnableDemo()) {
    window.AURORA_DEMO = false;
    return;
  }

  window.AURORA_DEMO = true;

  // Inject a fake token so app.js parseToken() succeeds and bootstrap proceeds.
  try {
    if (!localStorage.getItem("auroraHaToken")) {
      localStorage.setItem("auroraHaToken", "DEMO_TOKEN_DO_NOT_USE");
      // Mark that we set it so we can clean up later if needed.
      localStorage.setItem("auroraDemoTokenInjected", "1");
    }
  } catch {}

  /* ---------- Simulated entity state ---------- */
  const now = () => new Date().toISOString();
  const ent = (entity_id, state, attributes = {}) => ({
    entity_id,
    state,
    attributes,
    last_changed: now(),
    last_updated: now(),
  });

  const ENTITIES = [
    ent("weather.casa", "partlycloudy", { temperature: 24, humidity: 62, friendly_name: "Casa" }),
    ent("input_select.house", "Dia", { options: ["Dia", "Noite", "Fora", "Cinema"] }),

    // Sensores clima
    ent("sensor.casa_temperatura", "23.4", { unit_of_measurement: "°C", device_class: "temperature" }),
    ent("sensor.casa_umidade", "58", { unit_of_measurement: "%", device_class: "humidity" }),
    ent("sensor.wifiwen_shi_du_ji_temperatura", "24.2", { unit_of_measurement: "°C" }),
    ent("sensor.temperatura_compensada", "23.8", { unit_of_measurement: "°C" }),

    // Grupos
    ent("light.sala_4", "on", { brightness: 200, friendly_name: "Sala" }),
    ent("light.cozinha", "off", { friendly_name: "Cozinha" }),
    ent("light.servicos", "off", { friendly_name: "Serviços" }),
    ent("light.quarto_esther", "on", { brightness: 120, friendly_name: "Quarto Esther" }),
    ent("light.suite", "off", { friendly_name: "Suíte" }),

    // Sala
    ent("switch.cozylife_a50d", "on", { friendly_name: "Mesa" }),
    ent("switch.sofa_interruptor_1", "off", { friendly_name: "Sofá" }),

    // Cozinha
    ent("switch.cozylife_57cb", "off", { friendly_name: "Pia" }),
    ent("switch.balcao_interruptor_1", "off", { friendly_name: "Balcão" }),
    ent("light.lavanderialocal", "off", { friendly_name: "Lavanderia" }),

    // Serviços
    ent("switch.hall_interruptor_1", "off", { friendly_name: "Lavabo" }),
    ent("light.sacadalocal", "off", { friendly_name: "Sacada" }),
    ent("light.churrasqueiralocal", "off", { friendly_name: "Churrasqueira" }),
    ent("light.porta", "off", { friendly_name: "Porta" }),

    // Esther
    ent("light.teto", "on", { brightness: 80, friendly_name: "Teto" }),
    ent("switch.cozylife_66c5", "on", { friendly_name: "Led Esther" }),
    ent("switch.aquecedor_interruptor_1", "off", { friendly_name: "Aquecedor" }),

    // Suite
    ent("switch.cozylife_7cf5", "off", { friendly_name: "Hall" }),
    ent("switch.quarto_interruptor_1", "off", { friendly_name: "Quarto" }),
    ent("switch.t34_minitong_duan_qi_interruptor_1", "off", { friendly_name: "Cama" }),
    ent("switch.cozylife_94d7", "off", { friendly_name: "Banheiro" }),
    ent("switch.cozylife_74ef", "off", { friendly_name: "Espelho" }),

    // Segurança
    ent("binary_sensor.portaentrada", "off", { friendly_name: "Porta de entrada", device_class: "door" }),
    ent("alarm_control_panel.ezviz_alarm", "disarmed", { friendly_name: "Alarme" }),

    // Baby
    ent("binary_sensor.berco_ocupado_confiavel", "on", { friendly_name: "Berço ocupado" }),
    ent("sensor.berco_ultima_face_reconhecida", "Esther", { friendly_name: "Última face" }),
    ent("input_boolean.ruido_branco", "on", { friendly_name: "Ruído branco" }),

    // Mídia
    ent("media_player.tv_da_sala_de_estar", "playing", {
      friendly_name: "TV da Sala",
      media_title: "The Mandalorian",
      media_artist: "Disney+",
      source: "Disney+",
    }),
    ent("media_player.fire_tv", "idle", { friendly_name: "Fire TV" }),
    ent("media_player.echo_pop_de_vinicius", "playing", {
      friendly_name: "Echo Sala",
      media_title: "Calm Piano Mix",
      media_artist: "Spotify",
    }),
    ent("media_player.echo_quarto", "playing", {
      friendly_name: "Echo Quarto",
      media_title: "Ruído Branco · Chuva Suave",
      media_artist: "Sleep Sounds",
    }),
    ent("media_player.tablet", "idle", { friendly_name: "Tablet" }),

    // Câmeras (estado nominal — frames são gerados em /api/camera_proxy)
    ent("camera.berco_2", "streaming", { friendly_name: "Berço" }),
    ent("camera.quarto_esther_2", "streaming", { friendly_name: "Quarto Esther" }),
    ent("camera.sala_2", "streaming", { friendly_name: "Sala" }),
    ent("camera.cozinha_2", "streaming", { friendly_name: "Cozinha" }),
    ent("camera.suite", "streaming", { friendly_name: "Suite" }),
  ];

  const STATE_BY_ID = new Map(ENTITIES.map((e) => [e.entity_id, e]));

  /* ---------- Fake camera frames (animated SVG -> PNG via canvas) ---------- */
  const CAM_LABELS = {
    "camera.berco_2": "Berço · Esther",
    "camera.quarto_esther_2": "Quarto Esther",
    "camera.sala_2": "Sala",
    "camera.cozinha_2": "Cozinha",
    "camera.suite": "Suíte",
  };
  const CAM_PALETTES = {
    "camera.berco_2": ["#1a0f2e", "#3b1d5c", "#7a3fb0"],
    "camera.quarto_esther_2": ["#0f1a2e", "#1d3b5c", "#3f7ab0"],
    "camera.sala_2": ["#2e1a0f", "#5c3b1d", "#b07a3f"],
    "camera.cozinha_2": ["#1a2e0f", "#3b5c1d", "#7ab03f"],
    "camera.suite": ["#2e0f1a", "#5c1d3b", "#b03f7a"],
  };

  function makeCameraFrame(cameraId) {
    const W = 960;
    const H = 540;
    const t = (Date.now() / 1000) % 1000;
    const palette = CAM_PALETTES[cameraId] || CAM_PALETTES["camera.berco_2"];
    const label = CAM_LABELS[cameraId] || cameraId;
    const time = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // Generate animated mesh-gradient + scanlines + label as canvas blob
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // background gradient
    const g = ctx.createRadialGradient(
      W * (0.5 + 0.15 * Math.sin(t * 0.6)),
      H * (0.5 + 0.15 * Math.cos(t * 0.4)),
      40,
      W / 2,
      H / 2,
      W * 0.8
    );
    g.addColorStop(0, palette[2]);
    g.addColorStop(0.5, palette[1]);
    g.addColorStop(1, palette[0]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // moving blobs
    for (let i = 0; i < 4; i++) {
      const cx = W * (0.5 + 0.35 * Math.sin(t * (0.3 + i * 0.1) + i));
      const cy = H * (0.5 + 0.35 * Math.cos(t * (0.25 + i * 0.07) + i));
      const r = 80 + 40 * Math.sin(t + i);
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grd.addColorStop(0, `${palette[2]}55`);
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // scanlines
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);

    // vignette
    const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
    vg.addColorStop(0, "transparent");
    vg.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    // LIVE chip
    ctx.fillStyle = "rgba(255,60,80,0.95)";
    ctx.beginPath();
    ctx.roundRect(28, 24, 96, 36, 18);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.fillText("● LIVE", 46, 48);

    // Label (camera)
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = "bold 28px system-ui, sans-serif";
    ctx.fillText(label, 28, H - 56);

    // Timestamp
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "16px ui-monospace, monospace";
    ctx.fillText(`DEMO · ${time}`, 28, H - 28);

    // Frame border
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.78);
    });
  }

  /* ---------- Fetch interceptor ---------- */
  const realFetch = window.fetch.bind(window);
  window.fetch = async function (input, init) {
    const url = typeof input === "string" ? input : input?.url || "";
    if (!url.startsWith("/api/")) return realFetch(input, init);

    // States
    if (url === "/api/states") {
      return jsonResponse(Array.from(STATE_BY_ID.values()));
    }

    // Single state
    const stateMatch = url.match(/^\/api\/states\/(.+)$/);
    if (stateMatch) {
      const id = decodeURIComponent(stateMatch[1]);
      const e = STATE_BY_ID.get(id);
      return e ? jsonResponse(e) : new Response("not found", { status: 404 });
    }

    // Camera
    const camMatch = url.match(/^\/api\/camera_proxy\/(.+)$/);
    if (camMatch) {
      const id = decodeURIComponent(camMatch[1].split("?")[0]);
      const blob = await makeCameraFrame(id);
      return new Response(blob, { status: 200, headers: { "Content-Type": "image/jpeg" } });
    }

    // Service calls (toggle, turn_on, turn_off, scripts, media)
    const svcMatch = url.match(/^\/api\/services\/([^/]+)\/([^/?]+)/);
    if (svcMatch) {
      const [, domain, service] = svcMatch;
      let body = {};
      try {
        body = init?.body ? JSON.parse(init.body) : {};
      } catch {}
      handleServiceCall(domain, service, body);
      return jsonResponse([]);
    }

    // WebSocket REST is not used; for any other API, return ok empty.
    return jsonResponse({});
  };

  function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  /* ---------- Service simulation ---------- */
  const wsListeners = new Set();

  function emitStateChange(entity_id) {
    const e = STATE_BY_ID.get(entity_id);
    if (!e) return;
    e.last_changed = now();
    e.last_updated = now();
    const evt = {
      type: "event",
      event: {
        event_type: "state_changed",
        data: { entity_id, new_state: e, old_state: null },
        time_fired: now(),
      },
    };
    for (const fn of wsListeners) {
      try {
        fn(JSON.stringify(evt));
      } catch {}
    }
  }

  function setEnt(id, newState, patchAttrs = {}) {
    const e = STATE_BY_ID.get(id);
    if (!e) return;
    e.state = newState;
    e.attributes = { ...e.attributes, ...patchAttrs };
    emitStateChange(id);
  }

  function handleServiceCall(domain, service, body) {
    const targets = []
      .concat(body.entity_id || [])
      .flat()
      .filter(Boolean);

    if (domain === "script" && service === "turn_on") {
      const id = targets[0] || body.entity_id;
      if (id === "script.ligar_ruido_branco_esther") setEnt("input_boolean.ruido_branco", "on");
      if (id === "script.desligar_ruido_branco_esther") setEnt("input_boolean.ruido_branco", "off");
      return;
    }

    for (const id of targets) {
      const e = STATE_BY_ID.get(id);
      if (!e) continue;
      if (service === "toggle") {
        setEnt(id, e.state === "on" ? "off" : "on");
      } else if (service === "turn_on") {
        setEnt(id, "on");
      } else if (service === "turn_off") {
        setEnt(id, "off");
      } else if (domain === "media_player") {
        if (service === "media_play_pause") {
          setEnt(id, e.state === "playing" ? "paused" : "playing");
        } else if (service === "media_previous_track" || service === "media_next_track") {
          // just bump timestamp
          emitStateChange(id);
        }
      } else if (domain === "input_boolean") {
        if (service === "toggle") setEnt(id, e.state === "on" ? "off" : "on");
      } else if (domain === "alarm_control_panel") {
        if (service === "alarm_arm_away") setEnt(id, "armed_away");
        if (service === "alarm_disarm") setEnt(id, "disarmed");
      }
    }
  }

  /* ---------- WebSocket stub ---------- */
  const RealWebSocket = window.WebSocket;
  class FakeWebSocket {
    constructor(url) {
      this.url = url;
      this.readyState = 0;
      this.onopen = null;
      this.onmessage = null;
      this.onclose = null;
      this.onerror = null;
      this._listener = (data) => this.onmessage && this.onmessage({ data });
      setTimeout(() => {
        this.readyState = 1;
        this.onopen && this.onopen({});
        this._listener(JSON.stringify({ type: "auth_required" }));
      }, 30);
    }
    send(payload) {
      let msg = {};
      try {
        msg = JSON.parse(payload);
      } catch {}
      if (msg.type === "auth") {
        setTimeout(() => this._listener(JSON.stringify({ type: "auth_ok" })), 20);
        return;
      }
      if (msg.type === "subscribe_events") {
        wsListeners.add(this._listener);
        // Acknowledge subscription
        setTimeout(
          () => this._listener(JSON.stringify({ id: msg.id, type: "result", success: true, result: null })),
          20
        );
        return;
      }
    }
    close() {
      this.readyState = 3;
      wsListeners.delete(this._listener);
      this.onclose && this.onclose({});
    }
    addEventListener() {}
    removeEventListener() {}
  }
  window.WebSocket = function (url, protocols) {
    if (typeof url === "string" && url.includes("/api/websocket")) {
      return new FakeWebSocket(url);
    }
    return new RealWebSocket(url, protocols);
  };
  window.WebSocket.prototype = FakeWebSocket.prototype;

  /* ---------- Ambient state churn (subtle realism) ---------- */
  setInterval(() => {
    // Drift temperatures slightly
    const drift = (id, base, range) => {
      const e = STATE_BY_ID.get(id);
      if (!e) return;
      const next = (base + (Math.random() - 0.5) * range).toFixed(1);
      e.state = String(next);
      emitStateChange(id);
    };
    drift("sensor.casa_temperatura", 23.4, 0.3);
    drift("sensor.wifiwen_shi_du_ji_temperatura", 24.2, 0.2);
    drift("sensor.temperatura_compensada", 23.8, 0.2);
  }, 8000);

  // Tag a banner so user sees demo is on
  document.addEventListener("DOMContentLoaded", () => {
    const b = document.createElement("div");
    b.textContent = "MODO DEMO · sem conexão real ao Home Assistant";
    b.style.cssText =
      "position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:9999;background:rgba(255,180,0,.92);color:#1a1200;font:600 11px/1 system-ui,sans-serif;padding:6px 12px;border-radius:999px;letter-spacing:.04em;text-transform:uppercase;box-shadow:0 4px 14px rgba(0,0,0,.35);pointer-events:none;";
    document.body.appendChild(b);
  });

  // eslint-disable-next-line no-console
  console.info("[Aurora] Demo mode active — simulated HA data.");
})();
