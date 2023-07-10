import * as THREE from "three"

export default class Plot {
    constructor(stuff) {
        this.stuff = stuff
    }
    play(o) {
        o.cube.rotation.x += 0.01
        o.cube.rotation.y += 0.01

        o.renderer.render(o.scene, o.camera)

        // this.animate()
    }

    animate(stage) {
        console.log(stage)
        requestAnimationFrame(stage.animate)
        this.play(this.stuff)
    }
}
