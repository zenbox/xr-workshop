import * as THREE from "three"

class Light {
    constructor(scene) {
        this.scene = scene
        return true
    }
}

class Ambient extends Light {
    constructor(scene) {
        super(scene)

        this.ambient = new THREE.AmbientLight(0xffffff, 0.5)

        this.scene.add(this.ambient)

        return this.ambient
    }
}

class Directional extends Light {
    constructor(scene) {
        super(scene)

        this.directional = new THREE.DirectionalLight(0xffffff, 0.5)

        this.scene.add(this.directional)

        return this.directional
    }
}

class Spot extends Light {
    constructor(scene) {
        super(scene)

        this.spot = new THREE.SpotLight(0xffffff)
        this.spot.castShadow = true
        this.spot.position.set(50, 50, 50)

        this.spot.shadow.mapSize.width = 512
        this.spot.shadow.mapSize.height = 512
        this.spot.shadow.camera.near = 0.5
        this.spot.shadow.camera.far = 500
        this.spot.shadow.focus = 1

        this.scene.add(this.spot)

        return this.spot
    }
}

class Hemisphere extends Light {
    constructor(scene) {
        super(scene)

        const skyColor = "skyblue" // helles Himmelblau
        const groundColor = "forestgreen" // Grün
        const intensity = 0.25

        this.hemisphere = new THREE.HemisphereLight(
            skyColor,
            groundColor,
            intensity
        )

        this.scene.add(this.hemisphere)

        return this.hemisphere
    }
}

export { Light, Ambient, Directional, Spot, Hemisphere }
