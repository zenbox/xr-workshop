import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { XRButton } from "three/addons/webxr/XRButton.js";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";

export default class Controller {
    constructor(studio, plot) {
        this._studio = studio;
        this._plot = plot;
        this._scene = this._studio._scene;
        this._initOrbitControl();
        this._initXrControl();
        this._addRay();
        this._addMarker();
        this._addLeftController();
        this._addRightController();
        this._addLeftGrip();
        this._addRightGrip();
        this._addDomElements();
    }
    _initOrbitControl() {
        this._orbitControls = new OrbitControls(
            this._studio.camera,
            this._plot._renderer.domElement
        );
    }
    _initXrControl() {
        this._controllerModelFactory = new XRControllerModelFactory();
    }
    _update() {
        this._orbitControls.update();
    }
    _addLeftController() {
        this._leftController = this._plot._renderer.xr.getController(0);
        this._leftController.addEventListener("selectstart", this._onDragStart);
        this._leftController.addEventListener("selectend", this._onDragEnd);
        this._leftController.add(this._rayMesh.clone());
        this._scene.add(this._leftController);
    }
    _addRightController() {
        this._rightController = this._plot._renderer.xr.getController(1);
        this._rightController.addEventListener(
            "selectstart",
            this._onTeleportStart
        );
        this._rightController.addEventListener(
            "selectend",
            this._onTeleportEnd
        );
        this._rightController.add(this._rayMesh.clone());
        this._scene.add(this._rightController);
    }
    _addLeftGrip() {
        this._leftGrip = this._plot._renderer.xr.getControllerGrip(0);
        this._leftGrip.add(
            this._controllerModelFactory.createControllerModel(this._leftGrip)
        );
        this._scene.add(this._leftGrip);
    }
    _addRightGrip() {
        this._rightGrip = this._plot._renderer.xr.getControllerGrip(1);
        this._rightGrip.add(
            this._controllerModelFactory.createControllerModel(this._rightGrip)
        );
        this._scene.add(this._rightGrip);
    }
    _addMarker() {
        let _marker = new THREE.Mesh(
            new THREE.CircleGeometry(0.25, 32).rotateX(-Math.PI / 2),
            new THREE.MeshBasicMaterial({ color: 0x808080 })
        );
        this._scene.add(_marker);
    }
    _onDragStart(event) {
        this.userData.isSelecting = true;
        let _controller = event.target,
            _intersections = this._getRaycasterIntersections(_controller);
        if (_intersections.length > 0) {
            let _intersection = _intersections[0],
                _object = _intersection.object; // selected cube!
            _object.material.emissive.b = 1;
            _controller.attach(object);
            _controller.userData.selected = _object;
        }
        _controller.userData.targetRayMode = event.data.targetRayMode;
    }
    _onDragEnd(event) {
        this.userData.isSelecting = false;
        let _controller = event.target;
        if (_controller.userData.selected !== undefined) {
            let _object = _controller.userData.selected;
            // todo wtf?
            updateBodyFromMesh();
            _object.material.emissive.b = 0;
            // The global group of draggable objects
            group.attach(object);
            _controller.userData.selected = undefined;
        }
    }
    _onTeleportStart() {
        this.userData.isSelecting = true;
        //console.log("Suqueezebutton pressed");
    }
    _onTeleportEnd() {
        // console.log("Suqueezebutton unpressed");
        this.userData.isSelecting = false;
        if (INTERSECTION) {
            let _offsetPosition = {
                    x: -INTERSECTION.x,
                    y: -INTERSECTION.y,
                    z: -INTERSECTION.z,
                    w: 1,
                },
                _offsetRotation = new THREE.Quaternion(),
                _transform = new XRRigidTransform(
                    _offsetPosition,
                    _offsetRotation
                ),
                _teleportSpaceOffset =
                    baseReferenceSpace.getOffsetReferenceSpace(_transform);
            renderer.xr.setReferenceSpace(_teleportSpaceOffset);
        }
    }
    _addDomElements() {
        document.body.appendChild(XRButton.createButton(this._renderer));
    }
    _getRaycasterIntersections(controller) {
        let _drag = raycasterDrag,
            _ray = raycasterDrag.ray,
            _matrix = controller.matrixWorld;

        // ? why?
        // controller.updateMatrixWorld();

        // Extract controller rotation fron the controller matrix
        // (relative to world)
        tempMatrix.identity().extractRotation(_matrix);

        // Set the ray origin to controller matrix (position & rotation)
        // Set the ray direction (turn ray z into direction)
        _ray.origin.setFromMatrixPosition(_matrix);
        _ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

        return _drag.intersectObjects(group.children, false);
    }
    _intersectObjects(controller) {
        // Nothing is selected, so idle
        if (controller.userData.selected !== undefined) return;

        // Is there an object named "line" in the controller?
        let _line = controller.getObjectByName("line"),
            _intersections = getRaycasterIntersections(controller);

        // If there are any intersections
        if (_intersections.length > 0) {
            // Grab the first one
            let _intersection = intersections[0],
                _object = intersection.object;

            // Highlight the texture
            _object.material.emissive.r = 1;

            // Is an array of all intersections?
            intersectedObjects.push(object);

            // Adapt the raycaster z line length
            // to distance to selected object
            _line.scale.z = intersection.distance;
        } else {
            // Else fallback to half a meter
            _line.scale.z = 5;
        }
    }
    _cleanIntersectedObjects() {
        while (intersectedObjects.length) {
            let _object = intersectedObjects.pop();
            _object.material.emissive.r = 0;
        }
    }
    _addRay() {
        this._rayGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -1),
        ]);
        (this._raycasterDrag = new THREE.Raycaster()),
            (this._raycasterTeleport = new THREE.Raycaster()),
            (this._rayMesh = new THREE.Line(this._rayGeometry)),
            (this._intersectedObjects = []),
            (this._tempMatrix = new THREE.Matrix4());

        this._rayMesh.name = "line";
        this._rayMesh.scale.z = 5;
    }
}
