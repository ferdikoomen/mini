import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';

import Settings from './Settings';
import { getTheta } from './Utils';

export default class ThreeCamera {
    public static camera: THREE.PerspectiveCamera;
    public static enabled: boolean = true;
    public static enableZoom: boolean = false;
    public static enableRotate: boolean = false;
    public static enablePan: boolean = false;
    public static target: THREE.Object3D;

    private static width: number;
    private static height: number;
    private static minDistance: number = 2;
    private static maxDistance: number = 100;
    private static minPolarAngle: number = 0;
    private static maxPolarAngle: number = Math.PI / 2;
    private static minAzimuthAngle: number = -Infinity;
    private static maxAzimuthAngle: number = Infinity;
    private static dampingFactor: number = 0.25;
    private static zoomSpeed: number = 1.0;
    private static rotateSpeed: number = 0.25;
    private static mouseButtons: any = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };
    private static mouseDown: boolean = false;
    private static states: any = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 };
    private static state: number = -1;
    private static offset: THREE.Vector3;
    private static quat: THREE.Quaternion;
    private static quatInverse: THREE.Quaternion;
    private static spherical: THREE.Spherical = new THREE.Spherical();
    private static sphericalDelta: THREE.Spherical = new THREE.Spherical();
    private static scale: number = 1;
    private static rotateStart: THREE.Vector2 = new THREE.Vector2();
    private static rotateEnd: THREE.Vector2 = new THREE.Vector2();
    private static rotateDelta: THREE.Vector2 = new THREE.Vector2();
    private static panStart: THREE.Vector2 = new THREE.Vector2();
    private static panEnd: THREE.Vector2 = new THREE.Vector2();
    private static panDelta: THREE.Vector2 = new THREE.Vector2();
    private static panOffset: THREE.Vector3 = new THREE.Vector3();
    private static dollyStart: THREE.Vector2 = new THREE.Vector2();
    private static dollyEnd: THREE.Vector2 = new THREE.Vector2();
    private static dollyDelta: THREE.Vector2 = new THREE.Vector2();

    private static followTarget: THREE.Object3D;
    private static followTheta: number = 0;
    private static followThetaDelta: number = 0;

    public static init(): void {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.01, 1000);
        this.camera.position.set(0, 2, 4);
        this.camera.matrixAutoUpdate = false;
        this.target = new THREE.Object3D();
        this.target.matrixAutoUpdate = false;
        this.offset = new THREE.Vector3();
        this.quat = new THREE.Quaternion().setFromUnitVectors(this.camera.up, new THREE.Vector3(0, 1, 0));
        this.quatInverse = this.quat.clone().inverse();

        document.addEventListener('contextmenu', e => this.onContextMenu(e), false);
        document.addEventListener('mousedown', e => this.onMouseDown(e), false);
        document.addEventListener('mousemove', e => this.onMouseMove(e), false);
        document.addEventListener('mouseup', e => this.onMouseUp(e), false);
        document.addEventListener('wheel', e => this.onMouseWheel(e), false);
        document.addEventListener('touchstart', e => this.onTouchStart(e), false);
        document.addEventListener('touchmove', e => this.onTouchMove(e), false);
        document.addEventListener('touchend', e => this.onTouchEnd(e), false);
    }

    public static resize(): void {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    public static update(): void {
        if (this.enabled) {
            if (this.followTarget) {
                this.target.position.lerp(this.followTarget.position, 0.1);
                this.target.quaternion.slerp(this.followTarget.quaternion, 0.1);
                this.target.updateMatrix();

                const theta: number = getTheta(this.target);
                this.followThetaDelta = theta - this.followTheta;
                this.followTheta += this.followThetaDelta;
            } else {
                this.offset.copy(this.camera.position).sub(this.target.position);
                this.spherical.setFromVector3(this.offset);
            }

            this.spherical.theta += this.followThetaDelta;
            this.spherical.theta += this.sphericalDelta.theta;
            this.spherical.phi += this.sphericalDelta.phi;
            this.spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this.spherical.theta));
            this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));
            this.spherical.makeSafe();
            this.spherical.radius *= this.scale;
            this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));

            this.offset.setFromSpherical(this.spherical);

            this.target.position.add(this.panOffset);
            this.target.updateMatrix();

            this.camera.position.copy(this.target.position).add(this.offset);
            this.camera.lookAt(this.target.position);
            this.camera.updateMatrix();

            this.sphericalDelta.theta *= 1 - this.dampingFactor;
            this.sphericalDelta.phi *= 1 - this.dampingFactor;
            this.panOffset.set(0, 0, 0);
            this.scale = 1;
        }
    }

    public static setFollowTarget(target: THREE.Object3D): void {
        this.followTarget = target;
        this.followTheta = getTheta(target);
        this.followThetaDelta = 0;
    }

    public static async animatePosition(cameraTo: number[], targetTo: number[], duration: number): Promise<void> {
        return new Promise<void>((resolve: () => void): void => {
            new TWEEN.Tween({
                cameraX: this.camera.position.x,
                cameraY: this.camera.position.y,
                cameraZ: this.camera.position.z,
                targetX: this.target.position.x,
                targetY: this.target.position.y,
                targetZ: this.target.position.z,
            })
                .to(
                    {
                        cameraX: cameraTo[0],
                        cameraY: cameraTo[1],
                        cameraZ: cameraTo[2],
                        targetX: targetTo[0],
                        targetY: targetTo[1],
                        targetZ: targetTo[2],
                    },
                    duration / Settings.speed
                )
                .easing(TWEEN.Easing.Quintic.Out)
                .onUpdate((object: any): void => {
                    this.camera.position.set(object.cameraX, object.cameraY, object.cameraZ);
                    this.target.position.set(object.targetX, object.targetY, object.targetZ);
                    this.camera.updateMatrix();
                    this.target.updateMatrix();
                })
                .onComplete((): void => {
                    resolve();
                })
                // @ts-ignore
                .start();
        });
    }

    public static async animateSpherical(theta: number, phi: number, radius: number, targetTo: number[], duration: number): Promise<void> {
        return new Promise<void>((resolve: () => void): void => {
            const enabled: boolean = this.enabled;
            new TWEEN.Tween({
                theta: this.spherical.theta,
                phi: this.spherical.phi,
                radius: this.spherical.radius,
                targetX: this.target.position.x,
                targetY: this.target.position.y,
                targetZ: this.target.position.z,
            })
                .to(
                    {
                        theta: THREE.MathUtils.degToRad(theta),
                        phi: THREE.MathUtils.degToRad(phi),
                        radius: radius,
                        targetX: targetTo[0],
                        targetY: targetTo[1],
                        targetZ: targetTo[2],
                    },
                    duration / Settings.speed
                )
                .easing(TWEEN.Easing.Cubic.InOut)
                .onStart((): void => {
                    this.enabled = false;
                })
                .onUpdate((object: any): void => {
                    this.sphericalDelta.theta = 0;
                    this.sphericalDelta.phi = 0;
                    this.spherical.theta = object.theta;
                    this.spherical.phi = object.phi;
                    this.spherical.radius = object.radius;
                    this.target.position.set(object.targetX, object.targetY, object.targetZ);
                    this.target.updateMatrix();
                    this.offset.setFromSpherical(this.spherical);
                    this.offset.applyQuaternion(this.quatInverse);
                    this.camera.position.copy(this.target.position).add(this.offset);
                    this.camera.lookAt(this.target.position);
                    this.camera.updateMatrix();
                })
                .onComplete((): void => {
                    this.enabled = enabled;
                    resolve();
                })
                // @ts-ignore
                .start();
        });
    }

    private static onContextMenu(e: Event): void {
        e.preventDefault();
    }

    private static onMouseDown(e: MouseEvent): void {
        if (this.enabled) {
            e.preventDefault();

            switch (e.button) {
                case this.mouseButtons.ORBIT:
                    if (this.enableRotate) {
                        this.rotateStart.set(e.clientX, e.clientY);
                    }
                    this.state = this.states.ROTATE;
                    break;
                case this.mouseButtons.ZOOM:
                    if (this.enableZoom) {
                        this.dollyStart.set(e.clientX, e.clientY);
                    }
                    this.state = this.states.DOLLY;
                    break;
                case this.mouseButtons.PAN:
                    if (this.enablePan) {
                        this.panStart.set(e.clientX, e.clientY);
                    }
                    this.state = this.states.PAN;
                    break;
            }

            if (this.state !== this.states.NONE) {
                this.mouseDown = true;
            }
        }
    }

    private static onMouseMove(e: MouseEvent): void {
        if (this.enabled && this.mouseDown) {
            e.preventDefault();

            switch (this.state) {
                case this.states.ROTATE:
                    if (this.enableRotate) {
                        this.rotateEnd.set(e.clientX, e.clientY);
                        this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
                        this.rotateLeft(((2 * Math.PI * this.rotateDelta.x) / this.width) * this.rotateSpeed);
                        this.rotateUp(((2 * Math.PI * this.rotateDelta.y) / this.height) * this.rotateSpeed);
                        this.rotateStart.copy(this.rotateEnd);
                    }
                    break;
                case this.states.DOLLY:
                    if (this.enableZoom) {
                        this.dollyEnd.set(e.clientX, e.clientY);
                        this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart);
                        if (this.dollyDelta.y > 0) {
                            this.dollyIn(this.getZoomScale());
                        } else if (this.dollyDelta.y < 0) {
                            this.dollyOut(this.getZoomScale());
                        }
                        this.dollyStart.copy(this.dollyEnd);
                    }
                    break;
                case this.states.PAN:
                    if (this.enablePan) {
                        this.panEnd.set(e.clientX, e.clientY);
                        this.panDelta.subVectors(this.panEnd, this.panStart);
                        this.pan(this.panDelta.x, this.panDelta.y);
                        this.panStart.copy(this.panEnd);
                    }
                    break;
            }
        }
    }

    private static onMouseUp(): void {
        this.mouseDown = false;
        this.state = this.states.NONE;
    }

    private static onMouseWheel(e: MouseWheelEvent): void {
        if (this.enabled && this.enableZoom && (this.state === this.states.NONE || this.state === this.states.ROTATE)) {
            // e.preventDefault();
            e.stopPropagation();

            if (e.deltaY < 0) {
                this.dollyOut(this.getZoomScale());
            } else if (e.deltaY > 0) {
                this.dollyIn(this.getZoomScale());
            }
        }
    }

    private static onTouchStart(e: TouchEvent): void {
        if (this.enabled) {
            switch (e.touches.length) {
                case 1:
                    if (this.enableRotate) {
                        this.rotateStart.set(e.touches[0].pageX, e.touches[0].pageY);
                    }
                    this.state = this.states.TOUCH_ROTATE;
                    break;
                case 2:
                    if (this.enableZoom) {
                        const dx: number = e.touches[0].pageX - e.touches[1].pageX;
                        const dy: number = e.touches[0].pageY - e.touches[1].pageY;
                        const distance: number = Math.sqrt(dx * dx + dy * dy);
                        this.dollyStart.set(0, distance);
                    }
                    this.state = this.states.TOUCH_DOLLY;
                    break;
                case 3:
                    if (this.enablePan) {
                        this.panStart.set(e.touches[0].pageX, e.touches[0].pageY);
                    }
                    this.state = this.states.TOUCH_PAN;
                    break;
                default:
                    this.state = this.states.NONE;
            }
        }
    }

    private static onTouchMove(e: TouchEvent): void {
        if (this.enabled) {
            e.preventDefault();
            e.stopPropagation();

            switch (e.touches.length) {
                case 1:
                    if (this.enableRotate) {
                        this.rotateEnd.set(e.touches[0].pageX, e.touches[0].pageY);
                        this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
                        this.rotateLeft(((2 * Math.PI * this.rotateDelta.x) / this.width) * this.rotateSpeed);
                        this.rotateUp(((2 * Math.PI * this.rotateDelta.y) / this.height) * this.rotateSpeed);
                        this.rotateStart.copy(this.rotateEnd);
                    }
                    break;
                case 2:
                    if (this.enableZoom) {
                        const dx: number = e.touches[0].pageX - e.touches[1].pageX;
                        const dy: number = e.touches[0].pageY - e.touches[1].pageY;
                        const distance: number = Math.sqrt(dx * dx + dy * dy);
                        this.dollyEnd.set(0, distance);
                        this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart);
                        if (this.dollyDelta.y > 0) {
                            this.dollyOut(this.getZoomScale());
                        } else if (this.dollyDelta.y < 0) {
                            this.dollyIn(this.getZoomScale());
                        }
                        this.dollyStart.copy(this.dollyEnd);
                    }
                    break;
                case 3:
                    if (this.enablePan) {
                        this.panEnd.set(e.touches[0].pageX, e.touches[0].pageY);
                        this.panDelta.subVectors(this.panEnd, this.panStart);
                        this.pan(this.panDelta.x, this.panDelta.y);
                        this.panStart.copy(this.panEnd);
                    }
                    break;
                default:
                    this.state = this.states.NONE;
            }
        }
    }

    private static onTouchEnd(): void {
        this.state = this.states.NONE;
    }

    private static getZoomScale(): number {
        return Math.pow(0.95, this.zoomSpeed);
    }

    private static rotateLeft(angle: number): void {
        this.sphericalDelta.theta -= angle;
    }

    private static rotateUp(angle: number): void {
        this.sphericalDelta.phi -= angle;
    }

    private static pan(deltaX: number, deltaY: number): void {
        const offset: THREE.Vector3 = new THREE.Vector3();
        const position: THREE.Vector3 = this.camera.position;
        offset.copy(position).sub(this.target.position);
        let targetDistance: number = offset.length();
        targetDistance *= Math.tan(((this.camera.fov / 2) * Math.PI) / 180.0);
        this.panLeft((2 * deltaX * targetDistance) / this.height, this.camera.matrix);
        this.panUp((2 * deltaY * targetDistance) / this.height, this.camera.matrix);
    }

    private static panLeft(distance: number, objectMatrix: THREE.Matrix4): void {
        const v: THREE.Vector3 = new THREE.Vector3();
        v.setFromMatrixColumn(objectMatrix, 0);
        v.multiplyScalar(-distance);
        this.panOffset.add(v);
    }

    private static panUp(distance: number, objectMatrix: THREE.Matrix4): void {
        const v: THREE.Vector3 = new THREE.Vector3();
        v.setFromMatrixColumn(objectMatrix, 1);
        v.multiplyScalar(distance);
        this.panOffset.add(v);
    }

    private static dollyIn(dollyScale: number): void {
        this.scale /= dollyScale;
    }

    private static dollyOut(dollyScale: number): void {
        this.scale *= dollyScale;
    }
}
