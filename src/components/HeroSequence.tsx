import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
const frameUrl = (i: number) =>
  `/frames/frame_${String(i).padStart(3, "0")}.jpg`;

export function HeroSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!canvas || !section || !sticky) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: HTMLImageElement[] = [];
    const state = { frame: 0 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = sticky.clientWidth;
      const h = sticky.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      render();
    };

    const render = () => {
      const img = images[state.frame];
      if (!img || !img.complete || !img.naturalWidth) return;
      const cw = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    let firstLoaded = false;
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameUrl(i);
      img.onload = () => {
        if (!firstLoaded) {
          firstLoaded = true;
          render();
        }
      };
      images[i - 1] = img;
    }

    resize();
    window.addEventListener("resize", resize);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=3000",
      pin: sticky,
      scrub: 0.5,
      onUpdate: (self) => {
        const f = Math.min(
          FRAME_COUNT - 1,
          Math.max(0, Math.floor(self.progress * (FRAME_COUNT - 1))),
        );
        if (f !== state.frame) {
          state.frame = f;
          render();
        }
      },
    });

    return () => {
      window.removeEventListener("resize", resize);
      trigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full">
      <div
        ref={stickyRef}
        className="relative w-full overflow-hidden bg-background"
        style={{ height: "110vh" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-label="Plant scanning sequence"
        />
        {/* Bottom fade to blend into the page */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary/70 text-xs tracking-[0.3em] font-display animate-pulse">
          SCROLL
        </div>
      </div>
    </section>
  );
}

export default HeroSequence;
