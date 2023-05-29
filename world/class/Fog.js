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

export default class Fog {
    constructor() {
        this.fogColor = {
            h: 215,
            s: 80,
            l: 80,
        };
        return (this.fog = new THREE.Fog(
            `hsl(${this.fogColor.h},${this.fogColor.s}%,${this.fogColor.l}%)`,
            0.01,
            272
        ));
    }
  }