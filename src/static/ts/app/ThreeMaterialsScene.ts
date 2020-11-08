import * as THREE from 'three';

import Settings from './Settings';
import ThreeTextures from './ThreeTextures';

export default class ThreeMaterialsScene {
    public static backside: THREE.MeshBasicMaterial;
    public static floor: THREE.MeshPhongMaterial;
    public static ramp: THREE.MeshPhongMaterial;
    public static road: THREE.MeshPhysicalMaterial;

    public static load(): void {
        this.backside = new THREE.MeshBasicMaterial({
            color: 0x0b0b0b,
            side: THREE.BackSide,
        });

        this.floor = new THREE.MeshPhongMaterial({
            color: 0x111111,
            specular: 0x111111,
            shininess: 0,
            reflectivity: 0,
        });

        this.ramp = new THREE.MeshPhongMaterial({
            color: 0x111111,
            specular: 0x111111,
            shininess: 0,
            reflectivity: 0,
        });

        this.road = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0,
            roughness: 0.6,
            clearcoat: 1,
            clearcoatRoughness: 0.6,
            reflectivity: 0,
        });

        if (Settings.highQuality) {
            this.floor.bumpMap = ThreeTextures.noiseTexture;
            this.floor.bumpScale = 0.005;
            this.ramp.bumpMap = ThreeTextures.noiseTextureLarge;
            this.ramp.bumpScale = 0.005;
        }
    }
}
