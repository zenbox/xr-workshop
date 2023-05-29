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

export default class Terrain {
    constructor() {
        let worldWidth = 256,
            worldDepth = 256;

        const data = this.generateHeight(worldWidth, worldDepth);
        const terrainGeometry = new THREE.PlaneGeometry(
            7500,
            7500,
            worldWidth - 1,
            worldDepth - 1
        );
        terrainGeometry.rotateX(-Math.PI / 2);

        const vertices = terrainGeometry.attributes.position.array;
        for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = data[i] * 10;
        }

        let terrainTexture = new THREE.CanvasTexture(
            this.generateTexture(data, worldWidth, worldDepth)
        );
        terrainTexture.wrapS = THREE.ClampToEdgeWrapping;
        terrainTexture.wrapT = THREE.ClampToEdgeWrapping;
        terrainTexture.colorSpace = THREE.SRGBColorSpace;

        let terrainMesh = new THREE.Mesh(
            terrainGeometry,
            new THREE.MeshBasicMaterial({ map: terrainTexture })
        );
        return terrainMesh;
    }
    generateHeight(width, height) {
        let seed = Math.PI / 4;
        window.Math.random = function () {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        const size = width * height,
            data = new Uint8Array(size);
        const perlin = new ImprovedNoise(),
            z = Math.random() * 100;

        let quality = 1;

        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < size; i++) {
                const x = i % width,
                    y = ~~(i / width);
                data[i] += Math.abs(
                    perlin.noise(x / quality, y / quality, z) * quality * 0.75
                );
            }

            quality *= 5;
        }

        return data;
    }
    generateTexture(data, width, height) {
        let context, image, imageData, shade;

        const vector3 = new THREE.Vector3(0, 0, 0);

        const sun = new THREE.Vector3(1, 1, 1);
        sun.normalize();

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        context = canvas.getContext("2d");
        context.fillStyle = "#000";
        context.fillRect(0, 0, width, height);

        image = context.getImageData(0, 0, canvas.width, canvas.height);
        imageData = image.data;
        for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
            vector3.x = data[j - 2] - data[j + 2];
            vector3.y = 2;
            vector3.z = data[j - width * 2] - data[j + width * 2];
            vector3.normalize();

            shade = vector3.dot(sun);

            imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
            imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
            imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
        }
        context.putImageData(image, 0, 0);

        // Scaled 4x

        const canvasScaled = document.createElement("canvas");
        canvasScaled.width = width * 4;
        canvasScaled.height = height * 4;

        context = canvasScaled.getContext("2d");
        context.scale(4, 4);
        context.drawImage(canvas, 0, 0);

        image = context.getImageData(
            0,
            0,
            canvasScaled.width,
            canvasScaled.height
        );
        imageData = image.data;

        for (let i = 0, l = imageData.length; i < l; i += 4) {
            const v = ~~(Math.random() * 5);

            imageData[i] += v;
            imageData[i + 1] += v;
            imageData[i + 2] += v;
        }

        context.putImageData(image, 0, 0);

        return canvasScaled;
    }
}
