import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

const StlViewer = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const currentMount= mountRef.current
    if (!currentMount) return;
    // Instancia para creacion de escena
    const scene = new THREE.Scene();
    // Añadir ejes a la escena
    scene.add(new THREE.AxesHelper(5));
    
    const light = new THREE.SpotLight();
    light.position.set(20, 20, 20);
    scene.add(light);
    // Instancia para generar la camara. los parametros son:
    // fov: field of view,
    // Aspect ratio,
    // Cercania/lejania de la camara
    const camera = new THREE.PerspectiveCamera(
      75, 
      currentMount.clientWidth / currentMount.clientHeight,
       0.1, 1000);
      //Modificar posicion de la camara
    camera.position.z = 5;
    // Añadir la camara a la escena
    scene.add(camera);


    // Crear el renderer
    const renderer = new THREE.WebGLRenderer();
    // Para darle ancho y alto al renderer
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    // renderer.outputColorSpace = THREE. SRGBColorSpace;
    // Para añadir el nodo de la referencia al DOM
    currentMount.appendChild(renderer.domElement);

    
    
    // Material
    const material = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      metalness: 0.25,
      roughness: 0.1,
      transparent: true,
      opacity: 1.0,
      wireframe:true
    });
    
        // Controles de orbit controls
        // El damping amortigua el movimiento cuando suelto el control
        const controls = new OrbitControls(camera, renderer.domElement);
         controls.target.y =15
    controls.target.x =-15
        controls.enableDamping = true;
    
    
        // Carga de archivos STL
    const loader = new STLLoader();
    // Arreglo de 6 partes del modelo stl
    const stlFiles = ['Head.stl','Thing.stl','Body.stl', 'Hands.stl', 'Legs.stl', ]
    // Arreglo que va a almacenar los modelos SLT cargados
    const loadedModels: THREE.Mesh[] | null = [];
    // Iterador de arreglos cargados
    let loadedCount = 0;

    // Onload: recibe la geometria por callback
    // Crea un nuevo modelo combinano geometria y material
     // (Modifica la escala en el eje Z)
    //  Añade cada nuevo archivo al listado de modelos cargados y suma 1 al contador
    // Cuando se han añadido todos los modelos, calcula y aplica las transformaciones
    // Renderizar
    const onLoad = (geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>) => {
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
// Con esta linea vemos el progreso de carga para cada instancia en 
// Se toma el modelo actual usando la posicion el contador de modelos cargados
// Se muestra el proceso de carga por consola
    const onProgress = (xhr: ProgressEvent) => {
      const stlFile = stlFiles[loadedCount];
      console.log(`${stlFile}: ${(xhr.loaded / xhr.total) * 100}% loaded`);
    };

    const onError = (error: any) => {
      console.log(error);
    };
// Fija el tamaño del bounding box:
// Genera el bounding box
  // Expande el bounding box para que almacene cada modelo cargado en la lista
// Calcula el centro y el tamaño del bounding box con todos los modelos
// Escala el modelo completo usando los maximos en X, Y, Z como "normalizacion"
// Aplica el scale.set para escalar en todos los ejes al tiempo
    const calculateAndApplyTransformations = () => {
      const boundingBox = new THREE.Box3();
      loadedModels.forEach((model: THREE.Mesh) => boundingBox.expandByObject(model));

      const center = boundingBox.getCenter(new THREE.Vector3());
      const size = boundingBox.getSize(new THREE.Vector3());

      loadedModels.forEach((model: THREE.Mesh) => {
        // Scale the model to fit within a certain size
        const scaleFactor = 2.5 / Math.max(size.x, size.y, size.z);
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Position the model at the scene center
        model.position.sub(center);
      });
    };

    function onWindowResize() {
      if(!currentMount) return
      camera.aspect =  currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    }

    window.addEventListener('resize', onWindowResize, false);
// La funcion que genera animaciones en loop infinito, para permitir
// Desplazamientos
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
// Clean up function: remueve el render y crea uno nuevo con props actualizadas al refrezcar
    return () => {
      window.removeEventListener('resize', onWindowResize);
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  return <div
          ref= {mountRef} />;
};

export default StlViewer;