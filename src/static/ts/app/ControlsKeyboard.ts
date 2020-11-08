import * as THREE from 'three';

import CarPhysics from './CarPhysics';
import Physics from './Physics';
import Settings from './Settings';
import ThreeMaterialsBody from './ThreeMaterialsBody';
import ThreeMaterialsSpecial from './ThreeMaterialsSpecial';
import ThreeMaterialsWheels from './ThreeMaterialsWheels';
import ThreeTextures from './ThreeTextures';
import { positionInRange } from './Utils';

export default class ControlsKeyboard {
    private static enabled: boolean = false;
    private static steeringIncrement: number = 0.02;
    private static steeringDecrement: number = 0.04;
    private static steeringClamp: number = 0.5;
    private static maxEngineForce: number = 4000;
    private static maxBreakingForce: number = 100;
    private static maxSpeed: number = 120;

    private static actions: any = {
        acceleration: false,
        braking: false,
        left: false,
        right: false,
        reset: false,
    };

    private static keysActions: any = {
        ArrowUp: 'acceleration',
        ArrowDown: 'braking',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        KeyW: 'acceleration',
        KeyS: 'braking',
        KeyA: 'left',
        KeyD: 'right',
        Space: 'reset',
    };

    public static init(): void {
        if (!Settings.mobile) {
            this.enabled = true;
            document.getElementById('controls-drive-info')!.style.opacity = '1';
            window.addEventListener('keydown', e => this.keyDown(e), false);
            window.addEventListener('keyup', e => this.keyUp(e), false);
        }
    }

    public static update(): void {
        if (this.enabled && !Settings.mobile) {
            const speed: number = CarPhysics.getSpeed();
            const speedSteering: number = positionInRange(Math.abs(speed), 0, 80, 1, 0.5, true);

            CarPhysics.breakingForce = 0;
            CarPhysics.engineForce = 0;

            if (this.actions.reset) {
                CarPhysics.reset(0, 0, 0, 0);
            }

            if (this.actions.acceleration && speed < this.maxSpeed) {
                CarPhysics.engineForce = this.maxEngineForce;
            } else if (this.actions.braking) {
                if (speed > 1) {
                    CarPhysics.breakingForce = this.maxBreakingForce;
                } else {
                    CarPhysics.engineForce = -this.maxEngineForce / 2;
                }
            } else {
                CarPhysics.breakingForce = 10;
            }

            if (this.actions.left) {
                if (CarPhysics.vehicleSteering < this.steeringClamp) {
                    CarPhysics.vehicleSteering += this.steeringIncrement * speedSteering;
                }
            } else if (this.actions.right) {
                if (CarPhysics.vehicleSteering > -this.steeringClamp) {
                    CarPhysics.vehicleSteering -= this.steeringIncrement * speedSteering;
                }
            } else {
                if (CarPhysics.vehicleSteering < 0) {
                    CarPhysics.vehicleSteering += this.steeringDecrement;
                    if (CarPhysics.vehicleSteering > 0) {
                        CarPhysics.vehicleSteering = 0;
                    }
                } else {
                    if (CarPhysics.vehicleSteering > 0) {
                        CarPhysics.vehicleSteering -= this.steeringDecrement;
                        if (CarPhysics.vehicleSteering < 0) {
                            CarPhysics.vehicleSteering = 0;
                        }
                    } else {
                        CarPhysics.vehicleSteering = 0;
                    }
                }
            }
        }
    }

    private static keyUp(e: KeyboardEvent): void {
        if (this.keysActions[e.code]) {
            this.actions[this.keysActions[e.code]] = false;
        }

        if (e.code === 'KeyT') {
            this.maxEngineForce = 4000;
            this.maxBreakingForce = 150;
            this.maxSpeed = 240;
            CarPhysics.turbo();
            this.toGold(ThreeMaterialsBody.body);
            this.toGold(ThreeMaterialsBody.chrome);
            this.toGold(ThreeMaterialsBody.roofMirrors);
            this.toGold(ThreeMaterialsWheels.wheel);
        }

        if (e.code === 'KeyX') {
            ThreeMaterialsBody.materials.fill(ThreeMaterialsSpecial.xray);
            ThreeMaterialsWheels.materials.fill(ThreeMaterialsSpecial.xray);
        }

        if (e.code === 'KeyP') {
            Physics.togglePause();
        }
    }

    private static keyDown(e: KeyboardEvent): void {
        if (this.keysActions[e.code]) {
            this.actions[this.keysActions[e.code]] = true;
        }

        if (e.code === 'KeyN') {
            Physics.step();
        }
    }

    private static toGold(material: THREE.MeshPhysicalMaterial): void {
        material.color.r = 1;
        material.color.g = 0.8;
        material.color.b = 0;
        material.metalness = 0.8;
        material.roughness = 0.1;
        material.clearcoat = 1;
        material.clearcoatRoughness = 0.1;
        material.reflectivity = 0.8;
        material.envMap = ThreeTextures.enviromentMap;
    }
}
