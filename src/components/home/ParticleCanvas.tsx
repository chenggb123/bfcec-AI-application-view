'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ParticleCanvasProps {
  active: boolean
}

export function ParticleCanvas({ active }: ParticleCanvasProps) {
  const animIdRef = useRef<number | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const linesMeshRef = useRef<THREE.LineSegments | null>(null)
  const mouseXRef = useRef(0)
  const mouseYRef = useRef(0)
  const targetMXRef = useRef(0)
  const targetMYRef = useRef(0)
  const onMouseRef = useRef<((e: MouseEvent) => void) | null>(null)
  const onResizeRef = useRef<(() => void) | null>(null)
  const runningRef = useRef(false)

  useEffect(() => {
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement | null
    if (!canvas) return

    const W = window.innerWidth
    const H = window.innerHeight

    // Scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(60, W / H, 1, 1000)
    camera.position.z = 160
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer

    // ---- Particles ----
    const COUNT = 250
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 300
      positions[i3 + 1] = (Math.random() - 0.5) * 220
      positions[i3 + 2] = (Math.random() - 0.5) * 120
      // Mix: ~80% red, ~20% white/cyan for data-feel
      if (Math.random() < 0.2) {
        colors[i3] = 0.6 + Math.random() * 0.4
        colors[i3 + 1] = 0.5 + Math.random() * 0.5
        colors[i3 + 2] = 0.6 + Math.random() * 0.4
      } else {
        colors[i3] = 0.7 + Math.random() * 0.3
        colors[i3 + 1] = 0.05 + Math.random() * 0.15
        colors[i3 + 2] = 0.02 + Math.random() * 0.08
      }
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Glow texture
    const glowCanvas = document.createElement('canvas')
    glowCanvas.width = 32
    glowCanvas.height = 32
    const ctx = glowCanvas.getContext('2d')!
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.15, 'rgba(255,255,255,0.8)')
    grad.addColorStop(0.5, 'rgba(218,41,28,0.3)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 32, 32)
    const glowTex = new THREE.CanvasTexture(glowCanvas)

    const mat = new THREE.PointsMaterial({
      size: 1.8,
      map: glowTex,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.65,
    })
    const particles = new THREE.Points(geo, mat)
    scene.add(particles)
    particlesRef.current = particles

    // Connection lines between particles
    const buildLines = () => {
      const lineGeo = new THREE.BufferGeometry()
      const linePositions: number[] = []
      const lineCols: number[] = []
      const maxDist = 60
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = positions[i * 3] - positions[j * 3]
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (dist < maxDist && Math.random() < 0.06) {
            linePositions.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
            linePositions.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2])
            const alpha = 1 - dist / maxDist
            lineCols.push(0.7 * alpha, 0.12 * alpha, 0.08 * alpha)
            lineCols.push(0.7 * alpha, 0.12 * alpha, 0.08 * alpha)
          }
        }
      }
      if (linePositions.length === 0) return
      lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3))
      lineGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(lineCols), 3))
      const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.3,
      })
      const linesMesh = new THREE.LineSegments(lineGeo, lineMat)
      scene.add(linesMesh)
      linesMeshRef.current = linesMesh
    }
    buildLines()

    // Mouse tracking
    const onMouse = (e: MouseEvent) => {
      targetMXRef.current = (e.clientX / window.innerWidth) * 2 - 1
      targetMYRef.current = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouse)
    onMouseRef.current = onMouse

    // Resize handler
    const onResize = () => {
      if (!rendererRef.current) return
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      rendererRef.current.setSize(w, h)
    }
    window.addEventListener('resize', onResize)
    onResizeRef.current = onResize

    // Cleanup on unmount
    return () => {
      if (animIdRef.current !== null) {
        cancelAnimationFrame(animIdRef.current)
        animIdRef.current = null
      }
      runningRef.current = false
      if (onMouseRef.current) window.removeEventListener('mousemove', onMouseRef.current)
      if (onResizeRef.current) window.removeEventListener('resize', onResizeRef.current)

      // Dispose Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current = null
      }

      // Clear scene
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.LineSegments) {
          if (obj.geometry) obj.geometry.dispose()
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose())
            } else {
              obj.material.dispose()
            }
          }
        }
      })

      sceneRef.current = null
      cameraRef.current = null
      particlesRef.current = null
      linesMeshRef.current = null
    }
  }, []) // Init once on mount

  // Handle active state changes - start/stop animation
  useEffect(() => {
    if (!sceneRef.current) return

    if (active) {
      if (runningRef.current) return
      runningRef.current = true
      const canvas = document.getElementById('particle-canvas')
      if (canvas) canvas.classList.add('active')

      const animate = () => {
        if (!runningRef.current) return
        animIdRef.current = requestAnimationFrame(animate)

        const scene = sceneRef.current
        const camera = cameraRef.current
        const renderer = rendererRef.current
        if (!scene || !camera || !renderer) return

        // Smooth mouse follow
        mouseXRef.current += (targetMXRef.current - mouseXRef.current) * 0.03
        mouseYRef.current += (targetMYRef.current - mouseYRef.current) * 0.03

        // Particles drift + rotation
        const particles = particlesRef.current
        if (particles) {
          const pos = particles.geometry.attributes.position.array as Float32Array
          for (let i = 0; i < pos.length; i += 3) {
            pos[i + 1] += 0.05
            if (pos[i + 1] > 130) pos[i + 1] = -130
            // Subtle horizontal drift toward mouse
            pos[i] += mouseXRef.current * 0.008
            if (Math.abs(pos[i]) > 160) pos[i] *= -0.95
          }
          particles.geometry.attributes.position.needsUpdate = true
          particles.rotation.y += 0.0003
        }

        const linesMesh = linesMeshRef.current
        if (linesMesh) {
          linesMesh.rotation.y += 0.00025
          linesMesh.rotation.x += 0.00015
        }

        // Camera subtle sway
        camera.position.x += (mouseXRef.current * 8 - camera.position.x) * 0.015
        camera.position.y += (mouseYRef.current * 5 - camera.position.y) * 0.015
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)
      }

      animate()
    } else {
      runningRef.current = false
      if (animIdRef.current !== null) {
        cancelAnimationFrame(animIdRef.current)
        animIdRef.current = null
      }
      const canvas = document.getElementById('particle-canvas')
      if (canvas) canvas.classList.remove('active')
    }
  }, [active])

  return null
}
