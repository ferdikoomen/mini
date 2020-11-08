import * as THREE from 'three';

import Settings from './Settings';

export default class ThreeTextures {
    public static enviromentMap: THREE.Texture;
    public static enviromentMapBlurred: THREE.Texture;
    public static noiseTexture: THREE.Texture;
    public static noiseTextureLarge: THREE.Texture;

    private static cubeTextureloader: THREE.CubeTextureLoader;
    private static textureLoader: THREE.TextureLoader;

    public static load(manager: THREE.LoadingManager): void {
        this.cubeTextureloader = new THREE.CubeTextureLoader(manager);
        this.textureLoader = new THREE.TextureLoader(manager);

        this.enviromentMap = this.cubeTextureloader.load([
            '/static/gfx/cubemap_right.png',
            '/static/gfx/cubemap_left.png',
            '/static/gfx/cubemap_top.png',
            '/static/gfx/cubemap_bottom.png',
            '/static/gfx/cubemap_front.png',
            '/static/gfx/cubemap_back.png',
        ]);

        this.enviromentMapBlurred = this.cubeTextureloader.load([
            '/static/gfx/cubemap_right_blur.png',
            '/static/gfx/cubemap_left_blur.png',
            '/static/gfx/cubemap_top_blur.png',
            '/static/gfx/cubemap_bottom_blur.png',
            '/static/gfx/cubemap_front_blur.png',
            '/static/gfx/cubemap_back_blur.png',
        ]);

        this.noiseTexture = this.textureLoader.load('/static/gfx/noise.png');
        this.noiseTexture.repeat.set(100, 100);
        this.noiseTexture.wrapS = THREE.RepeatWrapping;
        this.noiseTexture.wrapT = THREE.RepeatWrapping;

        this.noiseTextureLarge = this.textureLoader.load('/static/gfx/noise.png');
        this.noiseTextureLarge.repeat.set(2, 2);
        this.noiseTextureLarge.wrapS = THREE.RepeatWrapping;
        this.noiseTextureLarge.wrapT = THREE.RepeatWrapping;

        if (Settings.highQuality) {
            this.enviromentMap.anisotropy = 4;
            this.enviromentMapBlurred.anisotropy = 4;
            this.noiseTexture.anisotropy = 4;
            this.noiseTextureLarge.anisotropy = 4;
        }
    }
}
