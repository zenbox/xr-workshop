import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky.js";

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
        let distance = 40000;
        let inclination = 10; // angle over horizon
        let azimuth = 45; // position around
        let theta = Math.PI * (inclination - 0.5);
        let phi = 2 * Math.PI * (azimuth - 0.5);
        let exposure = 0.3;

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
        this.uniforms.rayleigh.value = 0.6;
        this.uniforms.mieCoefficient.value = 0.01;
        this.uniforms.mieDirectionalG.value = 0.97;

        // this.sky.uniforms.sunPosition.value.copy(this.sunSphere.position);

        return this.sky;
    }
}
