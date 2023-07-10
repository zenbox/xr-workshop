import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader";

export default class Model {
    constructor(file, scene, options = { scale: 0.25 }) {
        this.options = options;
        this.init();
        this.scene = scene;
        this.get(file);
       
    }
    init() {
        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath(
            "../node_modules/three/examples/jsm/libs/draco/gltf/"
        );
        this.loader.setDRACOLoader(this.dracoLoader);
    }
    async get(file) {
        await this.loader.load(
            file,
            (gltf) => {
                // called when the resource is loaded
                let model = gltf.scene;
                this.gltf = gltf;
                model.scale.set(
                    this.options.scale,
                    this.options.scale,
                    this.options.scale
                );
                model.position.set(10, 10.1, -5);

                this.scene.add(model);
 this.mixer = new THREE.AnimationMixer(model);
                this.mixer.clipAction(gltf.animations[0]).play();
            },
            (xhr) => {
                // called while loading is progressing
                console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
            },
            (error) => {
                // called when loading has errors
                console.error("An error happened", error);
            }
        );
    }
}
