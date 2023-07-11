import * as THREE from "three"

export default class Fog {
    constructor(scene) {
        this.scene = scene
        this.fogColor = {
            h: 215,
            s: 80,
            l: 80,
        }
        return (this.fog = new THREE.Fog(
            `hsl(${this.fogColor.h},${this.fogColor.s}%,${this.fogColor.l}%)`,
            0.01,
            272
        ))

        this.scene.fog = fog
    }
}
