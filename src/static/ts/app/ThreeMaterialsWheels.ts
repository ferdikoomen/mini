import * as THREE from "three";


import ThreeTextures from "./ThreeTextures";


export default class ThreeMaterialsWheels {


	public static brakeDisc: THREE.MeshPhongMaterial;
	public static tire: THREE.MeshPhongMaterial;
	public static wheelCap: THREE.MeshPhysicalMaterial;
	public static wheel: THREE.MeshPhysicalMaterial;
	public static materials: THREE.Material[];


	public static load(): void {

		this.brakeDisc = new THREE.MeshPhongMaterial({
			color: 0x333333,
			specular: 0x333333,
			envMap: ThreeTextures.enviromentMap,
			combine: THREE.MultiplyOperation,
			reflectivity: 0.2,
			shininess: 5
		});

		this.tire = new THREE.MeshPhongMaterial({
			color: 0x111111,
			specular: 0x222222,
			envMap: ThreeTextures.enviromentMapBlurred,
			combine: THREE.MultiplyOperation,
			reflectivity: 0.05,
			shininess: 0
		});

		this.wheelCap = new THREE.MeshPhysicalMaterial({
			color: 0x111111,
			envMap: ThreeTextures.enviromentMap,
			metalness: 0,
			roughness: 0,
			clearCoat: 1,
			clearCoatRoughness: 0,
			reflectivity: 0.3
		});

		this.wheel = new THREE.MeshPhysicalMaterial({
			color: 0xCCCCCC,
			envMap: ThreeTextures.enviromentMapBlurred,
			metalness: 0.8,
			roughness: 0.6,
			clearCoat: 0.8,
			clearCoatRoughness: 0.5,
			reflectivity: 0.7
		});

		this.materials = [
			this.tire,
			this.wheel,
			this.wheelCap,
			this.brakeDisc
		];
	}
}
