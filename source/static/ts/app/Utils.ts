import * as THREE from "three";


export function isMobile(): boolean {
	return /iPad|iPhone|iPod|android/i.test(navigator.userAgent);
}


export function positionInRange(val: number, rangeMin: number, rangeMax: number, returnMin: number = 0, returnMax: number = 100, cap: boolean = false): number {
	let value: number = (((val - rangeMin) / (rangeMax - rangeMin)) * (returnMax - returnMin)) + returnMin;
	if (cap && value < Math.min(returnMin, returnMax)) {
		value = Math.min(returnMin, returnMax);
	}
	if (cap && value > Math.max(returnMin, returnMax)) {
		value = Math.max(returnMin, returnMax);
	}
	return value;
}


export function getTheta(target: THREE.Object3D): number {
	let position: THREE.Vector3 = new THREE.Vector3();
	let scale: THREE.Vector3 = new THREE.Vector3();
	let quaternion: THREE.Quaternion = new THREE.Quaternion();
	let direction: THREE.Vector3 = new THREE.Vector3();
	target.updateMatrixWorld(true);
	target.matrixWorld.decompose(position, quaternion, scale);
	direction.set(0, 0, 1).applyQuaternion(quaternion);
	return Math.atan2(direction.x, direction.z);
}
