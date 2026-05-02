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

function roomCard(id, name = null, meta = "Grupo") {
  const label = name || friendly(id, id);
  return `
    <article class="card room-card ${isOn(id) ? "is-on" : ""}" data-entity="${id}">
      <div class="top"><div class="card-head"><span class="card-title">${meta}</span><div class="card-icon">${iconSvg("light")}</div></div></div>
      <div class="row"><div><div class="name">${label}</div><div class="stat">${formatState(id)}</div></div><button class="switch ${isOn(id) ? "is-on" : ""}" data-toggle="${id}"><span></span></button></div>
    </article>`;
}

function lightCard(item) {
  const label = friendly(item.id, item.name);
  const pct = brightnessPct(item.id);
  const status = pct != null && isOn(item.id) ? `${pct}%` : formatState(item.id);
  const fill = pct != null ? pct : (isOn(item.id) ? 88 : 22);
  return `
    <article class="card light-card" data-entity="${item.id}">
      <div class="top"><div><div class="nm">${label}</div><div class="sb">${item.subtitle} · ${status}</div></div><button class="switch ${isOn(item.id) ? "is-on" : ""}" data-toggle="${item.id}"><span></span></button></div>
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
  return `
    <div class="home-grid">
      <section class="card hero">
        <div class="hero__feed"><img class="hero__feed-img" data-camera-feed="${cam.id}" data-camera-slot="home" alt="Sinal da câmera" /></div>
        <div class="hero__overlay">
          <div class="hero__top"><div class="hero__tabs" data-home-camera-tabs>${HOME_CAMERAS.map((c) => `<button class="${c.id === cam.id ? "is-active" : ""}" data-home-camera="${c.id}">${c.label}</button>`).join("")}</div><span class="chip chip--live"><span class="dot"></span> Ao vivo</span></div>
          <div class="hero__bottom"><div><h3 class="hero__title">Casa</h3><div class="hero__meta" data-home-camera-meta>${cam.label} · ${condition} · ${temp}°C · modo ${entityState(ENTITY_MAP.houseMode, "Dia")}</div></div><div class="hero__actions"><button class="btn btn--ghost" data-route-go="baby">Babytracker</button></div></div>
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
    return [`<div class="card card--solid" style="grid-column:span 3;padding:12px 18px;"><h3 style="margin:0;font-family:var(--f-display);font-size:18px;text-transform:capitalize;">${roomTitle}</h3></div>`, ...filtered.map(lightCard)];
  });
  return `${sectionHead("Luzes", state.query ? `Resultados para \"${state.query}\"` : "Controles individuais por cômodo")}<div class="home-grid" style="grid-template-columns:repeat(3,1fr);">${blocks.join("") || `<article class="card card--solid"><h3 style="margin:0 0 8px;">Nada encontrado</h3><div class="muted">Nenhum dispositivo corresponde à busca.</div></article>`}</div>`;
}

function renderClimate() {
  const temp = num(ENTITY_MAP.climate.temp, 0);
  const hum = num(ENTITY_MAP.climate.humidity, 0);
  const esther = num(ENTITY_MAP.climate.estherTemp, 0);
  const compensated = num(ENTITY_MAP.climate.compensated, esther);
  return `${sectionHead("Clima", "Leituras da casa e do quarto da Esther")}<div class="climate-grid"><article class="card gauge-card"><div class="card-head"><span class="card-title">Casa</span><div class="card-icon">${iconSvg("temp")}</div></div><div class="gauge"><div class="gauge__dial" style="--p:${Math.max(10, Math.min(95, temp * 3.2))}"></div><div class="gauge__center"><strong>${temp.toFixed(1)}°</strong><span>Temperatura</span></div></div></article><article class="card stat-card"><div class="label">Umidade</div><div class="value">${hum.toFixed(0)}%</div><div class="delta">Conforto da casa</div></article><article class="card stat-card"><div class="label">Esther</div><div class="value">${esther.toFixed(1)}°</div><div class="delta">Compensada ${compensated.toFixed(1)}°</div></article></div>`;
}

function renderSecurity() {
  return `${sectionHead("Segurança", "Porta principal e alarme")}<div class="home-grid" style="grid-template-columns:2fr 1fr 1fr;"><article class="card hero" style="min-height:260px;"><div class="hero__feed"><img class="hero__feed-img" data-camera-feed="${ENTITY_MAP.baby.camera}" alt="Sinal da câmera" /></div><div class="hero__overlay"><div class="hero__top"><span class="chip chip--live"><span class="dot"></span> Monitoramento</span></div><div class="hero__bottom"><div><h3 class="hero__title">Porta principal</h3><div class="hero__meta">${formatState(ENTITY_MAP.security.door)}</div></div></div></div></article><article class="card stat-card"><div class="label">Alarme</div><div class="value">${formatState(ENTITY_MAP.security.alarm)}</div></article><article class="card stat-card"><div class="label">Porta</div><div class="value">${formatState(ENTITY_MAP.security.door)}</div></article></div>`;
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
  return `<div class="toggle-row ${isOn(id) ? "is-on" : ""}" data-entity="${id}"><div><div class="nm">${name}</div><div class="sb">${subtitle}</div></div><button class="switch ${isOn(id) ? "is-on" : ""}" data-toggle="${id}"><span></span></button></div>`;
}

function renderBaby() {
  const occ = isOn(ENTITY_MAP.baby.occupied);
  const noiseOn = isOn(ENTITY_MAP.baby.noise);
  const mediaId = ENTITY_MAP.baby.media;
  const mediaEnt = entity(mediaId);
  const mediaTitle = mediaEnt?.attributes?.media_title || friendly(mediaId, "Echo Quarto");
  const mediaArtist = mediaEnt?.attributes?.media_artist || formatState(mediaId);
  return `<div class="baby"><div class="baby__row1"><article class="card baby-card baby-status ${occ ? "is-occupied" : ""}"><div class="head"><div class="ttl">Status</div><div class="card-icon">${iconSvg("home")}</div></div><div><div class="sub">Ocupação do berço</div><div style="font-family:var(--f-display);font-size:28px;font-weight:700;margin-top:6px;">${occ ? "Ocupado" : "Livre"}</div></div><div class="face"><div class="av">E</div><div><div class="nm">${entityState(ENTITY_MAP.baby.face, "desconhecida")}</div><div class="tm">Última face reconhecida</div></div></div></article><article class="card baby-card baby-temp"><div class="head"><div class="ttl">Temperatura</div><div class="card-icon">${iconSvg("temp")}</div></div><div class="row"><div class="ring"><b>${num(ENTITY_MAP.baby.temp, 0).toFixed(1)}°</b></div><div><div class="sub">Atual</div><div style="font-family:var(--f-display);font-size:26px;font-weight:700;">${num(ENTITY_MAP.baby.temp, 0).toFixed(1)}°C</div><div class="sub" style="margin-top:8px;">Compensada ${entityState(ENTITY_MAP.baby.compensated, "--")}</div></div></div></article><article class="card baby-card baby-media ${entityState(mediaId) === "paused" ? "is-paused" : ""}" data-entity="${mediaId}"><div class="head"><div class="ttl">Mídia</div><div class="card-icon">${iconSvg("media")}</div></div><div class="nowplay">${mediaTitle}</div><div class="artist">${mediaArtist}</div><div class="ctrls"><button class="btn" data-media-prev="${mediaId}">◀</button><button class="pp" data-media-playpause="${mediaId}">${entityState(mediaId) === "playing" ? "❚❚" : "▶"}</button><div class="vol"><i></i><i></i><i></i><i></i></div></div></article><article class="card baby-card baby-noise ${noiseOn ? "is-on" : ""}" data-entity="${ENTITY_MAP.baby.noise}"><div class="head"><div class="ttl">Ruído branco</div><div class="card-icon">${iconSvg("noise")}</div></div><div class="wave"><svg viewBox="0 0 200 40" fill="none"><path d="M0 20c20 0 20-12 40-12s20 24 40 24 20-24 40-24 20 24 40 24 20-12 40-12" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".8"/></svg></div><div class="btns"><button class="${noiseOn ? "is-active" : ""}" data-script="${ENTITY_MAP.scripts.noiseOn}">Ligar</button><button class="${!noiseOn ? "is-active" : ""}" data-script="${ENTITY_MAP.scripts.noiseOff}">Parar</button></div></article><article class="card baby-card baby-ctrls"><div class="head"><div class="ttl">Controles</div><div class="card-icon">${iconSvg("light")}</div></div>${toggleRow(ENTITY_MAP.baby.teto, "Teto", "Luz principal")}${toggleRow(ENTITY_MAP.baby.led, "Led Esther", "Apoio")}${toggleRow(ENTITY_MAP.baby.heater, "Aquecedor", "Conforto")}</article></div><section class="card baby__cam"><div class="feed"><img class="feed-img" data-camera-feed="${ENTITY_MAP.baby.camera}" alt="Sinal da câmera" /></div><div class="ovl"><div class="top"><div><div class="nm">Berço</div><div class="meta">Quarto da Esther · ${occ ? "ocupado" : "livre"}</div></div><div class="acts"><span class="pill live"><span class="pulse"></span>Live</span><span class="pill">Sinal ativo</span></div></div><div class="bot"><div></div><div class="acts"><button class="btn btn--ghost" data-refresh-camera="${ENTITY_MAP.baby.camera}">Atualizar</button><button class="btn" data-route-go="security">Segurança</button></div></div></div></section></div>`;
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
document.addEventListener("pointerup", () => {
  const active = document.activeElement;
  if (!active) return;
  if (active === searchInput || active.tagName === "INPUT" || active.tagName === "TEXTAREA") return;
  if (typeof active.blur === "function") active.blur();
});

(async () => {
  const route = (location.hash || "#home").slice(1);
  state.route = ROUTES.includes(route) ? route : "home";
  await bootstrap();
})();
