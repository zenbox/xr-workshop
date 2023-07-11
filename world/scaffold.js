import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

import Studio from "./class/Studio.js"
import { Light, Ambient, Directional, Spot, Hemisphere } from "./class/Light.js"
import Stage from "./class/Stage.js"
import Controller from "./class/Controller.js"
import { Things, Box, Sphere, House, Groundwater } from "./class/Things.js"
import Terrain from "./class/Terrain.js"
import Fog from "./class/Fog.js"

import { Water } from "three/examples/jsm/objects/Water2.js"
import { Sky } from "three/examples/jsm/objects/Sky.js"

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
    controller.setOrbitControl()
    controller.setXrButton()

    // Terrain
    // const terrain = new Terrain(scene)

    // Fog
    // const fog = new Fog(scene)

    // Materials and Objects
    const standardMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const red = new THREE.MeshStandardMaterial({ color: 0xff0000 })
    const green = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    const blue = new THREE.MeshStandardMaterial({ color: 0x0000ff })
    const water = 0x003322
    const gray = new THREE.MeshStandardMaterial({ color: 0x999999 })

    // Stage
    const stage = new Stage()

    // - - - - - - - - - -

    // Things
    const groundwater = new Groundwater(scene, water)
    const house = new House(scene, standardMaterial, { w: 40, h: 10, d: 40 })
    const box = new Box(scene, gray, { x: 0, y: 0.75, z: -2 })
    stage.add({ thing: box, rotate: { x: 0.05, y: 0.01, z: 0 } })

    // - - - - - - - - - -

    // Animate
    function animate() {
        renderer.setAnimationLoop(animate)
        renderer.render(scene, camera)
        stage.play()
    }

    // Process!
    animate()
    document.body.appendChild(renderer.domElement)

    // - - -
}
