'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const HEADLINE = 'WELCOME ITZFIZZ'

const stats = [
  {
    id: 'box1',
    value: '58%',
    label: 'Increase in pick up point use',
    bg: '#def54f',
    color: '#111',
  },
  {
    id: 'box2',
    value: '23%',
    label: 'Decreased in customer phone calls',
    bg: '#6ac9ff',
    color: '#111',
  },
  {
    id: 'box3',
    value: '27%',
    label: 'Increase in pick up point use',
    bg: '#333333',
    color: '#fff',
  },
  {
    id: 'box4',
    value: '40%',
    label: 'Decreased in customer phone calls',
    bg: '#fa7328',
    color: '#111',
  },
]

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const roadRef = useRef<HTMLDivElement>(null)
  const carRef = useRef<HTMLImageElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let rafCallback: ((time: number) => void) | undefined
    let refreshHandler: (() => void) | undefined

    // ── Smoother scroll (Lenis + GSAP ScrollTrigger) ──────────────────────
    if (!reduceMotion) {
      const lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        anchors: true,
      })
      lenis.on('scroll', ScrollTrigger.update)
      rafCallback = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(rafCallback)
      gsap.ticker.lagSmoothing(0)
      lenisRef.current = lenis
      // Keep Lenis' scroll limit in sync when ScrollTrigger adds pin spacing.
      refreshHandler = () => lenis.resize()
      ScrollTrigger.addEventListener('refresh', refreshHandler)
    }

    const section = sectionRef.current
    const track = trackRef.current
    const road = roadRef.current
    const car = carRef.current
    const trail = trailRef.current
    const valueEl = valueRef.current
    if (!section || !track || !road || !car || !trail || !valueEl) return

    // ── Build the headline letters (exactly like the demo) ────────────────
    valueEl.innerHTML = ''
    const letters: HTMLSpanElement[] = []
    HEADLINE.split('').forEach((ch) => {
      const span = document.createElement('span')
      span.className = 'value-letter'
      span.textContent = ch === ' ' ? '\u00A0' : ch
      valueEl.appendChild(span)
      letters.push(span)
    })

    // Demo constants
    const CAR_WIDTH = 150 // exactly as the demo hardcodes

    let letterOffsets: number[] = []
    let valueLeft = 0
    let roadWidth = window.innerWidth

    const measure = () => {
      valueLeft = valueEl.getBoundingClientRect().left
      letterOffsets = letters.map((l) => l.offsetLeft)
      roadWidth = road.getBoundingClientRect().width || window.innerWidth
    }

    // Travel far enough to light the final letter, but never less than the demo.
    const endX = () => {
      const lastOffset = letterOffsets[letterOffsets.length - 1] ?? 0
      const lastLetterX = valueLeft + lastOffset
      return Math.max(roadWidth - CAR_WIDTH, lastLetterX - CAR_WIDTH / 2 + 3)
    }

    requestAnimationFrame(() => {
      measure()
      ScrollTrigger.refresh()
    })

    // ── Car travel + trail + letter reveal (demo behaviour) ──────────────
    if (!reduceMotion) {
      gsap.to(car, {
        x: endX,
        ease: 'none',
        onUpdate: () => {
          const carX = (gsap.getProperty(car, 'x') as number) + CAR_WIDTH / 2

          letters.forEach((letter, i) => {
            const letterX = valueLeft + (letterOffsets[i] ?? 0)
            letter.style.opacity = carX >= letterX ? '1' : '0'
          })

          // Trail: same visual result as the demo's width, but transform-based
          const progress = Math.min(Math.max(carX / roadWidth, 0), 1)
          trail.style.transform = `scaleX(${progress})`
        },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
          pin: track,
          invalidateOnRefresh: true,
        },
      })

      // ── Stat cards fade in on scroll (demo milestones) ─────────────────
      const windows = [
        { start: 400, end: 600 },
        { start: 600, end: 800 },
        { start: 800, end: 1000 },
        { start: 1000, end: 1200 },
      ]
      stats.forEach((s, i) => {
        const el = document.getElementById(s.id)
        if (!el) return
        gsap.to(el, {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: `top+=${windows[i].start} top`,
            end: `top+=${windows[i].end} top`,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        })
      })
    } else {
      // Reduced motion: show the finished composition without scroll effects.
      measure()
      section.style.height = '100vh'
      letters.forEach((letter) => (letter.style.opacity = '1'))
      stats.forEach((s) => {
        const el = document.getElementById(s.id)
        if (el) el.style.opacity = '1'
      })
      car.style.transform = `translateX(${endX()}px)`
      trail.style.transform = `scaleX(${Math.min((endX() + CAR_WIDTH / 2) / roadWidth, 1)})`
    }

    const onResize = () => {
      measure()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)

    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    // Subtle entrance so the hero settles in on first paint.
    if (!reduceMotion) {
      gsap.fromTo(track, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.out' })
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
      if (refreshHandler) ScrollTrigger.removeEventListener('refresh', refreshHandler)
      if (rafCallback) gsap.ticker.remove(rafCallback)
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onLoad)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      style={{ height: '200vh', background: '#121212', fontFamily: 'sans-serif' }}
      aria-labelledby="hero-heading"
    >
      <div
        ref={trackRef}
        className="hero-track"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#d1d1d1',
        }}
      >
        <div
          ref={roadRef}
          className="hero-road"
          style={{
            position: 'relative',
            width: '100vw',
            height: 200,
            background: '#1e1e1e',
            overflow: 'hidden',
          }}
        >
          {/* Growing green trail (behind car) */}
          <div
            ref={trailRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              background: '#45db7d',
              transform: 'scaleX(0)',
              transformOrigin: 'left center',
              zIndex: 1,
            }}
          />

          {/* Car */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={carRef}
            src="/car.png"
            alt="McLaren 720S 2022 top view"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: 200,
              width: 'auto',
              zIndex: 10,
              willChange: 'transform',
              pointerEvents: 'none',
            }}
          />

          {/* Headline letters */}
          <div
            ref={valueRef}
            id="valueText"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%',
              left: '5%',
              transform: 'translateY(-50%)',
              display: 'flex',
              gap: 'clamp(0.05rem, 0.333vw, 0.3rem)',
              fontSize: 'min(8rem, 9.55vw)',
              fontWeight: 700,
              lineHeight: 1,
              color: '#111',
              zIndex: 5,
              whiteSpace: 'nowrap',
            }}
          />
        </div>

        {/* Stat cards (demo positions) */}
        {stats.map((s, i) => (
          <div
            key={s.id}
            id={s.id}
            className={`hero-stat hero-stat--${i + 1}`}
            style={{ background: s.bg, color: s.color }}
          >
            <span className="hero-stat-num">{s.value}</span>
            <span className="hero-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Hidden semantic heading for a11y/SEO */}
      <h1 id="hero-heading" className="sr-only">
        W E L C O M E I T Z F I Z Z
      </h1>
    </section>
  )
}
