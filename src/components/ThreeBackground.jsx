import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function makeCircleTexture(size = 64) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const r = size / 2
  const grad = ctx.createRadialGradient(r, r, 0, r, r, r)
  grad.addColorStop(0,   'rgba(255,255,255,1)')
  grad.addColorStop(0.4, 'rgba(255,255,255,0.9)')
  grad.addColorStop(1,   'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(r, r, r, 0, Math.PI * 2)
  ctx.fill()
  return new THREE.CanvasTexture(c)
}

export default function ThreeBackground({ theme = 'ice' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const W = window.innerWidth
    const H = window.innerHeight

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    const circleTex = makeCircleTexture(64)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
    camera.position.z = 8

    const palettes = {
      ice:   [[0.659,0.847,0.918],[0.773,0.910,0.961],[0.910,0.957,0.973],[1.000,1.000,1.000],[0.494,0.722,0.827]],
      sunny: [[1.000,0.753,0.180],[1.000,0.647,0.000],[1.000,0.855,0.400],[1.000,0.900,0.600],[1.000,0.500,0.100]],
      green: [[0.298,0.686,0.314],[0.400,0.733,0.416],[0.647,0.839,0.655],[0.200,0.600,0.220],[0.550,0.780,0.560]],
      red:   [[0.898,0.224,0.208],[0.937,0.325,0.314],[0.800,0.100,0.100],[1.000,0.400,0.400],[0.600,0.050,0.100]],
    }
    const palette = palettes[theme] || palettes.ice

    /* ── Layer 1: Dense small sparkles ── */
    const COUNT1 = 4500
    const geo1 = new THREE.BufferGeometry()
    const pos1 = new Float32Array(COUNT1 * 3)
    const col1 = new Float32Array(COUNT1 * 3)
    const vel1 = new Float32Array(COUNT1 * 3)
    const phase1 = new Float32Array(COUNT1)

    for (let i = 0; i < COUNT1; i++) {
      pos1[i * 3]     = (Math.random() - 0.5) * 26
      pos1[i * 3 + 1] = (Math.random() - 0.5) * 26
      pos1[i * 3 + 2] = (Math.random() - 0.5) * 14

      const c = palette[Math.floor(Math.random() * palette.length)]
      col1[i * 3]     = c[0]
      col1[i * 3 + 1] = c[1]
      col1[i * 3 + 2] = c[2]

      vel1[i * 3]     = (Math.random() - 0.5) * 0.0025
      vel1[i * 3 + 1] = -(Math.random() * 0.003 + 0.0004)
      vel1[i * 3 + 2] = (Math.random() - 0.5) * 0.0008
      phase1[i]       = Math.random() * Math.PI * 2
    }

    geo1.setAttribute('position', new THREE.BufferAttribute(pos1, 3))
    geo1.setAttribute('color',    new THREE.BufferAttribute(col1, 3))

    const mat1 = new THREE.PointsMaterial({
      size: 0.12,
      map: circleTex,
      vertexColors: true,
      transparent: true,
      alphaTest: 0.01,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const pts1 = new THREE.Points(geo1, mat1)
    scene.add(pts1)

    /* ── Layer 2: Larger glow orbs ── */
    const COUNT2 = 280
    const geo2 = new THREE.BufferGeometry()
    const pos2 = new Float32Array(COUNT2 * 3)
    const col2 = new Float32Array(COUNT2 * 3)
    const vel2 = new Float32Array(COUNT2 * 3)

    for (let i = 0; i < COUNT2; i++) {
      pos2[i * 3]     = (Math.random() - 0.5) * 20
      pos2[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos2[i * 3 + 2] = (Math.random() - 0.5) * 8

      const c = palette[Math.floor(Math.random() * palette.length)]
      col2[i * 3]     = c[0]
      col2[i * 3 + 1] = c[1]
      col2[i * 3 + 2] = c[2]

      vel2[i * 3]     = (Math.random() - 0.5) * 0.0012
      vel2[i * 3 + 1] = -(Math.random() * 0.0012 + 0.0002)
      vel2[i * 3 + 2] = 0
    }

    geo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3))
    geo2.setAttribute('color',    new THREE.BufferAttribute(col2, 3))

    const mat2 = new THREE.PointsMaterial({
      size: 0.45,
      map: circleTex,
      vertexColors: true,
      transparent: true,
      alphaTest: 0.01,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const pts2 = new THREE.Points(geo2, mat2)
    scene.add(pts2)

    /* ── Layer 3: Slow giant haze blobs ── */
    const COUNT3 = 60
    const geo3 = new THREE.BufferGeometry()
    const pos3 = new Float32Array(COUNT3 * 3)
    const col3 = new Float32Array(COUNT3 * 3)

    for (let i = 0; i < COUNT3; i++) {
      pos3[i * 3]     = (Math.random() - 0.5) * 18
      pos3[i * 3 + 1] = (Math.random() - 0.5) * 18
      pos3[i * 3 + 2] = -4 + Math.random() * 3

      const haze = { ice:[0.659,0.847,0.918], sunny:[1.000,0.700,0.100], green:[0.298,0.686,0.314], red:[0.898,0.224,0.208] }[theme] || [0.659,0.847,0.918]
      col3[i * 3]     = haze[0]
      col3[i * 3 + 1] = haze[1]
      col3[i * 3 + 2] = haze[2]
    }

    geo3.setAttribute('position', new THREE.BufferAttribute(pos3, 3))
    geo3.setAttribute('color',    new THREE.BufferAttribute(col3, 3))

    const mat3 = new THREE.PointsMaterial({
      size: 2.2,
      map: circleTex,
      vertexColors: true,
      transparent: true,
      alphaTest: 0.001,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const pts3 = new THREE.Points(geo3, mat3)
    scene.add(pts3)

    /* ── Mouse ── */
    const mouse  = { x: 0, y: 0 }
    const camTgt = { x: 0, y: 0 }

    const onMouseMove = (e) => {
      mouse.x =  (e.clientX / window.innerWidth  - 0.5)
      mouse.y = -(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('mousemove', onMouseMove)

    /* ── Animation ── */
    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      const p1 = geo1.attributes.position.array
      for (let i = 0; i < COUNT1; i++) {
        p1[i * 3]     += vel1[i * 3]     + Math.sin(t * 0.25 + phase1[i]) * 0.00025
        p1[i * 3 + 1] += vel1[i * 3 + 1]
        p1[i * 3 + 2] += vel1[i * 3 + 2]
        if (p1[i * 3 + 1] < -13) p1[i * 3 + 1] = 13
        if (p1[i * 3]     >  13) p1[i * 3]     = -13
        if (p1[i * 3]     < -13) p1[i * 3]     = 13
      }
      geo1.attributes.position.needsUpdate = true

      const p2 = geo2.attributes.position.array
      for (let i = 0; i < COUNT2; i++) {
        p2[i * 3]     += vel2[i * 3]
        p2[i * 3 + 1] += vel2[i * 3 + 1]
        if (p2[i * 3 + 1] < -10) p2[i * 3 + 1] = 10
        if (p2[i * 3]     >  10) p2[i * 3]     = -10
        if (p2[i * 3]     < -10) p2[i * 3]     = 10
      }
      geo2.attributes.position.needsUpdate = true

      /* slow haze drift */
      const p3 = geo3.attributes.position.array
      for (let i = 0; i < COUNT3; i++) {
        p3[i * 3]     += Math.sin(t * 0.08 + i) * 0.0003
        p3[i * 3 + 1] += Math.cos(t * 0.06 + i) * 0.0002
      }
      geo3.attributes.position.needsUpdate = true

      /* smooth camera parallax */
      camTgt.x += (mouse.x * 0.9 - camTgt.x) * 0.035
      camTgt.y += (mouse.y * 0.55 - camTgt.y) * 0.035
      camera.position.x = camTgt.x
      camera.position.y = camTgt.y
      camera.lookAt(scene.position)

      pts1.rotation.y = Math.sin(t * 0.04) * 0.08
      pts2.rotation.y = Math.cos(t * 0.025) * 0.05

      renderer.render(scene, camera)
    }

    animate()

    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      ;[geo1, geo2, geo3, mat1, mat2, mat3, circleTex].forEach(o => o.dispose())
      renderer.dispose()
    }
  }, [theme])

  return (
    <>
      <div className="gif-bg" />
      <div className="gif-overlay" />
      <canvas ref={canvasRef} id="three-canvas" />
    </>
  )
}
