import * as THREE from "three";
import stars from "./images/stars.jpg";
import sun from "./images/sun.jpg";
import mercuryTexture from "./images/mercury.jpg";
import venusTexture from "./images/venus.jpg";
import earthTexture from "./images/earth.jpg";
import marsTexture from "./images/mars.jpg";
import jupiterTexture from "./images/jupiter.jpg";
import saturnTexture from "./images/saturn.jpg";
import uranusTexture from "./images/uranus.jpg";
import neptuneTexture from "./images/neptune.jpg";

import { OrbitControls } from "three/examples/jsm/Addons.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
// Creating the camera
const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const cubeTextureLoader = new THREE.CubeTextureLoader();

scene.background = cubeTextureLoader.load([
  stars,
  stars,
  stars,
  stars,
  stars,
  stars,
]);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.minDistance = 200; // Prevents zooming in too close
orbit.maxDistance = 300; // Prevents zooming out too far
camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
// const redLight = new THREE.PointLight(0xff0000, 1); // Red light, moderate intensity, 300 units distance
// redLight.position.set(0, 0, 0); // Position the light at the center of the sun
// scene.add(redLight);

// const PointLighting = new THREE.PointLight(0xffffff, 1, 100, 0.5);
// PointLighting.position.set(0, 0, 0);
// scene.add(PointLighting);

const textureLoader = new THREE.TextureLoader();

textureLoader.load(sun, function (sunTexture) {
  const sunGeo = new THREE.SphereGeometry(16, 20, 20);
  const sunMat = new THREE.MeshBasicMaterial({
    map: sunTexture,
    emissive: 0xffff00, // Glow color (yellow)
    emissiveIntensity: 1,
  });

  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  scene.add(sunMesh); // Add the sun to the scene

  // Add a larger, transparent sphere around the sun for the glow effect
  const glowGeo = new THREE.SphereGeometry(16.5, 20, 20); // Slightly larger sphere for aura effect
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xff0000, // Red color for the glow
    transparent: true,
    opacity: 0.35, // Adjust opacity for desired glow effect
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glowMesh); // Add the glow effect around the sun
});

function createPlanet(size, texture, distancefromsun, speed) {
  const planetGeo = new THREE.SphereGeometry(size, 16, 16);
  const planetMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
    emissive: 0x111111, // Slight emissive to ensure visibility
    emissiveIntensity: 0.2,
  });

  const planet = new THREE.Mesh(planetGeo, planetMat);

  const planetOrbit = new THREE.Group();
  planetOrbit.add(planet);

  planet.position.x = distancefromsun;

  planetOrbit.userData = { speed: speed, distance: distancefromsun };

  scene.add(planetOrbit);

  return planetOrbit;
}

const mercury = createPlanet(2, mercuryTexture, 20, 0.0003);
const venus = createPlanet(4, venusTexture, 40, 0.0002);
const earth = createPlanet(4.5, earthTexture, 60, 0.00015); // Earth parameters
const mars = createPlanet(3.5, marsTexture, 77, 0.0001); // Mars parameters
const jupiter = createPlanet(10, jupiterTexture, 107, 0.00002);
const saturn = createPlanet(5.5, saturnTexture, 127, 0.00001);
const uranus = createPlanet(3.5, uranusTexture, 137, 0.000002);
const neptune = createPlanet(2.5, neptuneTexture, 147, 0.000001);

let previousTime = performance.now();

var frames = 0;

function animate() {
  frames = frames + 1;
  renderer.clear();
  const currentTime = performance.now();
  const deltaTime = (currentTime - previousTime) / 1000; // Convert to seconds

  // Update planet rotations using deltaTime to make the movement frame-rate independent
  mercury.rotation.y += mercury.userData.speed * deltaTime;
  venus.rotation.y += venus.userData.speed * deltaTime;
  earth.rotation.y += earth.userData.speed * deltaTime;
  mars.rotation.y += mars.userData.speed * deltaTime;
  jupiter.rotation.y += jupiter.userData.speed * deltaTime;
  saturn.rotation.y += saturn.userData.speed * deltaTime;
  uranus.rotation.y += uranus.userData.speed * deltaTime;
  neptune.rotation.y += uranus.userData.speed * deltaTime;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
setInterval(() => {
  console.debug(frames);
  frames = 0;
}, 1000);