import * as THREE from "three";


export default class ThreeMaterialsPaint {


	public static vocanicOrange: THREE.MeshPhysicalMaterial;
	public static electricBlue: THREE.MeshPhysicalMaterial;
	public static meltingSilver: THREE.MeshPhysicalMaterial;
	public static blazingRed: THREE.MeshPhysicalMaterial;
	public static deepBlue: THREE.MeshPhysicalMaterial;
	public static racingGreen: THREE.MeshPhysicalMaterial;
	public static white: THREE.MeshPhysicalMaterial;
	public static midnightBlack: THREE.MeshPhysicalMaterial;
	public static thunderGrey: THREE.MeshPhysicalMaterial;
	public static pepperWhite: THREE.MeshPhysicalMaterial;
	public static moonwalkGrey: THREE.MeshPhysicalMaterial;
	public static luxeryBlue: THREE.MeshPhysicalMaterial;
	public static chiliRed: THREE.MeshPhysicalMaterial;
	public static materials: THREE.MeshPhysicalMaterial[];


	public static load(): void {

		this.vocanicOrange = new THREE.MeshPhysicalMaterial({
			color: 0xed9300,
			metalness: 0,
			roughness: 0.6,
			clearCoat: 1,
			clearCoatRoughness: 0.6,
			reflectivity: 0
		});

		this.electricBlue = new THREE.MeshPhysicalMaterial({
			color: 0x00a3d7,
			metalness: 0,
			roughness: 0.6,
			clearCoat: 1,
			clearCoatRoughness: 0.6,
			reflectivity: 0
		});

		this.meltingSilver = new THREE.MeshPhysicalMaterial({
			color: 0xa9a8a2,
			metalness: 0.2,
			roughness: 0.6,
			clearCoat: 1,
			clearCoatRoughness: 0.6,
			reflectivity: 0
		});

		this.blazingRed = new THREE.MeshPhysicalMaterial({
			color: 0x8c1107,
			metalness: 0.2,
			roughness: 0.6,
			clearCoat: 1,
			clearCoatRoughness: 0.6,
			reflectivity: 0
		});

		this.deepBlue = new THREE.MeshPhysicalMaterial({
			color: 0x06305e,
			metalness: 0.2,
			roughness: 0.6,
			clearCoat: 1,
			clearCoatRoughness: 0.6,
			reflectivity: 0
		});

		this.racingGreen = new THREE.MeshPhysicalMaterial({
			color: 0x043f20,
			metalness: 0.2,
			roughness: 0.6,
			clearCoat: 1,
			clearCoatRoughness: 0.6,
			reflectivity: 0
		});

		this.white = new THREE.MeshPhysicalMaterial({
			color: 0xFFFFFF,
			metalness: 0.2,
			roughness: 0.6,
			clearCoat: 1,
			clearCoatRoughness: 0.6,
			reflectivity: 0
		});

		this.midnightBlack = new THREE.MeshPhysicalMaterial({
			color: 0x050706,
			metalness: 0.2,
			roughness: 0.6,
			clearCoat: 1,
			clearCoatRoughness: 0.6,
			reflectivity: 0
		});

		this.thunderGrey = new THREE.MeshPhysicalMaterial({
			color: 0x35363d,
			metalness: 0.2,
			roughness: 0.6,
			clearCoat: 1,
			clearCoatRoughness: 0.6,
			reflectivity: 0
		});

		this.pepperWhite = new THREE.MeshPhysicalMaterial({
			color: 0xebe2cb,
			metalness: 0.2,
			roughness: 0.6,
			clearCoat: 1,
			clearCoatRoughness: 0.6,
			reflectivity: 0
		});

		this.moonwalkGrey = new THREE.MeshPhysicalMaterial({
			color: 0x797874,
			metalness: 0.2,
			roughness: 0.6,
			clearCoat: 1,
			clearCoatRoughness: 0.6,
			reflectivity: 0
		});

		this.luxeryBlue = new THREE.MeshPhysicalMaterial({
			color: 0x021035,
			metalness: 0.2,
			roughness: 0.6,
			clearCoat: 1,
			clearCoatRoughness: 0.6,
			reflectivity: 0
		});

		this.chiliRed = new THREE.MeshPhysicalMaterial({
			color: 0xa9111d,
			metalness: 0.2,
			roughness: 0.6,
			clearCoat: 1,
			clearCoatRoughness: 0.6,
			reflectivity: 0
		});

		this.materials = [
			this.vocanicOrange,
			this.electricBlue,
			this.meltingSilver,
			this.blazingRed,
			this.deepBlue,
			this.racingGreen,
			this.white,
			this.midnightBlack,
			this.thunderGrey,
			this.pepperWhite,
			this.moonwalkGrey,
			this.luxeryBlue,
			this.chiliRed
		];
	}
}
