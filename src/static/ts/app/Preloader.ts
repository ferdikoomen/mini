import * as THREE from "three";


export class Preloader {


	public static manager: THREE.LoadingManager = new THREE.LoadingManager();


	public static init(): void {
		const element: HTMLElement = document.getElementById("preloader");
		element.style.opacity = "1";

		this.manager.onProgress = (item: any, loaded: number, total: number): void => {
			element.style.borderLeft = 200 * (loaded / total) + "px solid #FFFFFF";
			element.style.width = 200 * (1 - (loaded / total)) + "px";

			if (loaded === total) {
				element.style.opacity = "0";
				// this.manager.onProgress = null;
			}
		};
	}
}

