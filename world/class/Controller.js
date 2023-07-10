import * as THREE from "three"

import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js"

export default class Controller {
    constructor(scene, camera, renderer) {
        this.scene = scene
        this.camera = camera
        this.renderer = renderer

        // this.controllerModelFactory = new XRControllerModelFactory()
        // this.addLeftController()
        // this.addRightController()
        // this.addLeftGrip()
        // this.addRightGrip()
    }

    /**
     * @desc    setOrbitControl
     * @returns {OrbitControl}
     */
    setOrbitControl() {
        try {
            // - - -
            this.orbitControl = new OrbitControls(
                this.camera,
                this.renderer.domElement
            )
            this.orbitControl.enabled = true
            this.orbitControl.maxDistance = 1500
            this.orbitControl.minDistance = 0

            return this.orbitControl

            // - - -
        } catch (error) {
            console.log("setOrbitControl error.", error.message, error.name)

            return undefined
        }
    }

    buildController(data) {
        let geometry, material

        switch (data.targetRayMode) {
            case "tracked-pointer":
                geometry = new THREE.BufferGeometry()
                geometry.setAttribute(
                    "position",
                    new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3)
                )
                geometry.setAttribute(
                    "color",
                    new THREE.Float32BufferAttribute(
                        [0.5, 0.5, 0.5, 0, 0, 0],
                        3
                    )
                )

                material = new THREE.LineBasicMaterial({
                    vertexColors: true,
                    blending: THREE.AdditiveBlending,
                })

                return new THREE.Line(geometry, material)

            case "gaze":
                geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(
                    0,
                    0,
                    -1
                )
                material = new THREE.MeshBasicMaterial({
                    opacity: 0.5,
                    transparent: true,
                })
                return new THREE.Mesh(geometry, material)
        }
    }

    addLeftController() {
        this.leftController = this.renderer.xr.getController(0)

        this.leftController.addEventListener("selectstart", this.onSelectStart)
        this.leftController.addEventListener("selectend", this.onSelectEnd)

        this.leftController.addEventListener("connected", (event) => {
            event.target.add(this.buildController(event.data))
        })
        this.leftController.addEventListener("disconnected", (event) => {
            event.target.remove(this.children[0])
        })

        this.scene.add(this.leftController)
    }

    addRightController() {
        this.addRightController = this.renderer.xr.getController(1)
        this.addRightController.addEventListener(
            "selectstart",
            this.onSelectStart
        )
        this.addRightController.addEventListener("selectend", this.onSelectEnd)
        this.addRightController.addEventListener("connected", (event) => {
            event.target.add(this.buildController(event.data))
        })
        this.addRightController.addEventListener("disconnected", (event) => {
            event.target.remove(event.target.children[0])
        })
        this.scene.add(this.addRightController)
    }

    addLeftGrip() {
        let leftGrip = this.renderer.xr.getControllerGrip(0)
        leftGrip.add(
            this.controllerModelFactory.createControllerModel(leftGrip)
        )
        this.scene.add(leftGrip)
    }

    addRightGrip() {
        let rightGrip = this.renderer.xr.getControllerGrip(1)
        rightGrip.add(
            this.controllerModelFactory.createControllerModel(rightGrip)
        )
        this.scene.add(rightGrip)
    }

    handleController(controller) {
        if (controller.userData.isSelecting) {
            // do something ...
        }
    }

    onSelectStart(event) {
        event.target.userData.isSelecting = true
    }

    onSelectEnd(event) {
        event.target.userData.isSelecting = false
    }
}
