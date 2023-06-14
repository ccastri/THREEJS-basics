import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import *as dat from 'dat.gui'
import Stats from 'three/examples/jsm/libs/stats.module'

const StlViewer = () => {
  
  //   
  
  useEffect(() => {

    const gui= new dat.GUI()
     const Object3D = {
              mesh: 2,
            };
            const scene = new THREE.Scene();
            scene.add(new THREE.AxesHelper(5));
            
            
            
    // Dentro de la función useEffect
const lightFront = new THREE.SpotLight(0xffffff); // Luz frontal
lightFront.position.set(0, 20, 200); // Posición en el frente
scene.add(lightFront);

const lightBack = new THREE.SpotLight(0xffffff); // Luz trasera
lightBack.position.set(0, -20, -200); // Posición en la parte trasera
scene.add(lightBack);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z= 15;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer();
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    
    controls.target.y =5
    controls.target.x =-15 
    controls.enableDamping = true;

    const material = new THREE.MeshStandardMaterial({
      color: 0xbbb2ffc8,
      metalness: 0.25,
      roughness: 0.1,
      transparent: true,
      opacity: 1.0,
      wireframe:true
    });
    
    const loader = new STLLoader();
    const stlFiles = ['Head.stl', 'Thing.stl', 'Body.stl', 'Hands.stl', 'Legs.stl'];
    
    const loadedModels: any[] = [];
      let mesh: any; 
    const loadSTL = (stlFile: string, index: number) => {
      //  const folder = new THREE.Group();
      loader.load(`/${stlFile}`, (geometry) => {
        mesh = new THREE.Mesh(geometry, material);
        
        // Apply individual transformations to each mesh
        // switch (index) {
        //   case 2: // Body.stl
        //   mesh.scale.set(2, 2, 2); // Example scale transformation
        //     mesh.position.set(8, -4, 10); // Example translation transformation
        //      mesh.rotation.set(0, (Math.PI/2), (3*(Math.PI/2)));
        //     break;
        //   case 3: // Hands.stl
        //     mesh.scale.set(1.5, 0, 1.5); // Example scale transformation
        //     mesh.position.set(0, 0, -80); // Example translation transformation
        //     break;
        //   case 0: // Head.stl
        //     mesh.scale.set(1.2, 1.2, 1.2); // Example scale transformation
        //     mesh.position.set(0, 0, -25); // Example translation transformation
        //      mesh.rotation.set((Math.PI), 4*Math.PI/3, Math.PI/2);
        //     break;
        //   case 4: // Legs.stl
        //     mesh.scale.set(0, 0, 2); // Example scale transformation
        //     mesh.position.set(0, -20, -2); // Example translation transformation
        //     mesh.rotation.set(0,3*(Math.PI/4) , 5*Math.PI/6); // Rotación de 180 grados alrededor del eje Y // Example rotation transformation
        //     break;
        //   // Add cases for other STL files and apply their respective transformations
        //   // ...
          
        //   default:
        //     break;
        //   }
          //  folder.add(mesh);
          const fileName = stlFile.split('.')[0]; // Extract the file name without the extension
          // Add GUI controls to the mesh position within the folder with the file name as the name
          let defaultPosition = {
  x: mesh.position.x,
  y: mesh.position.y,
  z: mesh.position.z
};

let defaultRotation = {
  x: mesh.rotation.x,
  y: mesh.rotation.y,
  z: mesh.rotation.z
};
      const positionsFolder = gui.addFolder(`${fileName} - Positions`);
          positionsFolder.add(mesh.position, 'x').min(-100).max(100).step(0.5).name(`${fileName} - Pos X`).onChange(() => defaultPosition.x = mesh.position.x);
          positionsFolder.add(mesh.position, 'y').min(-100).max(100).step(0.5).name(`${fileName} - Pos Y`).onChange(() => defaultPosition.y = mesh.position.y);
          positionsFolder.add(mesh.position, 'z').min(-100).max(100).step(0.5).name(`${fileName} - Pos Z`).onChange(() => defaultPosition.z = mesh.position.z)
                const rotationsFolder = gui.addFolder(`${fileName} - Rotations`);
          rotationsFolder.add(mesh.rotation, 'x',0, 2*Math.PI).name(`${fileName} - Rot X`).onChange(() => defaultRotation.x = mesh.rotation.x);
          rotationsFolder.add(mesh.rotation, 'y',0, 2*Math.PI).name(`${fileName} - Rot Y`).onChange(() => defaultRotation.y = mesh.rotation.y);
          rotationsFolder.add(mesh.rotation, 'z',0, 2*Math.PI).name(`${fileName} - Rot Z`).onChange(() => defaultRotation.z = mesh.rotation.z)
    
    
    
    const meshAux= {
      scale: 1.2,
      color: 0xfffff
     
    }
    gui.add(meshAux, 'scale', {
      "Small": 1.2,
      "Medium": 2.4,
      "Big": 3.6,
    }).name(`${fileName} - Scale All`,).onChange(() => {mesh.scale.set(meshAux.scale, meshAux.scale, meshAux.scale); colorController.updateDisplay();})
    
    gui.add(mesh.scale, 'x', {
      "Small": 1,
      "Medium": 2,
      "Big": 3,
    }).name(`${fileName} - Scale X`,).onChange(() => console.log(Object3D.mesh))
    const  colorController= gui.addColor(meshAux, 'color',)
    .name(`${fileName} - Color`,)
    .onChange(() => {mesh.material.color.set(meshAux.color)
    //  colorController.updateDisplay();
    })
           scene.add(mesh);
           loadedModels.push(mesh);

        if (loadedModels.length === stlFiles.length) {
          calculateAndApplyTransformations();
          render();
        }
        // return mesh
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

const stats = new Stats()
document.body.appendChild(stats.dom)
    const animate = () => {
      // Para los frames del Orbit controls.
      // SCROLLING O ZOOM IN AND ZOOM OUT
      requestAnimationFrame(animate);
      loadedModels.forEach(model=>
        {

          model.rotation.x += 0.01
          model.rotation.y += 0.01
        })
      controls.update();
        stats.update()
      render();
    };

    const render = () => {
      renderer.render(scene, camera);
    };

    stlFiles.forEach((stlFile, index) => {
      loadSTL(stlFile, index);
    });

    animate();
// Clean up...
    return () => {
      window.removeEventListener('resize', onWindowResize);
      gui.destroy()
     
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return <div />;
};

export default StlViewer;