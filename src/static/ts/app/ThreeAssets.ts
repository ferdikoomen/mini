import * as THREE from "three";
import Loader from "./Loader";


export default class ThreeAssets {


	public static async load(manager: THREE.LoadingManager, urls: string[]): Promise<THREE.BufferGeometry> {
		return new Promise<THREE.BufferGeometry>(
			(resolve: (value: THREE.BufferGeometry) => void): void => {

				let length: number = urls.length;
				const geometryMerged: THREE.Geometry = new THREE.Geometry();
				const geometryBuffer: THREE.BufferGeometry = new THREE.BufferGeometry();
				const matrix: THREE.Matrix4 = new THREE.Matrix4();

				urls.forEach((url: string, index: number): void => {
					new Loader(manager).load(url, (geometry: THREE.Geometry): void => {
						geometryMerged.merge(geometry, matrix, index);
						geometry.dispose();
						if (!--length) {
							geometryMerged.computeFaceNormals();
							geometryMerged.computeBoundingSphere();
							geometryBuffer.fromGeometry(geometryMerged);
							geometryMerged.dispose();
							resolve(geometryBuffer);
						}
					});
				});
			}
		);
	}


	public static recalculate(geometry: THREE.Geometry): void {
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
		geometry.faceVertexUvs[0] = [];
		geometry.faces.forEach((face: THREE.Face3): void => {
			const components: number[] = [0, 1, 2].sort((a: number, b: number): number => {
				return Math.abs(face.normal.getComponent(a)) > Math.abs(face.normal.getComponent(b)) ? 1 : 0;
			});
			const v1: THREE.Vector3 = geometry.vertices[face.a];
			const v2: THREE.Vector3 = geometry.vertices[face.b];
			const v3: THREE.Vector3 = geometry.vertices[face.c];
			geometry.faceVertexUvs[0].push([
				new THREE.Vector2(v1.getComponent(components[0]), v1.getComponent(components[1])),
				new THREE.Vector2(v2.getComponent(components[0]), v2.getComponent(components[1])),
				new THREE.Vector2(v3.getComponent(components[0]), v3.getComponent(components[1]))
			]);
		});
		geometry.uvsNeedUpdate = true;
	}
}
