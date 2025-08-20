import React from 'react'
import { INVITATIONS } from './invitations'

// Countdown target
const TARGET = '2026-02-14T21:00:00'

// ---- Hooks ----
function useCountdown(targetISO) {
  const calc = () => {
    const t = new Date(targetISO).getTime()
    const now = Date.now()
    let diff = Math.max(0, Math.floor((t - now) / 1000))
    const days = Math.floor(diff / 86400); diff -= days * 86400
    const hours = Math.floor(diff / 3600); diff -= hours * 3600
    const mins = Math.floor(diff / 60); diff -= mins * 60
    const secs = diff
    return { days, hours, mins, secs }
  }
  const [left, setLeft] = React.useState(calc())
  React.useEffect(() => {
    const id = setInterval(() => setLeft(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return left
}

function useReveal() {
  React.useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-animate="reveal"]'))
    els.forEach(el => el.classList.add('reveal-init'))
    const ob = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed')
          ob.unobserve(e.target)
        }
      })
    }, { threshold: 0.15 })
    els.forEach(el => ob.observe(el))
    return () => ob.disconnect()
  }, [])
}

/* ============================
   GATE WRAPPER (Pantalla 1 + Pantalla 2)
============================ */
export default function App() {
  const [step, setStep] = React.useState(1)
  const [code, setCode] = React.useState("")
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState("")

  const normalize = (raw) =>
    raw.toUpperCase().replace(/\s+/g, "").replace(/[^A-Z0-9]/g, "")

  function handleSubmit(e) {
    e.preventDefault()
    const normalized = normalize(code)
    const match = INVITATIONS[normalized]
    if (!match) {
      setError("Código inexistente. Intenta de nuevo")
      setData(null)
      setStep(1)
      return
    }
    setError("")
    setCode(normalized)
    setData(match)
    setStep(2)
  }

  function handleConfirm() {
    setStep(3)
  }

  function handleChangeCode() {
    setCode("")
    setData(null)
    setStep(1)
  }

  // Pantalla 1: Ingresar código
  if (step === 1) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#f5f6fa] p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-center text-2xl font-bold text-[#333] mb-2">Ingresá tu código de invitación</h1>
          <form onSubmit={handleSubmit} className="grid gap-3">
            <input
              type="text"
              placeholder="Ej: CYM000"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border border-gray-200 rounded-xl outline-none px-4 py-3 focus:ring-4 focus:ring-[rgba(70,84,159,0.25)] focus:border-[#46549f]"
            />
            {!!error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="bg-[#46549f] hover:bg-[#3c488b] text-white font-semibold rounded-xl py-3">
              Continuar
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Pantalla 2: Confirmación
if (step === 2 && data) {
  const formatNames = (names) => {
    if (names.length === 1) return names[0];
    if (names.length === 2) return names.join(" y ");
    return `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
  };

  const namesLine = formatNames(data.names);

  return (
    <div className="min-h-screen grid place-items-center bg-[#f5f6fa] p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
        <h2 className="text-2xl font-bold text-[#333]">{namesLine}</h2>
        <p className="text-gray-600 mt-1">
          ¡Esperamos que puedan acompañarnos en este fiestón!
        </p>

        <div className="grid grid-cols-2 gap-3 my-5">
          <div>
            <span className="block text-gray-500 text-sm">Nro de invitados</span>
            <span className="block font-bold text-lg text-[#333]">
              {data.count}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 text-sm">Código</span>
            <span className="block font-bold text-lg text-[#333]">{code}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleChangeCode}
            className="border border-[#46549f] text-[#46549f] rounded-xl py-2 hover:bg-gray-50"
          >
            Cambiar código
          </button>
          <button
            onClick={handleConfirm}
            className="bg-[#46549f] text-white rounded-xl py-2 hover:bg-[#3c488b]"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}

  // Paso 3: mostrar tu App original completa
  return <OriginalApp />
}

/* ============================
   TU APP ORIGINAL (contenido intacto)
============================ */
function OriginalApp() {
  useReveal()

  const audioRef = React.useRef(null)
  const [playing, setPlaying] = React.useState(true)
  React.useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const tryPlay = async () => { try { await a.play() } catch { } }
    if (playing) tryPlay(); else a.pause()
  }, [playing])

React.useEffect(() => {
  const a = audioRef.current;
  if (!a) return;

  let removeListeners = null; // guardamos el cleanup aquí

  const tryImmediate = async () => {
    try {
      await a.play();
      a.muted = false; // si arranca, desmuteamos
    } catch {
      // si el navegador bloquea, esperamos el primer tap/click
      const start = async () => {
        try {
          a.muted = false;
          await a.play();
        } catch {}
      };
      const opts = { once: true, passive: true };
      document.addEventListener("touchstart", start, opts);
      document.addEventListener("click", start, opts);

      // definimos cleanup síncrono
      removeListeners = () => {
        document.removeEventListener("touchstart", start);
        document.removeEventListener("click", start);
      };
    }
  };

  // llamamos sin devolver la promise
  tryImmediate();

  // cleanup síncrono correcto
  return () => {
    if (removeListeners) removeListeners();
  };
}, []);

  // >>> agregado: estado del modal de datos bancarios
  const [bankOpen, setBankOpen] = React.useState(false)
  // <<<

  return (
    <div className="overflow-hidden min-h-screen">
      {/* Audio + floating toggle */}
      <audio
        ref={audioRef}
        src="/audio/audio.mp3"
        loop
        autoPlay
        muted
        playsInline   // iOS
      />
      <button
        onClick={() => setPlaying(p => !p)}
        style={{
          position: 'fixed', bottom: 20, right: 20, backgroundColor: '#46549f',
          color: '#fff', border: 'none', borderRadius: '50%', width: 50, height: 50,
          fontSize: 18, cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,.2)', zIndex: 9999
        }}
        aria-label={playing ? 'Pause music' : 'Play music'}
      >
        <i className={`fa ${playing ? 'fa-pause' : 'fa-play'} text-white`} />
      </button>

      {/* Inicio */}
      <section id="inicio" className="bg-[#f7f7f5] max-w-full" data-animate="reveal" style={{ '--reveal-transform': 'scale(0.95)' }}>
        <div className="min-h-screen relative">
          <img
            src="/fondo/fondo1.webp"
            alt="Fondo"
            className="absolute inset-0 w-full h-full object-contain"
          />
          <div className="flex justify-center items-center h-full z-10">
            <div className="custom-div lg:left-1/2">
              <a href="#frase">
                <img
                  src="/img/flecha.png"
                  className="text-white w-[45px] h-[40px] cursor-pointer"
                  alt="Flecha"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Frase */}
      <section id="frase" className="bg-primario max-w-full" data-animate="reveal">
        <div className="w-full p-8 flex justify-center items-center font-principal text-lg tracking-wide text-center text-white">
          <p>Mamá, cortaste toda la loooooz porque metiste un cutucuchillo</p>
        </div>
      </section>

      {/* Fecha + Countdown */}
      <FechaCountdown />

      {/* Ceremonia / Celebración */}
      <section className="pt-8 pb-8 flex flex-col justify-center items-center bg-[#f9f6f3] max-w-full">
        <div data-animate="reveal" style={{ '--reveal-transform': 'translateX(-100px)' }}>
          <Card icon="/img/copas.apng" title="Celebración"
            text="La Ceremonia, y la fiesta, las festejaremos en el Salón de Eventos Las Lilas."
            link="https://maps.app.goo.gl/Aea5oom663xVbsnd8" button="Llegar al salón" />
        </div>
      </section>

      {/* Nuestra historia */}
      <section className="max-w-full relative p-8">
        <div className="pb-2">
          <div data-animate="reveal" style={{ display: 'none' }}>
            <p className="text-center flex justify-center items-center font-principal uppercase text-[#333] text-base pb-1">Nuestra Historia </p>
          </div>
          <div className="overflow-hidden w-full">
            <div className="flex animate-scroll m-2 flex-shrink-0 h-full w-[250px]">
              {[...Array(2)].flatMap(() => [16, 17, 18, 19, 20, 21]).map((n, i) => (
                <img key={i} src={`/img/${n}.png`} alt="Imagen" className="m-2 rounded-md" />
              ))}
            </div>
          </div>
          <div className="text-center mt-10">
            <a href="https://example.com/galeria" target="_blank" rel="noopener noreferrer" style={{ display: 'none' }}
              className="px-4 py-2 inline-block bg-primario text-white font-light rounded-lg hover:bg-terciario hover:text-white">
              Ver fotos
            </a>
          </div>
        </div>
      </section>

      {/* Dress code */}
      <section className="bg-[#f9f6f3] max-w-full" data-animate="reveal">
        <div className="flex flex-col justify-center items-center text-center p-8">
          <img src="/img/code.png" alt="Codigo de Vestimenta" className="w-16 h-16" />
          <div className="pt-2"><img src="/img/linea.png" className="w-[1000px] h-[10px]" /></div>
          <div className="pt-1">
            <p className="text-lg pt-1 text-center text-[#333333] font-principal">Nuestra historia se viste de gala!</p>
            <p className="text-lg pt-1 text-center text-[#333333] uppercase font-semibold font-principal">y vos también!!</p>
          </div>
        </div>
      </section>

      {/* Regalos */}
      <section className="max-w-full bg-[#f0ebe4]" data-animate="reveal" style={{ '--reveal-transform': 'translateX(100px)' }}>
        <div className="flex flex-col justify-center items-center text-center p-8">
          <img src="/img/f.apng" alt="Icono Regalos" className="w-20 h-20" />
          <h2 className="text-[#333333] text-center mt-2 text-lg font-principal pb-3">
            Si deseás hacernos un regalo, además de tu hermosa presencia...
          </h2>
          {/* >>> reemplazo del <a> por botón con mismas clases para abrir modal */}
          <button
            onClick={() => setBankOpen(true)}
            className="bg-terciario text-white hover:bg-primario rounded-xl text-sm uppercase py-2 px-2 w-60 mt-2 inline-block text-center">
            ver datos bancarios
          </button>
          {/* <<< */}
        </div>
      </section>

      {/* Galería */}
      <div className="max-w-3xl mx-auto grid grid-cols-2 gap-4 md:gap-x-1 md:gap-y-4 p-4">
        {[12, 13, 14, 15, 16, 17].map(n => (
          <img key={n} src={`/img/${n}.png`} alt="Imagen" className="rounded-md cursor-pointer hover:scale-105 transition mx-auto w-auto h-auto md:h-60" />
        ))}
      </div>

      {/* Fiesta adultos */}
      <section className="max-w-full bg-[#f9f6f3]" data-animate="reveal">
        <div className="flex flex-col justify-center items-center text-center p-8">
          <img src="/img/festcode.apng" alt="Codigo de Vestimenta" className="w-16 h-16 animate-zoom" />
          <div className="pt-2"><img src="/img/linea.png" className="w-[1000px] h-[10px]" /></div>
          <div className="pt-1">
            <h3 className="font-semibold text-[#333333] text-lg pb-1 text-center font-principal">¡La fiesta está en marcha!</h3>
            <p className="text-[#333333] px-1 text-lg font-principal pb-4">Será una ocasión para relajarnos y disfrutar juntos, en un ambiente solo para adultos. Habran consoladores y cocaina para las personas entre 28 y 40 años.</p>
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="max-w-full bg-[#f0ebe4]" data-animate="reveal" style={{ '--reveal-transform': 'translateX(-100px)' }}>
        <div className="flex flex-col justify-center items-center text-center p-8 rounded-lg">
          <img src="/img/adelantos.apng" className="w-[60px] h-[60px] mb-2" alt="Adelantos icon" />
          <h3 className="text-[#333333] font-principal text-lg font-semibold pb-1 text-center">¡Si hay foto, hay historia!</h3>
          <h4 className="text-[#333333] text-lg font-principal uppercase font-semibold pb-1 text-center">@bodaCamiMilton</h4>
          <p className="text-[#333333] px-2 text-lg font-principal pb-4">Seguinos en nuestra cuenta de instagram <br />y etiquetanos en tus fotos y videos!</p>
          <a href="https:www.instagram.com/camicergneux/" target="_blank" rel="noopener noreferrer"
            className="bg-terciario text-white hover:bg-primario rounded-xl text-sm uppercase py-2 px-2 w-60 inline-block text-center">
            Ver Instagram
          </a>
        </div>
      </section>

      {/* Asistencia */}
      <section className="max-w-full relative w-full" data-animate="reveal" style={{ '--reveal-transform': 'scale(0.85)' }}>
        <div className="flex flex-col justify-center items-center text-center p-8">
          <img src="/img/asistencia.apng" className="w-[70px] h-[70px]" />
          <div className="relative z-10 text-[#333]">
            <h2 className="text-xl pt-2 pb-1 font-principal">¡Decile <span className="text-xl uppercase">"Sí acepto"</span> <br /> a nuestra invitación!</h2>
            <a href="https://example.com/rsvp" target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-block bg-primario text-white font-principal uppercase rounded-xl text-[12px] py-2 px-2 w-60 hover:bg-terciario text-center">
              ¡Confirmar Asistencia!
            </a>
          </div>
        </div>
      </section>

      {/* Playlist */}
      <section className="max-w-full bg-[#f9f6f3]" data-animate="reveal" style={{ '--reveal-transform': 'translateX(100px)' }}>
        <div className="flex flex-col justify-center items-center text-center p-8">
          <img src="/img/playlist.apng" alt="Icono de Musica" className="h-[70px] w-[70px]" />
          <p className="text-lg font-principal pb-1 font-semibold text-[#333333] text-center">¡Queremos armar la playlist perfecta!</p>
          <p className="text-lg font-principal pb-4 text-[#333333]">Decinos cuales son las canciones que no pueden faltar en la fiesta</p>
          <a href="https://open.spotify.com/playlist/7hEad2gsIbbyM2AcSOaice?si=swy3KCSfRS6V2ypYFKNYEw&pi=RkKt2fiHSEG6S" target="_blank" rel="noopener noreferrer"
            className="bg-terciario text-white hover:bg-primario rounded-xl text-sm uppercase py-2 px-2 w-60 inline-block text-center">
            Sugerir canción
          </a>
        </div>
      </section>

      {/* Subir fotos */}
      <section className="max-w-full bg-[#f0ebe4]" data-animate="reveal" style={{ '--reveal-transform': 'translateX(-100px)' }}>
        <div className="flex justify-center items-center text-center flex-col p-8">
          <img src="/img/foto.apng" alt="Icono fotos" className="w-[70px] h-[70px]" />
          <p className="text-[#333333] text-lg font-principal font-semibold pb-1 text-center">¡Revive la magia de nuestro gran día!</p>
          <p className="text-[#333333] text-lg font-principal font-thin pb-4">Comparte tus fotos en nuestro álbum de Google Drive</p>
          <a href="https://example.com/fotos" target="_blank" rel="noopener noreferrer"
            className="bg-terciario text-white hover:bg-primario rounded-xl text-sm uppercase py-2 px-2 w-60 inline-block text-center">
            Subir Fotos
          </a>
        </div>
      </section>

      {/* Imagen completa */}
      <section>
        <img src="/img/webp/f9.png" alt="Cami Minnie y Milton Mickey" className="w-full" />
      </section>

      {/* Gracias */}
      <section className="bg-primario max-w-full" data-animate="reveal">
        <div className="flex flex-col justify-center items-center text-center p-8">
          <p className="text-white text-lg font-principal tracking-wide">
            ¡Gracias por ser parte de este capitulo tan importante de nuestras vidas!
          </p>
        </div>
      </section>

      {/* >>> agregado: Modal de datos bancarios */}
      {bankOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-4 text-[#333]">Datos Bancarios</h2>
            <div className="text-left text-[#333] space-y-1">
              <p><strong>Titular:</strong> Guido DAmore. Si pasa, pasa, viste?</p>
              <p><strong>Alias:</strong> guido.pitolargo</p>
              <p><strong>CBU:</strong> 1234567890123456789012</p>
              <p><strong>Banco:</strong> Banco de pitos largos</p>
            </div>
            <button
              onClick={() => setBankOpen(false)}
              className="mt-4 bg-terciario hover:bg-primario text-white px-4 py-2 rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      {/* <<< */}
    </div>
  )
}

function FechaCountdown() {
  const { days, hours, mins, secs } = useCountdown(TARGET)
  const date = new Date(TARGET)
  return (
    <section className="max-w-full relative p-8" data-animate="reveal" style={{ '--reveal-transform': 'scale(0.5)' }}>
      <div>
        <div className="flex flex-col justify-center items-center text-center space-y-3">
          <p className="text-sm font-light uppercase text-gray-600">Te esperamos el día</p>
          <h2 className="text-2xl font-principal text-[#333]">
            {date.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </h2>
          <div>
            <div className="flex flex-col items-center justify-center space-y-6 text-center p-3">
              <div className="flex justify-center items-center space-x-6 text-2xl text-primario">
                <TimeCol label="Días" value={days} />
                <Sep />
                <TimeCol label="Hs" value={hours} />
                <Sep />
                <TimeCol label="Min" value={mins} />
                <Sep />
                <TimeCol label="Seg" value={secs} />
              </div>
            </div>
          </div>
          <div className="text-center mb-2">
            <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda%20Vale%20y%20Fran&dates=20250825/20250825&details=%C3%9Anete%20a%20nosotros%20para%20celebrar%20este%20d%C3%ADa%20especial."
              target="_blank" rel="noopener noreferrer"
              className="inline-block bg-terciario text-white rounded-xl text-sm uppercase py-2 px-2 w-60 hover:bg-primario transition-colors duration-300">
              Agendar fecha
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function TimeCol({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl text-[#333] font-principal">{value}</span>
      <span className="text-base text-gray-600 font-principal">{label}</span>
    </div>
  )
}
function Sep() { return <div className="flex flex-col items-center"><span className="text-2xl text-[#333]">:</span></div> }

function Card({ icon, title, text, button, link }) {
  return (
    <section className="flex flex-col items-center justify-center text-center px-10 py-5">
      <div><img src={icon} alt={title} className="w-[70px] h-[70px]" /></div>
      <div className="text-center"><p className="text-[#333] font-principal uppercase text-xl pb-1 pt-2">{title}</p></div>
      <div className="flex flex-col justify-center items-center text-center">
        <p className="pb-3 text-[#333333] font-principal text-lg">{text}</p>
        <a href={link} target="_blank" rel="noopener noreferrer"
          className="bg-terciario text-white hover:bg-primario rounded-xl mt-2 text-sm uppercase py-2 px-2 w-60 inline-block text-center">
          {button}
        </a>
      </div>
    </section>
  )
}

