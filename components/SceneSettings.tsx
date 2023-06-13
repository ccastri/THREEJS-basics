import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

export const useSceneMount = (mountRef: React.RefObject<HTMLDivElement>) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const stlFiles = ['Head.stl', 'Thing.stl', 'Body.stl', 'Hands.stl', 'Legs.stl'];
  const loadedModelsRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    const mountScene = () => {
      if (!mountRef.current) return;

      const scene = new THREE.Scene();
      scene.add(new THREE.AxesHelper(5));
      sceneRef.current = scene;

      const lightFront = new THREE.SpotLight(0xffffff);
      lightFront.position.set(0, 20, 200);
      scene.add(lightFront);

      const lightBack = new THREE.SpotLight(0xffffff);
      lightBack.position.set(0, -20, -200);
      scene.add(lightBack);

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 10;
      scene.add(camera);

      const renderer = new THREE.WebGLRenderer();
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(-10, 5, 0);
      controls.enableDamping = true;
      controlsRef.current = controls;

      const material = new THREE.MeshStandardMaterial({
        color: 0xbbb2ffc8,
        metalness: 0.25,
        roughness: 0.1,
        transparent: true,
        opacity: 1.0,
      });

      const loader = new STLLoader();
      const loadedModels: THREE.Mesh[] = [];
      loadedModelsRef.current = loadedModels;

      const loadSTL = (stlFile: string, index: number) => {
        loader.load(`/${stlFile}`, (geometry) => {
          const mesh = new THREE.Mesh(geometry, material);

          switch (index) {
            case 2:
              mesh.scale.set(2, 2, 2);
              mesh.position.set(8, -4, 10);
              mesh.rotation.set(0, Math.PI / 2, 3 * (Math.PI / 2));
              break;
            case 3:
              mesh.scale.set(1.5, 0, 1.5);
              mesh.position.set(0, 0, -80);
              break;
            case 0:
              mesh.scale.set(1.2, 1.2, 1.2);
              mesh.position.set(0, 0, -25);
              mesh.rotation.set(Math.PI, (4 * Math.PI) / 3, Math.PI / 2);
              break;
            case 4:
              mesh.scale.set(0, 0, 2);
              mesh.position.set(0, -20, -2);
              mesh.rotation.set(0, (3 * Math.PI) / 4, (5 * Math.PI) / 6);
              break;
            default:
              break;
          }

          scene.add(mesh);
          loadedModels.push(mesh);

          if (loadedModels.length === stlFiles.length) {
            calculateAndApplyTransformations();
            render();
          }
        }, undefined, (error) => {
          console.error(`Error loading STL file '${stlFile}':`, error);
        });
      };

      const calculateAndApplyTransformations = () => {
        const boundingBox = new THREE.Box3();
        loadedModels.forEach((model) => boundingBox.expandByObject(model));

        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());

        loadedModels.forEach((model) => {
          const scaleFactor = 100 / Math.max(size.x, size.y, size.z);
          model.scale.set(scaleFactor, scaleFactor, scaleFactor);
          model.position.sub(center);
        });
      };

      const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
      };

      window.addEventListener('resize', onWindowResize, false);

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        render();
      };

      const render = () => {
        renderer.render(scene, camera);
      };

      stlFiles.forEach((stlFile, index) => {
        loadSTL(stlFile, index);
      });

      animate();
    };

    mountScene();

    return () => {
      // Cleanup code...
    };
  }, [mountRef]);

  return { sceneRef, rendererRef, controlsRef, loadedModelsRef };
};