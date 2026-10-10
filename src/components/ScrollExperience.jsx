import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import HeroVisual from './HeroVisual.jsx'
import ImpactStats from './ImpactStats.jsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const title = 'WELCOME ITZ FIZZ'

export default function ScrollExperience() {
  const root = useRef(null)
  const stage = useRef(null)
  const vehicle = useRef(null)
  const trail = useRef(null)
  const charsRef = useRef([])
  const stats = useRef(null)
  const cue = useRef(null)
  const progress = useRef(null)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const chars = charsRef.current.filter(Boolean)
    const statItems = gsap.utils.toArray('.stat', stats.current)
    const nav = gsap.utils.toArray('.navbar .wordmark,.navbar .nav-center,.navbar .menu-toggle')

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
    intro.fromTo(nav, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .08 }, 0)
      .fromTo('.hero-kicker', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: .6 }, .1)
      .fromTo(chars, { yPercent: 105, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .72, stagger: .026 }, .18)
      .fromTo('.hero-deck', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .7 }, .4)
      .fromTo(vehicle.current, { opacity: 0, scale: .94 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' }, .25)
      .fromTo(statItems, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .1 }, .55)
      .fromTo(cue.current, { opacity: 0 }, { opacity: 1, duration: .5 }, .95)

    if (reduced) {
      gsap.set([vehicle.current, trail.current, chars, statItems, cue.current], { clearProps: 'all' })
      return
    }

    const mm = gsap.matchMedia()
    mm.add({ desktop: '(min-width: 761px)', mobile: '(max-width: 760px)' }, context => {
      const mobile = context.conditions.mobile
      const getTravel = () => {
        const stageWidth = stage.current.clientWidth
        const carWidth = vehicle.current.getBoundingClientRect().width
        return { start: -carWidth * (mobile ? .94 : 1.04), finish: stageWidth - carWidth * (mobile ? .12 : .08) }
      }
      const travel = getTravel()
      gsap.set(vehicle.current, { x: travel.start, y: 0, scale: mobile ? .92 : .96, transformOrigin: '50% 70%' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * (mobile ? 2.35 : 2.65))}`,
          scrub: .65,
          pin: stage.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: self => {
            const next = getTravel()
            gsap.set(vehicle.current, { x: next.start })
            self.animation?.invalidate()
          },
          onUpdate: self => {
            if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`
          }
        }
      })

      // Four story beats in one continuous, reversible scroll timeline.
      tl.addLabel('arrival', 0)
        .to('.arrival-copy', { opacity: 0, y: -28, duration: .14, ease: 'none' }, .08)
        .to(vehicle.current, { x: () => getTravel().finish, scale: mobile ? 1.02 : 1.1, y: mobile ? -3 : -7, duration: .68, ease: 'none' }, .08)
        .to(trail.current, { scaleX: 1, opacity: .9, duration: .58, ease: 'none' }, .12)
        .to('.road-markings', { xPercent: -24, duration: .68, ease: 'none' }, .08)
        .to('.vehicle-glow', { opacity: .62, scaleX: 1.16, duration: .68, ease: 'none' }, .08)
        .to('.light-streak--one', { xPercent: 125, opacity: .7, duration: .35, ease: 'none' }, .18)
        .to('.light-streak--two', { xPercent: -100, opacity: .5, duration: .4, ease: 'none' }, .28)
        .to(chars, { color: '#efff85', stagger: { each: .012, from: 'start' }, duration: .2, ease: 'none' }, .12)
        .to('.drive-copy', { opacity: 1, y: 0, duration: .12, ease: 'none' }, .32)
        .to('.hero-title-wrap', { opacity: .15, y: -45, scale: .94, duration: .2, ease: 'none' }, .35)
        .to(statItems, { y: -12, opacity: .15, stagger: .025, duration: .16, ease: 'none' }, .34)
        .to('.road-halo', { opacity: 1, scale: 1.18, duration: .3, ease: 'none' }, .38)
        .to(vehicle.current, { scale: mobile ? 1.08 : 1.2, y: mobile ? 0 : -2, duration: .15, ease: 'none' }, .55)
        .to('.drive-copy', { opacity: 0, y: -18, duration: .1, ease: 'none' }, .59)
        .to('.hero-moment', { opacity: 1, y: 0, duration: .13, ease: 'none' }, .61)
        .to('.stage-atmosphere', { backgroundColor: '#c9f24a', duration: .13, ease: 'none' }, .65)
        .to('.hero-moment', { color: '#10120e', duration: .1, ease: 'none' }, .66)
        .to('.hero-moment em', { color: '#f2f0e5', duration: .1, ease: 'none' }, .66)
        .to(vehicle.current, { x: () => getTravel().finish + (mobile ? vehicle.current.offsetWidth * .2 : vehicle.current.offsetWidth * .12), scale: mobile ? 1.1 : 1.22, y: mobile ? 5 : 8, duration: .18, ease: 'none' }, .76)
        .to('.hero-moment', { opacity: 0, y: -20, duration: .1, ease: 'none' }, .82)
        .to('.end-stamp', { opacity: 1, y: 0, rotate: -4, duration: .12, ease: 'none' }, .84)
        .to('.stage-atmosphere', { backgroundColor: '#10120e', duration: .14, ease: 'none' }, .91)
        .to('.exit-copy', { opacity: 1, y: 0, duration: .12, ease: 'none' }, .9)
        .to('.scroll-cue', { opacity: .2, duration: .1, ease: 'none' }, .88)

      return () => tl.scrollTrigger?.kill()
    })

    const refresh = () => ScrollTrigger.refresh()
    const raf = requestAnimationFrame(refresh)
    window.addEventListener('load', refresh, { once: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('load', refresh)
      mm.revert()
    }
  }, { scope: root })

  return (
    <section className="scroll-experience" id="top" ref={root} aria-label="ITZ FIZZ introduction">
      <div className="pinned-stage" ref={stage}>
        <div className="stage-atmosphere" aria-hidden="true" />
        <div className="stage-grid" aria-hidden="true" />
        <div className="hero-topline">
          <span className="hero-kicker"><i /> INDEPENDENT SPIRIT. UNCOMPROMISED SPARK.</span>
          <span className="hero-coordinates">EST. ANYWHERE / MADE FOR RIGHT NOW</span>
        </div>
        <div className="hero-title-wrap arrival-copy">
          <p className="hero-pretitle">A DIFFERENT KIND OF REFRESHMENT</p>
          <h1 className="hero-title" aria-label={title}>{title.split('').map((c, i) => <span key={`${c}-${i}`} className={`title-char ${c === ' ' ? 'space-char' : ''}`} ref={el => charsRef.current[i] = el} aria-hidden="true">{c === ' ' ? '\u00a0' : c}</span>)}</h1>
          <p className="hero-deck">TURN THE ORDINARY <em>UP.</em><br className="mobile-break" /> KEEP THE GOOD STUFF COMING.</p>
        </div>
        <div className="impact-area" ref={stats}><ImpactStats /></div>
        <div className="road-scene">
          <div className="road-halo" />
          <div className="road">
            <div className="road-edge road-edge--top" />
            <div className="road-centerline" />
            <div className="road-centerline road-centerline--second" />
            <div className="road-markings" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
            <div className="road-line" />
            <div className="trail" ref={trail} />
          </div>
          <div className="light-streak light-streak--one" aria-hidden="true" />
          <div className="light-streak light-streak--two" aria-hidden="true" />
          <HeroVisual ref={vehicle} />
          <span className="road-label road-label--left">01 / THE ARRIVAL</span>
          <span className="road-label road-label--right">FORWARD IS A FEELING →</span>
        </div>
        <div className="drive-copy"><span>02 / THE DRIVE</span><strong>DON’T JUST<br />PASS THROUGH.</strong><i>MAKE AN IMPRESSION.</i></div>
        <div className="hero-moment">BUILT FOR<br /><em>THE DETOUR.</em></div>
        <div className="exit-copy"><span>04 / THE EXIT</span><strong>LEAVE A LITTLE<br />LIME IN YOUR WAKE.</strong></div>
        <div className="stage-footer">
          <div className="scroll-cue" ref={cue}><span className="scroll-wheel" /><span>SCROLL TO FEEL IT</span></div>
          <span className="stage-footnote">NOT HERE TO BLEND IN.</span>
          <span className="stage-page">IF—001 <b>·</b> 2026</span>
        </div>
        <div className="scroll-edition"><span>THE ITZ FIZZ EFFECT</span><strong>MAKE ROOM<br />FOR A LITTLE <i>MORE.</i></strong></div>
        <div className="end-stamp">GOOD<br />ENERGY<br /><span>ONLY.</span></div>
        <div className="scroll-progress" aria-hidden="true"><span ref={progress} /></div>
      </div>
    </section>
  )
}
