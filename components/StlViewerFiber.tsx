// ! Within this component you will be able to render two different 3d models
// !Merlina y a knee prosthesis bellow you will encounter the coordinates 
// !For manually center each model (look into the calculateAndApplyTransform function to do so)


import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import *as dat from 'dat.gui'
import Stats from 'three/examples/jsm/libs/stats.module'

const StlViewer = () => {
  
  //   
  //! useEffect to run the scene at loading time
  useEffect(() => {
//! Instanciationg debugger ( new dat.GUI() object)
//! Define object 3d for scalation pourposes
    const gui= new dat.GUI()
     const Object3D = {
              mesh: 2,
            };
//! Create new scene and add the axis helper
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5));
            
            
            
    // Front and Back lights. It was just randomly chosen
//! There could be a pointLight, ambientLight or wathever
const lightFront = new THREE.SpotLight(0xffffff); // Luz frontal
lightFront.position.set(0, 20, 200); // Posición en el frente
scene.add(lightFront);

const lightBack = new THREE.SpotLight(0xffffff); // Luz trasera
lightBack.position.set(0, 20, -200); // Posición en la parte trasera
scene.add(lightBack);

//! Create camera object with field of view,
//!  the ratio between width and height (screenSize) and
//!  the closest and farthest zoom
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z= 15;
scene.add(camera);

//! Renderer which you may understante as drawing everything on the scene
// !You have to define height and width into the view
// !Then, to make a reference of the object through the dom by appending it into the current node
const renderer = new THREE.WebGLRenderer();
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
   
// !Orbit control allow us to control de view within de 3D space:
// ! We can zoom in and out, perfomr rotations, pick objects from the scene
// ! Among others and there are different view controllers at the docs
// ! You can switch or even combine
    const controls = new OrbitControls(camera, renderer.domElement);
    
    // controls.target.set()
// ! Smoothed stop when no longer zooming
    controls.enableDamping = true;
// ! Othe helper to pull the grid over
// !Add it to the scene
    const grid = new THREE.GridHelper()
    scene.add(grid)
// ! Define the material props
    const material = new THREE.MeshStandardMaterial({
      color: 0xbbb2ffc8,
      metalness: 0.25,
      roughness: 0.1,
      transparent: true,
      opacity: 1.0,
      wireframe:true
    });
    // ! Create a new intance for the STL loader from three js
    const loader = new STLLoader();
    //! Define both groups of files
    // TODO: toggle button for switching and centering models
    const stlFiles2 = ['Head.stl', 'Thing.stl', 'Body.stl', 'Hands.stl', 'Legs.stl', 'mandible-segmeneted.stl' ];
    const stlFiles = ['Knee_Prosthesis_1.stl', 'Knee_Prosthesis_2.stl', 'Knee_Prosthesis_3.stl' , 'Knee_Prosthesis_4.stl', 'Knee_Prosthesis_5.stl', 'Knee_Prosthesis_assembled.stl'];

    // !This is a const to save up the current list of models being rendered
    const loadedModels: any[] = [];
      let mesh: any; 

      //! LoadSTL fnc: Se encarga de la carga iterada para los elementos recibidos en STLFile
      //! Requiere que un elemento sea cargado
      //! Por callback crea el mesh que une la geometria y el material
      // !
    const loadSTL = (stlFile: string, index: number) => {
      //  const folder = new THREE.Group();
      loader.load(`/files/${stlFile}`, (geometry) => {
        mesh = new THREE.Mesh(geometry, material);
        

        //! This is to set a default starting position for each
        //! mesh models created for any individual piece on the 3D scene
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
        //   case 4: // Thing.stl
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
          // !This is simply to get the name of each STL file
          // !I needed later on for the gui controllers names
          const fileName = stlFile.split('.')[0]; // Extract the file name without the extension
          
          // TODO: Another posibility to center out a model as soon as rendered
          // Add GUI controls to the mesh position within the folder with the file name as the name
          // 
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
// !Create folders for position and rotations real time updates on each axis with dat gui
const positionsFolder = gui.addFolder(`${fileName} - Positions`);
positionsFolder.add(mesh.position, 'x').min(-100).max(100).step(0.01).name(`${fileName} - Pos X`).onChange(() => defaultPosition.x = mesh.position.x);
          positionsFolder.add(mesh.position, 'y').min(-100).max(100).step(0.01).name(`${fileName} - Pos Y`).onChange(() => defaultPosition.y = mesh.position.y);
          positionsFolder.add(mesh.position, 'z').min(-100).max(100).step(0.01).name(`${fileName} - Pos Z`).onChange(() => defaultPosition.z = mesh.position.z)
                const rotationsFolder = gui.addFolder(`${fileName} - Rotations`);
          rotationsFolder.add(mesh.rotation, 'x',0, 360).name(`${fileName} - Rot X`).onChange(() => defaultRotation.x = mesh.rotation.x *  (180 / Math.PI));
          rotationsFolder.add(mesh.rotation, 'y',0, 360).name(`${fileName} - Rot Y`).onChange(() => defaultRotation.y = mesh.rotation.y *  (180 / Math.PI));
          rotationsFolder.add(mesh.rotation, 'z',0, 2*Math.PI).name(`${fileName} - Rot Z`).onChange(() => defaultRotation.z = mesh.rotation.z *  (180 / Math.PI))
    
    
  // TODO: Need to figure it out whats happening with scales the object is being wrongly selected
  //  TODO: Why the heck is the color picker rendered for every file but one is afecting the others??
   
    const meshAux= {
      scale: 1.2,
      color: 0xfffff
      
    }
// const scaleController = gui.add(meshAux, 'scale', {
  //   "Small": 1.2,
  //   "Medium": 2.4,
  //   "Big": 3.6,
  // }).name(`${fileName} - Scale All`);
  
  // scaleController.onChange(() => {
    //   const selectedMesh = loadedModels[Object3D.mesh]; // Assuming Object3D.mesh holds the index of the selected mesh
    //   selectedMesh.scale.set(meshAux.scale, meshAux.scale, meshAux.scale);
    // });
    //     gui.add(mesh.scale, 'x', {
      //       "Small": 1,
//       "Medium": 2,
//       "Big": 3,
//     }).name(`${fileName} - Scale X`,).onChange(() => console.log(Object3D.mesh))
// !Color picker in dat gui
// ! Performs the setting of the new color into the meshAux color prop
// ! Add it to mesh
// ! The new mesh is being push in the loaded models list
// ! If loaded models and uploaded files has the same length
// ! calculate the center, the scale and reorient the model etc
// !Render it out
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
        
        
        
        

//  TODO: to toggle rendered model     
//         let currentSTLFiles = stlFiles;
        
//         const handleSTLFileListChange = () => {
//           loadedModels.forEach((model) => {
//             scene.remove(model); // Remove existing models from the scene
//           });
//   loadedModels.length = 0; // Clear the loaded models array

//   currentSTLFiles = stlFiles2; // Set the current STL file list to stlFiles2

//   currentSTLFiles.forEach((stlFile, index) => {
//     loadSTL(stlFile, index); // Reload the STL files from the new list
//   });
// };
//! calculateAndApplyTransformations fnc: Create the bounding box three js object
//! For each loaded model expand dims to store it within the bounding box
//! calculate center and size
    const calculateAndApplyTransformations = () => {
      const boundingBox = new THREE.Box3();
      loadedModels.forEach((model) => boundingBox.expandByObject(model));

      const center = boundingBox.getCenter(new THREE.Vector3());
      const size = boundingBox.getSize(new THREE.Vector3());
console.log(size)
      loadedModels.forEach((model) => {
        //! Scale the model to fit within a certain size
        const scaleFactor = 2 / Math.max(size.x, size.y, size.z);
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

//! Position the model at the scene center for Morticia
// ! const positionOffset = new THREE.Vector3();
//!     positionOffset.subVectors(center, new THREE.Vector3(46.50000287403856,
//! 70.04265746507652,
//! 15.235782109828362)); // Replace (0, 0, 0) with the desired screen center coordinates
//! With this one we get center for the prothesis
//! Is not working yet with Merlina 
const positionOffset = new THREE.Vector3().subVectors(center, model.position);
    model.position.add(positionOffset);

    
    //! Center 
// !43.19405722618103
// !39.894009590148926
// !127.046142578125

//! position of loaded prothesis:
//! 0.65
//! 2.68
//! 0.65
//! rotations:
//! 36
//! 9
//! 6

    model.position.sub(positionOffset);
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
// ! Recursive function: still calling itself 
// ! on infinite loop every frame
    const animate = () => {
      //! Para los frames del Orbit controls.
      //! SCROLLING O ZOOM IN AND ZOOM OUT
      requestAnimationFrame(animate);

      //! Element rotation
      // loadedModels.forEach(model=>
      //   {

      //     model.rotation.x += 0.01
      //     model.rotation.y += 0.01

      //   })
      // !Controls and stats update
      controls.update();
        stats.update()
      render();
    };
//! Render function to draw create scene and camera objects
    const render = () => {
      renderer.render(scene, camera);
    };
// !load files frame by frame to know when some got hidden
// ! deleted or wipped out from the scene
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

  return (
<>
<div/>
</>
  
  )
  
};

export default StlViewer;
// <div className='relative'>
// {/* <button className='absolute' >Click me!</button> */}
// {/* </div> */}