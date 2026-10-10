import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default function HeroCar() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(4, 2.2, 6);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x182018, 2));

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(4, 6, 5);
    scene.add(light);

    const greenLight = new THREE.PointLight(0x39ff14, 30, 10);
    greenLight.position.set(0, 0.3, 2);
    scene.add(greenLight);

    let car;
    let frameId;

    new GLTFLoader().load(
      "public/car.glb",
      (gltf) => {
        car = gltf.scene;

        // Automatically center and scale the model
        const box = new THREE.Box3().setFromObject(car);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        car.position.sub(center);

        const maxDimension = Math.max(size.x, size.y, size.z);
        if (maxDimension > 0) {
          car.scale.setScalar(4 / maxDimension);
        }

        scene.add(car);
      },
      undefined,
      (error) => {
        console.error("Car model failed to load:", error);
      }
    );

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (car) {
        car.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const materials = Array.isArray(obj.material)
            ? obj.material
            : [obj.material];

          materials.forEach((material) => {
            for (const key in material) {
              const value = material[key];
              if (value?.isTexture) value.dispose();
            }
            material.dispose();
          });
        }
      });
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "500px",
        overflow: "hidden",
      }}
    />
  );
}