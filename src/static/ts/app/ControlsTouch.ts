import CarPhysics from './CarPhysics';
import Settings from './Settings';
import { positionInRange } from './Utils';

export default class ControlsTouch {
    private static enabled: boolean = false;
    private static elementSteer: HTMLElement;
    private static elementAccelerate: HTMLElement;
    private static elementReset: HTMLElement;
    private static acceleration: number = 0;
    private static maxEngineForce: number = 4000;
    private static maxBreakingForce: number = 100;
    private static maxSpeed: number = 120;
    private static steer: number = 0;
    private static reset: boolean = false;

    public static init(): void {
        if (Settings.mobile) {
            this.enabled = true;

            this.elementSteer = document.getElementById('controls-drive-steer')!;
            this.elementAccelerate = document.getElementById('controls-drive-accelerate')!;
            this.elementReset = document.getElementById('controls-drive-reset')!;

            this.elementSteer.className = 'show';
            this.elementAccelerate.className = 'show';
            this.elementReset.className = 'show';

            this.elementSteer.addEventListener('touchstart', e => this.onTouchMove(e), false);
            this.elementSteer.addEventListener('touchmove', e => this.onTouchMove(e), false);
            this.elementSteer.addEventListener('touchend', e => this.onTouchEnd(e), false);

            this.elementAccelerate.addEventListener('touchstart', e => this.onTouchMove(e), false);
            this.elementAccelerate.addEventListener('touchmove', e => this.onTouchMove(e), false);
            this.elementAccelerate.addEventListener('touchend', e => this.onTouchEnd(e), false);

            this.elementReset.addEventListener(
                'click',
                (e: MouseEvent) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.reset = true;
                },
                false
            );
        }
    }

    public static update(): void {
        if (this.enabled && Settings.mobile) {
            const speed: number = CarPhysics.getSpeed();

            if (this.reset) {
                this.reset = false;
                CarPhysics.reset(0, 0, 0, 0);
            }

            CarPhysics.breakingForce = 0;
            CarPhysics.engineForce = 0;
            CarPhysics.vehicleSteering = this.steer * 0.5;

            if (this.acceleration > 0 && speed < this.maxSpeed) {
                CarPhysics.engineForce = this.acceleration * this.maxEngineForce;
            }

            if (this.acceleration < 0) {
                if (speed > 1) {
                    CarPhysics.breakingForce = -this.acceleration * this.maxBreakingForce;
                } else {
                    CarPhysics.engineForce = this.acceleration * (this.maxEngineForce / 2);
                }
            }

            if (this.acceleration === 0) {
                CarPhysics.breakingForce = 10;
            }
        }
    }

    private static onTouchMove(e: TouchEvent): void {
        e.preventDefault();
        e.stopImmediatePropagation();

        for (let i: number = 0; i < e.touches.length; i++) {
            const touch: Touch = e.touches[i];
            if (touch.target === this.elementSteer) {
                const left: number = this.elementSteer.getBoundingClientRect().left;
                this.steer = positionInRange(touch.clientX, left, left + 180, 1, -1, true);
            }
            if (touch.target === this.elementAccelerate) {
                const top: number = this.elementAccelerate.getBoundingClientRect().top;
                this.acceleration = positionInRange(touch.clientY, top, top + 180, 1, -1, true);
            }
        }
    }

    private static onTouchEnd(e: TouchEvent): void {
        e.preventDefault();
        e.stopImmediatePropagation();

        for (let i: number = 0; i < e.changedTouches.length; i++) {
            const touch: Touch = e.changedTouches[i];
            if (touch.target === this.elementSteer) {
                this.steer = 0;
            }
            if (touch.target === this.elementAccelerate) {
                this.acceleration = 0;
            }
        }
    }
}
