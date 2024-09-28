import * as THREE from "three";
import stars from "./images/stars.jpg";
import sun from "./images/sun.jpg";
import mercuryTexture from "./images/mercury.jpg";

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
orbit.minDistance = 50; // Prevents zooming in too close
orbit.maxDistance = 500; // Prevents zooming out too far
camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333, 1.5);
scene.add(ambientLight);

// const redLight = new THREE.PointLight(0xff0000, 1); // Red light, moderate intensity, 300 units distance
// redLight.position.set(0, 0, 0); // Position the light at the center of the sun
// scene.add(redLight);

const PointLighting = new THREE.PointLight(0xffffff, 1, 100, 0.1);
PointLighting.position.set(0, 0, 0);
scene.add(PointLighting);

const textureLoader = new THREE.TextureLoader();

textureLoader.load(sun, function (sunTexture) {
  const sunGeo = new THREE.SphereGeometry(16, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({
    map: sunTexture,
    emissive: 0xffff00, // Glow color (yellow)
    emissiveIntensity: 1,
  });

  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  scene.add(sunMesh); // Add the sun to the scene

  // Add a larger, transparent sphere around the sun for the glow effect
  const glowGeo = new THREE.SphereGeometry(16.5, 32, 32); // Slightly larger sphere for aura effect
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xff0000, // Red color for the glow
    transparent: true,
    opacity: 0.35, // Adjust opacity for desired glow effect
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glowMesh); // Add the glow effect around the sun
});

function createPlanet(size, texture, distancefromsun, speed) {
  const planetGeo = new THREE.SphereGeometry(size, 30, 30);
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

const mercury = createPlanet(2, mercuryTexture, 30, 0.0001);

function animate() {
  const planets = [mercury];
  planets.forEach((planetOrbit) => {
    planetOrbit.rotation.y += planetOrbit.userData.speed; // Orbit speed based on distance
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

renderer.setAnimationLoop(animate);
