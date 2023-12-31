// import React, { useEffect } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
// import *as dat from 'dat.gui'
// import Stats from 'three/examples/jsm/libs/stats.module'

// const StlViewer = () => {
  
//   //   
//   const initScene = () => {
//     const gui= new dat.GUI()
//           const scene = new THREE.Scene();
//           scene.add(new THREE.AxesHelper(5));
          
//           const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//           camera.position.z= 15;
//           scene.add(camera);
          
//           const renderer = new THREE.WebGLRenderer();
//           renderer.outputColorSpace = THREE.SRGBColorSpace;
//           renderer.setSize(window.innerWidth, window.innerHeight);
//           document.body.appendChild(renderer.domElement);
          
//           const controls = new OrbitControls(camera, renderer.domElement);
          
//           controls.target.y =5
//           controls.target.x =-15 
//           controls.enableDamping = true;
//           return { scene, camera, renderer, controls, gui };
//   }            
  
//   const setUpLights = (scene:any) =>{
  
//     const lightFront = new THREE.SpotLight(0xffffff); // Luz frontal
//     lightFront.position.set(0, 20, 200); // Posición en el frente
//     scene.add(lightFront);
    
//     const lightBack = new THREE.SpotLight(0xffffff); // Luz trasera
//     lightBack.position.set(0, -20, -200); // Posición en la parte trasera
//     scene.add(lightBack);
//   }


//   useEffect(() => {
//     const { scene, camera, renderer, controls, gui } = initScene();
//     setUpLights(scene);

//     const Object3D = {
//       mesh: 2,
//     };
            
//     // Dentro de la función useEffect


//  const loadSTLFiles = () => {
//   const loader = new STLLoader();
//   const stlFiles = ['Head.stl', 'Thing.stl', 'Body.stl', 'Hands.stl', 'Legs.stl', 'mandible-segmeneted.stl'];
//   const loadedModels = [];
//   const material = new THREE.MeshStandardMaterial({
//     color: 0xbbb2ffc8,
//     metalness: 0.25,
//     roughness: 0.1,
//     transparent: true,
//     opacity: 1.0,
//     wireframe: true,
//   });

//   const loadSTL = (stlFile:any, index:any) => {
//     loader.load(`/${stlFile}`, (geometry) => {
//       const mesh = new THREE.Mesh(geometry, material);
//       const fileName = stlFile.split('.')[0];

//       const addPositionControls = () => {
//         const defaultPosition = {
//           x: mesh.position.x,
//           y: mesh.position.y,
//           z: mesh.position.z,
//         };

//         const positionsFolder = gui.addFolder(`${fileName} - Positions`);
//         positionsFolder
//           .add(mesh.position, 'x')
//           .min(-100)
//           .max(100)
//           .step(0.5)
//           .name(`${fileName} - Pos X`)
//           .onChange(() => (defaultPosition.x = mesh.position.x));
//         positionsFolder
//           .add(mesh.position, 'y')
//           .min(-100)
//           .max(100)
//           .step(0.5)
//           .name(`${fileName} - Pos Y`)
//           .onChange(() => (defaultPosition.y = mesh.position.y));
//         positionsFolder
//           .add(mesh.position, 'z')
//           .min(-100)
//           .max(100)
//           .step(0.5)
//           .name(`${fileName} - Pos Z`)
//           .onChange(() => (defaultPosition.z = mesh.position.z));
//       };

//       const addRotationControls = () => {
//         const defaultRotation = {
//           x: mesh.rotation.x,
//           y: mesh.rotation.y,
//           z: mesh.rotation.z,
//         };

//         const rotationsFolder = gui.addFolder(`${fileName} - Rotations`);
//         rotationsFolder
//           .add(mesh.rotation, 'x', 0, 2 * Math.PI)
//           .name(`${fileName} - Rot X`)
//           .onChange(() => (defaultRotation.x = mesh.rotation.x));
//         rotationsFolder
//           .add(mesh.rotation, 'y', 0, 2 * Math.PI)
//           .name(`${fileName} - Rot Y`)
//           .onChange(() => (defaultRotation.y = mesh.rotation.y));
//         rotationsFolder
//           .add(mesh.rotation, 'z', 0, 2 * Math.PI)
//           .name(`${fileName} - Rot Z`)
//           .onChange(() => (defaultRotation.z = mesh.rotation.z));
//       };

//       const addScaleControls = () => {
//         const meshAux = {
//           scale: 1.2,
//           color: 0xffffff,
//         };

//         gui
//           .add(meshAux, 'scale', {
//             Small: 1.2,
//             Medium: 2.4,
//             Big: 3.6,
//           })
//           .name(`${fileName} - Scale All`)
//           .onChange(() => {
//             mesh.scale.set(meshAux.scale, meshAux.scale, meshAux.scale);
//             colorController.updateDisplay();
//           });

//         gui
//           .add(mesh.scale, 'x', {
//             Small: 1,
//             Medium: 2,
//             Big: 3,
//           })
//           .name(`${fileName} - Scale X`)
//           .onChange(() => console.log(Object3D.mesh));

//         const colorController = gui
//           .addColor(meshAux, 'color')
//           .name(`${fileName} - Color`)
//           .onChange(() => {
//             mesh.material.color.set(meshAux.color);
//           });
//       };

//       addPositionControls();
//       addRotationControls();
//       addScaleControls();

//       scene.add(mesh);
//       loadedModels.push(mesh);

//       if (loadedModels.length === stlFiles.length) {
//         calculateAndApplyTransformations();
//         render();
//       }
//     }, undefined, (error) => {
//       console.error(`Error loading STL file '${stlFile}':`, error);
//     });

    
//   };

//   stlFiles.forEach((stlFile: any, index: number) => {
//     loadSTL(stlFile, index);
//   });
// };
// const loadedModels: any =[]
//     const calculateAndApplyTransformations = () => {
//       const boundingBox = new THREE.Box3();
//       loadedModels.forEach((model: any) => boundingBox.expandByObject(model));

//       const center = boundingBox.getCenter(new THREE.Vector3());
//       const size = boundingBox.getSize(new THREE.Vector3());

//       loadedModels.forEach((model: any) => {
//         // Scale the model to fit within a certain size
//         const scaleFactor = 100 / Math.max(size.x, size.y, size.z);
//         model.scale.set(scaleFactor, scaleFactor, scaleFactor);

//         // Position the model at the scene center
//         model.position.sub(center);
//       });
//     };

//     function onWindowResize() {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//       render();
//     }

//     window.addEventListener('resize', onWindowResize, false);

// const stats = new Stats()
// document.body.appendChild(stats.dom)
//     const animate = () => {
//       // Para los frames del Orbit controls.
//       // SCROLLING O ZOOM IN AND ZOOM OUT
//       requestAnimationFrame(animate);

//       // Element rotation
//       loadedModels.forEach((model: any)=>
//         {

//           model.rotation.x += 0.01
//           model.rotation.y += 0.01
//         })
//       controls.update();
//         stats.update()
//       render();
//     };

//     const render = () => {
//       renderer.render(scene, camera);
//     };

//     stlFiles.forEach((stlFile, index) => {
//       loadSTL(stlFile, index);
//     });

//     animate();
// // Clean up...
//     return () => {
//       window.removeEventListener('resize', onWindowResize);
//       gui.destroy()
     
//       document.body.removeChild(renderer.domElement);
//     };
//   }, []);

//   return <div />;
// };

// export default StlViewer;