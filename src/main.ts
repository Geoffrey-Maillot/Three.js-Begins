import {
  Scene,
  SphereGeometry,
  MeshStandardMaterial,
  Mesh,
  PointLight,
  WebGLRenderer,
  PerspectiveCamera,
  Clock,
  MathUtils,
  TextureLoader,
  MeshStandardMaterialParameters,
  Vector2,
} from 'three';

import textureImage from './assets/textures/normalMap.png';
import backgroundImage from './assets/textures/sky.jpg';

const textureLoader = new TextureLoader();

// get container
const container = document.getElementById('app') as HTMLDivElement;

// camera
const fov = 35;
const aspect = container.clientWidth / container.clientHeight; // temp value
const near = 0.1;
const far = 100;

//create scene
const scene = new Scene();
const textureBackground = textureLoader.load(backgroundImage);
scene.background = textureBackground;
scene.backgroundIntensity = 0.2;
scene.backgroundBlurriness = 1;

// create camera
const camera = new PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 0, 5);

// geometry
const geometry = new SphereGeometry(0.5, 64, 64);

// material
const texture = textureLoader.load(textureImage);

const materialProps: MeshStandardMaterialParameters = {
  normalMap: texture,
  color: 0x292929,
  emissive: 0x000000,
  roughness: 0.25,
  metalness: 0.6,
};
const material = new MeshStandardMaterial(materialProps);

// create Circle
const circle = new Mesh(geometry, material);

// create lights
const light1 = new PointLight(0xffffff, 20, 0, 1);
light1.position.set(6, 7, 4.5);

const light2 = new PointLight(0xff0000, 3.2);
light2.position.set(-1, -1, 0);

scene.add(circle, light1, light2);

// render
const rendered = new WebGLRenderer({ antialias: true });

rendered.setSize(container.clientWidth, container.clientHeight);
// set the pixel ratio (for mobile devices)
rendered.setPixelRatio(window.devicePixelRatio);

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  rendered.setSize(container.clientWidth, container.clientHeight);
  rendered.setPixelRatio(window.devicePixelRatio);
});

container.append(rendered.domElement);

const clock = new Clock();

const animation = () => {
  const delta = clock.getDelta();
  //controls.update(delta);
  rendered.render(scene, camera);

  circle.rotation.y += MathUtils.degToRad(10) * delta;
};

const start = () => {
  rendered.setAnimationLoop(() => animation());
};

/**
 *  Mouse Events
 */

let mouse = new Vector2(0, 0);
let pageX: number;
let pageY: number;

window.addEventListener('mousemove', (e) => {
  let screenX = window.innerWidth / 2;
  let screenY = window.innerHeight / 2;
  pageX = e.clientX - screenX;
  pageY = e.clientY - screenY;
  console.log(pageX, pageY, screenX, screenY);

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  rotateSphere();
  moveSphere();
  moveTitle();
});

// Rotate sphere
const rotateSphere = () => {
  circle.rotateY(mouse.x / 50);
  circle.rotateX(mouse.y / 50);
};

// Move sphere
const moveSphere = () => {
  circle.position.x = -mouse.x / 10;
  circle.position.y = -mouse.y / 10;
};

// Translate title
const title = document.querySelector('h1') as HTMLHeadingElement;

const moveTitle = () => {
  title.style.transform = `translate(${-50 - pageX / 100}%, ${
    -50 - pageY / 10
  }%)`;
};

window.addEventListener('DOMContentLoaded', () => start());
