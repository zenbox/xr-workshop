import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { AnimationMixer } from "three"

import Studio from "./class/Studio.js"
import { Light, Ambient, Directional, Spot, Hemisphere } from "./class/Light.js"
import Stage from "./class/Stage.js"
import Controller from "./class/Controller.js"
import {
    Things,
    Box,
    Sphere,
    House,
    Groundwater,
    Atmosphere,
    Model,
} from "./class/Things.js"
import Terrain from "./class/Terrain.js"
import Fog from "./class/Fog.js"

window.onload = () => {
    // - - -
    // Studio
    const studio = new Studio({ helper: true })
    const scene = studio.setScene()
    const camera = studio.setCamera({ x: 0, y: 2, z: 5 })
    const helper = studio.setHelper({ grid: false, axes: false })
    const renderer = studio.setRenderer()

    // Lights
    const spotlight = new Spot(scene)
    const ambient = new Ambient(scene)
    // const directional = new Directional(scene)
    // const hemisphere = new Hemisphere(scene)

    // Controls
    const controller = new Controller(scene, camera, renderer)

    // Terrain
    // const terrain = new Terrain(scene)

    // Fog
    // const fog = new Fog(scene)

    // Group
    const group = new THREE.Group()
    scene.add(group)

    // Materials and Objects
    const standardMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const red = new THREE.MeshStandardMaterial({ color: 0xff0000 })
    const green = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    const blue = new THREE.MeshStandardMaterial({ color: 0x0000ff })
    const gray = new THREE.MeshStandardMaterial({ color: 0x999999 })

    // Stage
    const stage = new Stage()

    // - - - - - - - - - -

    // Things
    const atmosphere = new Atmosphere(scene)
    // const groundwater = new Groundwater(scene, 0x003322)
    // const house = new House(scene, standardMaterial, {
    //     w: 40,
    //     h: 10,
    //     d: 40,
    // })
    // const box = new Box(scene, gray, {
    //     w: 1,
    //     h: 0.25,
    //     d: 5,
    //     x: 0,
    //     y: 0.1,
    //     z: -4,
    // })
    // stage.add({
    //     thing: box,
    //     rotate: { x: 0.005, y: 0.01, z: 0.025 },
    // })

    // const tokyo = new Model("models/LittlestTokyo.glb", scene, {
    //     scale: 0.025,
    //     position: { x: 0, y: 5.05, z: -8 },
    // })
    const flamingo = new Model("models/flamingo.glb", scene, {
        scale: 0.0125,
        position: { x: 0, y: 2, z: -4 },
    })

    console.dir(flamingo)
    console.log(flamingo.gltf)

// const mixer = new AnimationMixer(flamingo);
// const action = mixer.clipAction(walkClip);

// // immediately set the animation to play
// action.play();

    // - - - - - - - - - -
    function addCubes() {
        for (let i = 0; i <= 10; i++) {
            const geometry = new THREE.BoxGeometry(
                Math.random() * 0.5,
                Math.random() * 0.5,
                Math.random() * 0.5
            )

            const material = new THREE.MeshPhongMaterial({
                color: Math.random() * 0xff0000,
            })

            let cube = new THREE.Mesh(geometry, material)

            cube.position.set(
                -5 + Math.random() * 10, //x orange
                3 + Math.random() * 2, // y grün
                -4 + Math.random() * 8 // -z blau
            )
            cubes.push(cube)
            group.add(cube)
        }
    }
    let cubes = []
    // addCubes()
    // - - - - - - - - - -

    // Animate
    function animate() {
        renderer.setAnimationLoop(animate)
        renderer.render(scene, camera)
        stage.play({ flamingo: flamingo })
    }

    // Process!
    animate()
    document.body.appendChild(renderer.domElement)

    // - - -
}
