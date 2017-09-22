import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";


import {ThreeMaterialsBody} from "./ThreeMaterialsBody";
import {ThreeMaterialsScene} from "./ThreeMaterialsScene";
import {SceneColors} from "./SceneColors";
import {Settings} from "./Settings";


export class ControlsSelectColor {


	private static enabled: boolean = false;
	private static selected: boolean = false;
	private static elementNext: HTMLElement;
	private static elementPrev: HTMLElement;
	private static elementSelect: HTMLElement;
	private static tweenColor: TWEEN.Tween;
	private static tweenPosition: TWEEN.Tween;


	public static index: number = 6; // White


	public static wait(): Promise<void> {
		return new Promise<void>(
			(resolve: () => void): void => {
				this.enabled = true;

				this.elementNext = document.getElementById("controls-color-next");
				this.elementPrev = document.getElementById("controls-color-prev");
				this.elementSelect = document.getElementById("controls-color-select");

				this.elementNext.className = "show";
				this.elementPrev.className = "show";
				this.elementSelect.className = "show";

				this.elementNext.addEventListener("click", () => this.animate(-1), false);
				this.elementPrev.addEventListener("click", () => this.animate(1), false);
				this.elementSelect.addEventListener("click", () => this.select(resolve), false);

				this.tweenColor = new TWEEN.Tween({
					r: ThreeMaterialsBody.body.color.r,
					g: ThreeMaterialsBody.body.color.g,
					b: ThreeMaterialsBody.body.color.b
				})
					.easing(TWEEN.Easing.Cubic.Out)
					.onUpdate((object: any): void => {
						ThreeMaterialsBody.body.color.r = object.r;
						ThreeMaterialsBody.body.color.g = object.g;
						ThreeMaterialsBody.body.color.b = object.b;
					});

				this.tweenPosition = new TWEEN.Tween({
					position: 0
				})
					.easing(TWEEN.Easing.Elastic.Out)
					.onUpdate((object: any): void => {
						SceneColors.group.position.x = object.position;
						SceneColors.group.updateMatrix();
					});
			});
	}


	private static animate(step: number): void {
		this.index += step;
		this.index = Math.max(this.index, 0);
		this.index = Math.min(this.index, 12);

		this.elementNext.className = this.index > 0 ? "show" : "";
		this.elementPrev.className = this.index < 12 ? "show" : "";

		const colorMesh: THREE.Mesh = SceneColors.items[this.index];
		const colorMaterial: THREE.MeshPhysicalMaterial = <THREE.MeshPhysicalMaterial> colorMesh.material;

		ThreeMaterialsScene.road.color.r = colorMaterial.color.r;
		ThreeMaterialsScene.road.color.g = colorMaterial.color.g;
		ThreeMaterialsScene.road.color.b = colorMaterial.color.b;

		this.tweenPosition
			.stop()
			.to({
				position: -colorMesh.position.x
			}, 1000 / Settings.speed)
			.start();

		this.tweenColor
			.stop()
			.to({
				r: colorMaterial.color.r,
				g: colorMaterial.color.g,
				b: colorMaterial.color.b
			}, 250 / Settings.speed)
			.start();
	}


	private static select(resolve: () => void): void {
		if (!this.selected) {
			this.selected = true;
			this.elementNext.className = "";
			this.elementPrev.className = "";
			this.elementSelect.className = "";
			resolve();
		}
	}
}

