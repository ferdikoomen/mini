import * as THREE from 'three';

import CarPhysics from './CarPhysics';
import Settings from './Settings';
import { positionInRange } from './Utils';

export default class ControlsOrientation {
    private static enabled: boolean = false;
    private static object: THREE.Object3D;
    private static quaternion: THREE.Quaternion;
    private static deviceOrientation: DeviceOrientationEvent;
    private static screenOrientation: number = 0;
    private static zee: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
    private static euler: THREE.Euler = new THREE.Euler();
    private static q0: THREE.Quaternion = new THREE.Quaternion();
    private static q1: THREE.Quaternion = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    private static rotateX: number = 0;
    private static rotateY: number = 0;
    private static rotateZ: number = 0;

    public static init(): void {
        if (Settings.mobile) {
            this.enabled = true;
            this.object = new THREE.Object3D();
            this.object.rotation.reorder('YXZ');
            this.quaternion = this.object.quaternion;

            window.addEventListener('orientationchange', () => this.onScreenOrientationChange(), false);
            window.addEventListener('deviceorientation', e => this.onDeviceOrientationChange(e), false);
            this.onScreenOrientationChange();
        }
    }

    public static update(): void {
        if (this.enabled && this.deviceOrientation && Settings.mobile) {
            const alpha: number = this.deviceOrientation.alpha ? THREE.MathUtils.degToRad(this.deviceOrientation.alpha) : 0;
            const beta: number = this.deviceOrientation.beta ? THREE.MathUtils.degToRad(this.deviceOrientation.beta) : 0;
            const gamma: number = this.deviceOrientation.gamma ? THREE.MathUtils.degToRad(this.deviceOrientation.gamma) : 0;
            const orient: number = this.screenOrientation ? THREE.MathUtils.degToRad(this.screenOrientation) : 0;

            this.euler.set(beta, alpha, -gamma, 'YXZ');
            this.quaternion.setFromEuler(this.euler);
            this.quaternion.multiply(this.q1);
            this.quaternion.multiply(this.q0.setFromAxisAngle(this.zee, -orient));

            this.rotateX = this.object.rotation.x;
            this.rotateY = this.object.rotation.y;
            this.rotateZ = this.object.rotation.z;

            const vehicleSteering: number = positionInRange(this.rotateZ, -0.5, 0.5, -0.5, 0.5, true);
            const engineForce: number = positionInRange(this.rotateX, 0, -0.5, 0, 1000, true);
            const breakingForce: number = positionInRange(this.rotateX, 0, 1, 0, 100, true);

            CarPhysics.vehicleSteering = vehicleSteering;
            CarPhysics.engineForce = engineForce;
            CarPhysics.breakingForce = breakingForce;
        }
    }

    private static onDeviceOrientationChange(e: DeviceOrientationEvent): void {
        this.deviceOrientation = e;
    }

    private static onScreenOrientationChange(): void {
        this.screenOrientation = <number>window.orientation || 0;
    }
}
