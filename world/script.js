import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Water } from "three/addons/objects/Water2.js";

import threejsExt from "https://cdn.skypack.dev/threejs-ext";
import ImprovedNoise from "https://cdn.jsdelivr.net/npm/improved-noise@0.0.3/+esm";
import * as dat from "https://cdn.skypack.dev/dat.gui@0.7.9";

import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm";
import CannonEsDebugger from "https://cdn.jsdelivr.net/npm/cannon-es-debugger@1.0.0/+esm";

// import { Sky } from "https://cdn.skypack.dev/three@0.130.1/examples/jsm/objects/Sky.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader";

console.clear();

class Studio {
    constructor(conf) {
        this.scene = this._setScene();
        this.camera = this._setCamera();
        this.renderer = this._setRenderer();
        if (conf.helper) this._setHelper();
    }
    _setScene() {
        this._scene = new THREE.Scene();
        return this._scene;
    }
    _setCamera() {
        this._camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            20000
        );
        return this._camera;
    }
    _setRenderer() {
        this._renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            logarithmicDepthBuffer: false,
        });
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this._renderer.setClearColor({ color: 0x334499, alpha: 0.5 });

        return this._renderer;
    }
    _setHelper() {
        this._gridHelper = new THREE.GridHelper(10, 10);
        this._scene.add(this._gridHelper);

        this._axesHelper = new THREE.AxesHelper(10);
        this._scene.add(this._axesHelper);
    }
}
class Light {
    constructor(type) {
        switch (type) {
            case "spot":
                this._light = this._addSpot();
                break;
            case "ambient":
                this._light = this._addAmbient();
                break;
            case "directional":
                this._light = this._addDirectional();
        }
        return this._light;
    }
    _addSpot() {
        this._light = new THREE.SpotLight(0xffffff);
        this._light.castShadow = true;
        this._light.position.set(50, 50, 50);

        this._light.shadow.mapSize.width = 512;
        this._light.shadow.mapSize.height = 512;
        this._light.shadow.camera.near = 0.5;
        this._light.shadow.camera.far = 500;
        this._light.shadow.focus = 1;

        return this._light;
    }
    _addAmbient() {
        this._light = new THREE.AmbientLight(0x404040);
        return this._light;
    }
    _addDirectional() {
        this._light = new THREE.DirectionalLight(0xffffff, 0.5);
        return this._light;
    }
}
class Plot {
    constructor() {}
    play(o) {
        o.cube.rotation.x += 0.01;
        o.cube.rotation.y += 0.01;

        o.renderer.render(o.scene, o.camera);
    }
}
class Sun {
    contructor() {
        this.sunSphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(200, 16, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        this.sunSphere.position.y = -700;
        this.sunSphere.visible = true;
        // this.moveSun();
        return this.sunSphere;
    }

    moveSun(time) {
        var distance = 4000;
        var theta = Math.PI * (inclination - 0.5);
        var phi = 2 * Math.PI * (azimuth - 0.5);

        this.sunSphere.position.x = distance * Math.cos(phi);
        this.sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
        this.sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
    }
    addSky() {
        // Add Sky Mesh
        this.sky = new THREE.Sky();
        this.uniforms = this.sky.uniforms;
        this.uniforms.turbidity.value = 16;
        this.uniforms.rayleigh.value = 1.027;
        this.uniforms.luminance.value = 1;
        this.uniforms.mieCoefficient.value = 0.01;
        this.uniforms.mieDirectionalG.value = 0.97;

        this.sky.uniforms.sunPosition.value.copy(this.sunSphere.position);

        return this.sky.mesh;
    }
}
class Terrain {
    constructor() {
        let worldWidth = 256,
            worldDepth = 256;

        const data = this.generateHeight(worldWidth, worldDepth);
        const terrainGeometry = new THREE.PlaneGeometry(
            7500,
            7500,
            worldWidth - 1,
            worldDepth - 1
        );
        terrainGeometry.rotateX(-Math.PI / 2);

        const vertices = terrainGeometry.attributes.position.array;
        for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = data[i] * 10;
        }

        let terrainTexture = new THREE.CanvasTexture(
            this.generateTexture(data, worldWidth, worldDepth)
        );
        terrainTexture.wrapS = THREE.ClampToEdgeWrapping;
        terrainTexture.wrapT = THREE.ClampToEdgeWrapping;
        terrainTexture.colorSpace = THREE.SRGBColorSpace;

        let terrainMesh = new THREE.Mesh(
            terrainGeometry,
            new THREE.MeshBasicMaterial({ map: terrainTexture })
        );
        return terrainMesh;
    }
    generateHeight(width, height) {
        let seed = Math.PI / 4;
        window.Math.random = function () {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        const size = width * height,
            data = new Uint8Array(size);
        const perlin = new ImprovedNoise(),
            z = Math.random() * 100;

        let quality = 1;

        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < size; i++) {
                const x = i % width,
                    y = ~~(i / width);
                data[i] += Math.abs(
                    perlin.noise(x / quality, y / quality, z) * quality * 0.75
                );
            }

            quality *= 5;
        }

        return data;
    }
    generateTexture(data, width, height) {
        let context, image, imageData, shade;

        const vector3 = new THREE.Vector3(0, 0, 0);

        const sun = new THREE.Vector3(1, 1, 1);
        sun.normalize();

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        context = canvas.getContext("2d");
        context.fillStyle = "#000";
        context.fillRect(0, 0, width, height);

        image = context.getImageData(0, 0, canvas.width, canvas.height);
        imageData = image.data;
        for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
            vector3.x = data[j - 2] - data[j + 2];
            vector3.y = 2;
            vector3.z = data[j - width * 2] - data[j + width * 2];
            vector3.normalize();

            shade = vector3.dot(sun);

            imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
            imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
            imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
        }
        context.putImageData(image, 0, 0);

        // Scaled 4x

        const canvasScaled = document.createElement("canvas");
        canvasScaled.width = width * 4;
        canvasScaled.height = height * 4;

        context = canvasScaled.getContext("2d");
        context.scale(4, 4);
        context.drawImage(canvas, 0, 0);

        image = context.getImageData(
            0,
            0,
            canvasScaled.width,
            canvasScaled.height
        );
        imageData = image.data;

        for (let i = 0, l = imageData.length; i < l; i += 4) {
            const v = ~~(Math.random() * 5);

            imageData[i] += v;
            imageData[i + 1] += v;
            imageData[i + 2] += v;
        }

        context.putImageData(image, 0, 0);

        return canvasScaled;
    }
}
class Fog {
    constructor() {
        this.fogColor = {
            h: 215,
            s: 80,
            l: 80,
        };
        return (this.fog = new THREE.Fog(
            `hsl(${this.fogColor.h},${this.fogColor.s}%,${this.fogColor.l}%)`,
            0.01,
            272
        ));
    }
}
class Gui {
    constructor() {
        this._gui = new dat.GUI();
        return this.GUI;
    }
    add(elem) {
        this._gui
            .add(elem, elem.key, 0.1, 1, 0.01)
            .name(elem.key)
            .onChange((e) => {
                let newVal = elem[elem.key];
                elem.target[elem.key] = newVal;
            });
    }
}
// - - - - -
window.onload = () => {
    // - - - - -
    // Studio
    const studio = new Studio({ helper: true });
    const scene = studio.scene;
    const camera = studio.camera;
    const renderer = studio.renderer;

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
    // scene.fog = fog;

    // Camera
    camera.position.x = 0;
    camera.position.z = 8;
    camera.position.y = 2;
    camera.lookAt(scene.position);

    // Sun
    // const sun = new Sun();
    // scene.add(sun);
    // scene.add(sun.addSky());

    // Terrain
    let terrain = new Terrain();
    terrain.position.set(-400, -85, 0);
    scene.add(terrain);

    // Water
    const textureLoader = new THREE.TextureLoader();
    const waterGeometry = new THREE.PlaneGeometry(12, 12, 50, 50);
    const flowMap = textureLoader.load("textures/water/Water_1_M_Flow.jpg");
    const waterMesh = new Water(waterGeometry, {
        scale: 2,
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
    cubeMesh.position.set(0, 2, 0);
    cubeMesh.castShadow = true;
    cubeMesh.receiveShadow = true;
    scene.add(cubeMesh);
    daylight.target = cubeMesh;

    const groundGeometrie = new THREE.BoxGeometry(10, 0.01, 10);
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
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("jsm/libs/draco/gltf/");

    loader.setDRACOLoader(dracoLoader);
    loader.load(
        // "models/LittlestTokyo.glb",
        "models/flamingo.glb",
        (gltf) => {
            // called when the resource is loaded
            gltf.scene.scale.set(0.025, 0.025, 0.025);
            gltf.scene.position.set(-2, 2.5, 0);
            scene.add(gltf.scene);
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
