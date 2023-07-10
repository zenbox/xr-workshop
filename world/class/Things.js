import * as THREE from "three"

class Things {
    constructor(scene) {
        this.scene = scene
        
    }
}

class Box extends Things {
    constructor(scene, material) {
        super(scene)
        this.material = material
        return this.add()
    }
    add() {
        this.geometry = new THREE.BoxGeometry(1, 1, 1)
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.set(0, 0, 0)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)

        return this.mesh
    }
}

class Sphere extends Things {
    constructor(scene, material) {
        super(scene)
        this.material = material
        return this.add()
    }
    add() {
        this.geometry = new THREE.SphereGeometry(0.65)
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.set(0, 0, 0)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)

        return this.mesh
    }
}

export { Things, Box, Sphere }
