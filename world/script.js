import * as THREE from "three"

import { GUI } from "three/addons/libs/lil-gui.module.min.js"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { XRButton } from "three/addons/webxr/XRButton.js"
// import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";

// import threejsExt from "https://cdn.skypack.dev/threejs-ext";
// import ImprovedNoise from "https://cdn.jsdelivr.net/npm/improved-noise@0.0.3/+esm";
// import * as dat from "https://cdn.skypack.dev/dat.gui@0.7.9";

import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm"
import CannonEsDebugger from "https://cdn.jsdelivr.net/npm/cannon-es-debugger@1.0.0/+esm"

import { Water } from "three/examples/jsm/objects/Water2.js"
import { Sky } from "three/examples/jsm/objects/Sky.js"

console.clear()

import Studio from "./class/Studio.js"
import Light from "./class/Light.js"
import Plot from "./class/Stage.js"
// import Sun from "./class/Sun.js";
import Terrain from "./class/Terrain.js"
import Fog from "./class/Fog.js"
import Gui from "./class/Gui.js"

import Model from "./class/Model.js"
import House from "./class/House.js"
import Controller from "./class/Controller.js"

// - - - - -
window.onload = () => {
    // - - - - -
    // Studio
    const studio = new Studio({ helper: false })
    const scene = studio.scene
    const camera = studio.camera
    const renderer = studio.renderer
    const clock = new THREE.Clock()

    // Stage (renderer)
    document.body.appendChild(renderer.domElement)

    // Physics
    const world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
    })
    const cannonDebugger = new CannonEsDebugger(scene, world, {
        color: 0x99ff99,
        alpha: 0.5,
    })
    const cannonDebug = false

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enabled = true
    controls.maxDistance = 1500
    controls.minDistance = 0

    // Lights
    const ambient = new Light("ambient")
    const spot = new Light("spot")
    const daylight = new Light("directional")
    const skylight = new Light("hemisphere")
    scene.add(ambient)
    scene.add(spot)
    scene.add(daylight)
    scene.add(skylight)

    // Fog
    const fog = new Fog()
    // scene.fog = fog;

    // Camera
    camera.position.x = 0
    camera.position.z = 25
    camera.position.y = 5
    camera.lookAt(scene.position)

    let groundLength = 7500

    // Terrain
    let terrain = new Terrain()
    terrain.position.set(-400, -85, 0)
    scene.add(terrain)

    // Water
    const textureLoader = new THREE.TextureLoader()
    const waterGeometry = new THREE.PlaneGeometry(
        groundLength,
        groundLength,
        50,
        50
    )
    // const flowMap = textureLoader.load("textures/water/Water_1_M_Flow.jpg");
    const flowMap = textureLoader.load("textures/water/Water_1_M_Normal.jpg")
    const waterMesh = new Water(waterGeometry, {
        scale: 32,
        textureWidth: 1024,
        textureHeight: 1024,
        flowMap: flowMap,
    })
    waterMesh.rotation.set(-Math.PI / 2, 0, 0)
    waterMesh.position.y = 0.25
    scene.add(waterMesh)

    // - - - - -
    const house = new House(scene)
    scene.add(house)
    // - - - - -

    // Materials and Objects
    const wireframe = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
    })
    const standard = new THREE.MeshStandardMaterial({ color: 0xff0000 })
    const ground = new THREE.MeshStandardMaterial({ color: 0x001144 })
    const phong = new THREE.MeshPhongMaterial({ color: 0xff0000 })

    // - - - - -
    const geometry = new THREE.BoxGeometry(5, 5, 5)

    const wire = new THREE.WireframeGeometry(geometry)

    const line = new THREE.LineSegments(wire)
    line.material.depthTest = false
    line.material.opacity = 1
    line.material.transparent = false

    // scene.add(line);
    // - - - - -
    const cubeGeometry = new THREE.BoxGeometry(1, 2, 1)
    const cubeMesh = new THREE.Mesh(cubeGeometry, standard)
    cubeMesh.position.set(3, 2, 0)
    cubeMesh.castShadow = true
    cubeMesh.receiveShadow = true

    scene.add(cubeMesh)

    daylight.target = cubeMesh

    const groundGeometrie = new THREE.BoxGeometry(
        groundLength,
        0.01,
        groundLength
    )
    const groundMesh = new THREE.Mesh(groundGeometrie, ground)
    groundMesh.position.set(0, -0.05, 0)
    groundMesh.castShadow = false
    groundMesh.receiveShadow = true
    scene.add(groundMesh)

    // Objects and physics
    const radius = 1
    const sphereGeometry = new THREE.SphereGeometry(radius)
    const sphereMaterial = new THREE.MeshNormalMaterial()
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)

    scene.add(sphereMesh)

    const sphereBody = new CANNON.Body({
        mass: 5, // kg
        shape: new CANNON.Sphere(radius),
    })
    sphereBody.position.set(0, 200, 0) // m
    world.addBody(sphereBody)

    const groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
    })

    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up

    world.addBody(groundBody)

    // Models (gltb)

    // let tokyo = new Model("models/LittlestTokyo.glb", scene, { scale: 0.05 })
    // let flamingo = new Model("models/flamingo.glb", scene, { scale: 0.25 });

    // Sun
    const sky = new Sky()
    sky.scale.setScalar(450000)
    scene.add(sky)
    const sun = new THREE.Vector3()

    // Gui
    const ambientControls = {
        target: ambient,
        key: "intensity",
        intensity: ambient.intensity,
    }
    // gui.add(ambientControls);
    const gui = new GUI()

    const effectController = {
        turbidity: 10, // Trübung
        rayleigh: 0.6, // Streuung
        mieCoefficient: 0.005, // Hofbildung
        mieDirectionalG: 0.07,
        elevation: 10, // Höhe über dem Horizont
        azimuth: 180, // Winkel im Kreis
        exposure: renderer.toneMappingExposure,
    }

    gui.add(effectController, "turbidity", 0.0, 20.0, 0.1).onChange((event) => {
        return guiChanged()
    })
    gui.add(effectController, "rayleigh", 0.0, 4, 0.001).onChange((event) =>
        guiChanged()
    )
    gui.add(effectController, "mieCoefficient", 0.0, 0.1, 0.001).onChange(
        (event) => guiChanged()
    )
    gui.add(effectController, "mieDirectionalG", 0.0, 1, 0.001).onChange(
        (event) => guiChanged()
    )
    gui.add(effectController, "elevation", 0, 90, 0.1).onChange((event) =>
        guiChanged()
    )
    gui.add(effectController, "azimuth", -180, 180, 0.1).onChange((event) =>
        guiChanged()
    )
    gui.add(effectController, "exposure", 0, 1, 0.0001).onChange((event) =>
        guiChanged()
    )

    function guiChanged() {
        const uniforms = sky.material.uniforms
        uniforms["turbidity"].value = effectController.turbidity
        uniforms["rayleigh"].value = effectController.rayleigh
        uniforms["mieCoefficient"].value = effectController.mieCoefficient
        uniforms["mieDirectionalG"].value = effectController.mieDirectionalG

        const phi = THREE.MathUtils.degToRad(90 - effectController.elevation)
        const theta = THREE.MathUtils.degToRad(effectController.azimuth)

        sun.setFromSphericalCoords(1, phi, theta)

        uniforms["sunPosition"].value.copy(sun)

        renderer.toneMappingExposure = effectController.exposure
        renderer.render(scene, camera)
    }

    // Action
    const stage = new Plot()
    const actors = {
        scene: scene,
        camera: camera,
        renderer: renderer,
        cube: cubeMesh,
    }

    // - - - - - - - - - -
    // Xr - controller
    // - - - - - - - - - -
    const controller = new Controller(scene, renderer)
    document.body.appendChild(XRButton.createButton(renderer))

    // Animate
    function animate() {
        requestAnimationFrame(animate)

        sphereMesh.position.copy(sphereBody.position)
        sphereMesh.quaternion.copy(sphereBody.quaternion)

        house.position.set(-10, 0, 0)
        house.rotation.x += 0.0001
        house.rotation.y += 0.01

        world.fixedStep()
        // cannonDebugger.update();

        const delta = clock.getDelta()

        // if (tokyo && typeof tokyo.update === "function") tokyo.update(delta)
        // if (typeof flamingo.update === "function") flamingo.update(delta);

        stage.play(actors)
    }
    guiChanged()
    animate()

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    })
    // - - - - -
}
// - - - - -
