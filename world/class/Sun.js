import * as THREE from "three";

// import threejsExt from "https://cdn.skypack.dev/threejs-ext";
// import ImprovedNoise from "https://cdn.jsdelivr.net/npm/improved-noise@0.0.3/+esm";
// import * as dat from "https://cdn.skypack.dev/dat.gui@0.7.9";

// import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm";
// import CannonEsDebugger from "https://cdn.jsdelivr.net/npm/cannon-es-debugger@1.0.0/+esm";

import { Sky } from "three/examples/jsm/objects/Sky.js";

// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { DRACOLoader } from "three/addons/loaders/DRACOLoader";

export default class Sun {
    contructor() {
        this.sunSphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(200, 16, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        this.sunSphere.position.y = -700;
        this.sunSphere.visible = true;
        this.moveSun();
        return this.sunSphere;
    }

    moveSun(time) {
        var distance = 4000;
        var theta = Math.PI * (inclination - 0.5);
        var phi = 2 * Math.PI * (azimuth - 0.5);

        this.sunSphere.position.x = distance * Math.cos(phi);
        this.sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
        this.sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
    }

    addSky() {
        // Add Sky Mesh
        this.sky = new Sky();
        this.sky.scale.setScalar(450000);
        this.uniforms = this.sky.material.uniforms;
        this.uniforms.turbidity.value = 16;
        this.uniforms.rayleigh.value = 1.027;
        this.uniforms.mieCoefficient.value = 0.01;
        this.uniforms.mieDirectionalG.value = 0.97;

        // this.sky.uniforms.sunPosition.value.copy(this.sunSphere.position);

        return this.sky;
    }
}
