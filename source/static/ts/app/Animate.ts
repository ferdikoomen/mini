import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";


import {Settings} from "./Settings";


export function animateFog(fog: THREE.Fog, near: number, far: number, duration: number): Promise<void> {
	return new Promise<void>(
		(resolve: () => void): void => {
			new TWEEN.Tween({
				near: fog.near,
				far: fog.far
			})
				.to({
					near: near,
					far: far
				}, duration / Settings.speed)
				.easing(TWEEN.Easing.Linear.None)
				.onUpdate((object: any): void => {
					fog.near = object.near;
					fog.far = object.far;
				})
				.onComplete((): void => {
					resolve();
				})
				.start();
		});
}

export function animateSpotLight(light: THREE.SpotLight, positionTo: number[], targetTo: number[], duration: number): Promise<void> {
	return new Promise<void>(
		(resolve: () => void): void => {
			new TWEEN.Tween({
				positionX: light.position.x,
				positionY: light.position.y,
				positionZ: light.position.z,
				targetX: light.target.position.x,
				targetY: light.target.position.y,
				targetZ: light.target.position.z
			})
				.to({
					positionX: positionTo[0],
					positionY: positionTo[1],
					positionZ: positionTo[2],
					targetX: targetTo[0],
					targetY: targetTo[1],
					targetZ: targetTo[2],
				}, duration / Settings.speed)
				.easing(TWEEN.Easing.Cubic.InOut)
				.onUpdate((object: any): void => {
					light.position.x = object.positionX;
					light.position.y = object.positionY;
					light.position.z = object.positionZ;
					light.updateMatrix();
					light.target.position.x = object.targetX;
					light.target.position.y = object.targetY;
					light.target.position.z = object.targetZ;
					light.target.updateMatrix();
				})
				.onComplete((): void => {
					resolve();
				})
				.start();
		});
}


