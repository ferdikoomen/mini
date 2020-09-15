import * as THREE from "three";
import Settings from "./Settings";


export default class ThreeStage {


	public static fog: THREE.Fog;
	public static scene: THREE.Scene;
	public static ambientLight: THREE.AmbientLight;
	public static directionalLight: THREE.DirectionalLight;
	public static spotLight: THREE.SpotLight;
	public static renderer: THREE.WebGLRenderer;
	private static width: number;
	private static height: number;

	public static init(): void {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.fog = new THREE.Fog(0x0B0B0B, 0, 1);

		this.scene = new THREE.Scene();
		this.scene.fog = this.fog;

		this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
		this.ambientLight.matrixAutoUpdate = false;
		this.ambientLight.position.set(0, 100, 0);
		this.ambientLight.updateMatrix();

		this.directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.6);
		this.directionalLight.matrixAutoUpdate = false;
		this.directionalLight.position.set(-100, 100, 100);
		this.directionalLight.updateMatrix();

		this.spotLight = new THREE.SpotLight(0xFFFFFF, 0.6);
		this.spotLight.matrixAutoUpdate = false;
		this.spotLight.position.set(0, 15, 0);
		this.spotLight.penumbra = 1;
		this.spotLight.updateMatrix();
		this.spotLight.target.matrixAutoUpdate = false;
		this.spotLight.target.position.set(0, 0, 0);
		this.spotLight.target.updateMatrix();

		if (Settings.highQuality) {
			this.spotLight.shadow.camera.near = 1
			this.spotLight.shadow.camera.far = 15
			this.spotLight.shadow.bias = 0.00005;
			this.spotLight.shadow.mapSize.width = 2048;
			this.spotLight.shadow.mapSize.height = 2048;
			this.spotLight.castShadow = true;
		}

		this.scene.add(this.ambientLight);
		this.scene.add(this.directionalLight);
		this.scene.add(this.spotLight);
		this.scene.add(this.spotLight.target);

		this.renderer = new THREE.WebGLRenderer({antialias: Settings.highQuality});
		this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
		this.renderer.setSize(this.width, this.height);
		this.renderer.setClearColor(this.fog.color);
		this.renderer.autoClear = false;

		if (Settings.highQuality) {
			this.renderer.shadowMap.enabled = true;
			this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		}

		document.body.appendChild(this.renderer.domElement);
	}


	public static resize(): void {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.renderer.setSize(this.width, this.height);
	}


	public static render(camera: THREE.Camera): void {
		this.renderer.clear();
		this.renderer.render(this.scene, camera);
	}
}
