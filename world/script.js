import * as THREE from "three";

// import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Water } from "three/addons/objects/Water2.js";

// import threejsExt from "https://cdn.skypack.dev/threejs-ext";
// import ImprovedNoise from "https://cdn.jsdelivr.net/npm/improved-noise@0.0.3/+esm";
// import * as dat from "https://cdn.skypack.dev/dat.gui@0.7.9";

import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm";
import CannonEsDebugger from "https://cdn.jsdelivr.net/npm/cannon-es-debugger@1.0.0/+esm";

// import { Sky } from "three/addons/objects/Sky.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader";

console.clear();

import Studio from "./class/Studio.js";
import Light from "./class/Light.js";
import Plot from "./class/Plot.js";
import Sun from "./class/Sun.js";
import Terrain from "./class/Terrain.js";
import Fog from "./class/Fog.js";
import Gui from "./class/Gui.js";

// - - - - -
window.onload = () => {
    // - - - - -
    // Studio
    const studio = new Studio({ helper: true });
    const scene = studio.scene;
    const camera = studio.camera;
    const renderer = studio.renderer;
    const clock = new THREE.Clock();
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath(
        "../node_modules/three/examples/jsm/libs/draco/gltf/"
    );

    loader.setDRACOLoader(dracoLoader);
    // Stage (renderer)
    document.body.appendChild(renderer.domElement);

    // Physics
    const world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
    });
    const cannonDebugger = new CannonEsDebugger(scene, world, {
        color: 0x99ff99,
        alpha: 0.5,
    });
    const cannonDebug = false;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = true;
    controls.maxDistance = 1500;
    controls.minDistance = 0;

    // Lights
    const ambient = new Light("ambient");
    const spot = new Light("spot");
    const daylight = new Light("directional");
    scene.add(ambient);
    scene.add(spot);
    scene.add(daylight);

    // Fog
    const fog = new Fog();
    scene.fog = fog;

    // Camera
    camera.position.x = 0;
    camera.position.z = 8;
    camera.position.y = 2;
    camera.lookAt(scene.position);

    // Sun
    const sun = new Sun();
    const sky = sun.addSky();
    scene.add(sky);
    // scene.add(sun);

    // Terrain
    let terrain = new Terrain();
    terrain.position.set(-400, -85, 0);
    scene.add(terrain);

    let groundLength = 1000;

    // Water
    const textureLoader = new THREE.TextureLoader();
    const waterGeometry = new THREE.PlaneGeometry(
        groundLength,
        groundLength,
        50,
        50
    );
    const flowMap = textureLoader.load("textures/water/Water_1_M_Flow.jpg");
    const waterMesh = new Water(waterGeometry, {
        scale: 32,
        textureWidth: 1024,
        textureHeight: 1024,
        flowMap: flowMap,
    });
    waterMesh.rotation.set(-Math.PI / 2, 0, 0);
    waterMesh.position.y = 0.5;
    scene.add(waterMesh);

    // Materials and Objects
    const wireframe = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
    });
    const standard = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const ground = new THREE.MeshStandardMaterial({ color: 0xc5d48f });
    const phong = new THREE.MeshPhongMaterial({ color: 0xff0000 });

    // - - - - -
    const cubeGeometry = new THREE.BoxGeometry(1, 2, 1);
    const cubeMesh = new THREE.Mesh(cubeGeometry, standard);
    cubeMesh.position.set(3, 2, 0);
    cubeMesh.castShadow = true;
    cubeMesh.receiveShadow = true;
    scene.add(cubeMesh);
    daylight.target = cubeMesh;

    const groundGeometrie = new THREE.BoxGeometry(
        groundLength,
        0.01,
        groundLength
    );
    const groundMesh = new THREE.Mesh(groundGeometrie, ground);
    groundMesh.position.set(0, -0.05, 0);
    groundMesh.castShadow = false;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Objects and physics
    const radius = 1;
    const sphereGeometry = new THREE.SphereGeometry(radius);
    const sphereMaterial = new THREE.MeshNormalMaterial();
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphereMesh);

    const sphereBody = new CANNON.Body({
        mass: 5, // kg
        shape: new CANNON.Sphere(radius),
    });
    sphereBody.position.set(0, 200, 0); // m
    world.addBody(sphereBody);

    const groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // make it face up
    world.addBody(groundBody);

    // Models (gltb)
    let mixerTokyo, mixerFlamingo;

    loader.load(
        "models/flamingo.glb",
        (gltf) => {
            // called when the resource is loaded
            const model = gltf.scene;
            model.scale.set(0.025, 0.025, 0.025);
            model.position.set(-2, 2.5, 0);
            scene.add(model);
            mixerFlamingo = new THREE.AnimationMixer(model);
            mixerFlamingo.clipAction(gltf.animations[0]).play();
        },
        (xhr) => {
            // called while loading is progressing
            console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
        },
        (error) => {
            // called when loading has errors
            console.error("An error happened", error);
        }
    );

    loader.load(
        "models/LittlestTokyo.glb",
        (gltf) => {
            // called when the resource is loaded
            const model = gltf.scene;
            model.scale.set(0.025, 0.025, 0.025);
            model.position.set(10, 5, -50);
            scene.add(model);

            mixerTokyo = new THREE.AnimationMixer(model);
            mixerTokyo.clipAction(gltf.animations[0]).play();
        },
        (xhr) => {
            // called while loading is progressing
            console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
        },
        (error) => {
            // called when loading has errors
            console.error("An error happened", error);
        }
    );
    // Gui
    const ambientControls = {
        target: ambient,
        key: "intensity",
        intensity: ambient.intensity,
    };
    const gui = new Gui();
    gui.add(ambientControls);

    // Action
    const stage = new Plot();
    const actors = {
        scene: scene,
        camera: camera,
        renderer: renderer,
        cube: cubeMesh,
    };

    function animate() {
        requestAnimationFrame(animate);

        sphereMesh.position.copy(sphereBody.position);
        sphereMesh.quaternion.copy(sphereBody.quaternion);

        world.fixedStep();
        cannonDebugger.update();

        const delta = clock.getDelta();
        if (mixerTokyo) mixerTokyo.update(delta);
        if (mixerFlamingo) mixerFlamingo.update(delta);

        stage.play(actors);
    }
    animate();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    // - - - - -
};
// - - - - -
