/**
 * nodejs
 * Projektordner
 * prettier
 * threejs instllieren
 * vite installieren
 * vite.config.js mit basicssl
 * ---
 * Chrome Browser (desktop)
 * mit Quest Erweiterung (Immersive Web Emulator)
 * Quest XR-fähigen Browser (Wolvic, Meta Browser)
 * ---
 * npx vite --host 0.0.0.0
 * 127.0.0.1:5173 (lokal)
 * 192.168.55.96:5173/ (in der VR Brille)
 * ---
 * index.html
 * javascript
 */

// threejs and xr modules
import * as THREE from "three";
import CANNON from "cannon";

import Studio from "./class/Studio.js";
import Plot from "./class/Plot.js";
import Controller from "./class/Controller.js";

const studio = new Studio();
const scene = studio._scene;

const plot = new Plot(studio);
const renderer = plot._renderer;

let group;
const controller = new Controller(studio, plot, group);
controller._update();

const world = new CANNON.World();
world.gravity.set(0, -9.82 * 20, 0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 16;

// Variablen für den Aufbau
let cubes = [],
    floor,
    back,
    left,
    right,
    INTERSECTION,
    baseReferenceSpace,
    ambientLight;

const clock = new THREE.Clock();

// **********
// **********
function addLights() {
    ambientLight = new THREE.AmbientLight(0x404040); // soft white light

    let pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 20, 0);

    scene.add(ambientLight);
    scene.add(pointLight);
}

function animate() {
    renderer.setAnimationLoop(renderXrLoop);
}

function renderXrLoop() {
    INTERSECTION = undefined;

    if (controller._leftController.userData.isSelecting === true) {
        tempMatrix.identity().extractRotation(leftController.matrixWorld);

        raycasterTeleport.ray.origin.setFromMatrixPosition(
            leftController.matrixWorld
        );
        raycasterTeleport.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

        const intersects = raycasterTeleport.intersectObjects([floor]);

        if (intersects.length > 0) {
            INTERSECTION = intersects[0].point;
        }
    } else if (controller._rightController.userData.isSelecting === true) {
        tempMatrix.identity().extractRotation(rightController.matrixWorld);

        raycasterTeleport.ray.origin.setFromMatrixPosition(
            rightController.matrixWorld
        );
        raycasterTeleport.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

        const intersects = raycasterTeleport.intersectObjects([floor]);

        if (intersects.length > 0) {
            INTERSECTION = intersects[0].point;
        }
    }

    if (INTERSECTION) this._marker.position.copy(INTERSECTION);

    controller._marker.visible = INTERSECTION !== undefined;
    // Render the image into the canvas object
    renderer.render(scene, studio.camera);

    controller._cleanIntersectedObjects();

    controller._intersectObjects(controller._leftController);
    controller._intersectObjects(controller._rightController);

    cubes.forEach((cube) => {
        cube.rotation.x += 0.005 + Math.random() * 0.005;
        cube.rotation.z += 0.005 + Math.random() * 0.005;
        cube.rotation.x += 0.005 + Math.random() * 0.005;
    });

    updatePhysics();
}

// - - - - - - - - - -
// RAYCASTER
// - - - - - - - - - -

// - - - - - - - - - -
function addCubes() {
    for (let i = 0; i <= 10; i++) {
        const geometry = new THREE.BoxGeometry(
            Math.random() * 0.5,
            Math.random() * 0.5,
            Math.random() * 0.5
        );

        const material = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xff0000,
        });

        let cube = new THREE.Mesh(geometry, material);

        cube.position.set(
            -5 + Math.random() * 10, //x orange
            3 + Math.random() * 2, // y grün
            -4 + Math.random() * 8 // -z blau
        );
        cubes.push(cube);
        group.add(cube);
    }
}
function addGroup() {
    group = new THREE.Group();
    scene.add(group);
}
function addFloor() {
    const geometry = new THREE.BoxGeometry(10, 0.1, 10);
    const material = new THREE.MeshBasicMaterial({
        color: 0x444444,
    });
    let floor = new THREE.Mesh(geometry, material);
    floor.position.y = -0.2;
    //Boden neigen
    //floor.rotation.set(-0.3, 0, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    return floor;
}
function addBack() {
    const geometry = new THREE.BoxGeometry(10, 10, 0.5);
    const material = new THREE.MeshBasicMaterial({
        color: 0x444444,
    });
    back = new THREE.Mesh(geometry, material);
    back.position.y = 4.85;
    back.position.z = -5.2;
    back.receiveShadow = true;
    scene.add(back);
}
function addLeft() {
    const geometry = new THREE.BoxGeometry(0.5, 10, 10);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
    });
    left = new THREE.Mesh(geometry, material);
    left.position.y = 4.85;
    left.position.z = -0;
    left.position.x = 5;
    left.receiveShadow = true;
    scene.add(left);
}
function addRight() {
    const geometry = new THREE.BoxGeometry(0.5, 10, 10);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
    });
    right = new THREE.Mesh(geometry, material);
    right.position.y = 4.85;
    right.position.z = -0;
    right.position.x = -5;
    right.receiveShadow = true;
    scene.add(right);
}

// - - - - - - - - - - -
//Physics
// - - - - - - - - - - -
floor = addFloor();
addGroup();
addCubes();

//Floor
let floorBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
});
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
floorBody.position.copy(floor.position);

function updatePhysics() {
    world.step(1.0 / 60.0);
    updateMeshFromBody();
}

function updateMeshFromBody() {
    meshObject.position.copy(physicsObject.position);
    meshObject.quaternion.copy(physicsObject.quaternion);
}

function updateBodyFromMesh() {
    physicsObject.position.copy(meshObject.position);
    physicsObject.quaternion.copy(meshObject.quaternion);
}

let simulationRunning = false;
let s = 0.25;
let physicsObject = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(s, s, s)),
    material: new THREE.MeshBasicMaterial(0xff0000),
});

let meshObject = new THREE.Mesh(
    new THREE.BoxGeometry(s, s, s),
    new THREE.MeshStandardMaterial({ color: 0xffcc00 })
);

world.add(floorBody);
world.add(physicsObject);

group.add(meshObject);

// - - - - - - - - - - -
// PROCESS
// - - - - - - - - - - -

addLights();

addBack();
addLeft();
addRight();

// - - - - - - - - - -
// Always at the end
// - - - - - - - - - -
animate();
