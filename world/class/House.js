import * as THREE from "three";

export default class House {
    constructor(scene) {
        this.scene = scene;
        this.setMaterials();
        this.extrudeSettings = {
            steps: 2,
            depth: 26,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1,
        };
        this.objects = [
            {
                n: "Hausmauer",
                g: "box",
                m: this.wall,
                level: 1,
                w: 2,
                h: 8,
                d: 2,
                x: -1,
                y: 4,
                z: 0,
                alpha: 0,
                beta: 0,
                gamma: 0,
            },
            {
                n: "Dachgeschoss",
                g: "roof",
                m: this.wood,
                level: 2,
                w: 2,
                h: 3,
                d: 2,
                x: -1,
                y: 4 + 5.5,
                z: 0,
                alpha: 0,
                beta: Math.PI * 0.5,
                gamma: 0,
            },
            {
                n: "Hausmauer",
                g: "box",
                m: this.wall,
                level: 1,
                w: 4,
                h: 4,
                d: 4,
                x: 2,
                y: 2,
                z: 0,
                alpha: 0,
                beta: 0,
                gamma: 0,
            },
            {
                n: "Dachgeschoss",
                g: "roof",
                m: this.wood,
                level: 2,
                w: 4,
                h: 2,
                d: 4,
                x: 2,
                y: 3 + 2,
                z: 0,
                alpha: 0,
                beta: 0,
                gamma: 0,
            },
        ];
        this.houses = this.build();
        // this.houses.position.set(0, this.config.height / 2 + 0.25, 14);
        // this.houses.rotation.set(0, 0.8, 0);
        return this.houses;
    }
    setMaterials() {
        this.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        this.floor = new THREE.MeshStandardMaterial({ color: "white" });
        this.wall = new THREE.MeshStandardMaterial({ color: "white" });
        this.wood = new THREE.MeshStandardMaterial({ color: "red" });
    }
    build() {
        const group = new THREE.Group();
        let totalWidth = [0,0,0];
        const objects = this.objects;
        const extrudeSettings = this.extrudeSettings;

        objects.forEach((d) => (totalWidth[d.level] += parseFloat(d.w)));

        const geometries = [];
        const meshes = [];
        let index = 0,
            length = [],
            y = 0,
            x = 0,
            z = 0;

        length[0] = 0;
        length[1] = 0;
        length[2] = 0;

        objects.forEach((object) => {
            let width = object.w || 1,
                height = object.h || 1,
                depth = object.d || 1,
                geometry = object.g,
                level = object.level,
                material = object.m,
                y = object.y || 0,
                x = object.x || 0,
                z = object.z || 0,
                alpha = object.alpha || 0,
                beta = object.beta || 0,
                gamma = object.gamma || 0;

            switch (geometry) {
                case "box":
                    const box = new THREE.Shape();
                    box.moveTo(-width / 2);
                    box.lineTo(-width / 2, height);
                    box.lineTo(width / 2, height);
                    box.lineTo(width / 2, 0);
                    box.lineTo(-width / 2, 0);
                    extrudeSettings.depth = width;
                    geometries[index] = new THREE.ExtrudeGeometry(
                        box,
                        extrudeSettings
                    );
                    geometries[index].center();

                    break;
                case "roof":
                    const roof = new THREE.Shape();
                    roof.moveTo(-width / 2, 0);
                    roof.lineTo(0, height);
                    roof.lineTo(width / 2, 0);
                    roof.lineTo(-width / 2, 0);
                    extrudeSettings.depth = width;
                    geometries[index] = new THREE.ExtrudeGeometry(
                        roof,
                        extrudeSettings
                    );
                    geometries[index].center();
                    break;
            }

            meshes[index] = new THREE.Mesh(geometries[index], material);
            meshes[index].position.set(x, y, z);
            meshes[index].rotation.set(alpha, beta, gamma);
            group.add(meshes[index]);
            index++;
        });
        return group;
    }
}
