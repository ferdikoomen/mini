import * as THREE from "three";
import ThreeAssets from "./ThreeAssets";
import ThreeMaterialsBody from "./ThreeMaterialsBody";
import Settings from "./Settings";


export default class CarBody {


	public static group: THREE.Group;
	private static lightLeft: THREE.SpotLight;
	private static lightRight: THREE.SpotLight;
	private static body: THREE.LOD;

	public static async load(manager: THREE.LoadingManager): Promise<void> {

		this.body = new THREE.LOD();

		this.group = new THREE.Group();
		this.group.matrixAutoUpdate = false;
		this.group.add(this.body);

		const geometryLQ: THREE.BufferGeometry = await ThreeAssets.load(manager, [
			"/static/models/back-lights-low.json",
			"/static/models/back-lights-glass-low.json",
			"/static/models/body-low.json",
			"/static/models/bumper-low.json",
			"/static/models/chrome-low.json",
			"/static/models/glass-dark-low.json",
			"/static/models/glass-low.json",
			"/static/models/head-lights-low.json",
			"/static/models/head-lights-glass-low.json",
			"/static/models/interior-details-low.json",
			"/static/models/interior-low.json",
			"/static/models/number-plates-low.json",
			"/static/models/plastic-low.json",
			"/static/models/roof-mirrors-low.json",
			"/static/models/seats-low.json"
		]);

		this.updateLOD(this.body, geometryLQ, ThreeMaterialsBody.materials, 8);
		if (!Settings.highQuality) {
			return;
		}

		if (Settings.highQuality) {
			const geometryHQ: THREE.BufferGeometry = await ThreeAssets.load(manager, [
				"/static/models/back-lights-high.json",
				"/static/models/back-lights-glass-high.json",
				"/static/models/body-high.json",
				"/static/models/bumper-high.json",
				"/static/models/chrome-high.json",
				"/static/models/glass-dark-high.json",
				"/static/models/glass-high.json",
				"/static/models/head-lights-high.json",
				"/static/models/head-lights-glass-high.json",
				"/static/models/interior-details-high.json",
				"/static/models/interior-high.json",
				"/static/models/number-plates-high.json",
				"/static/models/plastic-high.json",
				"/static/models/roof-mirrors-high.json",
				"/static/models/seats-high.json"
			]);

			this.updateLOD(this.body, geometryHQ, ThreeMaterialsBody.materials, 0);
			return;
		}
	}


	public static setPosition(x: number, y: number, z: number): void {
		this.group.position.set(x, y + 0.628, z);
		this.group.updateMatrix();
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

	private static updateLOD(lod: THREE.LOD, geometry: THREE.BufferGeometry, materials: THREE.Material[], distance: number): void {
		const mesh: THREE.Mesh = new THREE.Mesh(geometry, <any>materials);
		mesh.castShadow = true;
		mesh.matrixAutoUpdate = false;
		mesh.position.y = -0.6;
		mesh.updateMatrix();
		lod.addLevel(mesh, distance);
	}
}
