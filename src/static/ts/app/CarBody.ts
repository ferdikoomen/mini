import * as THREE from "three";


import {ThreeAssets} from "./ThreeAssets";
import {ThreeMaterialsBody} from "./ThreeMaterialsBody";
import {Settings} from "./Settings";


export class CarBody {


	private static lightLeft: THREE.SpotLight;
	private static lightRight: THREE.SpotLight;
	private static body: THREE.LOD;


	public static group: THREE.Group;


	public static load(manager: THREE.LoadingManager): Promise<void> {
		return new Promise<void>(
			(resolve: () => void): void => {

				this.body = new THREE.LOD();

				this.group = new THREE.Group();
				this.group.matrixAutoUpdate = false;
				this.group.add(this.body);

				ThreeAssets.load(manager, [
					require("../../models/back-lights-low.json"),
					require("../../models/back-lights-glass-low.json"),
					require("../../models/body-low.json"),
					require("../../models/bumper-low.json"),
					require("../../models/chrome-low.json"),
					require("../../models/glass-dark-low.json"),
					require("../../models/glass-low.json"),
					require("../../models/head-lights-low.json"),
					require("../../models/head-lights-glass-low.json"),
					require("../../models/interior-details-low.json"),
					require("../../models/interior-low.json"),
					require("../../models/number-plates-low.json"),
					require("../../models/plastic-low.json"),
					require("../../models/roof-mirrors-low.json"),
					require("../../models/seats-low.json")
				]).then((geometry: THREE.BufferGeometry): void => {
					this.updateLOD(this.body, geometry, ThreeMaterialsBody.materials, 8);
					if (!Settings.highQuality) {
						resolve();
					}
				});

				if (Settings.highQuality) {
					ThreeAssets.load(manager, [
						require("../../models/back-lights-high.json"),
						require("../../models/back-lights-glass-high.json"),
						require("../../models/body-high.json"),
						require("../../models/bumper-high.json"),
						require("../../models/chrome-high.json"),
						require("../../models/glass-dark-high.json"),
						require("../../models/glass-high.json"),
						require("../../models/head-lights-high.json"),
						require("../../models/head-lights-glass-high.json"),
						require("../../models/interior-details-high.json"),
						require("../../models/interior-high.json"),
						require("../../models/number-plates-high.json"),
						require("../../models/plastic-high.json"),
						require("../../models/roof-mirrors-high.json"),
						require("../../models/seats-high.json")
					]).then((geometry: THREE.BufferGeometry): void => {
						this.updateLOD(this.body, geometry, ThreeMaterialsBody.materials, 0);
						resolve();
					});
				}
			}
		);
	}


	public static setPosition(x: number, y: number, z: number): void {
		this.group.position.set(x, y + 0.628, z);
		this.group.updateMatrix();
	}


	private static updateLOD(lod: THREE.LOD, geometry: THREE.BufferGeometry, materials: THREE.Material[], distance: number): void {
		const mesh: THREE.Mesh = new THREE.Mesh(geometry, <any> materials);
		mesh.castShadow = true;
		mesh.matrixAutoUpdate = false;
		mesh.position.y = -0.6;
		mesh.updateMatrix();
		lod.addLevel(mesh, distance);
	}


	public static lights(): void {
		this.lightLeft = new THREE.SpotLight(0xFFFFFF, 10, 0, Math.PI / 4);
		this.lightLeft.matrixAutoUpdate = false;
		this.lightLeft.position.set(0.63, 0.18, 1.65);
		this.lightLeft.penumbra = 0.4;
		this.lightLeft.decay = 2;
		this.lightLeft.distance = 40;
		this.lightLeft.updateMatrix();
		this.lightLeft.target.matrixAutoUpdate = false;
		this.lightLeft.target.position.set(0, -0.4, 10);
		this.lightLeft.target.updateMatrix();

		this.lightRight = new THREE.SpotLight(0xFFFFFF, 10, 0, Math.PI / 4);
		this.lightRight.matrixAutoUpdate = false;
		this.lightRight.position.set(-0.63, 0.18, 1.65);
		this.lightRight.penumbra = 0.4;
		this.lightRight.decay = 2;
		this.lightRight.distance = 40;
		this.lightRight.updateMatrix();
		this.lightRight.target.matrixAutoUpdate = false;
		this.lightRight.target.position.set(0, -0.4, 10);
		this.lightRight.target.updateMatrix();

		if (Settings.highQuality) {
			this.lightLeft.castShadow = true;
			this.lightLeft.shadow = new THREE.SpotLightShadow(new THREE.PerspectiveCamera(50, 1, 0.01, 40));
			this.lightLeft.shadow.bias = 0.00005;
			this.lightLeft.shadow.mapSize.width = 1024;
			this.lightLeft.shadow.mapSize.height = 1024;

			this.lightRight.castShadow = true;
			this.lightRight.shadow = new THREE.SpotLightShadow(new THREE.PerspectiveCamera(50, 1, 0.01, 40));
			this.lightRight.shadow.bias = 0.00005;
			this.lightRight.shadow.mapSize.width = 1024;
			this.lightRight.shadow.mapSize.height = 1024;
		}

		this.group.add(this.lightLeft);
		this.group.add(this.lightLeft.target);
		this.group.add(this.lightRight);
		this.group.add(this.lightRight.target);

		ThreeMaterialsBody.headLights.emissive = new THREE.Color(0xFFFFFF);
		ThreeMaterialsBody.headLights.emissiveIntensity = 1;
		ThreeMaterialsBody.headLights.envMap = undefined;
		ThreeMaterialsBody.headLights.reflectivity = 0;
		ThreeMaterialsBody.headLights.shininess = 0;

		ThreeMaterialsBody.headLightsGlass.emissive = new THREE.Color(0xFFFFFF);
		ThreeMaterialsBody.headLightsGlass.emissiveIntensity = 1;
		ThreeMaterialsBody.headLightsGlass.opacity = 0.8;
		ThreeMaterialsBody.headLightsGlass.reflectivity = 0;
		ThreeMaterialsBody.headLightsGlass.shininess = 0;
	}


	public static update(camera: THREE.Camera): void {
		if (Settings.highQuality) {
			this.body.update(camera);
		}
	}
}
