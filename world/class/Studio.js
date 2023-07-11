import * as THREE from "three"

export default class Studio {
    constructor() {
        this.setResizeBehaviour()
    }

    /**
     * @desc    setScene
     * @returns {THREEJS Scene}
     */
    setScene() {
        try {
            // - - -
            this.scene = new THREE.Scene()
            this.scene.background = new THREE.Color(0x000033)

            return this.scene
            // - - -
        } catch (error) {
            console.log("setScene error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    setCamera
     * @param   {object} args - parameters to determine the camera
     * @returns {THREEJS Camera}
     */
    setCamera(args = undefined) {
        try {
            // - - -
            this.camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                20000
            )

            this.camera.position.x = args?.x || 0
            this.camera.position.y = args?.y || 2
            this.camera.position.z = args?.z || 10

            this.camera.lookAt(this.scene.position)

            return this.camera
            // - - -
        } catch (error) {
            console.log("setCamera error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    setRenderer
     * @returns {THREEJS Renderer}
     */
    setRenderer(a = undefined) {
        try {
            // - - -
            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                logarithmicDepthBuffer: false,
            })
            this.renderer.setSize(window.innerWidth, window.innerHeight)

            this.renderer.xr.enabled = true

            this.renderer.shadowMap.enabled = true
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

            this.renderer.toneMapping = THREE.ACESFilmicToneMapping
            this.renderer.toneMappingExposure = 0.5

            this.renderer.setClearColor({ color: 0x334499, alpha: 0.95 })

            return this.renderer
            // - - -
        } catch (error) {
            console.log("setRenderer error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    setHelper
     * @param   {obj} flags for scene helpers
     * @returns {boolean}
     */
    setHelper(show = {}) {
        try {
            // - - -
            if (show.grid) {
                this.gridHelper = new THREE.GridHelper(10, 10)
                this.scene.add(this.gridHelper)
            }
            if (show.axes) {
                this.axesHelper = new THREE.AxesHelper(10)
                this.scene.add(this.axesHelper)
            }

            return true
            // - - -
        } catch (error) {
            console.log("setHelper error.", error.message, error.name)

            return undefined
        }
    }

    /**
     * @desc    setResizeBehaviour
     * @returns {boolean}
     */
    setResizeBehaviour() {
        try {
            // - - -
            window.addEventListener("resize", () => {
                this.camera.aspect = window.innerWidth / window.innerHeight
                this.camera.updateProjectionMatrix()
                this.renderer.setSize(window.innerWidth, window.innerHeight)
            })
            return true
            // - - -
        } catch (error) {
            console.log("setResizeBehaviour error.", error.message, error.name)

            return undefined
        }
    }
}
