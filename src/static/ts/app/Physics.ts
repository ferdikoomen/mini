import * as THREE from 'three';

export default class Physics {
    public static world: Ammo.btDiscreteDynamicsWorld;
    private static enabled: boolean = false;
    private static subSteps: number;
    private static collisionConfiguration: Ammo.btDefaultCollisionConfiguration;
    private static dispatcher: Ammo.btCollisionDispatcher;
    private static broadphase: Ammo.btDbvtBroadphase;
    private static solver: Ammo.btSequentialImpulseConstraintSolver;
    private static delta: number = 0;
    private static clock: THREE.Clock;

    public static async init(): Promise<void> {
        await Ammo();
        this.subSteps = 1;
        this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        this.dispatcher = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
        this.broadphase = new Ammo.btDbvtBroadphase();
        this.solver = new Ammo.btSequentialImpulseConstraintSolver();
        this.world = new Ammo.btDiscreteDynamicsWorld(this.dispatcher, this.broadphase, this.solver, this.collisionConfiguration);
        this.world.setGravity(new Ammo.btVector3(0, -9.82, 0));
        this.clock = new THREE.Clock();
        this.clock.start();
        this.enabled = true;
        this.createFloor();
    }

    public static update(): void {
        if (this.enabled) {
            this.delta = this.clock.getDelta();
            this.world.stepSimulation(this.delta, this.subSteps);
        }
    }

    public static createFloor(): void {
        const transform: Ammo.btTransform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(0, -1, 0));
        transform.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));

        const motion: Ammo.btDefaultMotionState = new Ammo.btDefaultMotionState(transform);
        const inertia: Ammo.btVector3 = new Ammo.btVector3(0, 0, 0);
        const shape: Ammo.btStaticPlaneShape = new Ammo.btStaticPlaneShape(new Ammo.btVector3(0, 1, 0), 1);
        shape.calculateLocalInertia(0, inertia);

        const info: Ammo.btRigidBodyConstructionInfo = new Ammo.btRigidBodyConstructionInfo(0, motion, shape, inertia);
        const body: Ammo.btRigidBody = new Ammo.btRigidBody(info);
        body.setFriction(1);
        this.world.addRigidBody(body);
    }
}
