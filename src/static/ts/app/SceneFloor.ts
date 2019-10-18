import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import ThreeMaterialsScene from "./ThreeMaterialsScene";
import Settings from "./Settings";


export default class SceneFloor {


	public static floorLeft: THREE.Mesh;
	public static floorRight: THREE.Mesh;
	public static floorRoad: THREE.Mesh;


	public static init(): void {
		this.floorLeft = new THREE.Mesh(new THREE.CircleBufferGeometry(100, 32, THREE.Math.degToRad(270), THREE.Math.degToRad(180)), ThreeMaterialsScene.floor);
		this.floorLeft.receiveShadow = true;
		this.floorLeft.matrixAutoUpdate = false;
		this.floorLeft.position.x = 1;
		this.floorLeft.rotateX(THREE.Math.degToRad(-90));
		this.floorLeft.scale.set(0.0001, 0.0001, 0.0001);
		this.floorLeft.updateMatrix();

		this.floorRight = new THREE.Mesh(new THREE.CircleBufferGeometry(100, 32, THREE.Math.degToRad(90), THREE.Math.degToRad(180)), ThreeMaterialsScene.floor);
		this.floorRight.receiveShadow = true;
		this.floorRight.matrixAutoUpdate = false;
		this.floorRight.position.x = -1;
		this.floorRight.rotateX(THREE.Math.degToRad(-90));
		this.floorRight.scale.set(0.0001, 0.0001, 0.0001);
		this.floorRight.updateMatrix();

		this.floorRoad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 200, 1, 1), ThreeMaterialsScene.road);
		this.floorRoad.receiveShadow = true;
		this.floorRoad.matrixAutoUpdate = false;
		this.floorRoad.rotateX(THREE.Math.degToRad(-90));
		this.floorRoad.updateMatrix();
	}


	public static async show(): Promise<void> {
		return new Promise<void>((resolve: () => void): void => {
			new TWEEN.Tween({scale: 0.0001})
				.to({scale: 1}, 1500 / Settings.speed)
				.easing(TWEEN.Easing.Cubic.InOut)
				.onUpdate((object: any): void => {
					this.floorLeft.scale.set(object.scale, object.scale, object.scale);
					this.floorRight.scale.set(object.scale, object.scale, object.scale);
					this.floorLeft.updateMatrix();
					this.floorRight.updateMatrix();
				})
				.onComplete((): void => {
					resolve();
				})
				.start();
		});
	}
}
