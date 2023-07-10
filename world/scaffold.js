import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

import Studio from "./class/Studio.js"
import { Light, Ambient, Directional, Spot, Hemisphere } from "./class/Light.js"
import Plot from "./class/Plot.js"
import Controller from "./class/Controller.js"
import { Things, Box, Sphere } from "./class/Things.js"

window.onload = () => {
    // - - -
    // Studio
    const studio = new Studio({ helper: true })
    const scene = studio.setScene()
    const camera = studio.setCamera({ x: 0, y: 2, z: 5 })
    const helper = studio.setHelper({ grid: true, axes: true })
    const renderer = studio.setRenderer()

    // Lights
    const spotlight = new Spot(scene)
    const ambient = new Ambient(scene)
    const directional = new Directional(scene)
    const hemisphere = new Hemisphere(scene)

    // Controls
    const controller = new Controller(scene, camera, renderer)
    controller.setOrbitControl()

    // Materials and Objects
    const standardMaterial = new THREE.MeshStandardMaterial({ color: 0xff3300 })

    // Things
    const box = new Box(scene, standardMaterial)
    const sphere = new Sphere(scene, standardMaterial)

    // Action
    const staff = {
        scene: scene,
        camera: camera,
        renderer: renderer,
        box: box,
        sphere: sphere,
    }
    const stage = new Plot(staff)

    function animate() {
        requestAnimationFrame(animate)
        stage.play(staff)
    }
    // Process!
    animate()
    document.body.appendChild(renderer.domElement)

    // - - -
}
