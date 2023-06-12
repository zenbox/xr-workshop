import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Water } from "three/addons/objects/Water2.js";

import threejsExt from "https://cdn.skypack.dev/threejs-ext";
import ImprovedNoise from "https://cdn.jsdelivr.net/npm/improved-noise@0.0.3/+esm";
import * as dat from "https://cdn.skypack.dev/dat.gui@0.7.9";

import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm";
import CannonEsDebugger from "https://cdn.jsdelivr.net/npm/cannon-es-debugger@1.0.0/+esm";

// import { Sky } from "https://cdn.skypack.dev/three@0.130.1/examples/jsm/objects/Sky.js";

export default class Studio {
    constructor(conf) {
        this.scene = this._setScene();
        this.camera = this._setCamera();
        this.renderer = this._setRenderer();
        if (conf.helper) this._setHelper();
    }
    _setScene() {
        this._scene = new THREE.Scene();
        return this._scene;
    }
    _setCamera() {
        this._camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            20000
        );
        return this._camera;
    }
    _setRenderer() {
        this._renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            logarithmicDepthBuffer: false,
        });
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this._renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this._renderer.toneMappingExposure = 0.5;
        this._renderer.setClearColor({ color: 0x334499, alpha: 0.95 });

        return this._renderer;
    }
    _setHelper() {
        this._gridHelper = new THREE.GridHelper(10, 10);
        this._scene.add(this._gridHelper);

        this._axesHelper = new THREE.AxesHelper(10);
        this._scene.add(this._axesHelper);
    }
}
