import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

const StlViewer = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5));

    // const light = new THREE.SpotLight();
    // light.position.set(20, 20, 20);
    // scene.add(light);

    // Dentro de la función useEffect
const lightFront = new THREE.SpotLight(0xffffff); // Luz frontal
lightFront.position.set(0, 20, 200); // Posición en el frente
scene.add(lightFront);

const lightBack = new THREE.SpotLight(0xffffff); // Luz trasera
lightBack.position.set(0, -20, -200); // Posición en la parte trasera
scene.add(lightBack);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer();
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.target = new THREE.Vector3(3,3,3)
    controls.enableDamping = true;

    const material = new THREE.MeshStandardMaterial({
      color: 0xbbb2ffc8,
      metalness: 0.25,
      roughness: 0.1,
      transparent: true,
      opacity: 1.0,
    });

    const loader = new STLLoader();
    const stlFiles = ['Head.stl', 'Thing.stl', 'Body.stl', 'Hands.stl', 'Legs.stl'];

    const loadedModels: any[] = [];

    const loadSTL = (stlFile: string, index: number) => {
      loader.load(`/${stlFile}`, (geometry) => {
        const mesh = new THREE.Mesh(geometry, material);

        // Apply individual transformations to each mesh
        switch (index) {
          case 2: // Body.stl
            mesh.scale.set(2, 2, 2); // Example scale transformation
            mesh.position.set(8, -4, 10); // Example translation transformation
             mesh.rotation.set(0, (Math.PI/2), (3*(Math.PI/2)));
            break;
          case 3: // Hands.stl
            mesh.scale.set(1.5, 0, 1.5); // Example scale transformation
            mesh.position.set(0, 0, -80); // Example translation transformation
            break;
          case 0: // Head.stl
            mesh.scale.set(1.2, 1.2, 1.2); // Example scale transformation
            mesh.position.set(0, 0, -25); // Example translation transformation
             mesh.rotation.set((Math.PI), 4*Math.PI/3, Math.PI/2);
            break;
          case 4: // Legs.stl
            mesh.scale.set(0, 0, 2); // Example scale transformation
            mesh.position.set(0, -20, -2); // Example translation transformation
            mesh.rotation.set(0,3*(Math.PI/4) , 5*Math.PI/6); // Rotación de 180 grados alrededor del eje Y // Example rotation transformation
            break;
          // Add cases for other STL files and apply their respective transformations
          // ...

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
        // Scale the model to fit within a certain size
        const scaleFactor = 100 / Math.max(size.x, size.y, size.z);
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Position the model at the scene center
        model.position.sub(center);
      });
    };

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    }

    window.addEventListener('resize', onWindowResize, false);

    const animate = () => {
      // Para los frames del Orbit controls.
      // SCROLLING O ZOOM IN AND ZOOM OUT
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

    return () => {
      window.removeEventListener('resize', onWindowResize);
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return <div />;
};

export default StlViewer;