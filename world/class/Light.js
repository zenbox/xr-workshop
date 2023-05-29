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

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader";

export default class Light {
    constructor(type) {
        switch (type) {
            case "spot":
                this._light = this._addSpot();
                break;
            case "ambient":
                this._light = this._addAmbient();
                break;
            case "directional":
                this._light = this._addDirectional();
        }
        return this._light;
    }
    _addSpot() {
        this._light = new THREE.SpotLight(0xffffff);
        this._light.castShadow = true;
        this._light.position.set(50, 50, 50);

        this._light.shadow.mapSize.width = 512;
        this._light.shadow.mapSize.height = 512;
        this._light.shadow.camera.near = 0.5;
        this._light.shadow.camera.far = 500;
        this._light.shadow.focus = 1;

        return this._light;
    }
    _addAmbient() {
        this._light = new THREE.AmbientLight(0x404040);
        return this._light;
    }
    _addDirectional() {
        this._light = new THREE.DirectionalLight(0xffffff, 0.5);
        return this._light;
    }
  }