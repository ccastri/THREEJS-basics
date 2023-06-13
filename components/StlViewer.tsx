import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

const StlViewer = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5));
    
    const light = new THREE.SpotLight();
    light.position.set(20, 20, 20);
    scene.add(light);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer();
    renderer.outputColorSpace = THREE. SRGBColorSpace;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const material = new THREE.MeshStandardMaterial({
      color: 0xbbb2ffc8,
      metalness: 0.25,
      roughness: 0.1,
      transparent: true,
      opacity: 1.0,
    });

    const loader = new STLLoader();
    const stlFiles = ['Head.stl','Thing.stl','Body.stl', 'Hands.stl', 'Legs.stl', ]

    const loadedModels: any[] = [];
    let loadedCount = 0;

    const onLoad = (geometry: any) => {
      const mesh = new THREE.Mesh(geometry, material);
      loadedModels.push(mesh);
      mesh.scale.z=2
      scene.add(mesh);

      loadedCount++;
      if (loadedCount === stlFiles.length) {
        calculateAndApplyTransformations();
        render();
      }
    };

    const onProgress = (xhr: any) => {
      const stlFile = stlFiles[loadedCount];
      console.log(`${stlFile}: ${(xhr.loaded / xhr.total) * 100}% loaded`);
    };

    const onError = (error: any) => {
      console.log(error);
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
      requestAnimationFrame(animate);
      controls.update();
      render();
    };

    const render = () => {
      renderer.render(scene, camera);
    };

    stlFiles.forEach((stlFile) => {
      loader.load(`/${stlFile}`, onLoad, onProgress, onError);
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