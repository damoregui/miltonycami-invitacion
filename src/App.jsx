import React from 'react'

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

/* ---------- Detección de SO + Links de Dots Memories ---------- */
const DOTS_ANDROID = "https://play.google.com/store/apps/details?id=social.onelife&hl=es_AR" // <-- tu link Android
const DOTS_IOS = "https://apps.apple.com/ar/app/dots-memories-%C3%A1lbum-de-fotos/id6449039420" // <-- tu link iOS

function getMobileOS() {
  const ua = navigator.userAgent || navigator.vendor || window.opera
  if (/android/i.test(ua)) return "Android"
  if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return "iOS"
  return "other"
}

// 🚀 Exportamos directamente la app original
export default function App() {
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

    let removeListeners = null;

    const tryImmediate = async () => {
      try {
        await a.play();
        a.muted = false;
      } catch {
        const start = async () => {
          try {
            a.muted = false;
            await a.play();
          } catch { }
        };
        const opts = { once: true, passive: true };
        document.addEventListener("touchstart", start, opts);
        document.addEventListener("click", start, opts);
        removeListeners = () => {
          document.removeEventListener("touchstart", start);
          document.removeEventListener("click", start);
        };
      }
    };

    tryImmediate();

    return () => {
      if (removeListeners) removeListeners();
    };
  }, []);

  const [bankOpen, setBankOpen] = React.useState(false)
  const [tutorialOpen, setTutorialOpen] = React.useState(false) // <-- agregado

  return (
    <div className="overflow-hidden min-h-screen">
      {/* Audio + floating toggle */}
      <audio
        ref={audioRef}
        src="/audio/audio.mp3"
        loop
        autoPlay
        muted
        playsInline
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
          <img src="/fondo/fondo1.webp" alt="Fondo" className="absolute inset-0 w-full h-full object-contain" />
          <div className="flex justify-center items-center h-full z-10">
            <div className="custom-div lg:left-1/2">
              <a href="#frase">
                <img src="/img/flecha.png" className="text-white w-[45px] h-[40px] cursor-pointer" alt="Flecha" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Frase */}
      <section id="frase" className="bg-primario max-w-full" data-animate="reveal">
        <div className="w-full p-8 flex justify-center items-center font-principal text-lg tracking-wide text-center text-white">
          <p>¡Nos Casamos!</p>
        </div>
      </section>

      {/* Fecha + Countdown */}
      <FechaCountdown />

      {/* Ceremonia / Celebración */}
      <section className="pt-8 pb-8 flex flex-col justify-center items-center bg-[#f9f6f3] max-w-full">
        <div data-animate="reveal" style={{ '--reveal-transform': 'translateX(-100px)' }}>
          <Card icon="/img/copas.png" title="CEREMONIA Y FIESTA"
            text="Te esperamos para celebrar en el Salón Las Lilas a las 19.00hs
            (importante ser super puntuales, la novia entra 19.30hs!!)."
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
              {[...Array(2)].flatMap(() => [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]).map((n, i) => (
                <img key={i} src={`/img/${n}.jpg`} alt="Imagen" className="m-2 rounded-md" />
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
            <p className="text-lg pt-1 text-center text-[#333333] font-principal">DRESSCODE</p>
            <p className="text-lg pt-1 text-center text-[#333333] font-semibold font-principal">Formal, elegante. <br /> Pero no te olvides de traer zapatillas para la hora de bailar ;)</p>
          </div>
        </div>
      </section>

      {/* Regalos */}
      <section className="max-w-full bg-[#f0ebe4]" data-animate="reveal" style={{ '--reveal-transform': 'translateX(100px)' }}>
        <div className="flex flex-col justify-center items-center text-center p-8">
          <img src="/img/f.apng" alt="Icono Regalos" className="w-20 h-20" />
          <h2 className="text-[#333333] text-center mt-2 text-lg font-principal pb-3">
            Ya tenemos vajilla, licuadora y hasta tostadora… <br /> Por eso si queres hacernos un regalo podés ayudarnos con la luna de miel, y ser parte de nuestro viaje :)
          </h2>
          <button
            onClick={() => setBankOpen(true)}
            className="bg-terciario text-white hover:bg-primario rounded-xl text-sm uppercase py-2 px-2 w-60 mt-2 inline-block text-center">
            ver datos bancarios
          </button>
        </div>
      </section>

      {/* Galería */}
      <div className="max-w-3xl mx-auto grid grid-cols-2 gap-4 md:gap-x-1 md:gap-y-4 p-4">
        {[10, 11, 12, 13, 14, 15].map(n => (
          <img key={n} src={`/img/${n}.jpg`} alt="Imagen" className="rounded-md cursor-pointer hover:scale-105 transition mx-auto w-auto h-auto md:h-60" />
        ))}
      </div>

      {/* Instagram */}
      <section className="max-w-full bg-[#f0ebe4]" data-animate="reveal" style={{ '--reveal-transform': 'translateX(-100px)' }}>
        <div className="flex flex-col justify-center items-center text-center p-8 rounded-lg">
          <img src="/img/adelantos.apng" className="w-[60px] h-[60px] mb-2" alt="Adelantos icon" />
          <h4 className="text-[#333333] text-lg font-principal uppercase font-semibold pb-1 text-center">@bodaCamiMilton</h4>
          <p className="text-[#333333] px-2 text-lg font-principal pb-4">¡Preparate para este fiestón!<br />
            Seguinos en nuestra cuenta para ver todas las novedades del casamiento <br />
            y etiquetarnos en tus fotos y videos</p>
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
            <h4 className="text-[#333333] text-lg font-principal uppercase font-semibold pb-1 text-center">CONFIRMACIÓN DE ASISTENCIA</h4>
            <h2 className="text-xl pt-2 pb-1 font-principal">¡Decile <span className="text-xl uppercase">"Sí acepto"</span> <br /> a nuestra invitación!</h2>
            <a href="https://docs.google.com/forms/d/1_FUmFUrmEmhXcNydf21CsXzmu2ZkJ46d3IBZtyDM-C0/viewform?edit_requested=true" target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-block bg-primario text-white font-principal uppercase rounded-xl text-[18px] py-2 px-2 w-60 hover:bg-terciario text-center">
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

      {/* Subir fotos -> con redirección a la tienda correspondiente */}
      <section className="max-w-full bg-[#f0ebe4]" data-animate="reveal" style={{ '--reveal-transform': 'translateX(-100px)' }}>
        <div className="flex justify-center items-center text-center flex-col p-8">
          <img src="/img/foto.apng" alt="Icono fotos" className="w-[70px] h-[70px]" />
          <p className="text-[#333333] text-lg font-principal font-semibold pb-1 text-center">
            Bajate la aplicación Dots Memories y compartí con nosotros tus fotos y videos del gran día
          </p>

          {(() => {
            const os = getMobileOS()
            if (os === "Android") {
              return (
                <>
                  <a
                    href={DOTS_ANDROID}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-terciario text-white hover:bg-primario rounded-xl text-sm uppercase py-2 px-2 w-60 inline-block text-center"
                  >
                    Descargar en Google Play
                  </a>
                  <button
                    onClick={() => setTutorialOpen(true)}
                    className="bg-terciario text-white hover:bg-primario rounded-xl text-sm uppercase py-2 px-2 w-60 mt-2 inline-block text-center"
                  >
                    Mirá como usar la app
                  </button>
                </>
              )
            }
            if (os === "iOS") {
              return (
                <>
                  <a
                    href={DOTS_IOS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-terciario text-white hover:bg-primario rounded-xl text-sm uppercase py-2 px-2 w-60 inline-block text-center"
                  >
                    Descargar en App Store
                  </a>
                  <button
                    onClick={() => setTutorialOpen(true)}
                    className="bg-terciario text-white hover:bg-primario rounded-xl text-sm uppercase py-2 px-2 w-60 mt-2 inline-block text-center"
                  >
                    Mirá como usar la app
                  </button>
                </>
              )
            }
            return (
              <div className="flex flex-col gap-2 mt-2 items-center">
                <div className="flex gap-4">
                  <a
                    href={DOTS_ANDROID}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-terciario text-white hover:bg-primario rounded-xl text-sm uppercase py-2 px-2 w-40 inline-block text-center"
                  >
                    Google Play
                  </a>
                  <a
                    href={DOTS_IOS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-terciario text-white hover:bg-primario rounded-xl text-sm uppercase py-2 px-2 w-40 inline-block text-center"
                  >
                    App Store
                  </a>
                </div>
                <button
                  onClick={() => setTutorialOpen(true)}
                  className="bg-terciario text-white hover:bg-primario rounded-xl text-sm uppercase py-2 px-2 w-60 mt-2 inline-block text-center"
                >
                  Mirá como usar la app
                </button>
              </div>
            )
          })()}
        </div>
      </section>

      {/* Imagen completa */}
      <section>
        <img src="/img/webp/f9.jpg" alt="Cami Minnie y Milton Mickey" className="w-full" />
      </section>

      {/* Gracias */}
      <section className="bg-primario max-w-full" data-animate="reveal">
        <div className="flex flex-col justify-center items-center text-center p-8">
          <p className="text-white text-lg font-principal tracking-wide">
            ¡Gracias por ser parte de este capitulo tan importante de nuestras vidas!
          </p>
        </div>
      </section>

      {/* Modal de datos bancarios */}
      {bankOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-4 text-[#333]">Datos Bancarios</h2>
            <div className="text-left text-[#333] space-y-1">
              <p><strong>Titular:</strong> Guido DAmore</p>
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

      {/* Modal tutorial: "Cómo usar la app" */}
      {tutorialOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-4 text-[#333]">Cómo usar la app</h2>
            <div className="text-left text-[#333] space-y-2">
              <p>
                1) Una vez que hayas descargado la app, entrá a nuestro álbum clickeando{" "}
                <a
                  href="https://web.dotstheapp.com/a?group=2110936&code=BKgg1j2W&dlBy=camilacergneux&utm_source=guest&utm_medium=share&utm_campaign=guest_event_album&force_app=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primario hover:text-terciario"
                >
                  acá
                </a>
                .
              </p>
              <br />
              <p>
                2) Usa este código de acceso para poder entrar: <b>BKgg1j2W</b>
              </p>
            </div>
            <button
              onClick={() => setTutorialOpen(false)}
              className="mt-4 bg-terciario hover:bg-primario text-white px-4 py-2 rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
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
        </div>
        <div className="text-center mt-8">
          <a href="https://calendar.app.google/McKqMvBMhrkTzG9V9" target="_blank" rel="noopener noreferrer"
            className="bg-terciario text-white hover:bg-primario rounded-xl text-sm uppercase py-2 px-2 w-60 inline-block text-center">
            Agendá la fecha
          </a>
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
