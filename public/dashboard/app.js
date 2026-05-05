const ROUTES = ["home", "lights", "climate", "security", "media", "baby"];

const ENTITY_MAP = {
  weather: "weather.casa",
  houseMode: "input_select.house",
  groups: {
    sala: "light.sala_4",
    cozinha: "light.cozinha",
    servicos: "light.servicos",
    esther: "light.quarto_esther",
    suite: "light.suite",
  },
  lights: {
    sala: [
      { id: "switch.cozylife_a50d", name: "Mesa", subtitle: "Sala" },
      { id: "switch.sofa_interruptor_1", name: "Sofá", subtitle: "Sala" },
      { id: "light.sala_4", name: "Sala", subtitle: "Grupo" },
    ],
    cozinha: [
      { id: "switch.cozylife_57cb", name: "Pia", subtitle: "Cozinha" },
      { id: "switch.balcao_interruptor_1", name: "Balcão", subtitle: "Cozinha" },
      { id: "light.cozinha", name: "Cozinha", subtitle: "Grupo" },
      { id: "light.lavanderialocal", name: "Lavanderia", subtitle: "Cozinha" },
    ],
    servicos: [
      { id: "switch.hall_interruptor_1", name: "Lavabo", subtitle: "Serviços" },
      { id: "light.sacadalocal", name: "Sacada", subtitle: "Serviços" },
      { id: "light.churrasqueiralocal", name: "Churrasqueira", subtitle: "Serviços" },
      { id: "light.porta", name: "Porta", subtitle: "Serviços" },
    ],
    esther: [
      { id: "light.teto", name: "Teto", subtitle: "Esther" },
      { id: "switch.cozylife_66c5", name: "Led Esther", subtitle: "Esther" },
      { id: "switch.aquecedor_interruptor_1", name: "Aquecedor", subtitle: "Esther" },
    ],
    suite: [
      { id: "switch.cozylife_7cf5", name: "Hall", subtitle: "Suite" },
      { id: "switch.quarto_interruptor_1", name: "Quarto", subtitle: "Suite" },
      { id: "switch.t34_minitong_duan_qi_interruptor_1", name: "Cama", subtitle: "Suite" },
      { id: "switch.cozylife_94d7", name: "Banheiro", subtitle: "Suite" },
      { id: "switch.cozylife_74ef", name: "Espelho", subtitle: "Suite" },
    ],
  },
  security: {
    door: "binary_sensor.portaentrada",
    alarm: "alarm_control_panel.ezviz_alarm",
  },
  climate: {
    temp: "sensor.casa_temperatura",
    humidity: "sensor.casa_umidade",
    estherTemp: "sensor.wifiwen_shi_du_ji_temperatura",
    compensated: "sensor.temperatura_compensada",
  },
  media: {
    tv: "media_player.tv_da_sala_de_estar",
    firetv: "media_player.fire_tv",
    echoSala: "media_player.echo_pop_de_vinicius",
    echoQuarto: "media_player.echo_quarto",
    tablet: "media_player.tablet",
  },
  baby: {
    occupied: "binary_sensor.berco_ocupado_confiavel",
    face: "sensor.berco_ultima_face_reconhecida",
    temp: "sensor.wifiwen_shi_du_ji_temperatura",
    compensated: "sensor.temperatura_compensada",
    noise: "input_boolean.ruido_branco",
    media: "media_player.echo_quarto",
    teto: "light.teto",
    led: "switch.cozylife_66c5",
    heater: "switch.aquecedor_interruptor_1",
    camera: "camera.berco_2",
  },
  scripts: {
    noiseOn: "script.ligar_ruido_branco_esther",
    noiseOff: "script.desligar_ruido_branco_esther",
  },
};

const HOME_CAMERAS = [
  { id: "camera.quarto_esther_2", label: "Quarto Esther" },
  { id: "camera.sala_2", label: "Sala" },
  { id: "camera.cozinha_2", label: "Cozinha" },
  { id: "camera.suite", label: "Suite" },
];

const DISPLAY_NAMES = {
  "light.sala_4": "Sala",
  "light.cozinha": "Cozinha",
  "light.servicos": "Serviços",
  "light.quarto_esther": "Quarto Esther",
  "light.suite": "Suite",
  "switch.cozylife_a50d": "Mesa",
  "switch.sofa_interruptor_1": "Sofá",
  "switch.cozylife_57cb": "Pia",
  "switch.balcao_interruptor_1": "Balcão",
  "light.lavanderialocal": "Lavanderia",
  "switch.hall_interruptor_1": "Lavabo",
  "light.sacadalocal": "Sacada",
  "light.churrasqueiralocal": "Churrasqueira",
  "light.porta": "Porta",
  "light.teto": "Teto",
  "switch.cozylife_66c5": "Led Esther",
  "switch.aquecedor_interruptor_1": "Aquecedor",
  "switch.cozylife_7cf5": "Hall",
  "switch.quarto_interruptor_1": "Quarto",
  "switch.t34_minitong_duan_qi_interruptor_1": "Cama",
  "switch.cozylife_94d7": "Banheiro",
  "switch.cozylife_74ef": "Espelho",
  "media_player.tv_da_sala_de_estar": "TV da Sala",
  "media_player.fire_tv": "Fire TV",
  "media_player.echo_pop_de_vinicius": "Echo Sala",
  "media_player.echo_quarto": "Echo Quarto",
  "media_player.tablet": "Tablet",
  "camera.berco_2": "Berço",
  "camera.quarto_esther_2": "Quarto Esther",
  "camera.sala_2": "Sala",
  "camera.cozinha_2": "Cozinha",
  "camera.suite": "Suite",
};

const state = {
  route: "home",
  entities: {},
  token: null,
  error: null,
  connected: false,
  query: "",
  activeHomeCamera: "camera.quarto_esther_2",
  ws: null,
  cameraTimers: new Map(),
  cameraUrls: new Map(),
  activeSecurityCamera: null,
  securityRotateTimer: null,
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const view = $("#view");
const pageTitle = $("#pageTitle");
const pageSub = $("#pageSub");
const wxTemp = $("#wxTemp");
const wxLocation = $("#wxLocation");
const wxIcon = $("#wxIcon");
const searchInput = $("#searchInput");

const titleMap = {
  home: ["Casa", "Visão geral da casa em tempo real."],
  lights: ["Luzes", "Controles individuais por cômodo."],
  climate: ["Clima", "Temperatura, umidade e conforto térmico."],
  security: ["Segurança", "Porta, alarme e status da casa."],
  media: ["Mídia", "Players e reprodução da casa."],
  baby: ["Babytracker", "Monitoramento do quarto da Esther."],
};

function parseToken() {
  const keys = ["auroraHaToken", "hassTokens", `hassTokens-${location.host}`];
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key) || window.parent?.localStorage?.getItem(key);
      if (!raw) continue;
      if (key === "auroraHaToken") return raw.trim();
      const parsed = JSON.parse(raw);
      const candidates = [
        parsed?.access_token,
        parsed?.token?.access_token,
        parsed?.data?.access_token,
        parsed?.auth?.access_token,
      ].filter(Boolean);
      if (candidates.length) return candidates[0];
    } catch {}
  }
  return null;
}

async function haFetch(path, options = {}) {
  const token = state.token || parseToken();
  if (!token) throw new Error("Token do Home Assistant não encontrado.");
  state.token = token;
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const res = await fetch(path, { ...options, headers });
  if (!res.ok) throw new Error(`HA ${res.status} em ${path}`);
  if (res.status === 204) return null;
  return res.json();
}

async function loadStates() {
  const states = await haFetch("/api/states");
  state.entities = Object.fromEntries(states.map((item) => [item.entity_id, item]));
  state.connected = true;
  state.error = null;
}

async function callService(domain, service, serviceData = {}, target) {
  const body = { ...serviceData };
  if (target?.entity_id) body.entity_id = target.entity_id;
  return haFetch(`/api/services/${domain}/${service}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function entity(id) {
  return state.entities[id] || null;
}

function entityState(id, fallback = "unavailable") {
  return entity(id)?.state ?? fallback;
}

function isOn(id) {
  return ["on", "playing", "home", "open"].includes(entityState(id));
}

function friendly(id, fallback = id) {
  return DISPLAY_NAMES[id] || entity(id)?.attributes?.friendly_name || fallback;
}

function num(id, fallback = 0) {
  const value = parseFloat(entityState(id));
  return Number.isFinite(value) ? value : fallback;
}

function brightnessPct(id) {
  const attrs = entity(id)?.attributes || {};
  if (typeof attrs.brightness_pct === "number") return Math.round(attrs.brightness_pct);
  if (typeof attrs.brightness === "number") return Math.round((attrs.brightness / 255) * 100);
  return null;
}

function normalizeText(value) {
  return (value || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function matchesQuery(...parts) {
  if (!state.query) return true;
  return normalizeText(parts.join(" ")).includes(normalizeText(state.query));
}

function iconSvg(name) {
  const map = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/>',
    temp: '<path d="M14 14.76V3.5a2.5 2.5 0 1 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>',
    shield: '<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/>',
    media: '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 22h8"/><path d="M12 18v4"/>',
    light: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.7.6 1 1.4 1 2.3h6c0-.9.3-1.7 1-2.3A7 7 0 0 0 12 2z"/>',
    noise: '<path d="M5 9v6h4l5 4V5l-5 4H5z"/><path d="M19 9a4 4 0 0 1 0 6"/><path d="M17 7a7 7 0 0 1 0 10"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${map[name]}</svg>`;
}

function weatherIconSvg(conditionRaw) {
  const condition = normalizeText(conditionRaw);
  if (["sunny", "clear-night", "clear", "ensolarado", "limpo"].includes(condition)) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.2"/><path d="M12 19.3v2.2"/><path d="m4.93 4.93 1.56 1.56"/><path d="m17.51 17.51 1.56 1.56"/><path d="M2.5 12h2.2"/><path d="M19.3 12h2.2"/><path d="m4.93 19.07 1.56-1.56"/><path d="m17.51 6.49 1.56-1.56"/></svg>`;
  }
  if (["partlycloudy", "partly cloudy", "partlycloudynight", "parcialmente nublado"].includes(condition)) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5.5a4.5 4.5 0 0 1 6.2 4.15"/><path d="M17 18a4 4 0 0 0 0-8 5.8 5.8 0 0 0-1.3.15A6 6 0 0 0 4.3 11.5 4.5 4.5 0 0 0 6.5 20H17z"/><path d="M14.5 4.5h2"/><path d="M15.5 3.5v2"/></svg>`;
  }
  if (["cloudy", "nublado", "overcast"].includes(condition)) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a4 4 0 0 0 0-8 6 6 0 0 0-11.7 1.5A4.5 4.5 0 0 0 6.5 20H17z"/></svg>`;
  }
  if (["rainy", "pouring", "chuva", "chuvoso"].includes(condition)) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 16a4 4 0 0 0 0-8 6 6 0 0 0-11.7 1.5A4.5 4.5 0 0 0 6.5 18H17z"/><path d="m9 19-1 2"/><path d="m13 19-1 2"/><path d="m17 19-1 2"/></svg>`;
  }
  if (["lightning", "lightning-rainy", "trovoada", "tempestade"].includes(condition)) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 16a4 4 0 0 0 0-8 6 6 0 0 0-11.7 1.5A4.5 4.5 0 0 0 6.5 18H17z"/><path d="m12 13-2 4h2l-1 4 4-6h-2l2-4z"/></svg>`;
  }
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a4 4 0 0 0 0-8 6 6 0 0 0-11.7 1.5A4.5 4.5 0 0 0 6.5 20H17z"/></svg>`;
}

function formatState(id) {
  const s = entityState(id, "Indisponível");
  const map = {
    on: "Ligado",
    off: "Desligado",
    playing: "Tocando",
    paused: "Pausado",
    idle: "Parado",
    unavailable: "Indisponível",
    unknown: "Desconhecido",
    disarmed: "Desarmado",
    armed_away: "Armado fora",
    open: "Aberta",
    closed: "Fechada",
    home: "Em casa",
    not_home: "Fora",
  };
  return map[s] || s;
}

async function fetchCameraFrame(cameraId) {
  const token = state.token || parseToken();
  if (!token) return null;
  const res = await fetch(`/api/camera_proxy/${cameraId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Camera ${res.status}`);
  const blob = await res.blob();
  const prev = state.cameraUrls.get(cameraId);
  if (prev) URL.revokeObjectURL(prev);
  const url = URL.createObjectURL(blob);
  state.cameraUrls.set(cameraId, url);
  return url;
}

function lightBtn(id, size = "") {
  const on = isOn(id);
  return `<button class="lightbtn ${on ? "is-on" : ""}" data-toggle="${id}" aria-label="Ligar/desligar ${friendly(id, id)}">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.7.6 1 1.4 1 2.3h6c0-.9.3-1.7 1-2.3A7 7 0 0 0 12 2z"/></svg>
  </button>`;
}

// New modern horizontal pill switch — used on Home & Lights pages.
// Keeps data-toggle contract so existing handler in app.js still toggles HA entity.
function lightSwitch(id) {
  const on = isOn(id);
  return `<button class="ha-switch ${on ? "is-on" : ""}" data-toggle="${id}" role="switch" aria-checked="${on ? "true" : "false"}" aria-label="Ligar/desligar ${friendly(id, id)}">
    <span class="ha-switch__track"><span class="ha-switch__thumb"></span></span>
  </button>`;
}

function roomCard(id, name = null, meta = "Grupo") {
  const label = name || friendly(id, id);
  return `
    <article class="card room-card ${isOn(id) ? "is-on" : ""}" data-entity="${id}" data-group-key="${id}">
      <div class="top"><div class="card-head"><span class="card-title">${meta}</span><div class="card-icon">${iconSvg("light")}</div></div></div>
      <div class="row"><div><div class="name">${label}</div><div class="stat">${formatState(id)}</div></div>${lightSwitch(id)}</div>
    </article>`;
}

function lightCard(item) {
  const label = friendly(item.id, item.name);
  const pct = brightnessPct(item.id);
  const status = pct != null && isOn(item.id) ? `${pct}%` : formatState(item.id);
  const fill = pct != null ? pct : (isOn(item.id) ? 88 : 22);
  return `
    <article class="card light-card" data-entity="${item.id}">
      <div class="top"><div><div class="nm">${label}</div><div class="sb">${item.subtitle} · ${status}</div></div>${lightSwitch(item.id)}</div>
      <div class="slider"><span style="width:${fill}%"></span></div>
    </article>`;
}

function sectionHead(title, sub = "") {
  return `<div class="section-head"><div><h2>${title}</h2>${sub ? `<div class="tiny muted">${sub}</div>` : ""}</div></div>`;
}

function renderHome() {
  const weather = entity(ENTITY_MAP.weather);
  const temp = weather?.attributes?.temperature ?? num(ENTITY_MAP.climate.temp, 0);
  const condition = weather?.state || "indisponível";
  const cam = HOME_CAMERAS.find((c) => c.id === state.activeHomeCamera) || HOME_CAMERAS[0];
  const houseEnt = entity(ENTITY_MAP.houseMode);
  const houseOptions = houseEnt?.attributes?.options || ["Dia", "Noite", "Fora", "Cinema"];
  const houseCurrent = houseEnt?.state || houseOptions[0];
  return `
    <div class="home-grid">
      <section class="card hero" data-camera-fullscreen="${cam.id}">
        <div class="hero__feed"><img class="hero__feed-img" data-camera-feed="${cam.id}" data-camera-slot="home" alt="Sinal da câmera" /></div>
        <div class="hero__overlay">
          <div class="hero__top"><div class="hero__tabs" data-home-camera-tabs>${HOME_CAMERAS.map((c) => `<button class="${c.id === cam.id ? "is-active" : ""}" data-home-camera="${c.id}">${c.label}</button>`).join("")}</div><span class="chip chip--live"><span class="dot"></span> Ao vivo</span></div>
          <div class="hero__bottom"><div><h3 class="hero__title">Casa</h3><div class="hero__meta" data-home-camera-meta>${cam.label} · ${condition} · ${temp}°C · modo ${houseCurrent}</div></div><div class="hero__actions"><button class="btn btn--ghost" data-route-go="baby">Babytracker</button></div></div>
        </div>
      </section>
      ${roomCard(ENTITY_MAP.groups.sala, "Sala")}
      ${roomCard(ENTITY_MAP.groups.cozinha, "Cozinha")}
      ${roomCard(ENTITY_MAP.groups.servicos, "Serviços")}
      ${roomCard(ENTITY_MAP.groups.esther, "Quarto Esther")}
      ${roomCard(ENTITY_MAP.groups.suite, "Suite")}
      <article class="card stat-card"><div class="label">Temperatura interna</div><div class="value">${num(ENTITY_MAP.climate.temp, 0).toFixed(1)}°</div><div class="delta">Umidade ${num(ENTITY_MAP.climate.humidity, 0).toFixed(0)}%</div></article>
      <article class="card stat-card"><div class="label">Berço</div><div class="value">${isOn(ENTITY_MAP.baby.occupied) ? "Ocupado" : "Livre"}</div><div class="delta ${isOn(ENTITY_MAP.baby.occupied) ? "" : "down"}">Face: ${entityState(ENTITY_MAP.baby.face, "desconhecida")}</div></article>
      <article class="card stat-card"><div class="label">Segurança</div><div class="value">${formatState(ENTITY_MAP.security.alarm)}</div><div class="delta ${entityState(ENTITY_MAP.security.door) === "on" ? "down" : ""}">Porta ${formatState(ENTITY_MAP.security.door)}</div></article>
    </div>`;
}

function renderLights() {
  const blocks = Object.entries(ENTITY_MAP.lights).flatMap(([room, items]) => {
    const roomTitle = room === "esther" ? "Quarto Esther" : room === "servicos" ? "Serviços" : room;
    const filtered = items.filter((item) => matchesQuery(item.name, item.subtitle, roomTitle, friendly(item.id, item.name)));
    if (!filtered.length) return [];
    return [`<h3 class="lights-room-head">${roomTitle}</h3>`, `<div class="lights-room-grid">${filtered.map(lightCard).join("")}</div>`];
  });
  return `${sectionHead("Luzes", state.query ? `Resultados para \"${state.query}\"` : "Controles individuais por cômodo")}<div class="lights-page">${blocks.join("") || `<article class="card card--solid"><h3 style="margin:0 0 8px;">Nada encontrado</h3><div class="muted">Nenhum dispositivo corresponde à busca.</div></article>`}</div>`;
}

function renderClimate() {
  const temp = num(ENTITY_MAP.climate.temp, 0);
  const hum = num(ENTITY_MAP.climate.humidity, 0);
  const esther = num(ENTITY_MAP.climate.estherTemp, 0);
  const compensated = num(ENTITY_MAP.climate.compensated, esther);
  return `${sectionHead("Clima", "Leituras da casa e do quarto da Esther")}<div class="climate-grid"><article class="card gauge-card"><div class="card-head"><span class="card-title">Casa</span><div class="card-icon">${iconSvg("temp")}</div></div><div class="gauge"><div class="gauge__dial" style="--p:${Math.max(10, Math.min(95, temp * 3.2))}"></div><div class="gauge__center"><strong>${temp.toFixed(1)}°</strong><span>Temperatura</span></div></div></article><article class="card stat-card"><div class="label">Umidade</div><div class="value">${hum.toFixed(0)}%</div><div class="delta">Conforto da casa</div></article><article class="card stat-card"><div class="label">Esther</div><div class="value">${esther.toFixed(1)}°</div><div class="delta">Compensada ${compensated.toFixed(1)}°</div></article></div>`;
}

function renderSecurity() {
  const cams = HOME_CAMERAS;
  const cur = state.activeSecurityCamera || cams[0].id;
  state.activeSecurityCamera = cur;
  const curLabel = (cams.find((c) => c.id === cur) || cams[0]).label;
  return `${sectionHead("Segurança", "Câmeras, porta principal e alarme")}<div class="home-grid" style="grid-template-columns:2fr 1fr 1fr;">
    <article class="card hero" style="min-height:380px;grid-row:span 2;" data-camera-fullscreen="${cur}" data-security-hero>
      <div class="hero__feed"><img class="hero__feed-img" data-camera-feed="${cur}" data-camera-slot="security" alt="Sinal da câmera" /></div>
      <div class="hero__overlay">
        <div class="hero__top">
          <div class="hero__tabs" data-security-camera-tabs>${cams.map((c) => `<button class="${c.id === cur ? "is-active" : ""}" data-security-camera="${c.id}">${c.label}</button>`).join("")}</div>
          <span class="chip chip--live"><span class="dot"></span> Auto · 10s</span>
        </div>
        <div class="hero__bottom"><div><h3 class="hero__title" data-security-cam-label>${curLabel}</h3><div class="hero__meta">Arraste para trocar · toque para abrir</div></div></div>
      </div>
    </article>
    <article class="card stat-card" data-entity="${ENTITY_MAP.security.alarm}"><div class="label">Alarme</div><div class="value">${formatState(ENTITY_MAP.security.alarm)}</div></article>
    <article class="card stat-card"><div class="label">Porta</div><div class="value">${formatState(ENTITY_MAP.security.door)}</div></article>
  </div>`;
}

function mediaCard(id, label) {
  const e = entity(id);
  const title = e?.attributes?.media_title || friendly(id, label);
  const artist = e?.attributes?.media_artist || e?.attributes?.source || formatState(id);
  return `<article class="card player" data-entity="${id}"><div class="card-head"><span class="card-title">${label}</span><div class="card-icon">${iconSvg("media")}</div></div><div class="nm" style="font-family:var(--f-display);font-size:20px;font-weight:700;">${friendly(id, label)}</div><div class="nowplay" style="margin-top:10px;">${title}</div><div class="artist">${artist}</div><div class="progress" style="margin-top:16px;"><span style="width:${entityState(id) === "playing" ? 58 : 24}%;"></span></div><div style="display:flex;gap:8px;margin-top:16px;"><button class="btn" data-media-playpause="${id}">${entityState(id) === "playing" ? "Pausar" : "Play/Pause"}</button></div></article>`;
}

function renderMedia() {
  return `${sectionHead("Mídia", "Players principais da casa")}<div class="media-grid">${mediaCard(ENTITY_MAP.media.tv, friendly(ENTITY_MAP.media.tv, "TV"))}${mediaCard(ENTITY_MAP.media.firetv, friendly(ENTITY_MAP.media.firetv, "Fire TV"))}${mediaCard(ENTITY_MAP.media.echoSala, friendly(ENTITY_MAP.media.echoSala, "Echo Sala"))}${mediaCard(ENTITY_MAP.media.echoQuarto, friendly(ENTITY_MAP.media.echoQuarto, "Echo Quarto"))}${mediaCard(ENTITY_MAP.media.tablet, friendly(ENTITY_MAP.media.tablet, "Tablet"))}</div>`;
}

function toggleRow(id, name, subtitle) {
  return `<div class="toggle-row ${isOn(id) ? "is-on" : ""}" data-entity="${id}"><div><div class="nm">${name}</div><div class="sb">${subtitle}</div></div>${lightBtn(id)}</div>`;
}

function renderBaby() {
  const occ = isOn(ENTITY_MAP.baby.occupied);
  const noiseOn = isOn(ENTITY_MAP.baby.noise);
  const mediaId = ENTITY_MAP.baby.media;
  const mediaEnt = entity(mediaId);
  const mediaTitle = mediaEnt?.attributes?.media_title || friendly(mediaId, "Echo Quarto");
  const mediaArtist = mediaEnt?.attributes?.media_artist || formatState(mediaId);
  return `<div class="baby baby--cinema"><section class="baby__stage card" data-camera-fullscreen="${ENTITY_MAP.baby.camera}"><div class="baby__feed"><img class="feed-img" data-camera-feed="${ENTITY_MAP.baby.camera}" alt="Sinal da câmera" /></div><div class="baby__scrim"></div><div class="baby__hud baby__hud--top"><div class="baby__id"><div class="nm">Esther · Berço</div><div class="meta">Quarto · ${occ ? "ocupado" : "livre"} · ${num(ENTITY_MAP.baby.temp, 0).toFixed(1)}°C</div></div><div class="baby__chips"><span class="chip-live"><span class="pulse"></span>Live</span><span class="chip-soft">Sinal ativo</span><button class="chip-soft chip-btn ripple" data-refresh-camera="${ENTITY_MAP.baby.camera}"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/></svg>Atualizar</button><button class="chip-soft chip-btn chip-exit ripple" data-route-go="home" title="Sair do modo cinema"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></div></div><aside class="baby__panel baby__panel--left"><article class="glass-card baby-card baby-temp"><div class="head"><div class="ttl">Temperatura</div><div class="card-icon">${iconSvg("temp")}</div></div><div class="row" style="justify-content:center;align-items:center;"><div class="ring" style="width:108px;height:108px;"><b style="font-size:24px;">${num(ENTITY_MAP.baby.temp, 0).toFixed(1)}°</b></div></div></article><article class="glass-card baby-card baby-noise ${noiseOn ? "is-on" : ""}" data-entity="${ENTITY_MAP.baby.noise}"><div class="head"><div class="ttl">Ruído branco</div><div class="card-icon">${iconSvg("noise")}</div></div><div class="wave"><svg viewBox="0 0 200 40" fill="none"><path d="M0 20c20 0 20-12 40-12s20 24 40 24 20-24 40-24 20 24 40 24 20-12 40-12" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".8"/></svg></div><div class="btns"><button class="ripple ${noiseOn ? "is-active" : ""}" data-script="${ENTITY_MAP.scripts.noiseOn}">Ligar</button><button class="ripple ${!noiseOn ? "is-active" : ""}" data-script="${ENTITY_MAP.scripts.noiseOff}">Parar</button></div></article></aside><aside class="baby__panel baby__panel--right"><article class="glass-card baby-card baby-ctrls"><div class="head"><div class="ttl">Controles</div><div class="card-icon">${iconSvg("light")}</div></div>${toggleRow(ENTITY_MAP.baby.teto, "Teto", "Luz principal")}${toggleRow(ENTITY_MAP.baby.led, "Led Esther", "Apoio")}${toggleRow(ENTITY_MAP.baby.heater, "Aquecedor", "Conforto")}</article></aside><div class="baby__dock"><article class="glass-card baby-card baby-media ${entityState(mediaId) === "paused" ? "is-paused" : ""}" data-entity="${mediaId}"><div class="dock-info"><div class="nowplay">${mediaTitle}</div><div class="artist">${mediaArtist}</div></div><div class="ctrls"><button class="btn ripple" data-media-prev="${mediaId}">◀</button><button class="pp ripple" data-media-playpause="${mediaId}">${entityState(mediaId) === "playing" ? "❚❚" : "▶"}</button><div class="vol"><i></i><i></i><i></i><i></i></div></div><div class="dock-actions"><button class="btn btn--ghost ripple" data-route-go="security">Segurança</button></div></article></div></section></div>`;
}

function renderError() {
  const needsToken = (state.error || "").includes("401") || (state.error || "").includes("Token");
  return `<article class="card card--solid"><h2 style="margin-top:0;">Erro de integração</h2><p>${state.error}</p>${needsToken ? `<div style="display:grid;gap:12px;max-width:640px;margin-top:18px;"><input id="tokenInput" type="password" placeholder="Cole aqui um Long-Lived Access Token do Home Assistant" style="width:100%;padding:14px 16px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:inherit;outline:none;" /><div style="display:flex;gap:12px;"><button class="btn btn--lime" id="saveTokenBtn">Salvar token</button><button class="btn" id="clearTokenBtn">Limpar token</button></div></div>` : `<button class="btn btn--lime" id="retryBtn">Tentar novamente</button>`}</article>`;
}

function patchHeader() {
  const [title, sub] = titleMap[state.route] || titleMap.home;
  pageTitle.textContent = title;
  pageSub.textContent = state.error && !state.connected ? state.error : sub;
  const weather = entity(ENTITY_MAP.weather);
  const localTemp = num(ENTITY_MAP.climate.temp, Number.NaN);
  const weatherTemp = weather?.attributes?.temperature;
  const temp = Number.isFinite(localTemp) ? localTemp : (Number.isFinite(weatherTemp) ? weatherTemp : 0);
  const condition = weather?.state || "";
  wxTemp.textContent = `${temp.toFixed(0)}\u00B0`;
  if (wxLocation) wxLocation.textContent = "Taubat\u00E9";
  if (wxIcon) wxIcon.innerHTML = weatherIconSvg(condition);
  $$("#nav .nav-item").forEach((btn) => btn.classList.toggle("is-active", btn.dataset.route === state.route));
  if (searchInput) searchInput.value = state.query;
}

function patchEntityUI(id) {
  const current = isOn(id);
  const pct = brightnessPct(id);
  document.querySelectorAll(`[data-toggle="${id}"]`).forEach((el) => el.classList.toggle("is-on", current));
  document.querySelectorAll(`.lightbtn[data-toggle="${id}"]`).forEach((el) => el.classList.toggle("is-on", current));
  document.querySelectorAll(`[data-entity="${id}"]`).forEach((el) => {
    el.classList.toggle("is-on", current);
    if (el.classList.contains("room-card")) {
      const stat = el.querySelector(".stat");
      if (stat) stat.textContent = formatState(id);
    }
    if (el.classList.contains("light-card")) {
      const sb = el.querySelector(".sb");
      if (sb) {
        const subtitle = sb.textContent.split(" · ")[0];
        sb.textContent = `${subtitle} · ${pct != null && current ? `${pct}%` : formatState(id)}`;
      }
      const slider = el.querySelector(".slider span");
      if (slider) slider.style.width = `${pct != null ? pct : (current ? 88 : 22)}%`;
    }
    if (el.classList.contains("toggle-row")) {
      const sb = el.querySelector(".sb");
      if (sb) sb.textContent = current ? "Ligado" : "Desligado";
    }
    if (el.classList.contains("player")) {
      const btn = el.querySelector("[data-media-playpause]");
      if (btn) btn.textContent = entityState(id) === "playing" ? "Pausar" : "Play/Pause";
      const artist = el.querySelector(".artist");
      if (artist) artist.textContent = entity(id)?.attributes?.media_artist || entity(id)?.attributes?.source || formatState(id);
      const title = el.querySelector(".nowplay");
      if (title) title.textContent = entity(id)?.attributes?.media_title || friendly(id, friendly(id, id));
    }
    if (id === ENTITY_MAP.baby.noise && el.classList.contains("baby-noise")) {
      const buttons = el.querySelectorAll("[data-script]");
      buttons[0]?.classList.toggle("is-active", current);
      buttons[1]?.classList.toggle("is-active", !current);
    }
  });
  patchHeader();
}


function cameraSlotKey(img, fallback = "default") {
  return img?.dataset?.cameraSlot || img?.dataset?.cameraFeed || fallback;
}

function stopCameraFeeds() {
  for (const timer of state.cameraTimers.values()) clearInterval(timer);
  state.cameraTimers.clear();
}

async function refreshCameraFeed(img) {
  if (!img?.dataset?.cameraFeed) return;
  try {
    const url = await fetchCameraFrame(img.dataset.cameraFeed);
    if (url) img.src = url;
  } catch {}
}

function bindCameraFeed(img) {
  if (!img) return;
  const slot = cameraSlotKey(img);
  const existing = state.cameraTimers.get(slot);
  if (existing) clearInterval(existing);
  refreshCameraFeed(img);
  state.cameraTimers.set(slot, setInterval(() => refreshCameraFeed(img), 2500));
}

function startCameraFeeds() {
  stopCameraFeeds();
  $$("[data-camera-feed]").forEach((img) => bindCameraFeed(img));
}

function updateHomeCameraMeta() {
  const meta = $("[data-home-camera-meta]");
  if (!meta) return;
  const weather = entity(ENTITY_MAP.weather);
  const temp = weather?.attributes?.temperature ?? num(ENTITY_MAP.climate.temp, 0);
  const condition = weather?.state || "indisponível";
  const cam = HOME_CAMERAS.find((item) => item.id === state.activeHomeCamera) || HOME_CAMERAS[0];
  meta.textContent = `${cam.label} · ${condition} · ${temp}°C · modo ${entityState(ENTITY_MAP.houseMode, "Dia")}`;
}

function switchHomeCamera(nextId) {
  if (state.route !== "home" || !nextId || nextId === state.activeHomeCamera) return;
  const previousIndex = HOME_CAMERAS.findIndex((item) => item.id === state.activeHomeCamera);
  const nextIndex = HOME_CAMERAS.findIndex((item) => item.id === nextId);
  const direction = nextIndex >= previousIndex ? "left" : "right";
  state.activeHomeCamera = nextId;

  const tabs = $("[data-home-camera-tabs]");
  const img = $("[data-camera-slot='home']");
  const meta = $("[data-home-camera-meta]");

  $$("[data-home-camera]").forEach((btn) => btn.classList.toggle("is-active", btn.dataset.homeCamera === nextId));

  tabs?.classList.remove("is-sliding-left", "is-sliding-right");
  tabs?.classList.add(direction === "left" ? "is-sliding-left" : "is-sliding-right");
  window.setTimeout(() => tabs?.classList.remove("is-sliding-left", "is-sliding-right"), 260);

  if (meta) {
    meta.classList.remove("is-sliding-left", "is-sliding-right");
    meta.classList.add(direction === "left" ? "is-sliding-left" : "is-sliding-right");
  }

  if (!img) {
    updateHomeCameraMeta();
    return;
  }

  img.classList.remove("is-slide-in-left", "is-slide-in-right", "is-slide-out-left", "is-slide-out-right");
  img.classList.add(direction === "left" ? "is-slide-out-left" : "is-slide-out-right");

  window.setTimeout(async () => {
    img.dataset.cameraFeed = nextId;
    updateHomeCameraMeta();
    await refreshCameraFeed(img);
    bindCameraFeed(img);
    img.classList.remove("is-slide-out-left", "is-slide-out-right");
    img.classList.add(direction === "left" ? "is-slide-in-left" : "is-slide-in-right");
    window.setTimeout(() => {
      img.classList.remove("is-slide-in-left", "is-slide-in-right");
      meta?.classList.remove("is-sliding-left", "is-sliding-right");
    }, 280);
  }, 180);
}

function render() {
  patchHeader();
  if (state.error && !state.connected) {
    view.innerHTML = renderError();
    $("#retryBtn")?.addEventListener("click", bootstrap);
    $("#saveTokenBtn")?.addEventListener("click", () => {
      const value = $("#tokenInput")?.value?.trim();
      if (!value) return;
      localStorage.setItem("auroraHaToken", value);
      bootstrap();
    });
    $("#clearTokenBtn")?.addEventListener("click", () => {
      localStorage.removeItem("auroraHaToken");
      state.token = null;
      bootstrap();
    });
    return;
  }
  const renders = {
    home: renderHome,
    lights: renderLights,
    climate: renderClimate,
    security: renderSecurity,
    media: renderMedia,
    baby: renderBaby,
  };
  view.innerHTML = renders[state.route]();
  bindInteractions();
  startCameraFeeds();
}

function bindInteractions() {
  $$("[data-route-go]").forEach((btn) => {
    btn.onclick = () => go(btn.dataset.routeGo);
  });
  $$("[data-home-camera]").forEach((btn) => {
    btn.onclick = () => {
      switchHomeCamera(btn.dataset.homeCamera);
    };
  });
  $$("[data-toggle]").forEach((btn) => {
    btn.onclick = async (e) => {
      e.stopPropagation();
      await toggleEntity(btn.dataset.toggle);
    };
  });
  $$("[data-script]").forEach((btn) => {
    btn.onclick = async () => runScript(btn.dataset.script);
  });
  $$("[data-media-playpause]").forEach((btn) => {
    btn.onclick = async () => mediaPlayPause(btn.dataset.mediaPlaypause);
  });
  $$("[data-media-prev]").forEach((btn) => {
    btn.onclick = async () => mediaPrevious(btn.dataset.mediaPrev);
  });
  $$("[data-refresh-camera]").forEach((btn) => {
    btn.onclick = startCameraFeeds;
  });
}

function go(route) {
  state.route = ROUTES.includes(route) ? route : "home";
  history.replaceState(null, "", `#${state.route}`);
  // Cinema mode: full-bleed Babytracker (hides topbar + sidebar via CSS).
  document.body.toggleAttribute("data-baby-cinema", state.route === "baby");
  render();
}

function setEntityState(id, nextState) {
  if (!state.entities[id]) return;
  state.entities[id].state = nextState;
}

async function toggleEntity(id) {
  const domain = id.split(".")[0];
  const wasOn = isOn(id);
  try {
    await callService(domain, "toggle", {}, { entity_id: id });
    setEntityState(id, wasOn ? "off" : "on");
    patchEntityUI(id);
  } catch {
    state.error = `Falha ao alternar ${friendly(id, id)}.`;
    render();
  }
}

async function runScript(id) {
  try {
    await callService("script", "turn_on", { entity_id: id });
    if (id === ENTITY_MAP.scripts.noiseOn) setEntityState(ENTITY_MAP.baby.noise, "on");
    if (id === ENTITY_MAP.scripts.noiseOff) setEntityState(ENTITY_MAP.baby.noise, "off");
    patchEntityUI(ENTITY_MAP.baby.noise);
  } catch {
    state.error = `Falha ao executar ${id}.`;
    render();
  }
}

async function mediaPlayPause(id) {
  try {
    await callService("media_player", "media_play_pause", {}, { entity_id: id });
    setEntityState(id, entityState(id) === "playing" ? "paused" : "playing");
    patchEntityUI(id);
  } catch {
    state.error = `Falha no media player ${friendly(id, id)}.`;
    render();
  }
}

async function mediaPrevious(id) {
  try {
    await callService("media_player", "media_previous_track", {}, { entity_id: id });
  } catch {
    state.error = `Falha no media player ${friendly(id, id)}.`;
    render();
  }
}

function connectWebSocket() {
  if (!state.token) return;
  try {
    state.ws?.close();
  } catch {}
  const proto = location.protocol === "https:" ? "wss" : "ws";
  const ws = new WebSocket(`${proto}://${location.host}/api/websocket`);
  state.ws = ws;
  let subId = 1;

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === "auth_required") {
      ws.send(JSON.stringify({ type: "auth", access_token: state.token }));
      return;
    }
    if (msg.type === "auth_ok") {
      ws.send(JSON.stringify({ id: subId++, type: "subscribe_events", event_type: "state_changed" }));
      return;
    }
    if (msg.type === "event" && msg.event?.data?.entity_id) {
      const id = msg.event.data.entity_id;
      const next = msg.event.data.new_state;
      if (next) state.entities[id] = next;
      else delete state.entities[id];
      patchEntityUI(id);
      if (state.route === "home" && [ENTITY_MAP.weather, ENTITY_MAP.houseMode].includes(id)) {
        updateHomeCameraMeta();
      }
    }
  };

  ws.onclose = () => {
    setTimeout(() => {
      if (state.token) connectWebSocket();
    }, 3000);
  };
}

async function bootstrap() {
  state.token = parseToken();
  try {
    await loadStates();
    connectWebSocket();
  } catch (err) {
    state.error = err.message;
    state.connected = false;
  }
  render();
}

$$("#nav .nav-item[data-route]").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.query = "";
    go(btn.dataset.route);
  });
});

searchInput?.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  state.query = e.target.value.trim();
  go("lights");
});

window.addEventListener("hashchange", () => go((location.hash || "#home").slice(1)));
window.addEventListener("beforeunload", stopCameraFeeds);

/* ESC sai do modo cinema do Babytracker */
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && state.route === "baby") go("home");
});

/* Ripple universal — ativa em qualquer .ripple ou em toggle-row do Babytracker */
document.addEventListener("pointerdown", (e) => {
  const target = e.target.closest(".ripple, .baby--cinema .baby-ctrls .toggle-row");
  if (!target) return;
  const rect = target.getBoundingClientRect();
  target.style.setProperty("--rx", `${e.clientX - rect.left}px`);
  target.style.setProperty("--ry", `${e.clientY - rect.top}px`);
  target.classList.remove("is-rippling");
  // force reflow so animation restarts
  void target.offsetWidth;
  target.classList.add("is-rippling");
  setTimeout(() => target.classList.remove("is-rippling"), 600);
});
document.addEventListener("pointerup", () => {
  const active = document.activeElement;
  if (!active) return;
  if (active === searchInput || active.tagName === "INPUT" || active.tagName === "TEXTAREA") return;
  if (typeof active.blur === "function") active.blur();
});

(async () => {
  const route = (location.hash || "#home").slice(1);
  state.route = ROUTES.includes(route) ? route : "home";
  document.body.toggleAttribute("data-baby-cinema", state.route === "baby");
  await bootstrap();
})();

/* =========================================================
   THEME (normal -> dark -> night)
   ========================================================= */
const THEMES = ["normal", "dark", "night"];
function applyTheme(name) {
  document.body.dataset.theme = name;
  localStorage.setItem("auroraTheme", name);
  const btn = document.getElementById("themeBtn");
  if (btn) {
    btn.dataset.themeMode = name;
    btn.title = name === "normal"
      ? "Modo claro (atual) — clique para escuro"
      : name === "dark"
      ? "Modo escuro (atual) — clique para noturno"
      : "Modo noturno (atual) — clique para voltar";
  }
}
function cycleTheme() {
  const cur = document.body.dataset.theme || "normal";
  const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
  applyTheme(next);
}
document.getElementById("themeBtn")?.addEventListener("click", cycleTheme);
applyTheme(localStorage.getItem("auroraTheme") || "normal");

/* =========================================================
   MODAL — universal popup
   ========================================================= */
const modalEl = document.getElementById("modal");
const sheetEl = document.getElementById("modalSheet");

function openModal(html) {
  if (!modalEl || !sheetEl) return;
  sheetEl.innerHTML = html;
  modalEl.classList.add("is-open");
  modalEl.setAttribute("aria-hidden", "false");
  bindModalInteractions();
}
function closeModal() {
  if (!modalEl) return;
  modalEl.classList.remove("is-open");
  modalEl.setAttribute("aria-hidden", "true");
  sheetEl.innerHTML = "";
}
modalEl?.addEventListener("click", (e) => {
  if (e.target.matches("[data-modal-close]") || e.target === modalEl) closeModal();
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

const COLOR_SWATCHES = [
  { name: "Quente",   rgb: [255, 180, 107] },
  { name: "Branco",   rgb: [255, 244, 229] },
  { name: "Frio",     rgb: [200, 220, 255] },
  { name: "Âmbar",    rgb: [255, 160,  60] },
  { name: "Vermelho", rgb: [255,  70,  70] },
  { name: "Rosa",     rgb: [255, 105, 180] },
  { name: "Roxo",     rgb: [170, 100, 255] },
  { name: "Azul",     rgb: [ 80, 140, 255] },
  { name: "Ciano",    rgb: [ 80, 220, 230] },
  { name: "Verde",    rgb: [110, 230, 130] },
  { name: "Lime",     rgb: [214, 255,  77] },
  { name: "Amarelo",  rgb: [255, 230,  90] },
];
const COLOR_TEMPS = [
  { name: "2200K", k: 2200, hex: "#ffb46b" },
  { name: "2700K", k: 2700, hex: "#ffd29a" },
  { name: "4000K", k: 4000, hex: "#fff4e5" },
  { name: "6500K", k: 6500, hex: "#dfe8ff" },
];

function supportsBrightness(id) {
  const e = entity(id);
  return id.startsWith("light.") && (e?.attributes?.supported_color_modes?.length || e?.attributes?.brightness != null || true);
}
function supportsColor(id) {
  const e = entity(id);
  const modes = e?.attributes?.supported_color_modes || [];
  return id.startsWith("light.") && modes.some((m) => ["hs", "rgb", "rgbw", "rgbww", "xy"].includes(m));
}
function supportsColorTemp(id) {
  const e = entity(id);
  const modes = e?.attributes?.supported_color_modes || [];
  return id.startsWith("light.") && (modes.includes("color_temp") || modes.length === 0);
}

function openLightModal(id) {
  const on = isOn(id);
  const pct = brightnessPct(id) ?? (on ? 80 : 0);
  const isLight = id.startsWith("light.");
  const showColor = isLight && supportsColor(id);
  const showTemp  = isLight && supportsColorTemp(id);
  const showBright= isLight && supportsBrightness(id);

  const colorBlock = showColor ? `
    <div class="modal__section">
      <div class="modal__label">Cor <b>RGB</b></div>
      <div class="color-grid" data-color-grid>
        ${COLOR_SWATCHES.map((c) => `
          <button class="color-swatch" data-rgb="${c.rgb.join(',')}"
            style="background:rgb(${c.rgb.join(',')})" title="${c.name}"></button>
        `).join("")}
      </div>
    </div>` : "";

  const tempBlock = showTemp ? `
    <div class="modal__section">
      <div class="modal__label">Temperatura de cor</div>
      <div class="temp-row">
        ${COLOR_TEMPS.map((t) => `
          <button class="temp-pill" data-kelvin="${t.k}">
            <span class="swatch" style="background:${t.hex}"></span>
            <span>${t.name}</span>
          </button>
        `).join("")}
      </div>
    </div>` : "";

  const brightBlock = showBright ? `
    <div class="modal__section">
      <div class="modal__label">Intensidade <b id="brightVal">${pct}%</b></div>
      <input type="range" min="1" max="100" value="${pct}" class="bright-slider" id="brightSlider" />
    </div>` : "";

  openModal(`
    <div class="modal__head">
      <div>
        <h2 class="modal__title">${friendly(id, id)}</h2>
        <div class="modal__sub">${formatState(id)} · ${id}</div>
      </div>
      <button class="modal__close" data-modal-close aria-label="Fechar">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="modal-switch">
      <span class="lbl">${on ? "Ligado" : "Desligado"}</span>
      <button class="switch ${on ? "is-on" : ""}" data-modal-toggle="${id}"><span></span></button>
    </div>
    ${brightBlock}
    ${colorBlock}
    ${tempBlock}
  `);
}

function openMediaModal(id) {
  const e = entity(id);
  const playing = entityState(id) === "playing";
  const title = e?.attributes?.media_title || friendly(id, id);
  const artist = e?.attributes?.media_artist || e?.attributes?.app_name || formatState(id);
  const cover = e?.attributes?.entity_picture;
  const vol = Math.round((e?.attributes?.volume_level ?? 0.4) * 100);
  const initials = friendly(id, id).split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  openModal(`
    <div class="modal__head">
      <div>
        <h2 class="modal__title">${friendly(id, id)}</h2>
        <div class="modal__sub">${formatState(id)}</div>
      </div>
      <button class="modal__close" data-modal-close aria-label="Fechar">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="mp-cover">${cover ? `<img src="${cover}" alt="" />` : initials}</div>
    <div class="mp-meta">
      <div class="t">${title}</div>
      <div class="a">${artist}</div>
    </div>
    <div class="mp-controls">
      <button class="mp-btn" data-mp-prev="${id}" title="Anterior">⏮</button>
      <button class="mp-btn mp-pp" data-mp-pp="${id}" title="Play/Pause">${playing ? "❚❚" : "▶"}</button>
      <button class="mp-btn" data-mp-next="${id}" title="Próximo">⏭</button>
    </div>
    <div class="mp-vol">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9v6h4l5 4V5l-5 4H5z"/></svg>
      <input type="range" min="0" max="100" value="${vol}" id="mpVol" />
      <span id="mpVolVal" style="min-width:36px;text-align:right;font-variant-numeric:tabular-nums;">${vol}%</span>
    </div>
    <div class="modal__section">
      <div class="modal-switch">
        <span class="lbl">Energia</span>
        <button class="switch ${isOn(id) ? "is-on" : ""}" data-modal-toggle="${id}"><span></span></button>
      </div>
    </div>
  `);
}

function bindModalInteractions() {
  // Toggle dentro do modal
  sheetEl.querySelectorAll("[data-modal-toggle]").forEach((btn) => {
    btn.onclick = async () => {
      await toggleEntity(btn.dataset.modalToggle);
      btn.classList.toggle("is-on", isOn(btn.dataset.modalToggle));
      const lbl = btn.parentElement?.querySelector(".lbl");
      if (lbl) lbl.textContent = isOn(btn.dataset.modalToggle) ? "Ligado" : "Desligado";
    };
  });
  // Brightness
  const slider = sheetEl.querySelector("#brightSlider");
  const brightVal = sheetEl.querySelector("#brightVal");
  if (slider) {
    let timer;
    slider.addEventListener("input", () => { brightVal.textContent = `${slider.value}%`; });
    slider.addEventListener("change", async () => {
      const id = sheetEl.querySelector("[data-modal-toggle]")?.dataset.modalToggle;
      if (!id) return;
      clearTimeout(timer);
      timer = setTimeout(async () => {
        try {
          await callService("light", "turn_on", { brightness_pct: Number(slider.value) }, { entity_id: id });
          if (state.entities[id]) state.entities[id].attributes.brightness_pct = Number(slider.value);
          patchEntityUI(id);
        } catch (err) { console.error(err); }
      }, 80);
    });
  }
  // Color
  sheetEl.querySelectorAll("[data-rgb]").forEach((sw) => {
    sw.onclick = async () => {
      const id = sheetEl.querySelector("[data-modal-toggle]")?.dataset.modalToggle;
      if (!id) return;
      const rgb = sw.dataset.rgb.split(",").map(Number);
      sheetEl.querySelectorAll("[data-rgb]").forEach((s) => s.classList.remove("is-active"));
      sw.classList.add("is-active");
      try { await callService("light", "turn_on", { rgb_color: rgb }, { entity_id: id }); }
      catch (err) { console.error(err); }
    };
  });
  // Color temp
  sheetEl.querySelectorAll("[data-kelvin]").forEach((p) => {
    p.onclick = async () => {
      const id = sheetEl.querySelector("[data-modal-toggle]")?.dataset.modalToggle;
      if (!id) return;
      const k = Number(p.dataset.kelvin);
      sheetEl.querySelectorAll("[data-kelvin]").forEach((s) => s.classList.remove("is-active"));
      p.classList.add("is-active");
      try { await callService("light", "turn_on", { kelvin: k }, { entity_id: id }); }
      catch (err) { console.error(err); }
    };
  });
  // Media controls
  sheetEl.querySelectorAll("[data-mp-pp]").forEach((b) => {
    b.onclick = async () => {
      const id = b.dataset.mpPp;
      await mediaPlayPause(id);
      b.textContent = entityState(id) === "playing" ? "❚❚" : "▶";
    };
  });
  sheetEl.querySelectorAll("[data-mp-prev]").forEach((b) => {
    b.onclick = () => mediaPrevious(b.dataset.mpPrev);
  });
  sheetEl.querySelectorAll("[data-mp-next]").forEach((b) => {
    b.onclick = async () => {
      try { await callService("media_player", "media_next_track", {}, { entity_id: b.dataset.mpNext }); }
      catch (err) { console.error(err); }
    };
  });
  const mpVol = sheetEl.querySelector("#mpVol");
  const mpVolVal = sheetEl.querySelector("#mpVolVal");
  if (mpVol) {
    let vt;
    mpVol.addEventListener("input", () => { mpVolVal.textContent = `${mpVol.value}%`; });
    mpVol.addEventListener("change", () => {
      const id = sheetEl.querySelector("[data-mp-pp], [data-modal-toggle]")?.dataset.mpPp
              || sheetEl.querySelector("[data-modal-toggle]")?.dataset.modalToggle;
      if (!id) return;
      clearTimeout(vt);
      vt = setTimeout(async () => {
        try { await callService("media_player", "volume_set", { volume_level: Number(mpVol.value) / 100 }, { entity_id: id }); }
        catch (err) { console.error(err); }
      }, 80);
    });
  }
}

/* =========================================================
   Abrir popups via click no card (sem afetar o switch)
   ========================================================= */
document.addEventListener("click", (e) => {
  // ignora clique no switch (já tratado por data-toggle)
  if (e.target.closest("[data-toggle]")) return;
  if (e.target.closest("[data-modal-close]")) return;
  if (e.target.closest(".modal__sheet")) return;

  const card = e.target.closest("[data-entity]");
  if (!card) return;
  const id = card.dataset.entity;
  if (!id) return;

  // botões dentro do card que não devem abrir popup
  if (e.target.closest("[data-script], [data-media-prev], [data-media-playpause], [data-refresh-camera], [data-route-go], [data-home-camera]")) return;

  const domain = id.split(".")[0];
  if (domain === "light" || domain === "switch") openLightModal(id);
  else if (domain === "media_player") openMediaModal(id);
});

/* =========================================================
   HAPTICS
   ========================================================= */
function haptic(ms = 10) {
  try { navigator.vibrate?.(ms); } catch {}
}

/* =========================================================
   CENAS GLOBAIS
   ========================================================= */
const SCENES = [
  {
    id: "goodnight", name: "Boa noite",
    sub: "Apaga tudo, ativa ruído branco e modo noturno",
    icon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    run: async () => {
      const allLights = Object.values(ENTITY_MAP.groups);
      await Promise.allSettled(allLights.map((id) => callService(id.split(".")[0], "turn_off", {}, { entity_id: id })));
      await callService("script", "turn_on", { entity_id: ENTITY_MAP.scripts.noiseOn }).catch(() => {});
      applyTheme("night");
    },
  },
  {
    id: "cinema", name: "Cinema",
    sub: "Sala 20%, demais apagadas, modo escuro",
    icon: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M8 22h8M12 18v4"/>',
    run: async () => {
      await Promise.allSettled([
        callService("light", "turn_on", { brightness_pct: 20, kelvin: 2200 }, { entity_id: ENTITY_MAP.groups.sala }),
        callService("light", "turn_off", {}, { entity_id: ENTITY_MAP.groups.cozinha }),
        callService("light", "turn_off", {}, { entity_id: ENTITY_MAP.groups.servicos }),
      ]);
      applyTheme("dark");
    },
  },
  {
    id: "wakeup", name: "Acordar",
    sub: "Suite e quarto Esther em luz quente",
    icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
    run: async () => {
      await Promise.allSettled([
        callService("light", "turn_on", { brightness_pct: 60, kelvin: 2700 }, { entity_id: ENTITY_MAP.groups.suite }),
        callService("light", "turn_on", { brightness_pct: 40, kelvin: 2700 }, { entity_id: ENTITY_MAP.groups.esther }),
      ]);
      applyTheme("normal");
    },
  },
  {
    id: "leave", name: "Sair de casa",
    sub: "Apaga tudo e arma o alarme",
    icon: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    confirm: { title: "Sair de casa", message: "Vai apagar todas as luzes e armar o alarme. Confirma?" },
    run: async () => {
      const allLights = Object.values(ENTITY_MAP.groups);
      await Promise.allSettled(allLights.map((id) => callService(id.split(".")[0], "turn_off", {}, { entity_id: id })));
      await callService("alarm_control_panel", "alarm_arm_away", {}, { entity_id: ENTITY_MAP.security.alarm }).catch(() => {});
    },
  },
];

function openScenesModal() {
  openModal(`
    <div class="modal__head">
      <div>
        <h2 class="modal__title">Cenas</h2>
        <div class="modal__sub">Atalhos para a casa toda</div>
      </div>
      <button class="modal__close" data-modal-close aria-label="Fechar">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="scenes-grid">
      ${SCENES.map((s) => `
        <button class="scene-tile" data-scene="${s.id}">
          <div class="ic"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${s.icon}</svg></div>
          <div>
            <div class="nm">${s.name}</div>
            <div class="sb">${s.sub}</div>
          </div>
        </button>
      `).join("")}
    </div>
  `);
  sheetEl.querySelectorAll("[data-scene]").forEach((tile) => {
    tile.onclick = async () => {
      const scene = SCENES.find((s) => s.id === tile.dataset.scene);
      if (!scene) return;
      haptic(15);
      const exec = async () => {
        try { await scene.run(); closeModal(); }
        catch (err) { console.error(err); }
      };
      if (scene.confirm) openConfirm(scene.confirm.title, scene.confirm.message, exec);
      else await exec();
    };
  });
}
document.getElementById("scenesBtn")?.addEventListener("click", () => { haptic(8); openScenesModal(); });

function openHouseModeModal() {
  const ent = entity(ENTITY_MAP.houseMode);
  const opts = ent?.attributes?.options || ["Dia", "Noite", "Fora", "Cinema"];
  const cur = ent?.state || opts[0];
  const ICONS = {
    Dia: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
    Noite: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    Fora: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    Cinema: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M8 22h8M12 18v4"/>',
  };
  openModal(`
    <div class="modal__head">
      <div>
        <h2 class="modal__title">Modo da casa</h2>
        <div class="modal__sub">Atual: ${cur}</div>
      </div>
      <button class="modal__close" data-modal-close aria-label="Fechar">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="scenes-grid">
      ${opts.map((opt) => `
        <button class="scene-tile ${opt === cur ? "is-active" : ""}" data-house-mode="${opt}">
          <div class="ic"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[opt] || '<circle cx="12" cy="12" r="9"/>'}</svg></div>
          <div><div class="nm">${opt}</div><div class="sb">${opt === cur ? "Ativo agora" : "Selecionar"}</div></div>
        </button>
      `).join("")}
    </div>
  `);
  sheetEl.querySelectorAll("[data-house-mode]").forEach((btn) => {
    btn.onclick = async () => {
      const opt = btn.dataset.houseMode;
      haptic(12);
      try {
        await callService("input_select", "select_option", { option: opt }, { entity_id: ENTITY_MAP.houseMode });
        setEntityState(ENTITY_MAP.houseMode, opt);
      } catch (err) { console.error(err); }
      closeModal();
    };
  });
}
document.getElementById("houseBtn")?.addEventListener("click", () => { haptic(8); openHouseModeModal(); });

/* =========================================================
   CONFIRMAÇÃO (alarme / porta / sair)
   ========================================================= */
function openConfirm(title, message, onConfirm) {
  openModal(`
    <div class="modal__head">
      <div>
        <h2 class="modal__title">${title}</h2>
        <div class="modal__sub">${message}</div>
      </div>
    </div>
    <div class="confirm-actions">
      <button class="btn" data-modal-close>Cancelar</button>
      <button class="btn btn--danger" id="confirmYes">Confirmar</button>
    </div>
  `);
  sheetEl.querySelector("#confirmYes")?.addEventListener("click", async () => {
    haptic(20);
    closeModal();
    try { await onConfirm(); } catch (err) { console.error(err); }
  });
}

// Intercepta clique no card do alarme (security)
document.addEventListener("click", (e) => {
  const card = e.target.closest(`[data-entity="${ENTITY_MAP.security.alarm}"]`);
  if (!card || e.target.closest(".modal__sheet")) return;
  e.stopPropagation();
  const armed = entityState(ENTITY_MAP.security.alarm) === "armed_away";
  openConfirm(
    armed ? "Desarmar alarme" : "Armar alarme",
    armed ? "Tem certeza que quer desarmar?" : "Confirma armar o alarme em modo ausente?",
    async () => {
      await callService("alarm_control_panel", armed ? "alarm_disarm" : "alarm_arm_away", {}, { entity_id: ENTITY_MAP.security.alarm });
    }
  );
}, true);

/* =========================================================
   NOTIFICAÇÕES (logbook)
   ========================================================= */
const NOTIF_ENTITIES = [
  ENTITY_MAP.security.door,
  ENTITY_MAP.security.alarm,
  ENTITY_MAP.baby.occupied,
  ENTITY_MAP.baby.face,
];
let lastNotifSeen = Number(localStorage.getItem("auroraNotifSeen") || 0);

async function fetchNotifications() {
  try {
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const path = `/api/logbook/${encodeURIComponent(since)}?entity=${NOTIF_ENTITIES.join(",")}`;
    const data = await haFetch(path);
    return Array.isArray(data) ? data.slice(-30).reverse() : [];
  } catch { return []; }
}

function notifIcon(entity_id = "") {
  if (entity_id.startsWith("alarm")) return '<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/>';
  if (entity_id.includes("porta")) return '<rect x="6" y="3" width="12" height="18" rx="1"/><circle cx="15" cy="12" r="1"/>';
  if (entity_id.includes("berco")) return '<circle cx="12" cy="9" r="4"/><path d="M5 21c1-4 5-6 7-6s6 2 7 6"/>';
  return '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>';
}

async function openNotifModal() {
  openModal(`
    <div class="modal__head">
      <div>
        <h2 class="modal__title">Notificações</h2>
        <div class="modal__sub">Últimas 24h</div>
      </div>
      <button class="modal__close" data-modal-close aria-label="Fechar">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="notif-list" id="notifList"><div class="notif-empty">Carregando…</div></div>
  `);
  const list = sheetEl.querySelector("#notifList");
  const items = await fetchNotifications();
  if (!items.length) { list.innerHTML = `<div class="notif-empty">Sem eventos recentes</div>`; }
  else {
    list.innerHTML = items.map((it) => {
      const when = it.when ? new Date(it.when) : null;
      const ts = when ? when.toLocaleString("pt-BR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) : "";
      return `
        <div class="notif-item">
          <div class="ic"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${notifIcon(it.entity_id || "")}</svg></div>
          <div class="body">
            <div class="t">${it.name || it.entity_id || "Evento"}</div>
            <div class="m">${it.message || it.state || ""}</div>
            <div class="ts">${ts}</div>
          </div>
        </div>`;
    }).join("");
  }
  // marca visto
  lastNotifSeen = Date.now();
  localStorage.setItem("auroraNotifSeen", String(lastNotifSeen));
  document.getElementById("notifDot")?.setAttribute("hidden", "");
}
document.getElementById("notifBtn")?.addEventListener("click", () => { haptic(8); openNotifModal(); });

function bumpNotifDot() {
  document.getElementById("notifDot")?.removeAttribute("hidden");
}

/* =========================================================
   FAB BABYTRACKER
   ========================================================= */
const fabBaby = document.getElementById("fabBaby");
const fabPulse = document.getElementById("fabPulse");
fabBaby?.addEventListener("click", () => { haptic(10); go("baby"); });

function updateFab() {
  if (!fabBaby) return;
  if (state.route === "baby") fabBaby.setAttribute("hidden", "");
  else fabBaby.removeAttribute("hidden");
  if (isOn(ENTITY_MAP.baby.occupied)) fabPulse?.removeAttribute("hidden");
  else fabPulse?.setAttribute("hidden", "");
}

/* =========================================================
   SPARKLINE no Clima — history API
   ========================================================= */
async function fetchHistory(entity_id, hours = 12) {
  try {
    const start = new Date(Date.now() - hours * 3600 * 1000).toISOString();
    const data = await haFetch(`/api/history/period/${encodeURIComponent(start)}?filter_entity_id=${entity_id}&minimal_response=true`);
    if (!Array.isArray(data) || !data[0]) return [];
    return data[0].map((p) => parseFloat(p.state)).filter((v) => Number.isFinite(v));
  } catch { return []; }
}

function sparklineSvg(values) {
  if (!values.length) return "";
  const w = 320, h = 56, pad = 4;
  const min = Math.min(...values), max = Math.max(...values);
  const span = (max - min) || 1;
  const step = (w - pad * 2) / Math.max(1, values.length - 1);
  const pts = values.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (h - pad * 2) * (1 - (v - min) / span);
    return [x, y];
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length-1][0].toFixed(1)} ${h} L${pts[0][0].toFixed(1)} ${h} Z`;
  return `<svg class="sparkline" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <path class="area" d="${area}"/>
    <path d="${line}"/>
  </svg>`;
}

async function injectClimateSparklines() {
  if (state.route !== "climate") return;
  const cards = view.querySelectorAll(".stat-card");
  if (!cards.length) return;
  const [tempVals, humVals] = await Promise.all([
    fetchHistory(ENTITY_MAP.climate.temp, 12),
    fetchHistory(ENTITY_MAP.climate.humidity, 12),
  ]);
  if (humVals.length && cards[0]) cards[0].insertAdjacentHTML("beforeend", sparklineSvg(humVals));
  if (tempVals.length && cards[1]) cards[1].insertAdjacentHTML("beforeend", sparklineSvg(tempVals));
}

/* =========================================================
   SCREENSAVER + AUTO-NIGHT
   ========================================================= */
const SS_TIMEOUT = 3 * 60 * 1000; // 3 min
const ssEl = document.getElementById("screensaver");
const ssTime = document.getElementById("ssTime");
const ssDate = document.getElementById("ssDate");
const ssTemp = document.getElementById("ssTemp");
const ssBaby = document.getElementById("ssBaby");
let ssTimer = null;

function paintScreensaver() {
  const now = new Date();
  if (ssTime) ssTime.textContent = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  if (ssDate) ssDate.textContent = now.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  if (ssTemp) ssTemp.textContent = `${num(ENTITY_MAP.climate.temp, 0).toFixed(0)}°`;
  if (ssBaby) ssBaby.textContent = isOn(ENTITY_MAP.baby.occupied) ? "Berço ocupado" : "Berço livre";
}
let ssPaintTimer = null;
function showScreensaver() {
  if (!ssEl || ssEl.classList.contains("is-on")) return;
  paintScreensaver();
  ssEl.classList.add("is-on");
  ssEl.setAttribute("aria-hidden", "false");
  clearInterval(ssPaintTimer);
  ssPaintTimer = setInterval(paintScreensaver, 15000);
}
function hideScreensaver() {
  if (!ssEl) return;
  ssEl.classList.remove("is-on");
  ssEl.setAttribute("aria-hidden", "true");
  clearInterval(ssPaintTimer);
  ssPaintTimer = null;
}
function resetSsTimer() {
  clearTimeout(ssTimer);
  ssTimer = setTimeout(showScreensaver, SS_TIMEOUT);
}
ssEl?.addEventListener("click", () => { hideScreensaver(); resetSsTimer(); });
["pointerdown", "keydown", "wheel"].forEach((ev) =>
  document.addEventListener(ev, () => { if (ssEl?.classList.contains("is-on")) hideScreensaver(); resetSsTimer(); })
);
resetSsTimer();

// Auto-night entre 22h e 06h (apenas se usuário não trocou manualmente nos últimos 30min)
let lastManualThemeChange = 0;
document.getElementById("themeBtn")?.addEventListener("click", () => { lastManualThemeChange = Date.now(); });
function autoTheme() {
  if (Date.now() - lastManualThemeChange < 30 * 60 * 1000) return;
  const h = new Date().getHours();
  const desired = (h >= 22 || h < 6) ? "night" : "normal";
  if (document.body.dataset.theme !== desired) applyTheme(desired);
}
setInterval(autoTheme, 5 * 60 * 1000);

/* =========================================================
   PERFORMANCE — pause WS quando aba oculta + double-buffer câmera
   ========================================================= */
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopCameraFeeds();
    try { state.ws?.close(); } catch {}
  } else {
    if (state.token) connectWebSocket();
    startCameraFeeds();
  }
});

// Double buffer da câmera: substitui refreshCameraFeed por versão sem flicker
const _origRefresh = refreshCameraFeed;
refreshCameraFeed = async function (img) {
  if (!img?.dataset?.cameraFeed) return;
  try {
    const url = await fetchCameraFrame(img.dataset.cameraFeed);
    if (!url) return;
    const buf = new Image();
    buf.onload = () => { img.src = url; };
    buf.onerror = () => { img.src = url; };
    buf.src = url;
  } catch {}
};

/* =========================================================
   POLIMENTO VISUAL — bolinha de cor RGB nos cards de luz
   ========================================================= */
const _origPatchEntityUI = patchEntityUI;
patchEntityUI = function (id) {
  _origPatchEntityUI(id);
  if (!id.startsWith("light.")) return;
  const e = entity(id);
  const rgb = e?.attributes?.rgb_color;
  document.querySelectorAll(`[data-entity="${id}"]`).forEach((card) => {
    let dot = card.querySelector(".color-dot");
    if (rgb && isOn(id)) {
      if (!dot) {
        dot = document.createElement("span");
        dot.className = "color-dot";
        card.appendChild(dot);
      }
      dot.style.color = `rgb(${rgb.join(",")})`;
      dot.style.background = `rgb(${rgb.join(",")})`;
    } else if (dot) dot.remove();
  });
};

/* =========================================================
   LONG-PRESS REORDENAR (home)
   ========================================================= */
const ORDER_KEY = "auroraHomeOrder";
function applySavedOrder() {
  if (state.route !== "home") return;
  const grid = view.querySelector(".home-grid");
  if (!grid) return;
  const order = JSON.parse(localStorage.getItem(ORDER_KEY) || "null");
  if (!Array.isArray(order)) return;
  const map = new Map();
  Array.from(grid.children).forEach((el, i) => {
    const key = el.dataset.entity || `idx-${i}`;
    map.set(key, el);
  });
  order.forEach((key) => { const el = map.get(key); if (el) grid.appendChild(el); });
  // os que sobraram já estão no fim
}
function saveOrder() {
  const grid = view.querySelector(".home-grid");
  if (!grid) return;
  const order = Array.from(grid.children).map((el, i) => el.dataset.entity || `idx-${i}`);
  localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

function enableEdit() {
  if (state.route !== "home") return;
  document.body.classList.add("is-editing");
  haptic(25);
  const grid = view.querySelector(".home-grid");
  if (!grid) return;
  Array.from(grid.children).forEach((el) => { el.draggable = true; });
  let dragEl = null;
  grid.addEventListener("dragstart", (e) => {
    dragEl = e.target.closest(".home-grid > *");
    dragEl?.classList.add("is-dragging");
    e.dataTransfer.effectAllowed = "move";
  });
  grid.addEventListener("dragover", (e) => {
    e.preventDefault();
    const target = e.target.closest(".home-grid > *");
    if (!target || target === dragEl) return;
    const rect = target.getBoundingClientRect();
    const after = (e.clientY - rect.top) / rect.height > 0.5;
    target.parentNode.insertBefore(dragEl, after ? target.nextSibling : target);
  });
  grid.addEventListener("dragend", () => {
    dragEl?.classList.remove("is-dragging");
    saveOrder();
  });
}
function disableEdit() {
  document.body.classList.remove("is-editing");
  const grid = view.querySelector(".home-grid");
  if (!grid) return;
  Array.from(grid.children).forEach((el) => { el.draggable = false; });
}

// banner para sair do modo edição
const editBanner = document.createElement("div");
editBanner.className = "edit-banner";
editBanner.textContent = "Concluir edição";
editBanner.onclick = disableEdit;
document.body.appendChild(editBanner);

// long-press (600ms) em card de grupo da home -> abre popup com entidades
let lpTimer = null;
let lpFired = false;
view.addEventListener("pointerdown", (e) => {
  if (state.route !== "home") return;
  const card = e.target.closest(".room-card[data-group-key]");
  if (!card) return;
  if (e.target.closest("[data-toggle], button")) return;
  lpFired = false;
  lpTimer = setTimeout(() => {
    lpFired = true;
    haptic(20);
    openGroupModal(card.dataset.groupKey);
  }, 600);
});
["pointerup", "pointermove", "pointercancel", "pointerleave"].forEach((ev) =>
  view.addEventListener(ev, () => { clearTimeout(lpTimer); })
);
// se long-press disparou, suprime click subsequente
document.addEventListener("click", (e) => {
  if (lpFired) { e.stopPropagation(); e.preventDefault(); lpFired = false; }
}, true);

/* =========================================================
   HOOKS — render() extras + haptics nos toggles
   ========================================================= */
const _origRender = render;
render = function () {
  _origRender();
  applySavedOrder();
  updateFab();
  if (state.route === "climate") injectClimateSparklines();
};
const _origToggleEntity = toggleEntity;
toggleEntity = async function (id) {
  haptic(8);
  return _origToggleEntity(id);
};

/* WS hook para notif dot + FAB pulse */
const wsObserver = new MutationObserver(() => {});
const _origConnect = connectWebSocket;
connectWebSocket = function () {
  _origConnect();
  const ws = state.ws;
  if (!ws) return;
  const _orig = ws.onmessage;
  ws.onmessage = (event) => {
    _orig?.(event);
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === "event" && msg.event?.data?.entity_id) {
        const id = msg.event.data.entity_id;
        if (NOTIF_ENTITIES.includes(id)) bumpNotifDot();
        if (id === ENTITY_MAP.baby.occupied) updateFab();
      }
    } catch {}
  };
};

/* primeiro paint de FAB e auto-tema após bootstrap */
setTimeout(() => { updateFab(); autoTheme(); }, 800);

/* =========================================================
   SERVICE WORKER
   ========================================================= */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/dashboard/sw.js").catch(() => {});
  });
}

/* =========================================================
   GROUP MODAL (long-press num grupo)
   ========================================================= */
function openGroupModal(groupId) {
  const groupKey = Object.entries(ENTITY_MAP.groups).find(([k, v]) => v === groupId)?.[0];
  const items = groupKey ? ENTITY_MAP.lights[groupKey] || [] : [];
  const all = [{ id: groupId, name: friendly(groupId, groupId), subtitle: "Grupo" }, ...items.filter((i) => i.id !== groupId)];
  openModal(`
    <div class="modal__head">
      <div>
        <h2 class="modal__title">${friendly(groupId, groupId)}</h2>
        <div class="modal__sub">Controle individual do grupo</div>
      </div>
      <button class="modal__close" data-modal-close aria-label="Fechar">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="group-list">
      ${all.map((it) => `
        <div class="toggle-row ${isOn(it.id) ? "is-on" : ""}" data-entity="${it.id}">
          <div><div class="nm">${friendly(it.id, it.name)}</div><div class="sb">${it.subtitle || ""}</div></div>
          ${lightBtn(it.id)}
        </div>
      `).join("")}
    </div>
  `);
  sheetEl.querySelectorAll("[data-toggle]").forEach((btn) => {
    btn.onclick = async (e) => {
      e.stopPropagation();
      await toggleEntity(btn.dataset.toggle);
    };
  });
}

/* =========================================================
   HOUSE MODES + SECURITY SWIPE + FULLSCREEN CAMERA
   ========================================================= */
// Bind hooks após cada render
const _origBindInteractions = bindInteractions;
bindInteractions = function () {
  _origBindInteractions();

  // Modos da casa
  document.querySelectorAll("[data-house-mode]").forEach((btn) => {
    btn.onclick = async (e) => {
      e.stopPropagation();
      const opt = btn.dataset.houseMode;
      document.querySelectorAll("[data-house-mode]").forEach((b) => b.classList.toggle("is-active", b === btn));
      try {
        await callService("input_select", "select_option", { option: opt }, { entity_id: ENTITY_MAP.houseMode });
        setEntityState(ENTITY_MAP.houseMode, opt);
        updateHomeCameraMeta();
      } catch (err) { console.error(err); }
    };
  });

  // Tabs câmera de segurança
  document.querySelectorAll("[data-security-camera]").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      switchSecurityCamera(btn.dataset.securityCamera);
      restartSecurityRotate();
    };
  });

  // Swipe na hero da home
  const homeHero = document.querySelector(".hero[data-camera-fullscreen]");
  if (homeHero && state.route === "home") attachSwipe(homeHero, (dir) => {
    const ids = HOME_CAMERAS.map((c) => c.id);
    const i = ids.indexOf(state.activeHomeCamera);
    const nextIdx = (i + (dir === "left" ? 1 : -1) + ids.length) % ids.length;
    switchHomeCamera(ids[nextIdx]);
  });

  // Swipe no hero de segurança
  const secHero = document.querySelector("[data-security-hero]");
  if (secHero && state.route === "security") {
    attachSwipe(secHero, (dir) => {
      const ids = HOME_CAMERAS.map((c) => c.id);
      const i = ids.indexOf(state.activeSecurityCamera);
      const nextIdx = (i + (dir === "left" ? 1 : -1) + ids.length) % ids.length;
      switchSecurityCamera(ids[nextIdx]);
      restartSecurityRotate();
    });
    startSecurityRotate();
  } else {
    stopSecurityRotate();
  }

  // Click em hero (que NÃO seja num botão interno) -> fullscreen
  document.querySelectorAll("[data-camera-fullscreen]").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e.target.closest("button, [data-toggle], [data-home-camera], [data-security-camera]")) return;
      if (el.dataset._swiped === "1") { el.dataset._swiped = "0"; return; }
      openCameraFs(el.dataset.cameraFullscreen);
    });
  });
};

function attachSwipe(el, onSwipe) {
  let sx = 0, sy = 0, t0 = 0, active = false;
  el.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) return;
    sx = e.clientX; sy = e.clientY; t0 = Date.now(); active = true;
  });
  el.addEventListener("pointerup", (e) => {
    if (!active) return; active = false;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Date.now() - t0 < 600 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      el.dataset._swiped = "1";
      onSwipe(dx < 0 ? "left" : "right");
    }
  });
  el.addEventListener("pointercancel", () => { active = false; });
}

function switchSecurityCamera(nextId) {
  if (!nextId || nextId === state.activeSecurityCamera) return;
  state.activeSecurityCamera = nextId;
  const img = document.querySelector("[data-camera-slot='security']");
  const label = document.querySelector("[data-security-cam-label]");
  document.querySelectorAll("[data-security-camera]").forEach((b) => b.classList.toggle("is-active", b.dataset.securityCamera === nextId));
  const heroFs = document.querySelector("[data-security-hero]");
  if (heroFs) heroFs.dataset.cameraFullscreen = nextId;
  if (label) label.textContent = (HOME_CAMERAS.find((c) => c.id === nextId) || {}).label || "";
  if (img) {
    img.classList.add("is-slide-out-left");
    setTimeout(async () => {
      img.dataset.cameraFeed = nextId;
      await refreshCameraFeed(img);
      bindCameraFeed(img);
      img.classList.remove("is-slide-out-left");
    }, 180);
  }
}

function startSecurityRotate() {
  stopSecurityRotate();
  state.securityRotateTimer = setInterval(() => {
    if (state.route !== "security") return stopSecurityRotate();
    const ids = HOME_CAMERAS.map((c) => c.id);
    const i = ids.indexOf(state.activeSecurityCamera);
    switchSecurityCamera(ids[(i + 1) % ids.length]);
  }, 10000);
}
function stopSecurityRotate() {
  if (state.securityRotateTimer) clearInterval(state.securityRotateTimer);
  state.securityRotateTimer = null;
}
function restartSecurityRotate() {
  if (state.route === "security") startSecurityRotate();
}

/* =========================================================
   CÂMERA FULLSCREEN
   ========================================================= */
const camFs = document.createElement("div");
camFs.className = "camfs";
camFs.innerHTML = `
  <button class="camfs__close" aria-label="Fechar">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
  </button>
  <div class="camfs__bar"></div>
  <img class="camfs__img" alt="Câmera fullscreen" />
  <button class="talk-back camfs__talk" id="camFsTalk" title="Falar nesta câmera" aria-label="Talk-back">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 11a7 7 0 0 1-14 0"/><path d="M12 18v3"/></svg>
  </button>
  <div class="camfs__hint">Arraste para trocar · toque para fechar · segure 🎤 para falar</div>
`;
document.body.appendChild(camFs);
const camFsImg = camFs.querySelector(".camfs__img");
const camFsBar = camFs.querySelector(".camfs__bar");
let camFsTimer = null;
let camFsCurrent = null;
const ALL_CAMS = [...HOME_CAMERAS, { id: ENTITY_MAP.baby.camera, label: "Berço" }];

function paintCamFsBar() {
  camFsBar.innerHTML = ALL_CAMS.map((c) => `<button data-camfs="${c.id}" class="${c.id === camFsCurrent ? "is-active" : ""}">${c.label}</button>`).join("");
  camFsBar.querySelectorAll("[data-camfs]").forEach((b) => {
    b.onclick = (e) => { e.stopPropagation(); switchCamFs(b.dataset.camfs); };
  });
}
async function refreshCamFs() {
  if (!camFsCurrent) return;
  try {
    const url = await fetchCameraFrame(camFsCurrent);
    if (url) camFsImg.src = url;
  } catch {}
}
function switchCamFs(id, dir = "left") {
  if (!id || id === camFsCurrent) return;
  camFsCurrent = id;
  camFsImg.classList.add(dir === "left" ? "is-slide-out-left" : "is-slide-out-right");
  paintCamFsBar();
  setTimeout(async () => {
    await refreshCamFs();
    camFsImg.classList.remove("is-slide-out-left", "is-slide-out-right");
  }, 180);
}
function openCameraFs(id) {
  camFsCurrent = id;
  paintCamFsBar();
  camFs.classList.add("is-on");
  refreshCamFs();
  clearInterval(camFsTimer);
  camFsTimer = setInterval(refreshCamFs, 1500);
  haptic(10);
}
function closeCameraFs() {
  camFs.classList.remove("is-on");
  clearInterval(camFsTimer);
  camFsTimer = null;
  camFsCurrent = null;
  if (typeof _camFsStopTalk === "function") _camFsStopTalk();
}
camFs.querySelector(".camfs__close").addEventListener("click", (e) => { e.stopPropagation(); closeCameraFs(); });
camFs.addEventListener("click", (e) => {
  if (e.target.closest("button, .camfs__bar, .camfs__talk")) return;
  closeCameraFs();
});
attachSwipe(camFs, (dir) => {
  const ids = ALL_CAMS.map((c) => c.id);
  const i = ids.indexOf(camFsCurrent);
  const next = ids[(i + (dir === "left" ? 1 : -1) + ids.length) % ids.length];
  switchCamFs(next, dir);
});

/* Talk-back universal — push-to-talk em qualquer câmera (fullscreen) */
let _camFsTalkStream = null;
async function _camFsStartTalk() {
  if (_camFsTalkStream) return;
  try {
    _camFsTalkStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    document.getElementById("camFsTalk")?.classList.add("is-talking");
    if (typeof toast === "function") toast(`🎤 Falando em ${camFsCurrent || "câmera"}…`, "info", 2000);
    if (navigator.vibrate) navigator.vibrate(15);
  } catch { if (typeof toast === "function") toast("Microfone não autorizado", "err"); }
}
function _camFsStopTalk() {
  if (!_camFsTalkStream) return;
  _camFsTalkStream.getTracks().forEach(t => t.stop());
  _camFsTalkStream = null;
  document.getElementById("camFsTalk")?.classList.remove("is-talking");
}
(function bindCamFsTalk(){
  const btn = document.getElementById("camFsTalk");
  if (!btn) return;
  const start = (e)=>{ e.preventDefault(); e.stopPropagation(); _camFsStartTalk(); };
  const stop  = (e)=>{ e.preventDefault(); e.stopPropagation(); _camFsStopTalk(); };
  btn.addEventListener("pointerdown", start);
  btn.addEventListener("pointerup", stop);
  btn.addEventListener("pointercancel", stop);
  btn.addEventListener("pointerleave", stop);
})();

/* =========================================================
   SCREENSAVER — bloquear na página baby
   ========================================================= */
const _origReset = resetSsTimer;
resetSsTimer = function () {
  clearTimeout(ssTimer);
  if (state.route === "baby") return;
  ssTimer = setTimeout(showScreensaver, SS_TIMEOUT);
};
// Quando entra na baby: garante off
const _origGo = go;
go = function (route) {
  _origGo(route);
  if (state.route === "baby") {
    clearTimeout(ssTimer);
    hideScreensaver();
  } else {
    resetSsTimer();
  }
  stopSecurityRotate();
};

/* =========================================================
   SIDEBAR — avatar com iniciais coloridas + engrenagem (settings)
   ========================================================= */
(function setupSidebar() {
  const avatar = document.querySelector(".avatar");
  if (avatar) {
    const photo = localStorage.getItem("auroraUserPhoto");
    if (photo) {
      avatar.innerHTML = `<img src="${photo}" alt="Usuário" />`;
    }
    avatar.style.cursor = "pointer";
    avatar.title = "Trocar foto do usuário";
    avatar.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file"; input.accept = "image/*";
      input.onchange = () => {
        const f = input.files?.[0]; if (!f) return;
        const r = new FileReader();
        r.onload = () => {
          localStorage.setItem("auroraUserPhoto", r.result);
          avatar.innerHTML = `<img src="${r.result}" alt="Usuário" />`;
        };
        r.readAsDataURL(f);
      };
      input.click();
    });
  }
  const gear = document.querySelector(".sidebar__foot .nav-item");
  if (gear) {
    gear.addEventListener("click", openSettingsModal);
  }
})();

function openSettingsModal() {
  const photo = localStorage.getItem("auroraUserPhoto");
  openModal(`
    <div class="modal__head">
      <div>
        <h2 class="modal__title">Ajustes</h2>
        <div class="modal__sub">Preferências da dashboard</div>
      </div>
      <button class="modal__close" data-modal-close aria-label="Fechar">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="modal__section">
      <div class="modal__label">Tema</div>
      <div class="temp-row">
        <button class="temp-pill" data-set-theme="normal"><span class="swatch" style="background:#1a1d22"></span><span>Normal</span></button>
        <button class="temp-pill" data-set-theme="dark"><span class="swatch" style="background:#000"></span><span>Escuro</span></button>
        <button class="temp-pill" data-set-theme="night"><span class="swatch" style="background:#ff5a3a"></span><span>Noturno</span></button>
      </div>
    </div>
    <div class="modal__section">
      <div class="modal__label">Token Home Assistant</div>
      <input id="settingsToken" type="password" placeholder="Long-Lived Access Token" style="width:100%;padding:12px 14px;border-radius:14px;border:1px solid var(--glass-stroke);background:var(--glass-2);color:inherit;outline:none;" />
      <div style="display:flex;gap:10px;margin-top:10px;">
        <button class="btn btn--lime" id="saveTokenSet">Salvar token</button>
        <button class="btn" id="clearTokenSet">Limpar</button>
      </div>
    </div>
    <div class="modal__section">
      <div class="modal__label">Foto do usuário</div>
      <div style="display:flex;gap:10px;align-items:center;">
        ${photo ? `<img src="${photo}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;" />` : `<div class="avatar" style="position:relative;">W</div>`}
        <button class="btn" id="changePhotoBtn">Trocar foto</button>
        ${photo ? `<button class="btn" id="removePhotoBtn">Remover</button>` : ""}
      </div>
    </div>
    <div class="modal__section">
      <div class="modal__label">Recarregar dashboard</div>
      <button class="btn" id="reloadDashBtn">Recarregar agora</button>
    </div>
  `);
  sheetEl.querySelectorAll("[data-set-theme]").forEach((b) => {
    b.onclick = () => { applyTheme(b.dataset.setTheme); };
  });
  sheetEl.querySelector("#saveTokenSet")?.addEventListener("click", () => {
    const v = sheetEl.querySelector("#settingsToken").value.trim();
    if (!v) return;
    localStorage.setItem("auroraHaToken", v);
    bootstrap();
    closeModal();
  });
  sheetEl.querySelector("#clearTokenSet")?.addEventListener("click", () => {
    localStorage.removeItem("auroraHaToken");
    state.token = null;
    closeModal();
    bootstrap();
  });
  sheetEl.querySelector("#changePhotoBtn")?.addEventListener("click", () => {
    document.querySelector(".avatar")?.click();
    closeModal();
  });
  sheetEl.querySelector("#removePhotoBtn")?.addEventListener("click", () => {
    localStorage.removeItem("auroraUserPhoto");
    const av = document.querySelector(".avatar");
    if (av) av.innerHTML = "W";
    closeModal();
  });
  sheetEl.querySelector("#reloadDashBtn")?.addEventListener("click", () => location.reload());
}

/* Re-exclui o card popup da entidade alarme da segurança (quando há confirm) */

/* =========================================================
   v2 — IMPROVEMENTS PACK
   ========================================================= */

/* ---------- 4 · Toasts (feedback) ---------- */
const toastWrap = document.getElementById("toastWrap");
function toast(msg, kind = "info", ms = 2800) {
  if (!toastWrap) return;
  const el = document.createElement("div");
  el.className = `toast toast--${kind}`;
  el.textContent = msg;
  toastWrap.appendChild(el);
  setTimeout(() => { el.classList.add("is-out"); setTimeout(() => el.remove(), 250); }, ms);
}
window.toast = toast;

/* Wrap callService -> erro vira toast */
const _origCallService = callService;
callService = async function (...args) {
  try { return await _origCallService(...args); }
  catch (err) {
    toast(`Falha: ${args[0]}.${args[1]}`, "err");
    throw err;
  }
};

/* ---------- 1 · Dot de modo da casa no botão ---------- */
const HOUSE_MODE_COLORS = { Dia: "#d5ff7f", Noite: "#b39dff", Fora: "#7dd3fc", Cinema: "#ff8a9b" };
function paintHouseDot() {
  const btn = document.getElementById("houseBtn");
  if (!btn) return;
  const cur = entityState(ENTITY_MAP.houseMode, "");
  let dot = btn.querySelector(".mode-dot");
  if (!dot) { dot = document.createElement("span"); dot.className = "mode-dot"; btn.appendChild(dot); }
  const color = HOUSE_MODE_COLORS[cur] || "#888";
  dot.style.background = color;
  dot.style.color = color;
  btn.title = `Modo: ${cur || "—"}`;
}

/* ---------- 13 · Reconexão WS com backoff + chip ---------- */
const connChip = document.getElementById("connChip");
const connTxt = document.getElementById("connTxt");
function setConn(status) {
  if (!connChip) return;
  connChip.classList.remove("is-warn", "is-err");
  if (status === "ok") { connTxt.textContent = "ao vivo"; }
  else if (status === "warn") { connChip.classList.add("is-warn"); connTxt.textContent = "reconectando…"; }
  else { connChip.classList.add("is-err"); connTxt.textContent = "offline"; }
}
let wsRetry = 0;
const _origConnectV2 = connectWebSocket;
connectWebSocket = function () {
  if (!state.token) { setConn("err"); return; }
  setConn("warn");
  _origConnectV2();
  const ws = state.ws;
  if (!ws) return;
  const _open = ws.onopen;
  ws.onopen = (e) => { _open?.(e); };
  // monitora auth_ok
  const _msg = ws.onmessage;
  ws.onmessage = (event) => {
    _msg?.(event);
    try {
      const m = JSON.parse(event.data);
      if (m.type === "auth_ok") { setConn("ok"); wsRetry = 0; }
      if (m.type === "auth_invalid") { setConn("err"); toast("Token inválido", "err"); }
    } catch {}
  };
  const _close = ws.onclose;
  ws.onclose = (e) => {
    setConn("warn");
    wsRetry = Math.min(wsRetry + 1, 6);
    const delay = Math.min(30000, 1500 * Math.pow(1.6, wsRetry));
    setTimeout(() => { if (state.token) connectWebSocket(); else setConn("err"); }, delay);
  };
  ws.onerror = () => setConn("warn");
};

/* ---------- 17 · Transição entre rotas ---------- */
const _origGoV2 = go;
go = function (route) {
  view.classList.remove("is-routing");
  // forçar reflow
  void view.offsetWidth;
  _origGoV2(route);
  view.classList.add("is-routing");
  // dot no botão de modo após qualquer render
  setTimeout(paintHouseDot, 0);
};

/* ---------- 19 · Pulse de mudança ---------- */
const _patch2 = patchEntityUI;
const lastEntityState = {};
patchEntityUI = function (id) {
  const prev = lastEntityState[id];
  const next = isOn(id);
  _patch2(id);
  lastEntityState[id] = next;
  if (prev === undefined || prev === next) return;
  document.querySelectorAll(`[data-entity="${id}"]`).forEach((card) => {
    if (!card.classList.contains("card") && !card.classList.contains("room-card")) return;
    const cls = id.includes("porta") || id.includes("alarm") ? "flash-alert" : (next ? "flash-on" : "flash-off");
    card.classList.remove("flash-on", "flash-off", "flash-alert");
    void card.offsetWidth;
    card.classList.add(cls);
    setTimeout(() => card.classList.remove(cls), 1000);
  });
  if (id === ENTITY_MAP.houseMode) paintHouseDot();
};

/* ---------- 2 · Slide to confirm (substitui openConfirm) ---------- */
const _origOpenConfirm = openConfirm;
openConfirm = function (title, message, onConfirm) {
  openModal(`
    <div class="modal__head">
      <div>
        <h2 class="modal__title">${title}</h2>
        <div class="modal__sub">${message}</div>
      </div>
      <button class="modal__close" data-modal-close aria-label="Fechar">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="slide-confirm" id="slideConfirm">
      <div class="slide-confirm__fill" id="scFill"></div>
      <div class="slide-confirm__track">Arraste para confirmar →</div>
      <div class="slide-confirm__handle" id="scHandle">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </div>
    </div>
  `);
  const sc = sheetEl.querySelector("#slideConfirm");
  const handle = sheetEl.querySelector("#scHandle");
  const fill = sheetEl.querySelector("#scFill");
  let dragging = false, startX = 0, x = 0;
  const max = () => sc.offsetWidth - 60;
  const onDown = (e) => { dragging = true; startX = (e.touches?.[0]?.clientX ?? e.clientX); handle.style.transition = "none"; };
  const onMove = (e) => {
    if (!dragging) return;
    const cx = (e.touches?.[0]?.clientX ?? e.clientX);
    x = Math.max(0, Math.min(max(), cx - startX));
    handle.style.transform = `translateX(${x}px)`;
    fill.style.width = `${x + 56}px`;
    if (x > max() * 0.85) sc.classList.add("is-armed"); else sc.classList.remove("is-armed");
  };
  const onUp = async () => {
    if (!dragging) return; dragging = false;
    handle.style.transition = "transform .25s ease";
    if (x >= max() * 0.92) {
      haptic(25);
      closeModal();
      try { await onConfirm(); toast("Confirmado", "ok"); } catch { toast("Falhou", "err"); }
    } else {
      x = 0; handle.style.transform = "translateX(0)"; fill.style.width = "0";
      sc.classList.remove("is-armed");
    }
  };
  handle.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp, { once: false });
  handle.addEventListener("touchstart", onDown, { passive: true });
  window.addEventListener("touchmove", onMove, { passive: true });
  window.addEventListener("touchend", onUp);
};

/* ---------- 6 · Calendário / Rotinas ---------- */
async function fetchCalendars() {
  try {
    const cals = await haFetch("/api/calendars");
    if (!Array.isArray(cals) || !cals.length) return [];
    const start = new Date().toISOString();
    const end = new Date(Date.now() + 7 * 86400000).toISOString();
    const all = await Promise.all(cals.map((c) =>
      haFetch(`/api/calendars/${c.entity_id}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`).catch(() => [])
    ));
    return all.flat().sort((a, b) => (a.start?.dateTime || a.start?.date || "").localeCompare(b.start?.dateTime || b.start?.date || ""));
  } catch { return []; }
}
async function openCalendarModal() {
  openModal(`
    <div class="modal__head">
      <div><h2 class="modal__title">Próximos eventos</h2><div class="modal__sub">7 dias</div></div>
      <button class="modal__close" data-modal-close aria-label="Fechar"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="notif-list" id="calList"><div class="notif-empty">Carregando…</div></div>
  `);
  const list = sheetEl.querySelector("#calList");
  const evts = await fetchCalendars();
  if (!evts.length) { list.innerHTML = `<div class="notif-empty">Sem eventos</div>`; return; }
  list.innerHTML = evts.slice(0, 30).map((ev) => {
    const when = new Date(ev.start?.dateTime || ev.start?.date);
    const ts = when.toLocaleString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    return `<div class="notif-item"><div class="ic"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg></div>
      <div class="body"><div class="t">${ev.summary || "Evento"}</div><div class="m">${ev.description || ""}</div><div class="ts">${ts}</div></div></div>`;
  }).join("");
}

/* ---------- 7 · Lista de compras (todo) ---------- */
async function fetchTodos() {
  try {
    const states = await haFetch("/api/states");
    return states.filter((s) => s.entity_id.startsWith("todo."));
  } catch { return []; }
}
async function openTodoModal() {
  openModal(`
    <div class="modal__head">
      <div><h2 class="modal__title">Listas</h2><div class="modal__sub">Compras e tarefas</div></div>
      <button class="modal__close" data-modal-close aria-label="Fechar"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div id="todoBody"><div class="notif-empty">Carregando…</div></div>
  `);
  const body = sheetEl.querySelector("#todoBody");
  const lists = await fetchTodos();
  if (!lists.length) { body.innerHTML = `<div class="notif-empty">Nenhuma lista todo configurada no HA</div>`; return; }
  body.innerHTML = lists.map((l) => `
    <div class="modal__section">
      <div class="modal__label">${l.attributes?.friendly_name || l.entity_id}</div>
      <div style="display:flex;gap:8px;margin-bottom:8px;">
        <input class="todo-input" data-list="${l.entity_id}" placeholder="Adicionar item…" style="flex:1;padding:10px 14px;border-radius:12px;border:1px solid var(--glass-stroke);background:var(--glass-2);color:inherit;outline:none;" />
        <button class="btn btn--lime" data-add="${l.entity_id}">+</button>
      </div>
      <div class="muted" style="font-size:13px;">${l.state} pendentes</div>
    </div>
  `).join("");
  sheetEl.querySelectorAll("[data-add]").forEach((b) => {
    b.onclick = async () => {
      const id = b.dataset.add;
      const inp = sheetEl.querySelector(`.todo-input[data-list="${id}"]`);
      const v = inp?.value.trim(); if (!v) return;
      try {
        await callService("todo", "add_item", { item: v }, { entity_id: id });
        inp.value = ""; toast("Adicionado", "ok");
      } catch {}
    };
  });
}

/* ---------- 8 · Forecast popup ---------- */
async function openForecastModal() {
  openModal(`
    <div class="modal__head">
      <div><h2 class="modal__title">Previsão</h2><div class="modal__sub">7 dias · Taubaté</div></div>
      <button class="modal__close" data-modal-close aria-label="Fechar"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div id="fcBody"><div class="notif-empty">Carregando…</div></div>
  `);
  let forecast = [];
  try {
    const r = await haFetch(`/api/services/weather/get_forecasts?return_response=true`, {
      method: "POST",
      body: JSON.stringify({ entity_id: ENTITY_MAP.weather, type: "daily" }),
    });
    forecast = r?.service_response?.[ENTITY_MAP.weather]?.forecast || [];
  } catch {}
  if (!forecast.length) {
    const ent = entity(ENTITY_MAP.weather);
    forecast = ent?.attributes?.forecast || [];
  }
  const body = sheetEl.querySelector("#fcBody");
  if (!forecast.length) { body.innerHTML = `<div class="notif-empty">Sem dados de previsão</div>`; return; }
  body.innerHTML = `<div class="fc-grid">${forecast.slice(0, 7).map((f) => {
    const d = new Date(f.datetime || f.date || Date.now());
    const wd = d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
    return `<div class="fc-day"><div class="d">${wd}</div><div class="t">${Math.round(f.temperature ?? 0)}°</div><div class="r">${f.precipitation ? Math.round(f.precipitation) + "mm" : "—"}</div></div>`;
  }).join("")}</div>`;
}
document.querySelector(".weather-chip")?.addEventListener("click", openForecastModal);
document.querySelector(".weather-chip")?.style.setProperty("cursor", "pointer");

/* ---------- 9 · Intercom (TTS) ---------- */
async function openIntercomModal() {
  const speakers = ["media_player.echo_pop_de_vinicius", "media_player.echo_quarto"];
  openModal(`
    <div class="modal__head">
      <div><h2 class="modal__title">Intercom</h2><div class="modal__sub">Mensagem por voz</div></div>
      <button class="modal__close" data-modal-close aria-label="Fechar"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="modal__section">
      <textarea id="ttsMsg" placeholder="Ex: Jantar pronto!" style="width:100%;min-height:90px;padding:12px;border-radius:14px;border:1px solid var(--glass-stroke);background:var(--glass-2);color:inherit;outline:none;resize:vertical;"></textarea>
    </div>
    <div class="modal__section">
      <div class="modal__label">Caixas</div>
      <div class="temp-row" id="ttsSpk">
        ${speakers.map((s) => `<button class="temp-pill is-active" data-spk="${s}">${friendly(s, s)}</button>`).join("")}
      </div>
    </div>
    <div style="display:flex;gap:10px;">
      ${["Jantar pronto!","Estou indo!","Esther dormindo, silêncio."].map((q) => `<button class="btn" data-quick="${q}">${q}</button>`).join("")}
    </div>
    <div style="margin-top:14px;"><button class="btn btn--lime" id="ttsSend">Enviar</button></div>
  `);
  sheetEl.querySelectorAll("[data-spk]").forEach((b) => b.onclick = () => b.classList.toggle("is-active"));
  sheetEl.querySelectorAll("[data-quick]").forEach((b) => b.onclick = () => sheetEl.querySelector("#ttsMsg").value = b.dataset.quick);
  sheetEl.querySelector("#ttsSend").onclick = async () => {
    const msg = sheetEl.querySelector("#ttsMsg").value.trim();
    const targets = Array.from(sheetEl.querySelectorAll("[data-spk].is-active")).map((b) => b.dataset.spk);
    if (!msg || !targets.length) return;
    try {
      await callService("tts", "speak", { message: msg, media_player_entity_id: targets, cache: false }, { entity_id: "tts.google_translate_en_com" }).catch(async () => {
        // fallback antigo
        await Promise.allSettled(targets.map((t) => callService("notify", "alexa_media", { message: msg, target: t, data: { type: "tts" } })));
      });
      toast("Mensagem enviada", "ok"); closeModal();
    } catch {}
  };
}

/* ---------- 10 · Sparkline sono baby ---------- */
async function injectBabySparkline() {
  if (state.route !== "baby") return;
  const card = view.querySelector(".baby-status");
  if (!card || card.querySelector(".baby-sleep-spark")) return;
  const vals = await fetchHistory(ENTITY_MAP.baby.occupied, 24 * 7).catch(() => []);
  // converter on/off em 1/0 — fetchHistory só retorna numéricos, então busco bruto
  try {
    const start = new Date(Date.now() - 7 * 86400000).toISOString();
    const data = await haFetch(`/api/history/period/${encodeURIComponent(start)}?filter_entity_id=${ENTITY_MAP.baby.occupied}&minimal_response=true`);
    const pts = data?.[0]?.map((p) => p.state === "on" ? 1 : 0) || [];
    if (!pts.length) return;
    // agrupar por dia (média)
    const days = 7;
    const bucketSize = Math.max(1, Math.floor(pts.length / days));
    const buckets = [];
    for (let i = 0; i < days; i++) {
      const slice = pts.slice(i * bucketSize, (i + 1) * bucketSize);
      buckets.push(slice.length ? slice.reduce((a, b) => a + b, 0) / slice.length : 0);
    }
    const w = 320, h = 50;
    const step = w / (buckets.length - 1 || 1);
    const line = buckets.map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)} ${(h - v * h).toFixed(1)}`).join(" ");
    const area = `${line} L${w} ${h} L0 ${h} Z`;
    card.insertAdjacentHTML("beforeend",
      `<div style="font-size:11px;color:var(--c-ink-mute);margin-top:10px;">Ocupação 7 dias</div>
       <svg class="baby-sleep-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
         <path class="area" d="${area}"/><path d="${line}"/>
       </svg>`);
  } catch {}
}

/* ---------- 11 · Timer mamada / troca ---------- */
const BABY_LOG_KEY = "auroraBabyLog";
function babyLogGet() { try { return JSON.parse(localStorage.getItem(BABY_LOG_KEY) || "{}"); } catch { return {}; } }
function babyLogSet(k) {
  const log = babyLogGet(); log[k] = Date.now();
  localStorage.setItem(BABY_LOG_KEY, JSON.stringify(log));
  // manda pro HA se input_datetime existir
  const map = { feed: "input_datetime.esther_ultima_mamada", diaper: "input_datetime.esther_ultima_troca", sleep: "input_datetime.esther_ultimo_sono" };
  if (map[k]) callService("input_datetime", "set_datetime", { timestamp: Math.floor(Date.now() / 1000) }, { entity_id: map[k] }).catch(() => {});
}
function timeAgo(ts) {
  if (!ts) return "—";
  const min = Math.floor((Date.now() - ts) / 60000);
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60); return `${h}h${min % 60 ? ` ${min % 60}m` : ""}`;
}
function injectBabyTimers() {
  if (state.route !== "baby") return;
  const ctrls = view.querySelector(".baby-ctrls");
  if (!ctrls || ctrls.querySelector(".baby-timer-row")) return;
  const log = babyLogGet();
  const row = document.createElement("div");
  row.className = "baby-timer-row";
  row.innerHTML = `
    <button data-baby-log="feed"><span class="lab">Mamada</span><span data-ago="feed">${timeAgo(log.feed)}</span></button>
    <button data-baby-log="diaper"><span class="lab">Troca</span><span data-ago="diaper">${timeAgo(log.diaper)}</span></button>
    <button data-baby-log="sleep"><span class="lab">Sono</span><span data-ago="sleep">${timeAgo(log.sleep)}</span></button>
  `;
  ctrls.appendChild(row);
  row.querySelectorAll("[data-baby-log]").forEach((b) => {
    b.onclick = () => {
      const k = b.dataset.babyLog;
      babyLogSet(k);
      b.querySelector(`[data-ago="${k}"]`).textContent = "agora";
      haptic(15); toast(`Registrado: ${b.querySelector(".lab").textContent.toLowerCase()}`, "ok");
    };
  });
}

/* ---------- 12 · Monitor noturno automático ---------- */
const nm = document.getElementById("nightMonitor");
const nmTime = document.getElementById("nmTime");
const nmStatus = document.getElementById("nmStatus");
const nmTemp = document.getElementById("nmTemp");
const nmCamImg = document.getElementById("nmCamImg");
let nmTimer = null, nmCamTimer = null;
function paintNightMonitor() {
  if (!nm.classList.contains("is-on")) return;
  const now = new Date();
  nmTime.textContent = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const occ = isOn(ENTITY_MAP.baby.occupied);
  nm.classList.toggle("is-active", occ);
  nmStatus.textContent = occ ? "Berço ocupado" : "Berço livre";
  nmTemp.textContent = `${num(ENTITY_MAP.baby.temp, 0).toFixed(1)}°`;
}
async function refreshNmCam() {
  try { const u = await fetchCameraFrame(ENTITY_MAP.baby.camera); if (u) nmCamImg.src = u; } catch {}
}
function openNightMonitor() {
  if (state.route !== "baby") return;
  nm.classList.add("is-on"); nm.setAttribute("aria-hidden", "false");
  paintNightMonitor(); refreshNmCam();
  clearInterval(nmTimer); nmTimer = setInterval(paintNightMonitor, 15000);
  clearInterval(nmCamTimer); nmCamTimer = setInterval(refreshNmCam, 4000);
}
function closeNightMonitor() {
  nm.classList.remove("is-on"); nm.setAttribute("aria-hidden", "true");
  clearInterval(nmTimer); clearInterval(nmCamTimer);
  nmTimer = nmCamTimer = null;
}
document.getElementById("nmClose")?.addEventListener("click", closeNightMonitor);
// auto: entre 20h e 6h, na rota baby, sem interação por 60s -> ativa
let nmIdle = null;
function resetNmIdle() {
  clearTimeout(nmIdle);
  if (nm.classList.contains("is-on")) closeNightMonitor();
  if (state.route !== "baby") return;
  const h = new Date().getHours();
  if (h >= 20 || h < 6) nmIdle = setTimeout(openNightMonitor, 60000);
}
["pointerdown","keydown","wheel"].forEach((ev) => document.addEventListener(ev, resetNmIdle));

/* ---------- 14 · Cache otimista (já parcial) — toast em falha extra ---------- */
const _origToggleEntityV2 = toggleEntity;
toggleEntity = async function (id) {
  const wasOn = isOn(id);
  setEntityState(id, wasOn ? "off" : "on"); patchEntityUI(id);
  try { await callService(id.split(".")[0], "toggle", {}, { entity_id: id }); }
  catch {
    setEntityState(id, wasOn ? "on" : "off"); patchEntityUI(id);
    toast(`Falhou ${friendly(id, id)}`, "err");
  }
};

/* ---------- 15 · Snapshot offline ---------- */
const SNAP_KEY = "auroraSnap";
function saveSnapshot() {
  try { localStorage.setItem(SNAP_KEY, JSON.stringify({ t: Date.now(), e: state.entities })); } catch {}
}
setInterval(saveSnapshot, 30000);
const _origLoadStates = loadStates;
loadStates = async function () {
  try { return await _origLoadStates(); }
  catch (err) {
    try {
      const snap = JSON.parse(localStorage.getItem(SNAP_KEY) || "null");
      if (snap?.e) { state.entities = snap.e; toast("Modo offline (snapshot)", "info"); }
    } catch {}
    throw err;
  }
};

/* ---------- 16 · Logs de auditoria ---------- */
const AUDIT_KEY = "auroraAudit";
function auditLog(action, target, ok = true) {
  try {
    const arr = JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]");
    arr.unshift({ t: Date.now(), action, target, ok });
    localStorage.setItem(AUDIT_KEY, JSON.stringify(arr.slice(0, 100)));
  } catch {}
}
const _origCallServiceV3 = callService;
callService = async function (domain, service, data, target) {
  try {
    const r = await _origCallServiceV3(domain, service, data, target);
    auditLog(`${domain}.${service}`, target?.entity_id || data?.entity_id || "—", true);
    return r;
  } catch (e) { auditLog(`${domain}.${service}`, target?.entity_id || data?.entity_id || "—", false); throw e; }
};
function openAuditModal() {
  const arr = (() => { try { return JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]"); } catch { return []; } })();
  openModal(`
    <div class="modal__head">
      <div><h2 class="modal__title">Auditoria</h2><div class="modal__sub">Últimas ações da dashboard</div></div>
      <button class="modal__close" data-modal-close aria-label="Fechar"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="notif-list">
      ${arr.length ? arr.map((it) => `<div class="notif-item"><div class="ic"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div><div class="body"><div class="t">${it.action} ${it.ok ? "" : "❌"}</div><div class="m">${it.target}</div><div class="ts">${new Date(it.t).toLocaleString("pt-BR")}</div></div></div>`).join("") : `<div class="notif-empty">Sem registros</div>`}
    </div>
  `);
}

/* ---------- 18 · Skeleton no boot ---------- */
if (!state.connected) {
  view.innerHTML = `<div class="home-grid">${Array.from({length:6}).map(() => `<div class="card skeleton" style="height:160px;"></div>`).join("")}</div>`;
}

/* ---------- HOOKS de render para baby (10 + 11) ---------- */
const _origRenderV2 = render;
render = function () {
  _origRenderV2();
  if (state.route === "baby") { injectBabySparkline(); injectBabyTimers(); resetNmIdle(); }
  paintHouseDot();
};

/* ---------- Cores do tema (accent) ---------- */
const ACCENT_PRESETS = [
  { id: "lime",    name: "Lima",     accent: "#d6ff4d", soft: "#b8e840", baby: "#ff8a9b" },
  { id: "cyan",    name: "Ciano",    accent: "#7dd3fc", soft: "#38bdf8", baby: "#ff8a9b" },
  { id: "violet",  name: "Violeta",  accent: "#b39dff", soft: "#8b5cf6", baby: "#ff8a9b" },
  { id: "rose",    name: "Rosa",     accent: "#ff8a9b", soft: "#ff5d77", baby: "#d6ff4d" },
  { id: "amber",   name: "Âmbar",    accent: "#ffd84a", soft: "#f5b800", baby: "#ff8a9b" },
  { id: "emerald", name: "Esmeralda",accent: "#5ee2a0", soft: "#2dc97f", baby: "#ff8a9b" },
  { id: "coral",   name: "Coral",    accent: "#ff7a59", soft: "#ff5a3a", baby: "#7dd3fc" },
];
function hexToRgb(h) {
  const m = h.replace("#", "");
  const v = m.length === 3 ? m.split("").map(c=>c+c).join("") : m;
  const n = parseInt(v, 16);
  return [(n>>16)&255, (n>>8)&255, n&255];
}
function applyAccent(cfg) {
  const accent = cfg.accent;
  const soft = cfg.soft || cfg.accent;
  const baby = cfg.baby || "#ff8a9b";
  const [r, g, b] = hexToRgb(accent);
  const root = document.documentElement.style;
  root.setProperty("--c-lime", accent);
  root.setProperty("--c-lime-soft", soft);
  root.setProperty("--c-rose", baby);
  root.setProperty("--shadow-glow-lime",
    `0 0 0 1px rgba(${r},${g},${b},.35), 0 10px 40px -10px rgba(${r},${g},${b},.45)`);
  localStorage.setItem("auroraAccent", JSON.stringify(cfg));
}
(function initAccent() {
  try {
    const saved = JSON.parse(localStorage.getItem("auroraAccent") || "null");
    if (saved && saved.accent) applyAccent(saved);
  } catch {}
})();

/* ---------- Atalhos extras: gear settings -> adiciona seções (calendário/listas/intercom/auditoria/cores) ---------- */
const _origOpenSettings = openSettingsModal;
openSettingsModal = function () {
  _origOpenSettings();

  // Cores do tema
  const saved = (() => { try { return JSON.parse(localStorage.getItem("auroraAccent") || "null"); } catch { return null; } })();
  const currentAccent = saved?.accent || "#d6ff4d";
  const colorSec = document.createElement("div");
  colorSec.className = "modal__section";
  colorSec.innerHTML = `
    <div class="modal__label">Cores do tema</div>
    <div class="temp-row" id="accentPresets" style="flex-wrap:wrap;">
      ${ACCENT_PRESETS.map(p => `
        <button class="temp-pill" data-accent="${p.id}" ${currentAccent.toLowerCase()===p.accent.toLowerCase()?'style="outline:2px solid '+p.accent+';"':''}>
          <span class="swatch" style="background:${p.accent}"></span>
          <span>${p.name}</span>
        </button>`).join("")}
    </div>
    <div style="display:flex;gap:10px;align-items:center;margin-top:12px;flex-wrap:wrap;">
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--c-ink-soft);">
        Personalizado:
        <input type="color" id="accentCustom" value="${currentAccent}" style="width:42px;height:32px;border:none;background:transparent;cursor:pointer;" />
      </label>
      <button class="btn" id="accentReset">Restaurar padrão</button>
    </div>`;
  sheetEl.appendChild(colorSec);
  colorSec.querySelectorAll("[data-accent]").forEach(b => {
    b.onclick = () => {
      const p = ACCENT_PRESETS.find(x => x.id === b.dataset.accent);
      if (p) { applyAccent(p); closeModal(); openSettingsModal(); }
    };
  });
  colorSec.querySelector("#accentCustom").oninput = (e) => {
    applyAccent({ accent: e.target.value, soft: e.target.value, baby: "#ff8a9b" });
  };
  colorSec.querySelector("#accentReset").onclick = () => {
    localStorage.removeItem("auroraAccent");
    document.documentElement.style.removeProperty("--c-lime");
    document.documentElement.style.removeProperty("--c-lime-soft");
    document.documentElement.style.removeProperty("--c-rose");
    document.documentElement.style.removeProperty("--shadow-glow-lime");
    closeModal(); openSettingsModal();
  };

  // Atalhos
  const extra = document.createElement("div");
  extra.className = "modal__section";
  extra.innerHTML = `
    <div class="modal__label">Atalhos</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      <button class="btn" id="openCalBtn">Calendário</button>
      <button class="btn" id="openTodoBtn">Listas</button>
      <button class="btn" id="openTtsBtn">Intercom</button>
      <button class="btn" id="openAuditBtn">Auditoria</button>
    </div>`;
  sheetEl.appendChild(extra);
  extra.querySelector("#openCalBtn").onclick = () => { closeModal(); openCalendarModal(); };
  extra.querySelector("#openTodoBtn").onclick = () => { closeModal(); openTodoModal(); };
  extra.querySelector("#openTtsBtn").onclick = () => { closeModal(); openIntercomModal(); };
  extra.querySelector("#openAuditBtn").onclick = () => { closeModal(); openAuditModal(); };
};

/* ---------- init ---------- */
setTimeout(() => { paintHouseDot(); setConn(state.connected ? "ok" : "warn"); }, 1000);
/* =========================================================
   v3 — EXPANSION PACK
   Depende de globals já definidos em app.js
   ========================================================= */
/* eslint-disable no-undef */

(function v3() {
  if (typeof haFetch !== "function") { console.warn("v3: app.js não carregado"); return; }

  /* ---------- Settings: itens persistentes ---------- */
  const SETTINGS_KEY = "auroraSettingsV3";
  function getSettings() {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"); } catch { return {}; }
  }
  function setSettings(p) {
    const cur = getSettings();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...cur, ...p }));
  }

  /* =========================================================
     #23 · URL configurável do HA  (proxy via localStorage)
     ========================================================= */
  const HA_URL_KEY = "auroraHaUrl";
  const _origFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    try {
      const base = localStorage.getItem(HA_URL_KEY);
      if (base && typeof input === "string" && input.startsWith("/api/")) {
        return _origFetch(base.replace(/\/$/, "") + input, init);
      }
    } catch {}
    return _origFetch(input, init);
  };

  /* =========================================================
     #4 · Energia
     ========================================================= */
  async function getPowerEntities() {
    try {
      const all = Object.values(state.entities || {});
      return all.filter((e) =>
        e.entity_id.startsWith("sensor.") &&
        ((e.attributes?.device_class === "power") ||
         (e.attributes?.unit_of_measurement || "").toLowerCase() === "w")
      );
    } catch { return []; }
  }
  async function getEnergyEntities() {
    const all = Object.values(state.entities || {});
    return all.filter((e) =>
      e.entity_id.startsWith("sensor.") &&
      ((e.attributes?.device_class === "energy") ||
       (e.attributes?.unit_of_measurement || "").toLowerCase() === "kwh")
    );
  }
  async function injectEnergyCard() {
    if (state.route !== "home") return;
    if (view.querySelector(".energy-card")) return;
    const power = await getPowerEntities();
    const energy = await getEnergyEntities();
    if (!power.length && !energy.length) return;
    const total = power.reduce((s, e) => s + (parseFloat(e.state) || 0), 0);
    const dayKwh = energy.reduce((s, e) => s + (parseFloat(e.state) || 0), 0);
    const top = [...power].sort((a, b) => (parseFloat(b.state) || 0) - (parseFloat(a.state) || 0)).slice(0, 3);
    const html = `
      <article class="card energy-card" style="grid-column: span 2;">
        <div class="card-head"><span class="card-title">Energia</span>
          <div class="card-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg></div>
        </div>
        <div class="now">${total.toFixed(0)} W</div>
        <div class="day">${dayKwh.toFixed(2)} kWh hoje</div>
        ${top.length ? `<div class="top3">${top.map(t => `<div class="row"><span>${friendly(t.entity_id, t.entity_id)}</span><b>${parseFloat(t.state).toFixed(0)} W</b></div>`).join("")}</div>` : ""}
      </article>`;
    const grid = view.querySelector(".home-grid");
    if (grid) grid.insertAdjacentHTML("beforeend", html);
  }

  /* =========================================================
     #5 · Cenas/Scripts dinâmicos do HA
     #6 · Automações com toggle
     ========================================================= */
  function listByPrefix(prefix) {
    return Object.values(state.entities || {}).filter((e) => e.entity_id.startsWith(prefix));
  }
  async function openHaAutomationsModal() {
    const scenes = listByPrefix("scene.");
    const scripts = listByPrefix("script.");
    const autos = listByPrefix("automation.");
    openModal(`
      <div class="modal__head">
        <div><h2 class="modal__title">Automações da casa</h2><div class="modal__sub">Scenes · Scripts · Automations</div></div>
        <button class="modal__close" data-modal-close aria-label="Fechar">×</button>
      </div>
      ${scenes.length ? `<div class="modal__section"><div class="modal__label">Cenas (${scenes.length})</div><div class="ha-list">${scenes.map(s => `<div class="row"><div><div class="nm">${friendly(s.entity_id, s.entity_id)}</div><div class="sb">${s.entity_id}</div></div><button class="btn btn--lime" data-run-scene="${s.entity_id}">▶</button></div>`).join("")}</div></div>` : ""}
      ${scripts.length ? `<div class="modal__section"><div class="modal__label">Scripts (${scripts.length})</div><div class="ha-list">${scripts.map(s => `<div class="row"><div><div class="nm">${friendly(s.entity_id, s.entity_id)}</div><div class="sb">${s.entity_id}</div></div><button class="btn" data-run-script="${s.entity_id}">▶</button></div>`).join("")}</div></div>` : ""}
      ${autos.length ? `<div class="modal__section"><div class="modal__label">Automações (${autos.length})</div><div class="ha-list">${autos.map(a => `<div class="row ${a.state==='on'?'is-on':''}" data-auto="${a.entity_id}"><div><div class="nm">${friendly(a.entity_id, a.entity_id)}</div><div class="sb">${a.state==='on'?'Ativa':'Pausada'}</div></div><div class="sw" data-auto-toggle="${a.entity_id}"></div></div>`).join("")}</div></div>` : ""}
      ${!scenes.length && !scripts.length && !autos.length ? `<div class="notif-empty">Nenhuma cena/script/automação encontrada</div>` : ""}
    `);
    sheetEl.querySelectorAll("[data-run-scene]").forEach(b => b.onclick = async () => { try { await callService("scene", "turn_on", {}, { entity_id: b.dataset.runScene }); toast("Cena ativada", "ok"); } catch {} });
    sheetEl.querySelectorAll("[data-run-script]").forEach(b => b.onclick = async () => { try { await callService("script", "turn_on", {}, { entity_id: b.dataset.runScript }); toast("Script executado", "ok"); } catch {} });
    sheetEl.querySelectorAll("[data-auto-toggle]").forEach(b => b.onclick = async () => {
      const id = b.dataset.autoToggle;
      const row = sheetEl.querySelector(`[data-auto="${id}"]`);
      const wasOn = row?.classList.contains("is-on");
      try {
        await callService("automation", wasOn ? "turn_off" : "turn_on", {}, { entity_id: id });
        row?.classList.toggle("is-on");
        toast(wasOn ? "Automação pausada" : "Automação ativa", "ok");
      } catch {}
    });
  }

  /* =========================================================
     #9 · Alertas inteligentes de temperatura
     ========================================================= */
  const TEMP_ALERT = { min: 20, max: 24 };
  let lastTempAlert = 0;
  function checkBabyTempAlert() {
    const t = num(ENTITY_MAP.baby.temp, NaN);
    const fab = document.getElementById("fabBaby");
    if (!Number.isFinite(t) || !fab) return;
    const out = t < TEMP_ALERT.min || t > TEMP_ALERT.max;
    fab.classList.toggle("alert-temp", out);
    if (out && Date.now() - lastTempAlert > 10 * 60 * 1000) {
      lastTempAlert = Date.now();
      toast(`⚠ Quarto Esther ${t.toFixed(1)}° (fora de ${TEMP_ALERT.min}-${TEMP_ALERT.max}°)`, "err", 5000);
      bumpNotifDot?.();
    }
  }
  setInterval(checkBabyTempAlert, 30000);
  setTimeout(checkBabyTempAlert, 5000);

  /* =========================================================
     #10 · Talk-back placeholder (microfone via WebRTC)
     ========================================================= */
  let talkStream = null;
  async function toggleTalkBack(btn) {
    if (talkStream) {
      talkStream.getTracks().forEach(t => t.stop()); talkStream = null;
      btn.classList.remove("is-talking"); toast("Talk-back encerrado", "info");
      return;
    }
    try {
      talkStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      btn.classList.add("is-talking");
      toast("Falando no berço… (configure go2rtc para áudio bidirecional)", "info", 4000);
    } catch (err) {
      toast("Microfone não autorizado", "err");
    }
  }
  function injectTalkBackBtn() {
    if (state.route !== "baby") return;
    const cam = view.querySelector(".baby__cam");
    if (!cam || cam.querySelector(".talk-back")) return;
    const btn = document.createElement("button");
    btn.className = "talk-back";
    btn.title = "Falar no berço";
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 11a7 7 0 0 1-14 0"/><path d="M12 18v3"/></svg>`;
    btn.onclick = () => toggleTalkBack(btn);
    cam.appendChild(btn);
  }

  /* =========================================================
     #11 · Timeline berço (eventos recentes)
     ========================================================= */
  async function injectBabyTimeline() {
    if (state.route !== "baby") return;
    const ctrls = view.querySelector(".baby-ctrls");
    if (!ctrls || view.querySelector(".baby-timeline")) return;
    try {
      const since = new Date(Date.now() - 12 * 3600 * 1000).toISOString();
      const ents = [ENTITY_MAP.baby.occupied, ENTITY_MAP.baby.face].join(",");
      const data = await haFetch(`/api/logbook/${encodeURIComponent(since)}?entity=${ents}`);
      if (!Array.isArray(data) || !data.length) return;
      const items = data.slice(-10).reverse();
      const html = `<div class="baby-timeline">${items.map(it => {
        const ts = it.when ? new Date(it.when).toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit"}) : "";
        return `<div class="it"><span>${(it.message || it.state || "").slice(0,40)}</span><span class="ts">${ts}</span></div>`;
      }).join("")}</div>`;
      ctrls.insertAdjacentHTML("beforeend", html);
    } catch {}
  }

  /* =========================================================
     #12 · Capa de álbum no media
     ========================================================= */
  function decorateAlbumArt() {
    if (state.route !== "media") return;
    view.querySelectorAll(".player").forEach(card => {
      const id = card.dataset.entity;
      const ent = entity(id);
      const pic = ent?.attributes?.entity_picture;
      if (!pic || card.querySelector(".album-art")) return;
      const head = card.querySelector(".nm");
      if (!head) return;
      const wrap = document.createElement("div");
      wrap.className = "player-with-art";
      const art = document.createElement("div");
      art.className = "album-art";
      art.style.backgroundImage = `url("${pic}")`;
      const meta = document.createElement("div");
      meta.style.flex = "1";
      head.parentNode.insertBefore(wrap, head);
      wrap.appendChild(art); wrap.appendChild(meta);
      meta.appendChild(head);
      const np = card.querySelector(".nowplay");
      const ar = card.querySelector(".artist");
      if (np) meta.appendChild(np);
      if (ar) meta.appendChild(ar);
    });
  }

  /* =========================================================
     #14 · Join/Unjoin Echos
     ========================================================= */
  async function openJoinEchosModal() {
    const players = Object.values(state.entities).filter(e => e.entity_id.startsWith("media_player.echo"));
    openModal(`
      <div class="modal__head">
        <div><h2 class="modal__title">Sincronizar Echos</h2><div class="modal__sub">Tocar a mesma música em todos</div></div>
        <button class="modal__close" data-modal-close aria-label="Fechar">×</button>
      </div>
      <div class="modal__section">
        <div class="modal__label">Mestre (toca primeiro)</div>
        <div class="temp-row" id="echoMaster">${players.map(p => `<button class="temp-pill" data-master="${p.entity_id}">${friendly(p.entity_id, p.entity_id)}</button>`).join("")}</div>
      </div>
      <div class="modal__section">
        <div class="modal__label">Membros</div>
        <div class="temp-row" id="echoMembers">${players.map(p => `<button class="temp-pill" data-member="${p.entity_id}">${friendly(p.entity_id, p.entity_id)}</button>`).join("")}</div>
      </div>
      <div style="display:flex;gap:10px;">
        <button class="btn btn--lime" id="doJoin">Agrupar</button>
        <button class="btn" id="doUnjoin">Desagrupar tudo</button>
      </div>
    `);
    let master = null;
    sheetEl.querySelectorAll("[data-master]").forEach(b => b.onclick = () => {
      sheetEl.querySelectorAll("[data-master]").forEach(x => x.classList.remove("is-active"));
      b.classList.add("is-active"); master = b.dataset.master;
    });
    sheetEl.querySelectorAll("[data-member]").forEach(b => b.onclick = () => b.classList.toggle("is-active"));
    sheetEl.querySelector("#doJoin").onclick = async () => {
      const members = Array.from(sheetEl.querySelectorAll("[data-member].is-active")).map(b => b.dataset.member).filter(m => m !== master);
      if (!master || !members.length) { toast("Escolha mestre + membros", "err"); return; }
      try { await callService("media_player", "join", { group_members: members }, { entity_id: master }); toast("Agrupado", "ok"); closeModal(); } catch {}
    };
    sheetEl.querySelector("#doUnjoin").onclick = async () => {
      try {
        await Promise.allSettled(players.map(p => callService("media_player", "unjoin", {}, { entity_id: p.entity_id })));
        toast("Desagrupado", "ok"); closeModal();
      } catch {}
    };
  }

  /* =========================================================
     #16 · Qualidade do ar / CO2
     ========================================================= */
  function injectAqiCard() {
    if (state.route !== "climate") return;
    if (view.querySelector(".aqi-card")) return;
    const aqi = Object.values(state.entities).find(e =>
      ["aqi","carbon_dioxide","volatile_organic_compounds","pm25"].includes(e.attributes?.device_class) ||
      /co2|aqi|voc|pm25/.test(e.entity_id)
    );
    const grid = view.querySelector(".climate-grid");
    if (!grid) return;
    if (!aqi) {
      grid.insertAdjacentHTML("beforeend", `<article class="card stat-card aqi-card"><div class="label">Qualidade do ar</div><div class="value" style="font-size:18px;">Sem sensor</div><div class="delta">Adicione um Aqara/Awair</div></article>`);
      return;
    }
    const v = parseFloat(aqi.state) || 0;
    const unit = aqi.attributes?.unit_of_measurement || "";
    const pct = Math.min(100, Math.max(0, (v / 1000) * 100));
    grid.insertAdjacentHTML("beforeend", `<article class="card stat-card aqi-card"><div class="label">${friendly(aqi.entity_id, "Ar")}</div><div class="ring2" style="--p:${pct}"><div class="in">${v.toFixed(0)}</div></div><div class="delta">${unit}</div></article>`);
  }

  /* =========================================================
     #18 · persistent_notification do HA no sino
     ========================================================= */
  const _origFetchNotifications = typeof fetchNotifications === "function" ? fetchNotifications : null;
  if (_origFetchNotifications) {
    fetchNotifications = async function () {
      const base = await _origFetchNotifications();
      try {
        const persist = Object.values(state.entities)
          .filter(e => e.entity_id.startsWith("persistent_notification."))
          .map(e => ({
            when: e.last_changed,
            entity_id: e.entity_id,
            name: e.attributes?.title || "Aviso",
            message: e.attributes?.message || e.state,
          }));
        return [...persist, ...base].slice(0, 50);
      } catch { return base; }
    };
  }

  /* =========================================================
     #19 · Snapshot automático ao abrir porta
     ========================================================= */
  const SNAP_GAL_KEY = "auroraDoorSnaps";
  function getSnaps() { try { return JSON.parse(localStorage.getItem(SNAP_GAL_KEY) || "[]"); } catch { return []; } }
  function saveSnap(url) {
    const arr = getSnaps(); arr.unshift({ t: Date.now(), url });
    localStorage.setItem(SNAP_GAL_KEY, JSON.stringify(arr.slice(0, 10)));
  }
  let lastDoorState = null;
  setInterval(async () => {
    const cur = entityState(ENTITY_MAP.security.door);
    const houseMode = entityState(ENTITY_MAP.houseMode);
    if (cur === "on" && lastDoorState !== "on" && houseMode !== "Em casa" && houseMode !== "Dia") {
      try {
        const url = await fetchCameraFrame(HOME_CAMERAS[0].id);
        if (url) {
          // Convert blob URL to data URL for persistence
          const blob = await fetch(url).then(r => r.blob());
          const reader = new FileReader();
          reader.onload = () => { saveSnap(reader.result); toast("📸 Snapshot capturado (porta aberta)", "info"); };
          reader.readAsDataURL(blob);
        }
      } catch {}
    }
    lastDoorState = cur;
  }, 5000);
  function openDoorSnapsModal() {
    const arr = getSnaps();
    openModal(`
      <div class="modal__head">
        <div><h2 class="modal__title">Snapshots da porta</h2><div class="modal__sub">Últimos 10 eventos</div></div>
        <button class="modal__close" data-modal-close aria-label="Fechar">×</button>
      </div>
      ${arr.length ? `<div class="snap-grid">${arr.map(s => `<div><img src="${s.url}" alt="snap"/><div class="muted" style="font-size:11px;text-align:center;margin-top:4px;">${new Date(s.t).toLocaleString("pt-BR")}</div></div>`).join("")}</div>` : `<div class="notif-empty">Sem snapshots</div>`}
    `);
  }

  /* =========================================================
     #20 · Pessoas em casa
     ========================================================= */
  function injectPersonsCard() {
    if (state.route !== "home") return;
    if (view.querySelector(".persons-card")) return;
    const persons = Object.values(state.entities).filter(e => e.entity_id.startsWith("person."));
    if (!persons.length) return;
    const html = `<article class="card persons-card" style="grid-column: span 3;">
      <div class="card-head"><span class="card-title">Quem está em casa</span></div>
      <div class="persons-row" style="margin-top:10px;">
        ${persons.map(p => {
          const home = p.state === "home";
          const pic = p.attributes?.entity_picture;
          const initial = (p.attributes?.friendly_name || p.entity_id.split(".")[1] || "?")[0].toUpperCase();
          return `<div class="person-pill ${home ? "is-home" : "is-away"}"><div class="av" ${pic?`style="background-image:url('${pic}')"`:""}>${pic?"":initial}</div><span>${friendly(p.entity_id, p.entity_id)} · ${home?"em casa":"fora"}</span></div>`;
        }).join("")}
      </div>
    </article>`;
    const grid = view.querySelector(".home-grid");
    if (grid) grid.insertAdjacentHTML("beforeend", html);
  }

  /* =========================================================
     #21 · Drag-reorder dos cards da home
     #22 · Esconder cômodos
     ========================================================= */
  const ORDER_KEY = "auroraHomeOrder";
  const HIDDEN_KEY = "auroraHiddenRooms";
  function getOrder() { try { return JSON.parse(localStorage.getItem(ORDER_KEY) || "[]"); } catch { return []; } }
  function setOrder(o) { localStorage.setItem(ORDER_KEY, JSON.stringify(o)); }
  function getHiddenRooms() { try { return JSON.parse(localStorage.getItem(HIDDEN_KEY) || "[]"); } catch { return []; } }
  function setHiddenRooms(o) { localStorage.setItem(HIDDEN_KEY, JSON.stringify(o)); }

  function applyHomeLayout() {
    if (state.route !== "home") return;
    const grid = view.querySelector(".home-grid");
    if (!grid) return;
    // Hide rooms
    const hidden = getHiddenRooms();
    hidden.forEach(id => {
      grid.querySelectorAll(`[data-group-key="${id}"]`).forEach(el => el.style.display = "none");
    });
    // Apply saved order
    const order = getOrder();
    if (order.length) {
      const map = new Map();
      Array.from(grid.children).forEach(c => {
        const key = c.dataset.entity || c.dataset.cameraFullscreen || c.className;
        map.set(key, c);
      });
      order.forEach(k => { const el = map.get(k); if (el) grid.appendChild(el); });
    }
    // Make draggable
    Array.from(grid.children).forEach(card => {
      card.setAttribute("draggable", "true");
      card.addEventListener("dragstart", () => card.classList.add("dragging"));
      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
        const newOrder = Array.from(grid.children).map(c => c.dataset.entity || c.dataset.cameraFullscreen || c.className);
        setOrder(newOrder);
      });
      card.addEventListener("dragover", (e) => {
        e.preventDefault();
        const dragging = grid.querySelector(".dragging");
        if (!dragging || dragging === card) return;
        const rect = card.getBoundingClientRect();
        const after = (e.clientY - rect.top) > rect.height / 2;
        grid.insertBefore(dragging, after ? card.nextSibling : card);
      });
    });
  }

  /* =========================================================
     #24 · Modo quiosque
     ========================================================= */
  function applyKioskMode() {
    const s = getSettings();
    document.body.classList.toggle("is-kiosk", !!s.kiosk);
  }
  applyKioskMode();

  /* =========================================================
     #25 · Command Palette ⌘K
     ========================================================= */
  const cmdkEl = document.createElement("div");
  cmdkEl.className = "cmdk";
  cmdkEl.innerHTML = `<div class="cmdk__sheet"><input id="cmdkInput" placeholder="Buscar dispositivos, cenas, rotas… (Esc para sair)" autocomplete="off"/><div class="cmdk__list" id="cmdkList"></div></div>`;
  document.body.appendChild(cmdkEl);
  const cmdkInput = cmdkEl.querySelector("#cmdkInput");
  const cmdkList = cmdkEl.querySelector("#cmdkList");

  function buildCmdItems() {
    const items = [];
    ROUTES.forEach(r => items.push({ label: `Ir para ${r}`, kbd: r, run: () => go(r) }));
    items.push({ label: "Abrir Cenas", run: () => openScenesModal() });
    items.push({ label: "Modo da Casa", run: () => openHouseModeModal() });
    items.push({ label: "Notificações", run: () => openNotifModal() });
    items.push({ label: "Ajustes", run: () => openSettingsModal() });
    items.push({ label: "Calendário", run: () => openCalendarModal() });
    items.push({ label: "Listas (Todo)", run: () => openTodoModal() });
    items.push({ label: "Intercom (TTS)", run: () => openIntercomModal() });
    items.push({ label: "Auditoria", run: () => openAuditModal() });
    items.push({ label: "Auto. HA · Cenas/Scripts/Automações", run: () => openHaAutomationsModal() });
    items.push({ label: "Sincronizar Echos", run: () => openJoinEchosModal() });
    items.push({ label: "Snapshots da porta", run: () => openDoorSnapsModal() });
    Object.values(state.entities || {}).slice(0, 200).forEach(e => {
      if (e.entity_id.startsWith("light.") || e.entity_id.startsWith("switch.")) {
        items.push({ label: `Toggle: ${friendly(e.entity_id, e.entity_id)}`, kbd: e.entity_id, run: () => toggleEntity(e.entity_id) });
      }
    });
    return items;
  }
  function openCmdk() { cmdkEl.classList.add("is-on"); cmdkInput.value = ""; renderCmdk(""); cmdkInput.focus(); }
  function closeCmdk() { cmdkEl.classList.remove("is-on"); }
  function renderCmdk(q) {
    const items = buildCmdItems();
    const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    const nq = norm(q);
    const filtered = nq ? items.filter(i => norm(i.label).includes(nq) || norm(i.kbd || "").includes(nq)) : items;
    cmdkList.innerHTML = filtered.slice(0, 30).map((it, i) => `<div class="cmdk__item ${i===0?"is-active":""}" data-idx="${i}"><span>${it.label}</span>${it.kbd?`<span class="kbd">${it.kbd}</span>`:""}</div>`).join("");
    cmdkList.querySelectorAll(".cmdk__item").forEach(el => el.onclick = () => { filtered[+el.dataset.idx].run(); closeCmdk(); });
    cmdkList._items = filtered;
  }
  cmdkInput.addEventListener("input", (e) => renderCmdk(e.target.value));
  cmdkInput.addEventListener("keydown", (e) => {
    const items = cmdkList._items || [];
    const active = cmdkList.querySelector(".is-active");
    let idx = active ? +active.dataset.idx : 0;
    if (e.key === "Escape") closeCmdk();
    else if (e.key === "Enter") { items[idx]?.run(); closeCmdk(); }
    else if (e.key === "ArrowDown") { idx = Math.min(items.length - 1, idx + 1); cmdkList.querySelectorAll(".cmdk__item").forEach((el,i)=>el.classList.toggle("is-active", i===idx)); cmdkList.children[idx]?.scrollIntoView({block:"nearest"}); e.preventDefault(); }
    else if (e.key === "ArrowUp") { idx = Math.max(0, idx - 1); cmdkList.querySelectorAll(".cmdk__item").forEach((el,i)=>el.classList.toggle("is-active", i===idx)); cmdkList.children[idx]?.scrollIntoView({block:"nearest"}); e.preventDefault(); }
  });
  cmdkEl.addEventListener("click", (e) => { if (e.target === cmdkEl) closeCmdk(); });
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openCmdk(); }
  });
  // search input no topbar abre cmdk
  document.querySelector(".search input")?.addEventListener("focus", openCmdk);

  /* =========================================================
     #27 · PWA install + push
     ========================================================= */
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredPrompt = e; });
  async function tryInstallPWA() {
    if (!deferredPrompt) { toast("Já instalado ou navegador não suporta", "info"); return; }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    toast(outcome === "accepted" ? "Instalado!" : "Cancelado", "info");
    deferredPrompt = null;
  }
  async function tryPushNotif() {
    if (!("Notification" in window)) { toast("Sem suporte a notificações", "err"); return; }
    const perm = await Notification.requestPermission();
    if (perm === "granted") { new Notification("Casa", { body: "Notificações ativadas ✓" }); toast("Notificações ativadas", "ok"); }
    else toast("Permissão negada", "err");
  }
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/dashboard/sw.js").catch(() => {});
  }

  /* =========================================================
     Settings v3 — extensão do modal
     ========================================================= */
  const _origSettings = openSettingsModal;
  openSettingsModal = function () {
    _origSettings();
    const s = getSettings();
    const allRooms = Object.entries(ENTITY_MAP.groups);
    const hidden = getHiddenRooms();

    const sec = document.createElement("div");
    sec.className = "modal__section";
    sec.innerHTML = `
      <div class="modal__label">Servidor Home Assistant</div>
      <input id="haUrlInput" type="text" placeholder="https://meu-ha.duckdns.org (vazio = mesmo host)" value="${localStorage.getItem(HA_URL_KEY) || ""}" style="width:100%;padding:12px 14px;border-radius:14px;border:1px solid var(--glass-stroke);background:var(--glass-2);color:inherit;outline:none;" />
      <div style="display:flex;gap:10px;margin-top:8px;"><button class="btn btn--lime" id="saveHaUrl">Salvar URL</button><button class="btn" id="clearHaUrl">Limpar</button></div>
    `;
    sheetEl.appendChild(sec);
    sec.querySelector("#saveHaUrl").onclick = () => {
      const v = sec.querySelector("#haUrlInput").value.trim();
      if (v) localStorage.setItem(HA_URL_KEY, v); else localStorage.removeItem(HA_URL_KEY);
      toast("URL salva — recarregando", "ok"); setTimeout(() => location.reload(), 600);
    };
    sec.querySelector("#clearHaUrl").onclick = () => { localStorage.removeItem(HA_URL_KEY); location.reload(); };

    const roomsSec = document.createElement("div");
    roomsSec.className = "modal__section";
    roomsSec.innerHTML = `
      <div class="modal__label">Cômodos visíveis na Home</div>
      <div class="room-toggle-list">
        ${allRooms.map(([k, id]) => `<label><input type="checkbox" data-room="${id}" ${hidden.includes(id)?"":"checked"}/> ${k}</label>`).join("")}
      </div>
      <div class="muted" style="font-size:11px;margin-top:6px;">Arraste os cards na home para reordenar.</div>
    `;
    sheetEl.appendChild(roomsSec);
    roomsSec.querySelectorAll("[data-room]").forEach(cb => cb.onchange = () => {
      const id = cb.dataset.room;
      const cur = getHiddenRooms();
      const next = cb.checked ? cur.filter(x => x !== id) : [...cur, id];
      setHiddenRooms(next);
      if (state.route === "home") render();
    });

    const kioskSec = document.createElement("div");
    kioskSec.className = "modal__section";
    kioskSec.innerHTML = `
      <div class="modal__label">Modo quiosque (tablet)</div>
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="checkbox" id="kioskCb" ${s.kiosk?"checked":""}/> Esconder sidebar e barra de busca</label>
    `;
    sheetEl.appendChild(kioskSec);
    kioskSec.querySelector("#kioskCb").onchange = (e) => { setSettings({ kiosk: e.target.checked }); applyKioskMode(); };

    const moreSec = document.createElement("div");
    moreSec.className = "modal__section";
    moreSec.innerHTML = `
      <div class="modal__label">Mais</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        <button class="btn" id="openAutosBtn">Cenas/Scripts/Automações</button>
        <button class="btn" id="openEchosBtn">Sincronizar Echos</button>
        <button class="btn" id="openSnapsBtn">Snapshots porta</button>
        <button class="btn" id="installPwaBtn">Instalar app (PWA)</button>
        <button class="btn" id="enablePushBtn">Ativar notificações</button>
      </div>
    `;
    sheetEl.appendChild(moreSec);
    moreSec.querySelector("#openAutosBtn").onclick = () => { closeModal(); openHaAutomationsModal(); };
    moreSec.querySelector("#openEchosBtn").onclick = () => { closeModal(); openJoinEchosModal(); };
    moreSec.querySelector("#openSnapsBtn").onclick = () => { closeModal(); openDoorSnapsModal(); };
    moreSec.querySelector("#installPwaBtn").onclick = tryInstallPWA;
    moreSec.querySelector("#enablePushBtn").onclick = tryPushNotif;
  };

  /* =========================================================
     Hooks no render
     ========================================================= */
  const _origRender = render;
  render = function () {
    _origRender();
    setTimeout(() => {
      injectEnergyCard();
      injectPersonsCard();
      applyHomeLayout();
      injectAqiCard();
      decorateAlbumArt();
      injectTalkBackBtn();
      injectBabyTimeline();
      checkBabyTempAlert();
    }, 50);
  };

  // dispara hooks também no boot
  setTimeout(() => {
    injectEnergyCard();
    injectPersonsCard();
    applyHomeLayout();
    injectAqiCard();
    decorateAlbumArt();
    injectTalkBackBtn();
    injectBabyTimeline();
  }, 1500);

  console.log("[v3] expansion pack carregado ✓");
})();
