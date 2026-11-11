import { useEffect, useRef } from 'react'

// Animated dot grid behind the hero — ported from the original site's
// assets/js/main.js (same gap, radius, colour, reduced-motion handling).
export default function DotGrid() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    let dots = []
    let W = 0
    let H = 0
    let t = 0
    let raf = 0
    const GAP = 26
    const R = 2.2
    function resize() {
      const r = canvas.parentElement.getBoundingClientRect()
      W = canvas.width = r.width
      H = canvas.height = r.height
      dots = []
      for (let x = GAP / 2; x < W; x += GAP) {
        for (let y = GAP / 2; y < H; y += GAP) dots.push({ x, y, ph: (x + y) * 0.01 })
      }
    }
    function draw() {
      t += 0.012
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#d5d1cf'
      for (const d of dots) {
        const s = 1 + 0.25 * Math.sin(t + d.ph)
        ctx.beginPath()
        ctx.arc(d.x, d.y, R * s, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    resize()
    window.addEventListener('resize', resize)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ctx.fillStyle = '#d5d1cf'
      dots.forEach((d) => { ctx.beginPath(); ctx.arc(d.x, d.y, R, 0, Math.PI * 2); ctx.fill() })
    } else {
      draw()
    }
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="dotgrid-canvas" aria-hidden="true" />
}
