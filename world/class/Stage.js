import * as THREE from "three"
const clock = new THREE.Clock()

export default class Stage {
    constructor() {
        this.staff = []
    }

    /**
     * @desc    add
     * @param   {type} desc
     * @returns {boolean}
     */
    add(props) {
        try {
            // - - -
            this.staff.push(props)
            return true
            // - - -
        } catch (error) {
            console.log("add error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    play
     * @param   {type} desc
     * @returns {boolean}
     */
    play(actors) {
        try {
            // - - -
            this.staff.forEach((that) => {
                that.thing.rotation.x += that.rotate.x || 0
                that.thing.rotation.y += that.rotate.y || 0
                that.thing.rotation.z += that.rotate.z || 0
            })

            const delta = clock.getDelta()
            // if (actors.tokyo && typeof actors.tokyo.update === "function") actors.tokyo.update(delta)
            if (actors.flamingo && typeof actors.flamingo.update === "function")
                actors.flamingo.update(delta)
            
            

            return true
            // - - -
        } catch (error) {
            console.log("play error.", error.message, error.name)

            return undefined
        }
    }
}
