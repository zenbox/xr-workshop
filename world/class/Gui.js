import * as THREE from "three"
import { GUI } from "three/addons/libs/lil-gui.module.min.js"
import * as dat from "https://cdn.skypack.dev/dat.gui@0.7.9"

export default class Gui {
    constructor() {
        this._gui = new dat.GUI()
        return this.GUI
    }
    
    add(elem) {
        this._gui
            .add(elem, elem.key, 0.1, 1, 0.01)
            .name(elem.key)
            .onChange((e) => {
                let newVal = elem[elem.key]
                elem.target[elem.key] = newVal
            })
    }

    changed(sky) {
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
}
