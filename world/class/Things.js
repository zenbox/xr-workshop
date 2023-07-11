import * as THREE from "three"

import { Water } from "three/examples/jsm/objects/Water2.js"
import { Sky } from "three/examples/jsm/objects/Sky.js"

class Things {
    constructor(scene, material, conf = {}) {
        this.scene = scene
        this.material = material
        this.conf = conf
    }
}

class Box extends Things {
    constructor(scene, material, conf = {}) {
        super(scene)

        this.material = material
        this.conf = conf

        return this.add()
    }

    /**
     * @desc    add
     * @returns {THREEJS CubeObject}
     */
    add(a = undefined) {
        try {
            // - - -
            this.geometry = new THREE.BoxGeometry(
                this.conf.w || 1,
                this.conf.h || 1,
                this.conf.d || 1
            )
            this.mesh = new THREE.Mesh(this.geometry, this.material)
            this.mesh.position.set(
                this.conf.x || 0,
                this.conf.y || 0,
                this.conf.z || 0
            )
            this.mesh.castShadow = true
            this.mesh.receiveShadow = true
            this.scene.add(this.mesh)

            return this.mesh
            // - - -
        } catch (error) {
            console.log("add error.", error.message, error.name)

            return undefined
        }
    }
}

class Sphere extends Things {
    constructor(scene, material, conf = {}) {
        super(scene)
        this.material = material
        this.conf = conf
        return this.add()
    }

    /**
     * @desc    add
     * @returns {THREEJS SphereObject}
     */
    add() {
        try {
            // - - -
            this.geometry = new THREE.SphereGeometry(this.conf.r || 0.5)
            this.mesh = new THREE.Mesh(this.geometry, this.material)
            this.mesh.position.set(
                this.conf.x || 0,
                this.conf.y || 0,
                this.conf.z || 0
            )
            this.mesh.castShadow = true
            this.mesh.receiveShadow = true
            this.scene.add(this.mesh)

            return this.mesh

            // - - -
        } catch (error) {
            console.log("add error.", error.message, error.name)

            return undefined
        }
    }
}

class House extends Things {
    constructor(scene, material, conf) {
        super(scene)

        this.material = material
        this.conf = conf

        this.width = 20
        this.height = 20
        this.depth = 20

        return this.add()
    }
    /**
     * @desc    add
     * @returns {THREEJS Mesh}
     */
    add() {
        try {
            // - - -
            this.geometry = new THREE.BoxGeometry(
                this.conf.w || this.width,
                this.conf.h || this.height,
                this.conf.d || this.depth
            )
            this.material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                side: THREE.BackSide,
            })
            this.mesh = new THREE.Mesh(this.geometry, this.material)
            this.mesh.receiveShadow = true
            this.mesh.position.set(0, (this.conf.h || this.height) / 2 - 1, 0)

            this.scene.add(this.mesh)
            return this.mesh
            // - - -
        } catch (error) {
            console.log("add error.", error.message, error.name)

            return undefined
        }
    }
}

class Groundwater extends Things {
    constructor(scene, color) {
        super(scene)
        this.color = color

        this.width = 15
        this.depth = 15

        return this.add()
    }
    /**
     * @desc    add
     * @param   {type} desc
     * @returns {boolean}
     */
    add() {
        try {
            // - - -
            this.colorGeometry = new THREE.PlaneGeometry(this.width, this.depth, 5, 5)
            this.colorMaterial = new THREE.MeshStandardMaterial({
                color: this.color,
            })
            this.colorMesh = new THREE.Mesh(
                this.colorGeometry,
                this.colorMaterial
            )
            this.colorMesh.rotation.set(-Math.PI / 2, 0, 0)
            this.colorMesh.position.y = -0
            this.scene.add(this.colorMesh)

            this.textureLoader = new THREE.TextureLoader()
            this.geometry = new THREE.PlaneGeometry(
                this.width,
                this.depth,
                5,
                5
            )
            // this.flowMap = textureLoader.load("textures/water/Water_1_M_Flow.jpg");
            // this.flowMap = this.textureLoader.load(
            //     "textures/water/Water_1_M_Normal.jpg"
            // )
            this.mesh = new Water(this.geometry, {
                scale: 5,
                textureWidth: 1024,
                textureHeight: 1024,
                flowMap: this.flowMap,
            })
            this.mesh.rotation.set(-Math.PI / 2, 0, 0)
            this.mesh.position.y = 0.10
            this.scene.add(this.mesh)

            // - - -
        } catch (error) {
            console.log("add error.", error.message, error.name)

            return undefined
        }
    }
}

export { Things, Box, Sphere, House, Groundwater }
