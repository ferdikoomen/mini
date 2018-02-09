import * as THREE from "three";


import {ThreeTextures} from "./ThreeTextures";
import {Settings} from "./Settings";


export class ThreeMaterialsBody {


	public static backLights: THREE.MeshPhongMaterial;
	public static backLightsGlass: THREE.MeshPhongMaterial;
	public static body: THREE.MeshPhysicalMaterial;
	public static bumper: THREE.MeshPhysicalMaterial;
	public static chrome: THREE.MeshPhysicalMaterial;
	public static glassDark: THREE.MeshPhongMaterial;
	public static glass: THREE.MeshPhongMaterial;
	public static headLights: THREE.MeshPhongMaterial;
	public static headLightsGlass: THREE.MeshPhongMaterial;
	public static interiorDetails: THREE.MeshPhongMaterial;
	public static interior: THREE.MeshPhongMaterial;
	public static numberPlates: THREE.MeshPhongMaterial;
	public static plastic: THREE.MeshPhongMaterial;
	public static roofMirrors: THREE.MeshPhysicalMaterial;
	public static seats: THREE.MeshPhongMaterial;
	public static materials: THREE.Material[];


	public static load(): void {

		this.backLights = new THREE.MeshPhongMaterial({
			color: 0x660000,
			specular: 0x111111,
			envMap: ThreeTextures.enviromentMap,
			combine: THREE.MultiplyOperation,
			reflectivity: 0.05,
			shininess: 0
		});

		this.backLightsGlass = new THREE.MeshPhongMaterial({
			color: 0x660000,
			specular: 0x111111,
			envMap: ThreeTextures.enviromentMap,
			combine: THREE.MultiplyOperation,
			reflectivity: 0.9,
			shininess: 70,
			transparent: true,
			opacity: 0.5
		});

		this.body = new THREE.MeshPhysicalMaterial({
			color: 0xFFFFFF,
			envMap: ThreeTextures.enviromentMap,
			metalness: 0,
			roughness: 0,
			clearCoat: 1,
			clearCoatRoughness: 0,
			reflectivity: 0.5,
			side: THREE.DoubleSide
		});

		this.bumper = new THREE.MeshPhysicalMaterial({
			color: 0x111111,
			envMap: ThreeTextures.enviromentMap,
			metalness: 0,
			roughness: 0,
			clearCoat: 1,
			clearCoatRoughness: 0,
			reflectivity: 0.5
		});

		this.chrome = new THREE.MeshPhysicalMaterial({
			color: 0xFFFFFF,
			envMap: ThreeTextures.enviromentMap,
			metalness: 0.8,
			roughness: 0.1,
			clearCoat: 1,
			clearCoatRoughness: 0.1,
			reflectivity: 0.8
		});

		this.glassDark = new THREE.MeshPhongMaterial({
			color: 0x111111,
			specular: 0x111111,
			envMap: ThreeTextures.enviromentMap,
			combine: THREE.MultiplyOperation,
			reflectivity: 0.9,
			shininess: 70,
			transparent: true,
			opacity: 0.95
		});

		this.glass = new THREE.MeshPhongMaterial({
			color: 0x111111,
			specular: 0x111111,
			envMap: ThreeTextures.enviromentMap,
			combine: THREE.MultiplyOperation,
			reflectivity: 0.9,
			shininess: 70,
			transparent: true,
			opacity: 0.4
		});

		this.headLights = new THREE.MeshPhongMaterial({
			color: 0xFFFFFF,
			specular: 0xFFFFFF,
			envMap: ThreeTextures.enviromentMapBlurred,
			combine: THREE.MultiplyOperation,
			reflectivity: 0.7,
			shininess: 30
		});

		this.headLightsGlass = new THREE.MeshPhongMaterial({
			color: 0xFFFFFF,
			specular: 0x111111,
			envMap: ThreeTextures.enviromentMap,
			combine: THREE.MultiplyOperation,
			reflectivity: 0.9,
			shininess: 70,
			transparent: true,
			opacity: 0.2
		});

		this.interiorDetails = new THREE.MeshPhongMaterial({
			color: 0xCCCCCC,
			specular: 0x333333,
			envMap: ThreeTextures.enviromentMap,
			combine: THREE.MultiplyOperation,
			reflectivity: 0.6,
			shininess: 30
		});

		this.interior = new THREE.MeshPhongMaterial({
			color: 0x222222,
			specular: 0x333333,
			envMap: ThreeTextures.enviromentMapBlurred,
			combine: THREE.MultiplyOperation,
			reflectivity: 0.1,
			shininess: 10
		});

		this.numberPlates = new THREE.MeshPhongMaterial({
			color: 0x222222,
			specular: 0x333333,
			envMap: ThreeTextures.enviromentMapBlurred,
			combine: THREE.MultiplyOperation,
			reflectivity: 0.1,
			shininess: 10
		});

		this.plastic = new THREE.MeshPhongMaterial({
			color: 0x222222,
			specular: 0x222222,
			envMap: ThreeTextures.enviromentMapBlurred,
			combine: THREE.MultiplyOperation,
			reflectivity: 0.1,
			shininess: 5,
			side: THREE.DoubleSide
		});

		this.roofMirrors = new THREE.MeshPhysicalMaterial({
			color: 0xFFFFFF,
			envMap: ThreeTextures.enviromentMap,
			metalness: 0,
			roughness: 0,
			clearCoat: 1,
			clearCoatRoughness: 0,
			reflectivity: 0.5
		});

		this.seats = new THREE.MeshPhongMaterial({
			color: 0x111111,
			specular: 0x111111,
			envMap: ThreeTextures.enviromentMapBlurred,
			combine: THREE.MultiplyOperation,
			reflectivity: 0.1,
			shininess: 5
		});

		if (Settings.highQuality) {
			this.body.bumpMap = ThreeTextures.noiseTexture;
			this.body.bumpScale = 0.000001;
			this.bumper.bumpMap = ThreeTextures.noiseTexture;
			this.bumper.bumpScale = 0.000001;
			this.roofMirrors.bumpMap = ThreeTextures.noiseTexture;
			this.roofMirrors.bumpScale = 0.000001;
			this.interior.bumpMap = ThreeTextures.noiseTexture;
			this.interior.bumpScale = 0.00005;
			this.plastic.bumpMap = ThreeTextures.noiseTexture;
			this.plastic.bumpScale = 0.00001;
		}

		this.materials = [
			this.backLights,
			this.backLightsGlass,
			this.body,
			this.bumper,
			this.chrome,
			this.glassDark,
			this.glass,
			this.headLights,
			this.headLightsGlass,
			this.interiorDetails,
			this.interior,
			this.numberPlates,
			this.plastic,
			this.roofMirrors,
			this.seats
		];
	}

}
