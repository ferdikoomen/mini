import * as THREE from "three";
import vertexShader from "../../shaders/vertex.glsl";
import fragmentShader from "../../shaders/fragment.glsl";


export default class ThreeMaterialsSpecial {


	public static xray: THREE.RawShaderMaterial;


	public static load(): void {

		const uniforms = {
			color: {
				type: 'c',
				value: new THREE.Color(0x88ccff),
			},
			strength: {
				type: 'f',
				value: 4.0,
			},
		};

		this.xray = new THREE.RawShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms,
			side: THREE.DoubleSide,
			blending: THREE.AdditiveBlending,
			transparent: true,
			depthWrite: false,
			lights: false,
		});
	}

}
