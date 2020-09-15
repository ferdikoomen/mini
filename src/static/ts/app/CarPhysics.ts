import * as THREE from "three";
import CarBody from "./CarBody";
import CarWheels from "./CarWheels";
import Physics from "./Physics";


export default class CarPhysics {

	public static enabled: boolean = false;
	public static body: THREE.Object3D;
	public static wheels: THREE.Object3D[] = [];
	public static vehicle: Ammo.btRaycastVehicle;
	public static wheelInfoFrontRight: Ammo.btWheelInfo;
	public static wheelInfoFrontLeft: Ammo.btWheelInfo;
	public static wheelInfoRearRight: Ammo.btWheelInfo;
	public static wheelInfoRearLeft: Ammo.btWheelInfo;
	public static chassisWidth: number = 1.6;
	public static chassisHeight: number = 0.6;
	public static chassisLength: number = 3.8;
	public static vehicleMass: number = 1000;
	public static wheelAxisPositionFront: number = 1.15;
	public static wheelAxisPositionBack: number = -1.35;
	public static wheelRadiusFront: number = 0.314;
	public static wheelRadiusBack: number = 0.314;
	public static wheelHalfTrackBack: number = 0.75;
	public static wheelHalfTrackFront: number = 0.75;
	public static wheelAxisHeightBack: number = 0.1;
	public static wheelAxisHeightFront: number = 0.1;
	public static friction: number = 1000;
	public static suspensionStiffness: number = 50.0;
	public static suspensionDamping: number = 3;
	public static suspensionCompression: number = 5;
	public static suspensionRestLength: number = 0.45;
	public static rollInfluence: number = 0.01;
	public static engineForce: number = 0;
	public static breakingForce: number = 0;
	public static vehicleSteering: number = 0;
	public static fourWheelDrive: boolean = false;


	public static init() {
		this.enabled = true;

		this.body = CarBody.group;

		this.wheels = [
			CarWheels.frontLeft,
			CarWheels.frontRight,
			CarWheels.rearLeft,
			CarWheels.rearRight
		];

		this.createVehicle(
			Physics.world,
			new Ammo.btVector3(this.body.position.x, this.body.position.y, this.body.position.z),
			new Ammo.btQuaternion(this.body.quaternion.x, this.body.quaternion.y, this.body.quaternion.z, this.body.quaternion.w)
		);
	}


	public static reset(x: number, y: number, z: number, rotation: number): void {
		const position: Ammo.btVector3 = new Ammo.btVector3(x, y + this.wheelRadiusFront * 2, z);
		const quaternion: Ammo.btQuaternion = new Ammo.btQuaternion(0, 0, 0, 1);
		quaternion.setRotation(new Ammo.btVector3(0, 1, 0), THREE.MathUtils.degToRad(rotation));

		const transform: Ammo.btTransform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(position);
		transform.setRotation(quaternion);

		const motion: Ammo.btDefaultMotionState = new Ammo.btDefaultMotionState(transform);
		const rigidBody: Ammo.btRigidBody = this.vehicle.getRigidBody();
		rigidBody.setMotionState(motion);
		rigidBody.setAngularVelocity(new Ammo.btVector3(0, 0, 0));
		rigidBody.setLinearVelocity(new Ammo.btVector3(0, 0, 0));

		this.vehicle.resetSuspension();
	}

	public static turbo(): void {
		this.fourWheelDrive = true;
		this.suspensionStiffness = 100.0;
		this.suspensionDamping = 5;
		this.suspensionCompression = 7;
		this.wheelInfoFrontLeft.set_m_suspensionStiffness(this.suspensionStiffness);
		this.wheelInfoFrontLeft.set_m_wheelsDampingRelaxation(this.suspensionDamping);
		this.wheelInfoFrontLeft.set_m_wheelsDampingCompression(this.suspensionCompression);
		this.wheelInfoFrontRight.set_m_suspensionStiffness(this.suspensionStiffness);
		this.wheelInfoFrontRight.set_m_wheelsDampingRelaxation(this.suspensionDamping);
		this.wheelInfoFrontRight.set_m_wheelsDampingCompression(this.suspensionCompression);
		this.wheelInfoRearLeft.set_m_suspensionStiffness(this.suspensionStiffness);
		this.wheelInfoRearLeft.set_m_wheelsDampingRelaxation(this.suspensionDamping);
		this.wheelInfoRearLeft.set_m_wheelsDampingCompression(this.suspensionCompression);
		this.wheelInfoRearRight.set_m_suspensionStiffness(this.suspensionStiffness);
		this.wheelInfoRearRight.set_m_wheelsDampingRelaxation(this.suspensionDamping);
		this.wheelInfoRearRight.set_m_wheelsDampingCompression(this.suspensionCompression);
		this.vehicle.resetSuspension();
	}


	public static getSpeed(): number {
		return this.vehicle.getCurrentSpeedKmHour();
	}


	public static update(): void {
		if (this.enabled) {
			const FRONT_LEFT: number = 0;
			const FRONT_RIGHT: number = 1;
			const REAR_LEFT: number = 2;
			const REAR_RIGHT: number = 3;

			this.vehicle.applyEngineForce(this.engineForce, FRONT_LEFT);
			this.vehicle.applyEngineForce(this.engineForce, FRONT_RIGHT);

			if (this.fourWheelDrive) {
				this.vehicle.applyEngineForce(this.engineForce, REAR_LEFT);
				this.vehicle.applyEngineForce(this.engineForce, REAR_RIGHT);
			}

			this.vehicle.setBrake(this.breakingForce / 2, FRONT_LEFT);
			this.vehicle.setBrake(this.breakingForce / 2, FRONT_RIGHT);
			this.vehicle.setBrake(this.breakingForce, REAR_LEFT);
			this.vehicle.setBrake(this.breakingForce, REAR_RIGHT);
			this.vehicle.setSteeringValue(this.vehicleSteering, FRONT_LEFT);
			this.vehicle.setSteeringValue(this.vehicleSteering, FRONT_RIGHT);

			if (this.fourWheelDrive) {
				this.vehicle.setSteeringValue(this.vehicleSteering / 5, REAR_LEFT);
				this.vehicle.setSteeringValue(this.vehicleSteering / 5, REAR_RIGHT);
			}

			let transform: Ammo.btTransform = this.vehicle.getChassisWorldTransform();
			let position: Ammo.btVector3 = transform.getOrigin();
			let quaternion: Ammo.btQuaternion = transform.getRotation();
			this.body.position.set(position.x(), position.y(), position.z());
			this.body.quaternion.set(quaternion.x(), quaternion.y(), quaternion.z(), quaternion.w());
			this.body.updateMatrix();

			const n: number = this.vehicle.getNumWheels();
			for (let i: number = 0; i < n; i++) {

				this.vehicle.updateWheelTransform(i, false);
				transform = this.vehicle.getWheelTransformWS(i);
				position = transform.getOrigin();
				quaternion = transform.getRotation();

				const wheel: THREE.Object3D = this.wheels[i];
				wheel.position.set(position.x(), position.y(), position.z());
				wheel.quaternion.set(quaternion.x(), quaternion.y(), quaternion.z(), quaternion.w());
				wheel.rotateY(i === 0 || i === 2 ? Math.PI : 0);
				wheel.updateMatrix();
			}
		}
	}


	private static createVehicle(world: Ammo.btDiscreteDynamicsWorld, position: Ammo.btVector3, quaternion: Ammo.btQuaternion): void {
		const transform: Ammo.btTransform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(position);
		transform.setRotation(quaternion);

		const motion: Ammo.btDefaultMotionState = new Ammo.btDefaultMotionState(transform);
		const inertia: Ammo.btVector3 = new Ammo.btVector3(0, 0, 0);
		const shape: Ammo.btBoxShape = new Ammo.btBoxShape(new Ammo.btVector3(this.chassisWidth * 0.5, this.chassisHeight * 0.5, this.chassisLength * 0.5));
		shape.calculateLocalInertia(this.vehicleMass, inertia);

		const rigidBody: Ammo.btRigidBody = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(this.vehicleMass, motion, shape, inertia));
		rigidBody.setActivationState(4);
		world.addRigidBody(rigidBody);

		const tuning: Ammo.btVehicleTuning = new Ammo.btVehicleTuning();
		const rayCaster: Ammo.btDefaultVehicleRaycaster = new Ammo.btDefaultVehicleRaycaster(world);
		this.vehicle = new Ammo.btRaycastVehicle(tuning, rigidBody, rayCaster);
		this.vehicle.setCoordinateSystem(0, 1, 2);
		world.addAction(this.vehicle);

		this.wheelInfoFrontRight = this.createVehicleWheel(tuning, true, new Ammo.btVector3(this.wheelHalfTrackFront, this.wheelAxisHeightFront, this.wheelAxisPositionFront), this.wheelRadiusFront);
		this.wheelInfoFrontLeft = this.createVehicleWheel(tuning, true, new Ammo.btVector3(-this.wheelHalfTrackFront, this.wheelAxisHeightFront, this.wheelAxisPositionFront), this.wheelRadiusFront);
		this.wheelInfoRearRight = this.createVehicleWheel(tuning, false, new Ammo.btVector3(this.wheelHalfTrackBack, this.wheelAxisHeightBack, this.wheelAxisPositionBack), this.wheelRadiusBack);
		this.wheelInfoRearLeft = this.createVehicleWheel(tuning, false, new Ammo.btVector3(-this.wheelHalfTrackBack, this.wheelAxisHeightBack, this.wheelAxisPositionBack), this.wheelRadiusBack);
	}


	private static createVehicleWheel(tuning: Ammo.btVehicleTuning, front: boolean, position: Ammo.btVector3, radius: number): Ammo.btWheelInfo {
		const info: Ammo.btWheelInfo = this.vehicle.addWheel(
			position,
			new Ammo.btVector3(0, -1, 0),
			new Ammo.btVector3(-1, 0, 0),
			this.suspensionRestLength,
			radius,
			tuning,
			front
		);

		info.set_m_suspensionStiffness(this.suspensionStiffness);
		info.set_m_wheelsDampingRelaxation(this.suspensionDamping);
		info.set_m_wheelsDampingCompression(this.suspensionCompression);
		info.set_m_frictionSlip(this.friction);
		info.set_m_rollInfluence(this.rollInfluence);

		return info;
	}
}
