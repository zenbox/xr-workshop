import * as THREE from "three"
import ImprovedNoise from "https://cdn.jsdelivr.net/npm/improved-noise@0.0.3/+esm"

export default class Terrain {
    constructor(scene) {
        let worldWidth = 256,
            worldDepth = 256,
            worldHeight = 5
        
        this.scene = scene

        const data = this.generateHeight(worldWidth, worldDepth)
        const terrainGeometry = new THREE.PlaneGeometry(
            // Width, depth
            10000,
            10000,
            worldWidth - 1,
            worldDepth - 1
        )
        terrainGeometry.rotateX(-Math.PI / 2)

        const vertices = terrainGeometry.attributes.position.array
        for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = data[i] * 10
        }

        let terrainTexture = new THREE.CanvasTexture(
            this.generateTexture(data, worldWidth, worldDepth)
        )

        terrainTexture.wrapS = THREE.ClampToEdgeWrapping
        terrainTexture.wrapT = THREE.ClampToEdgeWrapping

        terrainTexture.colorSpace = THREE.SRGBColorSpace

        let terrainMesh = new THREE.Mesh(
            terrainGeometry,
            new THREE.MeshBasicMaterial({ map: terrainTexture })
        )

        terrainMesh.position.set(-400, -85, 0)
        this.scene.add(terrainMesh)

        return terrainMesh
    }
    generateHeight(width, depth) {
        let seed = Math.PI / 4
        window.Math.random = function () {
            const x = Math.sin(seed++) * 1000
            return x - Math.floor(x)
        }

        const size = width * depth,
            data = new Uint8Array(size)
        const perlin = new ImprovedNoise(),
            z = Math.random() * 150

        let quality = 1

        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < size; i++) {
                const x = i % width,
                    y = ~~(i / width)
                data[i] += Math.abs(
                    perlin.noise(x / quality, y / quality, z) * quality * 0.75
                )
            }

            quality *= 3.1 // Kind of height?
        }

        return data
    }
    generateTexture(data, width, height) {
        let context, image, imageData, shade

        const vector3 = new THREE.Vector3(0, 0, 0)

        const sun = new THREE.Vector3(0.5, 0.5, 0.5)
        sun.normalize()

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height

        context = canvas.getContext("2d")
        context.fillStyle = "#000"
        context.fillRect(0, 0, width, height)

        image = context.getImageData(0, 0, canvas.width, canvas.height)
        imageData = image.data
        for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
            vector3.x = data[j - 2] - data[j + 2]
            vector3.y = 2
            vector3.z = data[j - width * 2] - data[j + width * 2]
            vector3.normalize()

            shade = vector3.dot(sun)
            let constant = 100
            imageData[i] =
                constant / 10 + (96 + shade * 128) * (0.5 + data[j] * 0.007)
            imageData[i + 1] =
                constant + (32 + shade * 96) * (0.5 + data[j] * 0.007)
            imageData[i + 2] = constant + shade * 96 * (0.5 + data[j] * 0.007)

            // console.log(imageData[i]);
        }
        context.putImageData(image, 0, 0)

        // Scaled 4x

        const canvasScaled = document.createElement("canvas")
        canvasScaled.width = width * 4
        canvasScaled.height = height * 4

        context = canvasScaled.getContext("2d")
        context.scale(4, 4)
        context.drawImage(canvas, 0, 0)

        image = context.getImageData(
            0,
            0,
            canvasScaled.width,
            canvasScaled.height
        )
        imageData = image.data

        for (let i = 0, l = imageData.length; i < l; i += 4) {
            const v = ~~(Math.random() * 5)

            imageData[i] += v
            imageData[i + 1] += v
            imageData[i + 2] += v
        }

        context.putImageData(image, 0, 0)

        return canvasScaled
    }
}
