import { forwardRef, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const MODEL_URL = `${import.meta.env.BASE_URL}car.glb`

const HeroVisual = forwardRef(function HeroVisual(_, ref) {
  const canvasHost = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const host = canvasHost.current
    if (!host) return

    let disposed = false
    let frame = 0
    let model = null
    let renderer
    let observer

    const scene = new THREE.Scene()

    // Orthographic camera keeps the car's proportions consistent.
    const camera = new THREE.OrthographicCamera(
      -6, 6, 2.5, -2.5, 0.1, 100
    )

    // Side view: assumes the car's length runs along the X axis.
    camera.position.set(14, 2, 0)
    camera.lookAt(0, 0.7, 0)

    scene.add(
      new THREE.HemisphereLight(0xeaf4d7, 0x141810, 2.0)
    )

    const key = new THREE.DirectionalLight(0xfff3d8, 3.2)
    key.position.set(-3.5, 7, 7)
    scene.add(key)

    const rim = new THREE.DirectionalLight(0xc9f24a, 2.6)
    rim.position.set(4, 3.5, -5)
    scene.add(rim)

    const fill = new THREE.DirectionalLight(0xc7d5ff, 1)
    fill.position.set(4, 2, 6)
    scene.add(fill)

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      })

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 1.5)
      )
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.18
      renderer.setClearColor(0x000000, 0)
      renderer.domElement.className = 'vehicle-3d-canvas'
      host.appendChild(renderer.domElement)
    } catch (error) {
      console.error('WebGL initialization failed:', error)
      setFailed(true)
      return
    }

    const resize = () => {
      if (!renderer || !host.clientWidth || !host.clientHeight) return

      const aspect = host.clientWidth / host.clientHeight
      const viewHeight = 4.8

      camera.left = -(viewHeight * aspect) / 2
      camera.right = (viewHeight * aspect) / 2
      camera.top = viewHeight / 2
      camera.bottom = -viewHeight / 2
      camera.updateProjectionMatrix()

      renderer.setSize(
        host.clientWidth,
        host.clientHeight,
        false
      )
    }

    observer = new ResizeObserver(resize)
    observer.observe(host)
    resize()

    const loader = new GLTFLoader()

    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) {
          gltf.scene.traverse((node) => {
            if (node.isMesh) {
              node.geometry?.dispose()
            }
          })
          return
        }

        model = gltf.scene

        model.traverse((node) => {
          if (!node.isMesh) return

          node.castShadow = false
          node.receiveShadow = false

          const materials = Array.isArray(node.material)
            ? node.material
            : [node.material]

          materials.forEach((material) => {
            if (!material) return
            if ('envMapIntensity' in material) {
              material.envMapIntensity = 1.15
            }
            if ('roughness' in material && material.roughness > 0.72) {
              material.roughness = 0.58
            }
            material.needsUpdate = true
          })
        })

        // Center and scale the model so it fits the viewport.
        const bounds = new THREE.Box3().setFromObject(model)
        const size = bounds.getSize(new THREE.Vector3())
        const center = bounds.getCenter(new THREE.Vector3())

        const maxDimension = Math.max(
          size.x, size.y, size.z, 0.001
        )

        // Smaller model; reduce 4.5 to 3.5 if needed.
        const scale = 7.5 / maxDimension

        model.scale.setScalar(scale)
        model.position.set(
          -center.x * scale,
          -bounds.min.y * scale - 0.08,
          -center.z * scale
        )
        model.rotation.y = Math.PI ;

        scene.add(model)
        setLoaded(true)
      },
      undefined,
      (error) => {
        console.error('Failed to load car GLB:', error)
        if (!disposed) setFailed(true)
      }
    )

    let animationId

    const render = () => {
      if (disposed || !renderer) return

      renderer.render(scene, camera)
      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      disposed = true
      cancelAnimationFrame(animationId)
      observer?.disconnect()

      if (model) {
        model.traverse((node) => {
          if (!node.isMesh) return

          node.geometry?.dispose()

          const materials = Array.isArray(node.material)
            ? node.material
            : [node.material]

          materials.forEach((material) => {
            if (!material) return

            for (const key in material) {
              if (material[key]?.isTexture) {
                material[key].dispose()
              }
            }

            material.dispose()
          })
        })
      }

      renderer?.dispose()

      if (renderer?.domElement.parentNode === host) {
        host.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="vehicle-wrap" ref={ref} aria-hidden="true">
      <div className="vehicle-glow" />

      <div
        className={`vehicle-3d-host ${loaded ? 'is-loaded' : ''}`}
        ref={canvasHost}
      />

      {!loaded && (
        <div className="vehicle-fallback">
          {failed
            ? 'Car model unavailable'
            : 'Loading car...'}
        </div>
      )}

      <span className="vehicle-caption">
        FIZZ / 3D PERFORMANCE STUDY — 001
      </span>
    </div>
  )
})

export default HeroVisual