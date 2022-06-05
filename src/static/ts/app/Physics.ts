import * as THREE from 'three';

import Settings from './Settings';

export default class Physics {
    public static world: Ammo.btDiscreteDynamicsWorld;
    private static enabled: boolean = false;
    private static pause: boolean = false;
    private static subSteps: number;
    private static collisionConfiguration: Ammo.btDefaultCollisionConfiguration;
    private static dispatcher: Ammo.btCollisionDispatcher;
    private static broadphase: Ammo.btDbvtBroadphase;
    private static solver: Ammo.btSequentialImpulseConstraintSolver;
    private static delta: number = 0;
    private static clock: THREE.Clock;

    public static init(): void {
        Ammo().then(ammo => {
            this.subSteps = Settings.highQuality ? 10 : 5;
            this.collisionConfiguration = new ammo.btDefaultCollisionConfiguration();
            this.dispatcher = new ammo.btCollisionDispatcher(this.collisionConfiguration);
            this.broadphase = new ammo.btDbvtBroadphase();
            this.solver = new ammo.btSequentialImpulseConstraintSolver();
            this.world = new ammo.btDiscreteDynamicsWorld(this.dispatcher, this.broadphase, this.solver, this.collisionConfiguration);
            this.world.setGravity(new ammo.btVector3(0, -9.82, 0));
            this.clock = new THREE.Clock();
            this.clock.start();
            this.enabled = true;
            this.createFloor(ammo);
        });
    }

    public static togglePause(): void {
        this.pause = !this.pause;
    }

    public static step(): void {
        if (this.pause) {
            this.delta = 50;
        }
    }

    public static update(): void {
        if (this.enabled) {
            if (!this.pause) {
                this.delta = this.clock.getDelta() + 0.001;
                this.delta = Math.min(1 / 60, this.delta);
            }
            this.world.stepSimulation(this.delta, this.subSteps);
            this.delta = 0;
        }
    }

    public static createFloor(ammo: typeof Ammo): void {
        const transform: Ammo.btTransform = new ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new ammo.btVector3(0, -1, 0));
        transform.setRotation(new ammo.btQuaternion(0, 0, 0, 1));

        const motion: Ammo.btDefaultMotionState = new ammo.btDefaultMotionState(transform);
        const inertia: Ammo.btVector3 = new ammo.btVector3(0, 0, 0);
        const shape: Ammo.btStaticPlaneShape = new ammo.btStaticPlaneShape(new ammo.btVector3(0, 1, 0), 1);
        shape.calculateLocalInertia(0, inertia);

        const info: Ammo.btRigidBodyConstructionInfo = new ammo.btRigidBodyConstructionInfo(0, motion, shape, inertia);
        const body: Ammo.btRigidBody = new ammo.btRigidBody(info);
        body.setFriction(1);
        this.world.addRigidBody(body);
    }
}
