import { useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const StlViewerAgain = () => {
  useEffect(() => {
    import('three').then((THREE) => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();

      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Material y geometria. Se combinan para generar el render 3D
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      
      scene.add(cube);
      scene.add(new THREE.AxesHelper(5))

      camera.position.z = 5;

      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      }

      animate();
    });
  }, []);

  return (
    <div>
      <h1>Hey you!</h1>
    </div>
  );
};

export default StlViewerAgain;