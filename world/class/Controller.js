import * as THREE from "three"

import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { XRButton } from "three/addons/webxr/XRButton.js"
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js"

export default class Controller {
    constructor(scene, camera, renderer) {
        this.scene = scene
        this.camera = camera
        this.renderer = renderer

        // Controller for browser view
        this.setOrbitControl()
        this.setXrButton()

        // Controller for vr view
        this.controllerModelFactory = new XRControllerModelFactory()
        this.addLeftController()
        this.addRightController()
        this.addLeftGrip()
        this.addRightGrip()
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

    /**
     * @desc    setXrButton
     * @param   {type} desc
     * @returns {boolean}
     */
    setXrButton() {
        try {
            // - - -
            document.body.appendChild(XRButton.createButton(this.renderer))
            return true
            // - - -
        } catch (error) {
            console.log("setXrButton error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    buildGrip
     * @returns {THREEJS Mesh}
     */
    buildGrip(data) {
        try {
            // - - -
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
            // - - -
        } catch (error) {
            console.log("buildGrip error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    addLeftController
     * @returns {boolean}
     */
    addLeftController() {
        try {
            // - - -
            // Get the controller
            const controller = this.renderer.xr.getController(0)

            // set the eventlistener
            // connected, disconnected
            // selectstart, selectend
            controller.addEventListener("connected", (event) => {
                event.target.add(this.buildGrip(event.data))
            })
            controller.addEventListener("disconnected", (event) => {
                event.target.remove(event.target.children[0])
            })
            controller.addEventListener("selectstart", (event) => {
                this.onSelectStart
            })
            controller.addEventListener("selectend", (event) => {
                this.onSelectEnd
            })

            this.scene.add(controller)

            return true
            // - - -
        } catch (error) {
            console.log("addLeftController error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    addRightController
     * @returns {boolean}
     */
    addRightController() {
        try {
            // - - -
            // Get the controller
            const controller = this.renderer.xr.getController(1)

            // Set the eventlistener
            // connected, disconnected
            // selectstart, selectend
            controller.addEventListener("connected", (event) => {
                event.target.add(this.buildGrip(event.data))
            })
            controller.addEventListener("disconnected", (event) => {
                event.target.remove(event.target.children[0])
            })
            controller.addEventListener("selectstart", (event) => {
                this.onSelectStart
            })

            controller.addEventListener("selectend", (event) => {
                this.onSelectEnd
            })

            this.scene.add(controller)

            return true
            // - - -
        } catch (error) {
            console.log("addRightController error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    addLeftGrip
     * @returns {boolean}
     */
    addLeftGrip() {
        try {
            // - - -
            const grip = this.renderer.xr.getControllerGrip(0)
            grip.add(this.controllerModelFactory.createControllerModel(grip))
            this.scene.add(grip)

            return true
            // - - -
        } catch (error) {
            console.log("addLeftGrip error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    addRightGrip
     * @returns {boolean}
     */
    addRightGrip() {
        try {
            // - - -
            const grip = this.renderer.xr.getControllerGrip(1)
            grip.add(this.controllerModelFactory.createControllerModel(grip))
            this.scene.add(grip)

            return true
            // - - -
        } catch (error) {
            console.log("addRightGrip error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    handleController
     * @param   {object} controller
     * @returns {boolean}
     */
    handleController() {
        try {
            // - - -
            if (controller.userData.isSelecting) {
                // do something ...
            }
            return true
            // - - -
        } catch (error) {
            console.log("handleController error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    onSelectStart
     * @param   {object} event
     * @returns {boolean}
     */
    onSelectStart(event) {
        try {
            // - - -
            event.target.userData.isSelecting = true
            return true
            // - - -
        } catch (error) {
            console.log("onSelectStart error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    onSelectEnd
     * @param   {object} event
     * @returns {boolean}
     */
    onSelectEnd(event) {
        try {
            // - - -
            event.target.userData.isSelecting = false

            return true
            // - - -
        } catch (error) {
            console.log("onSelectEnd error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    onDragStart
     * @param   {object} event
     * @returns {boolean}
     */
    onDragStart(event) {
        try {
            // - - -

            const controller = event.target
            controller.userData.isSelecting = true

            const intersections = this.getIntersections(controller)

            if (intersections.length > 0) {
                const intersection = intersections[0]

                const object = intersection.object
                object.material.emissive.b = 1
                controller.attach(object)

                controller.userData.selected = object
            }

            controller.userData.targetRayMode = event.data.targetRayMode

            return true
            // - - -
        } catch (error) {
            console.log("onDragStart error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    onDragEnd
     * @param   {object} event
     * @returns {boolean}
     */
    onDragEnd(event) {
        try {
            // - - -

            const controller = event.target
            controller.userData.isSelecting = false

            if (controller.userData.selected !== undefined) {
                const object = controller.userData.selected
                object.material.emissive.b = 0

                // todo: Die Gruppe gibt es noch nicht
                this.group.attach(object)

                controller.userData.selected = undefined
            }
            return true
            // - - -
        } catch (error) {
            console.log("onDragEnd error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    onTeleportStart
     * @param   {object} event
     * @returns {boolean}
     */
    onTeleportStart(event) {
        try {
            // - - -
            event.target.userData.isSelecting = true
            //console.log("Suqueezebutton pressed");

            return true
            // - - -
        } catch (error) {
            console.log("onTeleportStart error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    onTeleportEnd
     * @param   {object} event
     * @returns {boolean}
     */
    onTeleportEnd(event) {
        try {
            // - - -
            // console.log("Suqueezebutton unpressed");
            event.target.userData.isSelecting = false

            if (INTERSECTION) {
                const offsetPosition = {
                    x: -INTERSECTION.x,
                    y: -INTERSECTION.y,
                    z: -INTERSECTION.z,
                    w: 1,
                }
                const offsetRotation = new THREE.Quaternion()
                const transform = new XRRigidTransform(
                    offsetPosition,
                    offsetRotation
                )
                const teleportSpaceOffset =
                    baseReferenceSpace.getOffsetReferenceSpace(transform)

                this.renderer.xr.setReferenceSpace(teleportSpaceOffset)
            }

            return true
            // - - -
        } catch (error) {
            console.log("onTeleportEnd error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    getIntersections
     * @param   {type} desc
     * @returns {boolean}
     */
    getIntersections(controller) {
        try {
            // - - -
            controller.updateMatrixWorld()

            tempMatrix.identity().extractRotation(controller.matrixWorld)

            raycaster_drag.ray.origin.setFromMatrixPosition(
                controller.matrixWorld
            )
            raycaster_drag.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix)

            return raycaster_drag.intersectObjects(group.children, false)
            // - - -
        } catch (error) {
            console.log("getIntersections error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    intersectObjects
     * @param   {type} desc
     * @returns {boolean}
     */
    intersectObjects(controller) {
        try {
            // - - -
            // Do not highlight in mobile-ar

            if (controller.userData.targetRayMode === "screen") return

            // Do not highlight when already selected

            if (controller.userData.selected !== undefined) return

            const line = controller.getObjectByName("line")
            const intersections = getIntersections(controller)

            if (intersections.length > 0) {
                const intersection = intersections[0]

                const object = intersection.object
                object.material.emissive.r = 1
                intersected.push(object)

                line.scale.z = intersection.distance
            } else {
                line.scale.z = 5
            }

            return true
            // - - -
        } catch (error) {
            console.log("intersectObjects error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    cleanIntersected
     * @returns {boolean}
     */
    cleanIntersected() {
        try {
            // - - -
            while (intersected.length) {
                const object = intersected.pop()
                object.material.emissive.r = 0
            }

            return true
            // - - -
        } catch (error) {
            console.log("cleanIntersected error.", error.message, error.name)

            return undefined
        }
    }
}
