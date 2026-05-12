const { useState, useEffect, useRef } = React;

function useViewport() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return { w, isMobile: w < 720, isTablet: w >= 720 && w < 1024, isDesktop: w >= 1024 };
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "clasico",
  "heroVariant": "split",
  "showStickyCTA": true,
  "campusFocus": "valle"
}/*EDITMODE-END*/;

const PALETTES = {
  clasico:   { bg: "#FBF5E6", ink: "#1A2A52", accent: "#F2B544", soft: "#F0E7CC", muted: "#5C5A55", forest: "#E45A3F" },
  marino:    { bg: "#F4F2EB", ink: "#0F2240", accent: "#E14B4B", soft: "#E6E2D3", muted: "#5A5C66", forest: "#F2B544" },
  pradera:   { bg: "#F2F4E8", ink: "#1F4022", accent: "#F2A93B", soft: "#DCE8C8", muted: "#5A6450", forest: "#E14B4B" },
  durazno:   { bg: "#FCEAE0", ink: "#3D1F4F", accent: "#E8536E", soft: "#F7D7C5", muted: "#6E5D6E", forest: "#F5BC4A" },
};

const CAMPUSES = [
  { id: "valle", name: "Valle Oriente", area: "San Pedro Garza García", levels: "Maternal · Preescolar · Primaria · Secundaria · Preparatoria", students: 1240, founded: 1998, hero: "Campus insignia, comunidad multicultural", lat: "25.6457", lng: "-100.3015" },
  { id: "carretera", name: "Carretera Nacional", area: "Monterrey Sur", levels: "Preescolar · Primaria · Secundaria · Preparatoria", students: 890, founded: 2008, hero: "Campus STEM, laboratorios de robótica e IA", lat: "25.5612", lng: "-100.2331" },
  { id: "cumbres", name: "Cumbres", area: "Monterrey Poniente", levels: "Maternal · Preescolar · Primaria · Secundaria", students: 760, founded: 2014, hero: "Campus deportivo, alianza con academias internacionales", lat: "25.7510", lng: "-100.4071" },
  { id: "santacat", name: "Santa Catarina", area: "Santa Catarina", levels: "Maternal · Preescolar · Primaria", levels2: "Secundaria (2027)", students: 420, founded: 2022, hero: "Nuevo campus, arquitectura sustentable", lat: "25.6790", lng: "-100.4580" },
];

const LEVELS = [
  { id: "maternal", name: "Maternal", ages: "1–2 años", line: "Apego, exploración sensorial y primer contacto con dos idiomas." },
  { id: "preescolar", name: "Preescolar", ages: "3–5 años", line: "Aprendizaje por proyectos. Juego, ciencia y curiosidad guiada." },
  { id: "primaria", name: "Primaria", ages: "6–11 años", line: "Bilingüismo activo, pensamiento computacional y arte." },
  { id: "secundaria", name: "Secundaria", ages: "12–14 años", line: "Tutoría personal, debate, modelos ONU y bachillerato puente." },
  { id: "prepa", name: "Preparatoria", ages: "15–17 años", line: "Doble certificación nacional + internacional. Mentoría universitaria." },
];

const PILLARS = [
  { tag: "01", title: "Bilingüismo vivido", line: "60% del día en inglés desde maternal. Certificación Cambridge y AP en prepa." },
  { tag: "02", title: "Mentoría 1:1", line: "Cada alumno con tutor académico y coach socioemocional. Grupos máximos de 22." },
  { tag: "03", title: "Pensamiento STEM", line: "Robótica, IA aplicada, biotecnología y emprendimiento desde primaria." },
  { tag: "04", title: "Bienestar integral", name: "Bienestar", line: "Psicología, nutrición y educación física integradas al currículo." },
];

const STATS = [
  { n: "98%", t: "ingreso a primera opción universitaria" },
  { n: "37", t: "universidades top del mundo en últimos 5 años" },
  { n: "C1", t: "nivel mínimo de inglés al egresar" },
  { n: "1:11", t: "ratio docente / alumno" },
];

const TESTIMONIALS = [
  { who: "Familia Treviño-García", role: "Padres · Secundaria", text: "Nuestro hijo pasó de odiar las matemáticas a competir en olimpiada nacional. El tutor le dio un propósito que ningún otro colegio había logrado." },
  { who: "Andrea M.", role: "Egresada generación 2024", text: "Llegué a McGill sin un solo curso extra de inglés. Monteclaro me preparó para defender ideas, no solo para pasar exámenes." },
  { who: "Familia Sáenz", role: "Padres · Preescolar Cumbres", text: "Buscábamos un colegio donde nuestra hija no perdiera la curiosidad. Aquí la encontramos jugando con un microscopio a los 4 años." },
];

const EVENTS = [
  { date: "18 May", weekday: "Lunes", campus: "Valle Oriente", title: "Open House Maternal & Preescolar", time: "09:00 — 11:30" },
  { date: "22 May", weekday: "Viernes", campus: "Carretera Nacional", title: "Tour Campus STEM (Primaria–Prepa)", time: "16:00 — 18:00" },
  { date: "29 May", weekday: "Viernes", campus: "Cumbres", title: "Open House Familias Nuevas", time: "10:00 — 12:00" },
  { date: "06 Jun", weekday: "Sábado", campus: "Santa Catarina", title: "Recorrido del campus sustentable", time: "10:00 — 12:00" },
];

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? h.scrollTop / max : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return p;
}

function Logo({ color = "currentColor", scale = 1 }) {
  // Stylized mountain mark for "Monteclaro"
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18 * scale }}>
      <svg width={28 * scale} height={28 * scale} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M2 26 L11 10 L17 19 L21 13 L30 26 Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" fill="none" />
        <circle cx="24" cy="7" r="2.2" fill={color} />
      </svg>
      <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 22 * scale, letterSpacing: -0.3, color }}>
        Monteclaro
      </span>
    </div>
  );
}

function StripedPlaceholder({ label, h = 280, tone = 'warm' }) {
  const c = tone === 'warm' ? '#D9CFBC' : '#C8C2B5';
  const c2 = tone === 'warm' ? '#CCC0A7' : '#B9B2A2';
  return (
    <div style={{
      height: h, width: '100%',
      background: `repeating-linear-gradient(135deg, ${c} 0 14px, ${c2} 14px 28px)`,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
      padding: 16, color: '#3a3530', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase',
      borderRadius: 18, position: 'relative', overflow: 'hidden',
    }}>
      <span style={{ background: 'rgba(244,239,230,0.85)', padding: '4px 8px', borderRadius: 2 }}>{label}</span>
    </div>
  );
}

const IMAGES = {
  hero:        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&auto=format&fit=crop&q=70",
  robotics:    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&auto=format&fit=crop&q=70",
  ceremony:    "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=900&auto=format&fit=crop&q=70",
  maternal:    "https://images.unsplash.com/photo-1588072432836-e10032774350?w=900&auto=format&fit=crop&q=70",
  preescolar:  "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=900&auto=format&fit=crop&q=70",
  primaria:    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=900&auto=format&fit=crop&q=70",
  secundaria:  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=900&auto=format&fit=crop&q=70",
  prepa:       "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&auto=format&fit=crop&q=70",
  art:         "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900&auto=format&fit=crop&q=70",
  reading:     "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&auto=format&fit=crop&q=70",
  science:     "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=900&auto=format&fit=crop&q=70",
  garden:      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&auto=format&fit=crop&q=70",
  sports:      "https://images.unsplash.com/photo-1529566652340-2c41a1eb6d93?w=900&auto=format&fit=crop&q=70",
  mentor:      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=900&auto=format&fit=crop&q=70",
  campusValle:  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=70",
  campusCarretera: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=70",
  campusCumbres: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1200&auto=format&fit=crop&q=70",
  campusSantaCat:"https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=1200&auto=format&fit=crop&q=70",
};

function Img({ src, alt, label, h = 280, tone = 'warm', radius = 18 }) {
  const [err, setErr] = useState(false);
  if (err || !src) return <StripedPlaceholder label={label || alt || 'Imagen'} h={h} tone={tone} />;
  return (
    <div style={{ height: h, width: '100%', borderRadius: radius, overflow: 'hidden', position: 'relative', background: 'var(--soft)' }}>
      <img src={src} alt={alt || ''} loading="lazy" onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  );
}

function TopNav({ p, onCta, onOpenAdmissions }) {
  const [open, setOpen] = useState(false);
  const { isMobile, isTablet } = useViewport();
  const scrolled = p > 0.005;
  const compact = isMobile || isTablet;
  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 90 }}>
        <div style={{ height: '100%', width: `${p * 100}%`, background: 'var(--accent)', transition: 'width 0.05s linear' }} />
      </div>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 80,
        padding: isMobile ? '12px 18px' : '14px 32px',
        background: scrolled || (compact && open) ? 'rgba(244,239,230,0.95)' : 'transparent',
        backdropFilter: scrolled || (compact && open) ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(16,28,42,0.08)' : '1px solid transparent',
        transition: 'all 0.25s ease',
      }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo scale={isMobile ? 0.85 : 1} />
          {!compact && (
            <nav style={{ display: 'flex', gap: 28, fontSize: 14, color: 'var(--ink)' }}>
              <a href="#filosofia" style={navLink}>Filosofía</a>
              <a href="#niveles" style={navLink}>Niveles</a>
              <a href="#campus" style={navLink}>Campus</a>
              <a href="#vida" style={navLink}>Vida escolar</a>
              <a href="#calendario" style={navLink}>Open house</a>
              <a href="#admisiones" style={navLink}>Admisiones</a>
            </nav>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
            {!compact && <button onClick={onOpenAdmissions} style={{ ...btnGhost, fontSize: 13 }}>Portal familias</button>}
            {!isMobile && (
              <button onClick={onCta} style={{ ...btnPrimary, fontSize: 13, padding: '10px 18px' }}>Agenda tu visita →</button>
            )}
            {compact && (
              <button onClick={() => setOpen(v => !v)} aria-label="Menú" style={{
                background: 'transparent', border: '1px solid rgba(16,28,42,0.18)',
                width: 42, height: 42, borderRadius: 999, cursor: 'pointer',
                display: 'grid', placeItems: 'center', color: 'var(--ink)',
              }}>
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                  <line x1="0" y1="1" x2="18" y2="1" stroke="currentColor" strokeWidth="1.6" style={{ transform: open ? 'translate(0, 5px) rotate(45deg)' : 'none', transformOrigin: 'center', transition: 'transform 0.2s' }}/>
                  <line x1="0" y1="11" x2="18" y2="11" stroke="currentColor" strokeWidth="1.6" style={{ transform: open ? 'translate(0, -5px) rotate(-45deg)' : 'none', transformOrigin: 'center', transition: 'transform 0.2s' }}/>
                </svg>
              </button>
            )}
          </div>
        </div>
        {compact && open && (
          <div style={{ paddingTop: 18, paddingBottom: 8, borderTop: '1px solid rgba(16,28,42,0.08)', marginTop: 12 }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 18, color: 'var(--ink)', maxWidth: 1320, margin: '0 auto' }}>
              {[['#filosofia','Filosofía'],['#niveles','Niveles'],['#campus','Campus'],['#vida','Vida escolar'],['#calendario','Open house'],['#admisiones','Admisiones']].map(([h,t]) => (
                <a key={h} href={h} onClick={() => setOpen(false)} style={{ ...navLink, padding: '12px 4px', borderBottom: '1px solid rgba(16,28,42,0.06)', fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 22 }}>{t}</a>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                <button onClick={() => { setOpen(false); onCta(); }} style={{ ...btnAccent, width: '100%' }}>Agenda tu visita →</button>
                <button onClick={() => { setOpen(false); onOpenAdmissions(); }} style={{ ...btnGhost, width: '100%' }}>Portal familias</button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

const navLink = { color: 'inherit', textDecoration: 'none', fontWeight: 500, opacity: 0.85 };
const btnPrimary = {
  background: 'var(--ink)', color: 'var(--bg)', border: 'none',
  padding: '14px 22px', borderRadius: 999, cursor: 'pointer',
  fontWeight: 500, fontFamily: 'inherit', fontSize: 14, letterSpacing: 0.1,
  transition: 'transform 0.15s ease, background 0.2s ease',
};
const btnAccent = { ...btnPrimary, background: 'var(--accent)', color: '#fff' };
const btnGhost = {
  background: 'transparent', color: 'var(--ink)', border: '1px solid rgba(16,28,42,0.18)',
  padding: '10px 18px', borderRadius: 999, cursor: 'pointer',
  fontWeight: 500, fontFamily: 'inherit', fontSize: 14,
};

function Hero({ variant, onCta }) {
  const { isMobile, isTablet } = useViewport();
  const split = variant === 'split' && !isMobile;
  return (
    <section style={{ padding: isMobile ? '110px 20px 40px' : '140px 32px 60px', position: 'relative' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gridTemplateColumns: split ? (isTablet ? '1fr 1fr' : '1.15fr 1fr') : '1fr', gap: isMobile ? 32 : 48, alignItems: 'end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 28 }}>
            <span style={{ width: 24, height: 1, background: 'var(--muted)' }}></span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }}></span>
              Colegio bilingüe · 4 campus en Nuevo León · Desde 1998
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Bricolage Grotesque, sans-serif',
            fontSize: 'clamp(56px, 7vw, 116px)',
            lineHeight: 0.95, letterSpacing: -0.02, margin: 0,
            color: 'var(--ink)', textWrap: 'pretty',
          }}>
            Educar con<br />
            <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>vista al futuro,</span><br />
            raíces en casa.
          </h1>
          <p style={{ maxWidth: 540, marginTop: 32, fontSize: 18, lineHeight: 1.55, color: 'var(--muted)' }}>
            Cuatro campus en Nuevo León. Un mismo modelo bilingüe, mentoría 1:1 y un currículo que prepara a tus hijos para las universidades del mundo — sin que dejen de ser de aquí.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
            <button onClick={onCta} style={btnAccent}>Agenda tu visita →</button>
            <button style={btnGhost}>Descarga el folleto 2026–27</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr 1fr' : 'repeat(3, auto)', gap: isMobile ? 20 : 32, marginTop: isMobile ? 40 : 56, paddingTop: 24, borderTop: '1px solid rgba(16,28,42,0.1)' }}>
            {STATS.slice(0, 3).map(s => (
              <div key={s.t}>
                <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: isMobile ? 30 : 40, lineHeight: 1, color: 'var(--ink)' }}>{s.n}</div>
                <div style={{ fontSize: isMobile ? 11 : 12, color: 'var(--muted)', marginTop: 6, maxWidth: 160 }}>{s.t}</div>
              </div>
            ))}
          </div>
        </div>
        {split && (
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'relative', borderRadius: 6, overflow: 'hidden' }}>
              <Img src={IMAGES.hero} alt="Alumnos en patio principal Valle Oriente" h={isTablet ? 380 : 520} />
              <div style={{
                position: 'absolute', bottom: 20, right: 20,
                background: 'var(--bg)', padding: '18px 22px', borderRadius: 999,
                fontSize: 12, color: 'var(--ink)', maxWidth: 220,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>4 campus · 3,310 alumnos</div>
                <div style={{ color: 'var(--muted)' }}>Comunidad activa en San Pedro, Monterrey y Santa Catarina.</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              <Img src={IMAGES.robotics} alt="Clase de robótica" h={180} />
              <Img src={IMAGES.ceremony} alt="Ceremonia preescolar" h={180} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function MarqueeStrip() {
  const items = ["Acreditación Cambridge", "IB Candidate School", "Doble certificación AP", "Modelo ONU desde secundaria", "Plataforma Monteclaro Family App", "Cinco generaciones de egresados"];
  return (
    <div style={{ borderTop: '1px solid rgba(16,28,42,0.1)', borderBottom: '1px solid rgba(16,28,42,0.1)', padding: '18px 0', overflow: 'hidden', background: 'var(--soft)' }}>
      <div style={{ display: 'flex', gap: 56, animation: 'mc-scroll 40s linear infinite', whiteSpace: 'nowrap', fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--ink)' }}>
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 56 }}>
            <span>{it}</span>
            <span style={{ opacity: 0.55, color: 'var(--accent)' }}>●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Pillars() {
  const { isMobile, isTablet } = useViewport();
  return (
    <section id="filosofia" style={{ padding: isMobile ? '80px 20px 60px' : '120px 32px 80px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr', gap: isMobile ? 24 : 64, alignItems: 'start', marginBottom: isMobile ? 40 : 64 }}>
          <div>
            <div style={sectionLabel}>Filosofía</div>
            <h2 style={h2Style}>Cuatro convicciones que <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>no negociamos.</span></h2>
          </div>
          <p style={{ fontSize: isMobile ? 16 : 20, lineHeight: 1.5, color: 'var(--ink)', textWrap: 'pretty' }}>
            Monteclaro nació en 1998 con la idea de que un colegio regiomontano podía estar a la altura de los mejores del mundo sin perder el calor de casa. Hoy lo sostienen cuatro pilares que viven en cada salón, cada campus y cada conversación con una familia.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12, borderRadius: 24, overflow: 'hidden' }}>
          {PILLARS.map((p, i) => {
            const tints = ['var(--accent)', 'var(--forest)', 'var(--ink)', 'var(--soft)'];
            const fgs   = ['#fff',          'var(--ink)',     'var(--bg)',    'var(--ink)'];
            return (
              <div key={p.tag} style={{
                background: tints[i % 4], color: fgs[i % 4],
                padding: '40px 28px', minHeight: 320,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 32, fontWeight: 700, opacity: 0.85 }}>{p.tag}</div>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
                    <circle cx="16" cy="16" r="6" fill="currentColor" opacity="0.85"/>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 30, lineHeight: 1.05, margin: '0 0 12px', fontWeight: 600 }}>{p.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.85, margin: 0 }}>{p.line}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Levels() {
  const [active, setActive] = useState('primaria');
  const cur = LEVELS.find(l => l.id === active);
  const { isMobile, isTablet } = useViewport();
  return (
    <section id="niveles" style={{ padding: isMobile ? '60px 20px 80px' : '80px 32px 100px', background: 'var(--soft)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={sectionLabel}>Niveles</div>
            <h2 style={h2Style}>De la primera palabra<br />a la primera tesis.</h2>
          </div>
          <p style={{ maxWidth: 360, fontSize: 15, lineHeight: 1.55, color: 'var(--muted)' }}>
            Un solo colegio, cinco etapas pensadas como un solo viaje. Selecciona una para conocer su modelo.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)', gap: 8, marginBottom: isMobile ? 20 : 32 }}>
          {LEVELS.map((l, i) => (
            <button key={l.id} onClick={() => setActive(l.id)} style={{
              textAlign: 'left', padding: isMobile ? '14px 14px' : '20px 18px', borderRadius: 18, cursor: 'pointer',
              background: active === l.id ? 'var(--ink)' : 'var(--bg)',
              color: active === l.id ? 'var(--bg)' : 'var(--ink)',
              border: '1px solid rgba(16,28,42,0.12)', fontFamily: 'inherit',
              transition: 'all 0.2s ease',
            }}>
              <div style={{ fontSize: 11, letterSpacing: 1, opacity: 0.6, textTransform: 'uppercase' }}>0{i + 1}</div>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: isMobile ? 20 : 26, marginTop: 6 }}>{l.name}</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{l.ages}</div>
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: isMobile ? 20 : 32, background: 'var(--bg)', padding: isMobile ? 20 : 32, borderRadius: 18, border: '1px solid rgba(16,28,42,0.12)' }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)' }}>{cur.ages}</div>
            <h3 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: isMobile ? 40 : 56, lineHeight: 1, margin: '8px 0 16px' }}>{cur.name}</h3>
            <p style={{ fontSize: isMobile ? 15 : 18, lineHeight: 1.5, color: 'var(--ink)', maxWidth: 480 }}>{cur.line}</p>
            <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button style={btnPrimary}>Ver plan de estudios</button>
              <button style={btnGhost}>Hablar con coordinación</button>
            </div>
          </div>
          <Img src={IMAGES[cur.id] || IMAGES.primaria} alt={`Alumnos de ${cur.name}`} h={isMobile ? 220 : 320} />
        </div>
      </div>
    </section>
  );
}

function CampusComparator({ focus, setFocus }) {
  const cur = CAMPUSES.find(c => c.id === focus) || CAMPUSES[0];
  const { isMobile, isTablet } = useViewport();
  return (
    <section id="campus" style={{ padding: isMobile ? '80px 20px' : '120px 32px 100px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={sectionLabel}>Cuatro campus</div>
            <h2 style={h2Style}>Cerca de casa,<br /><span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>lejos del promedio.</span></h2>
          </div>
          <p style={{ maxWidth: 380, fontSize: 15, lineHeight: 1.55, color: 'var(--muted)' }}>
            Elige el campus por ubicación, etapa educativa o enfoque. Todos comparten el mismo modelo Monteclaro y traslado entre campus garantizado.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '260px 1fr' : '320px 1fr', gap: 1, background: 'rgba(16,28,42,0.12)', border: '1px solid rgba(16,28,42,0.12)', borderRadius: 18, overflow: 'hidden' }}>
          <div style={{ background: 'var(--bg)', display: isMobile ? 'grid' : 'flex', gridTemplateColumns: isMobile ? '1fr 1fr' : undefined, flexDirection: isMobile ? undefined : 'column' }}>
            {CAMPUSES.map(c => (
              <button key={c.id} onClick={() => setFocus(c.id)} style={{
                textAlign: 'left', padding: '24px 20px', cursor: 'pointer',
                background: focus === c.id ? 'var(--ink)' : 'transparent',
                color: focus === c.id ? 'var(--bg)' : 'var(--ink)',
                border: 'none', borderBottom: '1px solid rgba(16,28,42,0.08)',
                fontFamily: 'inherit', flex: 1, position: 'relative',
              }}>
                <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.6 }}>Campus {focus === c.id ? '↘' : ''}</div>
                <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 28, marginTop: 4 }}>{c.name}</div>
                <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>{c.area}</div>
              </button>
            ))}
          </div>
          <div style={{ background: 'var(--bg)', padding: isMobile ? 20 : 32, position: 'relative' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 24, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--muted)' }}>Distintivo</div>
                <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: isMobile ? 22 : 28, lineHeight: 1.1, marginTop: 8 }}>{cur.hero}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--muted)' }}>Alumnos</div>
                  <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 36, marginTop: 4 }}>{cur.students.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--muted)' }}>Fundación</div>
                  <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 36, marginTop: 4 }}>{cur.founded}</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Niveles disponibles</div>
            <div style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 6 }}>{cur.levels}</div>
            {cur.levels2 && <div style={{ fontSize: 13, color: 'var(--accent)', fontStyle: 'italic' }}>Próximamente: {cur.levels2}</div>}
            <div style={{ marginTop: 24, position: 'relative' }}>
              <Img src={({valle:IMAGES.campusValle,carretera:IMAGES.campusCarretera,cumbres:IMAGES.campusCumbres,santacat:IMAGES.campusSantaCat})[cur.id]} alt={cur.name} h={isMobile ? 200 : 280} />
              {/* faux pin */}
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 0 8px rgba(184,86,56,0.25)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              <button style={btnAccent}>Visitar este campus →</button>
              <button style={btnGhost}>Llamar al campus</button>
              <button style={btnGhost}>WhatsApp · admisiones</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VidaEscolar() {
  const { isMobile } = useViewport();
  const items = [
    { t: 'Equipo robótica gana nacional FIRST 2026', cat: 'Logros', src: IMAGES.robotics },
    { t: 'Festival bilingüe de poesía primaria', cat: 'Cultura', src: IMAGES.reading },
    { t: 'Programa de mentoría con egresados en Cornell, Tec y UNAM', cat: 'Mentoría', src: IMAGES.mentor },
    { t: 'Nuevo huerto urbano en Santa Catarina', cat: 'Sustentabilidad', src: IMAGES.garden },
    { t: 'Selección de fútbol llega a final estatal', cat: 'Deportes', src: IMAGES.sports },
    { t: 'Festival de arte primaria · expo en Mty', cat: 'Arte', src: IMAGES.art },
  ];
  return (
    <section id="vida" style={{ padding: isMobile ? '80px 0' : '120px 0 100px', background: 'var(--ink)', color: 'var(--bg)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 56, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ ...sectionLabel, color: 'rgba(244,239,230,0.6)' }}>Vida escolar</div>
            <h2 style={{ ...h2Style, color: 'var(--bg)' }}>Lo que está pasando<br /><span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>esta semana.</span></h2>
          </div>
          <button style={{ ...btnGhost, color: 'var(--bg)', borderColor: 'rgba(244,239,230,0.3)' }}>Ver todas las noticias</button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: isMobile ? '0 20px' : '0 32px', scrollbarWidth: 'none' }}>
        {items.map((it, i) => (
          <article key={i} style={{ minWidth: isMobile ? 260 : 320, maxWidth: isMobile ? 260 : 320, background: 'rgba(244,239,230,0.06)', padding: 20, borderRadius: 18, border: '1px solid rgba(244,239,230,0.1)' }}>
            <Img src={it.src} alt={it.t} h={200} />
            <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--accent)', marginTop: 16 }}>{it.cat}</div>
            <h3 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, lineHeight: 1.15, margin: '8px 0 0' }}>{it.t}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

function Numbers() {
  const { isMobile, isTablet } = useViewport();
  const cols = isMobile ? 2 : isTablet ? 2 : 4;
  return (
    <section style={{ padding: isMobile ? '80px 20px' : '120px 32px', background: 'var(--soft)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={sectionLabel}>En números</div>
        <h2 style={{ ...h2Style, marginBottom: isMobile ? 40 : 64 }}>Los datos que importan<br />a una familia.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 0, borderTop: '1px solid rgba(16,28,42,0.15)' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ padding: isMobile ? '28px 16px 16px 0' : '40px 24px 0 0', borderRight: (i % cols) < (cols - 1) ? '1px solid rgba(16,28,42,0.15)' : 'none', borderBottom: isMobile && i < 2 ? '1px solid rgba(16,28,42,0.15)' : 'none' }}>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 'clamp(64px, 6vw, 110px)', lineHeight: 0.95, color: 'var(--ink)' }}>{s.n}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 16, maxWidth: 220 }}>{s.t}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];
  const { isMobile } = useViewport();
  return (
    <section style={{ padding: isMobile ? '70px 20px' : '120px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={sectionLabel}>Familias Monteclaro</div>
        <blockquote style={{
          fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 'clamp(36px, 4vw, 64px)',
          lineHeight: 1.15, margin: '24px 0 32px', color: 'var(--ink)', textWrap: 'pretty',
        }}>
          &ldquo;{t.text}&rdquo;
        </blockquote>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(16,28,42,0.15)', paddingTop: 20 }}>
          <div>
            <div style={{ fontWeight: 600 }}>{t.who}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{t.role}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {TESTIMONIALS.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} aria-label={`Testimonio ${idx + 1}`} style={{
                width: 32, height: 4, borderRadius: 2, border: 'none', cursor: 'pointer',
                background: idx === i ? 'var(--ink)' : 'rgba(16,28,42,0.2)',
              }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Calendar() {
  const [picked, setPicked] = useState(0);
  const { isMobile, isTablet } = useViewport();
  return (
    <section id="calendario" style={{ padding: isMobile ? '70px 20px' : '120px 32px', background: 'var(--soft)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={sectionLabel}>Open house</div>
            <h2 style={h2Style}>Conoce Monteclaro<br /><span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>en persona.</span></h2>
          </div>
          <p style={{ maxWidth: 360, fontSize: 15, lineHeight: 1.55, color: 'var(--muted)' }}>
            Recibe un recorrido guiado por una familia actual, conoce al coordinador del nivel y vive un día Monteclaro.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1.2fr 1fr' : '1.5fr 1fr', gap: isMobile ? 20 : 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(16,28,42,0.12)', border: '1px solid rgba(16,28,42,0.12)' }}>
            {EVENTS.map((e, i) => (
              <button key={i} onClick={() => setPicked(i)} style={{
                background: picked === i ? 'var(--ink)' : 'var(--bg)',
                color: picked === i ? 'var(--bg)' : 'var(--ink)',
                border: 'none', textAlign: 'left', cursor: 'pointer',
                padding: isMobile ? '18px 18px' : '24px 28px',
                display: 'grid',
                gridTemplateColumns: isMobile ? '78px 1fr auto' : '120px 1fr auto',
                gap: isMobile ? 14 : 24, alignItems: 'center', fontFamily: 'inherit',
              }}>
                <div>
                  <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: isMobile ? 22 : 32, lineHeight: 1 }}>{e.date}</div>
                  <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{e.weekday}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.6 }}>{e.campus}</div>
                  <div style={{ fontSize: isMobile ? 15 : 18, marginTop: 4 }}>{e.title}</div>
                  <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>{e.time}</div>
                </div>
                <div style={{ fontSize: 24, opacity: 0.6 }}>→</div>
              </button>
            ))}
          </div>
          <aside style={{ background: 'var(--ink)', color: 'var(--bg)', padding: isMobile ? 24 : 32, borderRadius: 18, position: isMobile ? 'static' : 'sticky', top: 100, alignSelf: 'start' }}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.6 }}>Reserva tu lugar</div>
            <h3 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 36, lineHeight: 1.05, margin: '12px 0 20px' }}>
              {EVENTS[picked].title}
            </h3>
            <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 6 }}>{EVENTS[picked].date} · {EVENTS[picked].time}</div>
            <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 24 }}>Campus {EVENTS[picked].campus}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <input placeholder="Nombre del padre/madre" style={inputDark} />
              <input placeholder="Correo" style={inputDark} />
              <input placeholder="Teléfono / WhatsApp" style={inputDark} />
            </div>
            <button style={{ ...btnAccent, width: '100%' }}>Reservar mi visita →</button>
            <div style={{ fontSize: 11, opacity: 0.6, marginTop: 14, lineHeight: 1.5 }}>
              Recibirás confirmación por WhatsApp en menos de una hora hábil. Cupo limitado a 12 familias por sesión.
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

const inputDark = {
  background: 'rgba(244,239,230,0.08)', border: '1px solid rgba(244,239,230,0.2)',
  borderRadius: 2, padding: '12px 14px', color: 'var(--bg)', fontFamily: 'inherit', fontSize: 14, outline: 'none',
};

function AdmissionsFunnel({ onCta }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const { isMobile } = useViewport();
  const steps = [
    { q: '¿Para qué nivel buscas colegio?', opts: ['Maternal', 'Preescolar', 'Primaria', 'Secundaria', 'Preparatoria'], key: 'nivel' },
    { q: '¿Cuándo te gustaría que inicie?', opts: ['Agosto 2026', 'Enero 2027', 'Más adelante', 'Sólo estoy explorando'], key: 'inicio' },
    { q: '¿Qué campus está más cerca?', opts: CAMPUSES.map(c => c.name), key: 'campus' },
  ];
  const done = step >= steps.length;
  return (
    <section id="admisiones" style={{ padding: isMobile ? '80px 20px' : '140px 32px', background: 'var(--ink)', color: 'var(--bg)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ ...sectionLabel, color: 'rgba(244,239,230,0.6)' }}>Admisiones 2026 – 2027</div>
        <h2 style={{ ...h2Style, color: 'var(--bg)', maxWidth: 900 }}>
          Tres minutos para saber<br /><span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>si Monteclaro es para ustedes.</span>
        </h2>
        <div style={{ marginTop: isMobile ? 32 : 48, background: 'rgba(244,239,230,0.05)', borderRadius: 18, padding: isMobile ? 20 : 32, border: '1px solid rgba(244,239,230,0.1)' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
            {steps.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? 'var(--accent)' : 'rgba(244,239,230,0.15)' }} />
            ))}
          </div>
          {!done ? (
            <div>
              <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.6, marginBottom: 12 }}>Paso {step + 1} de {steps.length}</div>
              <h3 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: isMobile ? 28 : 42, lineHeight: 1.1, margin: '0 0 24px' }}>{steps[step].q}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {steps[step].opts.map(opt => {
                  const sel = answers[steps[step].key] === opt;
                  return (
                    <button key={opt} onClick={() => {
                      setAnswers({ ...answers, [steps[step].key]: opt });
                      setTimeout(() => setStep(step + 1), 220);
                    }} style={{
                      padding: '14px 22px', borderRadius: 999, cursor: 'pointer',
                      background: sel ? 'var(--accent)' : 'transparent',
                      color: sel ? '#fff' : 'var(--bg)',
                      border: '1px solid ' + (sel ? 'var(--accent)' : 'rgba(244,239,230,0.3)'),
                      fontFamily: 'inherit', fontSize: 15,
                      transition: 'all 0.18s ease',
                    }}>{opt}</button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.6, marginBottom: 12 }}>Perfecto</div>
              <h3 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: isMobile ? 30 : 48, lineHeight: 1.05, margin: '0 0 16px' }}>
                Lugar disponible en <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>{answers.campus}</span> para {answers.nivel?.toLowerCase()} en {answers.inicio?.toLowerCase()}.
              </h3>
              <p style={{ fontSize: 17, lineHeight: 1.5, opacity: 0.85, maxWidth: 680, marginBottom: 32 }}>
                Te llamamos hoy en menos de 4 horas hábiles para confirmar tu visita y resolver dudas sobre proceso, costos y becas Monteclaro.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button onClick={onCta} style={btnAccent}>Agenda mi visita →</button>
                <button onClick={() => { setStep(0); setAnswers({}); }} style={{ ...btnGhost, color: 'var(--bg)', borderColor: 'rgba(244,239,230,0.3)' }}>Empezar otra vez</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { isMobile, isTablet } = useViewport();
  return (
    <footer style={{ background: 'var(--bg)', borderTop: '1px solid rgba(16,28,42,0.12)', padding: isMobile ? '48px 20px 24px' : '64px 32px 32px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1.4fr 1fr 1fr 1fr', gap: isMobile ? 32 : 48, marginBottom: isMobile ? 32 : 48 }}>
          <div>
            <Logo />
            <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 320, marginTop: 16, lineHeight: 1.55 }}>
              Cuatro campus, una misma comunidad. Formando regiomontanos para el mundo desde 1998.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              {['IG', 'FB', 'YT', 'LI'].map(s => (
                <a key={s} href="#" style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(16,28,42,0.18)', display: 'grid', placeItems: 'center', textDecoration: 'none', color: 'var(--ink)', fontSize: 11, fontWeight: 600 }}>{s}</a>
              ))}
            </div>
          </div>
          {[
            { h: 'Campus', items: CAMPUSES.map(c => c.name) },
            { h: 'Familias', items: ['Portal padres', 'Calendario', 'Plataforma académica', 'Comedor', 'Transporte'] },
            { h: 'Comunidad', items: ['Egresados', 'Empleo', 'Becas Monteclaro', 'Prensa', 'Contacto'] },
          ].map(col => (
            <div key={col.h}>
              <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>{col.h}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.items.map(it => <li key={it}><a href="#" style={{ color: 'var(--ink)', textDecoration: 'none', fontSize: 14 }}>{it}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 0, justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', paddingTop: 24, borderTop: '1px solid rgba(16,28,42,0.12)', fontSize: 12, color: 'var(--muted)' }}>
          <div>© 2026 Colegio Monteclaro · Nuevo León, México · RVOE SEP</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="#" style={{ color: 'inherit' }}>Aviso de privacidad</a>
            <a href="#" style={{ color: 'inherit' }}>Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function StickyCTA({ onCta }) {
  const { isMobile } = useViewport();
  return (
    <div style={{ position: 'fixed', bottom: isMobile ? 14 : 24, right: isMobile ? 14 : 24, left: isMobile ? 14 : 'auto', zIndex: 70, display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: 10, alignItems: isMobile ? 'stretch' : 'flex-end', justifyContent: isMobile ? 'space-between' : 'flex-start' }}>
      <a href="#" style={{
        background: '#25D366', color: '#fff', padding: '12px 18px', borderRadius: 999,
        textDecoration: 'none', fontWeight: 500, fontSize: isMobile ? 13 : 14, display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)', justifyContent: 'center', flex: isMobile ? 1 : 'initial',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4l-2.3-1.1c-.3-.1-.7 0-.9.2l-1 1.1c-1.6-.8-2.9-2.1-3.7-3.7l1.1-1c.3-.2.4-.6.2-.9L9.6 6.5c-.2-.3-.6-.5-1-.4L6.7 6.6c-.4.1-.7.5-.7 1 .3 4 3.4 7.1 7.4 7.4.4 0 .8-.3 1-.7l.5-1.5c.1-.4-.1-.8-.4-1z"/></svg>
        {isMobile ? 'WhatsApp' : 'WhatsApp admisiones'}
      </a>
      <button onClick={onCta} style={{ ...btnAccent, boxShadow: '0 8px 24px rgba(184,86,56,0.3)', flex: isMobile ? 1 : 'initial', fontSize: isMobile ? 13 : 14 }}>Agenda tu visita →</button>
    </div>
  );
}

function VisitDialog({ open, onClose }) {
  const [step, setStep] = useState(0);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(16,28,42,0.6)', backdropFilter: 'blur(4px)',
      zIndex: 100, display: 'grid', placeItems: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg)', borderRadius: 18, padding: 'clamp(24px, 5vw, 40px)', maxWidth: 520, width: '100%',
        position: 'relative', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <button onClick={onClose} aria-label="Cerrar" style={{
          position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 20,
        }}>×</button>
        {step === 0 ? (
          <>
            <div style={sectionLabel}>Agenda tu visita</div>
            <h3 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 'clamp(28px, 4.5vw, 40px)', lineHeight: 1.05, margin: '8px 0 8px' }}>
              Una visita, <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>cero compromiso.</span>
            </h3>
            <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 28, lineHeight: 1.55 }}>
              Te contactamos en menos de 4 horas hábiles para coordinar día, hora y campus.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <input placeholder="Nombre completo" style={inputLight} />
              <input placeholder="Correo" style={inputLight} />
              <input placeholder="WhatsApp · (81) ..." style={inputLight} />
              <select style={inputLight}>
                <option>Campus de interés...</option>
                {CAMPUSES.map(c => <option key={c.id}>{c.name}</option>)}
              </select>
              <select style={inputLight}>
                <option>Nivel del alumno...</option>
                {LEVELS.map(l => <option key={l.id}>{l.name}</option>)}
              </select>
            </div>
            <button onClick={() => setStep(1)} style={{ ...btnAccent, width: '100%' }}>Enviar solicitud →</button>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 12, lineHeight: 1.5 }}>
              Al continuar aceptas nuestro aviso de privacidad. No te enviaremos spam ni cederemos tus datos.
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', margin: '0 auto 20px', fontSize: 28 }}>✓</div>
            <h3 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 36, lineHeight: 1.1, margin: 0 }}>Recibimos tu solicitud.</h3>
            <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 12, lineHeight: 1.55 }}>
              Sofía, de admisiones, te llamará hoy mismo. Mientras tanto, prepara tus preguntas — nos encanta responderlas todas.
            </p>
            <button onClick={onClose} style={{ ...btnPrimary, marginTop: 24 }}>Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
}

const inputLight = {
  background: 'var(--soft)', border: '1px solid rgba(16,28,42,0.12)', borderRadius: 2,
  padding: '12px 14px', fontFamily: 'inherit', fontSize: 14, outline: 'none', color: 'var(--ink)',
};

const sectionLabel = {
  fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16,
};
const h2Style = {
  fontFamily: 'Bricolage Grotesque, sans-serif',
  fontSize: 'clamp(44px, 5vw, 80px)',
  lineHeight: 0.98, letterSpacing: -0.01, margin: 0,
  color: 'var(--ink)', textWrap: 'pretty',
};

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [dialog, setDialog] = useState(false);
  const [campusFocus, setCampusFocus] = useState(tweaks.campusFocus);
  const p = useScrollProgress();
  const pal = PALETTES[tweaks.palette] || PALETTES.terracota;

  useEffect(() => { setCampusFocus(tweaks.campusFocus); }, [tweaks.campusFocus]);

  const cssVars = {
    '--bg': pal.bg, '--ink': pal.ink, '--accent': pal.accent,
    '--soft': pal.soft, '--muted': pal.muted, '--forest': pal.forest,
  };

  return (
    <div style={{ ...cssVars, background: 'var(--bg)', color: 'var(--ink)', minHeight: '100vh' }}>
      <TopNav p={p} onCta={() => setDialog(true)} onOpenAdmissions={() => document.getElementById('admisiones')?.scrollIntoView({ behavior: 'smooth' })} />
      <Hero variant={tweaks.heroVariant} onCta={() => setDialog(true)} />
      <MarqueeStrip />
      <Pillars />
      <Levels />
      <CampusComparator focus={campusFocus} setFocus={setCampusFocus} />
      <Numbers />
      <VidaEscolar />
      <Testimonials />
      <Calendar />
      <AdmissionsFunnel onCta={() => setDialog(true)} />
      <Footer />
      {tweaks.showStickyCTA && <StickyCTA onCta={() => setDialog(true)} />}
      <VisitDialog open={dialog} onClose={() => setDialog(false)} />

      <TweaksPanel title="Tweaks · Monteclaro">
        <TweakSection label="Paleta">
          <TweakSelect
            label="Color base"
            value={tweaks.palette}
            options={[
              { value: 'clasico', label: 'Clásico · Navy + Amarillo' },
              { value: 'marino', label: 'Marino · Rojo + Crema' },
              { value: 'pradera', label: 'Pradera · Verde + Ocre' },
              { value: 'durazno', label: 'Durazno · Magenta' },
            ]}
            onChange={v => setTweak('palette', v)}
          />
        </TweakSection>
        <TweakSection label="Hero">
          <TweakRadio
            label="Layout"
            value={tweaks.heroVariant}
            options={[
              { value: 'split', label: 'Split' },
              { value: 'solo', label: 'Solo' },
            ]}
            onChange={v => setTweak('heroVariant', v)}
          />
        </TweakSection>
        <TweakSection label="Campus enfocado">
          <TweakSelect
            label="Por defecto"
            value={tweaks.campusFocus}
            options={CAMPUSES.map(c => ({ value: c.id, label: c.name }))}
            onChange={v => setTweak('campusFocus', v)}
          />
        </TweakSection>
        <TweakSection label="CTA flotante">
          <TweakToggle label="WhatsApp + visita" value={tweaks.showStickyCTA} onChange={v => setTweak('showStickyCTA', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
