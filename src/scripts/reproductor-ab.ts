/**
 * Lógica del comparador A/B.
 *
 * Las dos versiones se reproducen a la vez y sincronizadas; alternar solo cruza
 * el volumen entre una y otra. Así se compara el mismo instante exacto de la
 * canción, que es lo único que hace útil a una comparativa.
 *
 * El ruteo es: <audio> -> MediaElementSource -> GainNode -> salida. Usar
 * MediaElementSource en vez de decodificar el archivo entero permite que el
 * audio siga llegando de a poco, sin esperar la descarga completa.
 */

type Lado = 'before' | 'after';

/**
 * Todos los reproductores de la página. Con varias comparativas hace falta que
 * arrancar una pause las otras: si no, se pisan entre sí.
 */
const montados: ReproductorAB[] = [];

const CRUCE_SEGUNDOS = 0.04; // duración del cruce de volumen
const DERIVA_MAXIMA = 0.05; // desincronización tolerada entre las dos ramas

function formatearTiempo(segundos: number): string {
  if (!Number.isFinite(segundos)) return '0:00';
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

class ReproductorAB {
  private raiz: HTMLElement;
  private audios: Record<Lado, HTMLAudioElement>;
  private botonPlay: HTMLButtonElement;
  private opciones: HTMLButtonElement[];
  private onda: HTMLElement;
  private recorte: SVGRectElement;
  private tiempo: HTMLElement;
  private total: HTMLElement;

  /** Ancho del viewBox de la onda, en unidades del SVG. */
  private anchoOnda: number;

  private contexto?: AudioContext;
  private ganancias?: Record<Lado, GainNode>;
  private lado: Lado = 'before';
  /** Ganancia por rama que iguala la sonoridad de las dos versiones. */
  private igualacion: Record<Lado, number>;
  private sonando = false;
  private preparado = false;
  private cuadro = 0;

  constructor(raiz: HTMLElement) {
    this.raiz = raiz;
    this.audios = {
      before: raiz.querySelector('[data-audio="before"]')!,
      after: raiz.querySelector('[data-audio="after"]')!,
    };
    this.botonPlay = raiz.querySelector('[data-play]')!;
    this.opciones = [...raiz.querySelectorAll<HTMLButtonElement>('[data-lado]')];
    this.onda = raiz.querySelector('[data-onda]')!;
    this.recorte = raiz.querySelector('[data-recorte]')!;
    this.tiempo = raiz.querySelector('[data-tiempo]')!;
    this.total = raiz.querySelector('[data-total]')!;
    this.anchoOnda = this.recorte.ownerSVGElement?.viewBox.baseVal.width ?? 0;
    this.igualacion = {
      before: Number(raiz.dataset.gananciaBefore ?? 1),
      after: Number(raiz.dataset.gananciaAfter ?? 1),
    };

    if (!this.formatoSoportado()) {
      this.raiz.querySelector<HTMLElement>('[data-sin-soporte]')!.hidden = false;
      this.botonPlay.disabled = true;
      return;
    }

    this.total.textContent = formatearTiempo(Number(raiz.dataset.duracion ?? 0));
    this.pintarSeleccion();
    this.conectarEventos();
  }

  /** ¿Alguna de las fuentes declaradas se puede reproducir acá? */
  private formatoSoportado(): boolean {
    const fuentes = [...this.audios.before.querySelectorAll('source')];
    return fuentes.some((f) => this.audios.before.canPlayType(f.type) !== '');
  }

  private conectarEventos() {
    this.botonPlay.addEventListener('click', () => this.alternarReproduccion());

    this.opciones.forEach((boton, i) => {
      boton.addEventListener('click', () => this.cambiarLado(boton.dataset.lado as Lado));
      boton.addEventListener('keydown', (evento) => {
        if (evento.key !== 'ArrowRight' && evento.key !== 'ArrowLeft') return;
        evento.preventDefault();
        const siguiente = this.opciones[(i + 1) % this.opciones.length];
        siguiente.focus();
        this.cambiarLado(siguiente.dataset.lado as Lado);
      });
    });

    this.onda.addEventListener('click', (evento) => {
      const caja = this.onda.getBoundingClientRect();
      this.buscar(((evento.clientX - caja.left) / caja.width) * this.duracion());
    });

    this.onda.addEventListener('keydown', (evento) => {
      const salto = evento.key === 'ArrowRight' ? 5 : evento.key === 'ArrowLeft' ? -5 : 0;
      if (!salto) return;
      evento.preventDefault();
      this.buscar(this.activo().currentTime + salto);
    });

    // Al terminar, vuelve al principio y deja el botón listo para otra escucha.
    this.audios.before.addEventListener('ended', () => this.detener());
  }

  private activo(): HTMLAudioElement {
    return this.audios[this.lado];
  }

  private inactivo(): HTMLAudioElement {
    return this.audios[this.lado === 'before' ? 'after' : 'before'];
  }

  private duracion(): number {
    return this.activo().duration || Number(this.raiz.dataset.duracion ?? 0);
  }

  /**
   * Crea el grafo de audio. Se hace en el primer play y no antes: los
   * navegadores no permiten iniciar un AudioContext sin un gesto del usuario.
   */
  private prepararAudio() {
    if (this.preparado) return;
    this.contexto = new AudioContext();
    this.ganancias = {
      before: this.contexto.createGain(),
      after: this.contexto.createGain(),
    };

    for (const lado of ['before', 'after'] as const) {
      const fuente = this.contexto.createMediaElementSource(this.audios[lado]);
      fuente.connect(this.ganancias[lado]).connect(this.contexto.destination);
      this.ganancias[lado].gain.value = lado === this.lado ? this.igualacion[lado] : 0;
    }
    this.preparado = true;
  }

  private async alternarReproduccion() {
    if (this.sonando) {
      this.detener(false);
      return;
    }

    // Una sola comparativa sonando a la vez.
    for (const otro of montados) if (otro !== this) otro.pausar();

    this.prepararAudio();
    await this.contexto?.resume();

    // Arrancan las dos ramas juntas desde la misma posición.
    const posicion = this.activo().currentTime;
    this.inactivo().currentTime = posicion;

    try {
      await Promise.all([this.audios.before.play(), this.audios.after.play()]);
    } catch {
      // Reproducción bloqueada por el navegador: no hay nada que sincronizar.
      return;
    }

    this.sonando = true;
    this.pintarPlay();
    this.animar();
  }

  /** Pausa sin volver al principio: la usa el resto de los reproductores. */
  pausar() {
    if (this.sonando) this.detener(false);
  }

  private detener(reiniciar = true) {
    this.audios.before.pause();
    this.audios.after.pause();
    if (reiniciar) {
      this.audios.before.currentTime = 0;
      this.audios.after.currentTime = 0;
      this.pintarAvance(0);
    }
    this.sonando = false;
    this.pintarPlay();
    cancelAnimationFrame(this.cuadro);
  }

  /** Cruza el volumen. No toca la posición: por eso la comparación es válida. */
  private cambiarLado(lado: Lado) {
    if (lado === this.lado) return;
    this.lado = lado;
    this.pintarSeleccion();

    if (!this.preparado || !this.contexto || !this.ganancias) return;

    const ahora = this.contexto.currentTime;
    for (const candidato of ['before', 'after'] as const) {
      const ganancia = this.ganancias[candidato].gain;
      ganancia.cancelScheduledValues(ahora);
      ganancia.setValueAtTime(ganancia.value, ahora);
      ganancia.linearRampToValueAtTime(
        candidato === lado ? this.igualacion[candidato] : 0,
        ahora + CRUCE_SEGUNDOS
      );
    }
  }

  private buscar(segundos: number) {
    const destino = Math.min(Math.max(segundos, 0), this.duracion());
    this.audios.before.currentTime = destino;
    this.audios.after.currentTime = destino;
    this.pintarAvance(destino);
  }

  private animar = () => {
    const actual = this.activo().currentTime;

    // Corrige la deriva solo en la rama muda: ajustar la que se escucha se oiría.
    if (Math.abs(this.inactivo().currentTime - actual) > DERIVA_MAXIMA) {
      this.inactivo().currentTime = actual;
    }

    this.pintarAvance(actual);
    if (this.sonando) this.cuadro = requestAnimationFrame(this.animar);
  };

  private pintarAvance(segundos: number) {
    const proporcion = this.duracion() ? segundos / this.duracion() : 0;
    this.recorte.setAttribute('width', String(this.anchoOnda * proporcion));
    this.tiempo.textContent = formatearTiempo(segundos);
    this.onda.setAttribute('aria-valuenow', String(Math.round(segundos)));
    this.onda.setAttribute('aria-valuetext', `${Math.round(segundos)} segundos`);
  }

  private pintarPlay() {
    this.raiz
      .querySelector<SVGElement>('[data-icono="play"]')!
      .classList.toggle('hidden', this.sonando);
    this.raiz
      .querySelector<SVGElement>('[data-icono="pausa"]')!
      .classList.toggle('hidden', !this.sonando);
    this.botonPlay.setAttribute('aria-label', this.sonando ? 'Pausar' : 'Reproducir');
  }

  private pintarSeleccion() {
    for (const boton of this.opciones) {
      const activo = boton.dataset.lado === this.lado;
      boton.setAttribute('aria-checked', String(activo));
      boton.classList.toggle('bg-marca', activo);
      boton.classList.toggle('text-black', activo);
      boton.classList.toggle('text-texto-suave', !activo);
      // Solo la opción activa recibe foco al tabular dentro del grupo.
      boton.tabIndex = activo ? 0 : -1;
    }
  }
}

export function montarReproductores() {
  document.querySelectorAll<HTMLElement>('[data-reproductor-ab]').forEach((raiz) => {
    if (raiz.dataset.montado) return; // el script corre una vez por componente
    raiz.dataset.montado = '1';
    montados.push(new ReproductorAB(raiz));
  });
}
