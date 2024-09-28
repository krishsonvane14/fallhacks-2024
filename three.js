import * as THREE from "three";
import top from "./images/row-1-column-2.png";
import left from "./images/row-2-column-1.png";
import front from "./images/row-2-column-2.png";
import right from "./images/row-2-column-3.png";
import back from "./images/row-2-column-4.png";
import bottom from "./images/row-3-column-2.png";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// Creating the camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

const cubeTextureLoader = new THREE.CubeTextureLoader();

scene.background = cubeTextureLoader.load([
  right,
  left,
  top,
  bottom,
  front,
  back,
]);

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();

function animate() {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
