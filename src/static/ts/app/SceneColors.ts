import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';

import Settings from './Settings';
import ThreeAssets from './ThreeAssets';
import ThreeMaterialsPaint from './ThreeMaterialsPaint';
import ThreeMaterialsScene from './ThreeMaterialsScene';

export default class SceneColors {
    public static group: THREE.Group;
    public static items: THREE.Mesh[];
    private static vocanicOrange: THREE.Mesh;
    private static electricBlue: THREE.Mesh;
    private static meltingSilver: THREE.Mesh;
    private static blazingRed: THREE.Mesh;
    private static deepBlue: THREE.Mesh;
    private static racingGreen: THREE.Mesh;
    private static white: THREE.Mesh;
    private static midnightBlack: THREE.Mesh;
    private static thunderGrey: THREE.Mesh;
    private static pepperWhite: THREE.Mesh;
    private static moonwalkGrey: THREE.Mesh;
    private static luxeryBlue: THREE.Mesh;
    private static chiliRed: THREE.Mesh;
    private static backside: THREE.Mesh;

    public static async load(manager: THREE.LoadingManager): Promise<void> {
        const geometry: THREE.BufferGeometry = await ThreeAssets.load(manager, ['/static/models/colors.json']);

        const width: number = 2.4;

        this.vocanicOrange = this.create(geometry, ThreeMaterialsPaint.vocanicOrange, -width * 6);
        this.electricBlue = this.create(geometry, ThreeMaterialsPaint.electricBlue, -width * 5);
        this.meltingSilver = this.create(geometry, ThreeMaterialsPaint.meltingSilver, -width * 4);
        this.blazingRed = this.create(geometry, ThreeMaterialsPaint.blazingRed, -width * 3);
        this.deepBlue = this.create(geometry, ThreeMaterialsPaint.deepBlue, -width * 2);
        this.racingGreen = this.create(geometry, ThreeMaterialsPaint.racingGreen, -width);
        this.white = this.create(geometry, ThreeMaterialsPaint.white, 0);
        this.midnightBlack = this.create(geometry, ThreeMaterialsPaint.midnightBlack, width);
        this.thunderGrey = this.create(geometry, ThreeMaterialsPaint.thunderGrey, width * 2);
        this.pepperWhite = this.create(geometry, ThreeMaterialsPaint.pepperWhite, width * 3);
        this.moonwalkGrey = this.create(geometry, ThreeMaterialsPaint.moonwalkGrey, width * 4);
        this.luxeryBlue = this.create(geometry, ThreeMaterialsPaint.luxeryBlue, width * 5);
        this.chiliRed = this.create(geometry, ThreeMaterialsPaint.chiliRed, width * 6);

        this.backside = new THREE.Mesh(geometry, ThreeMaterialsScene.backside);
        this.backside.matrixAutoUpdate = false;
        this.backside.scale.x = 15.6;
        this.backside.updateMatrix();

        this.group = new THREE.Group();
        this.group.matrixAutoUpdate = false;
        this.group.add(this.vocanicOrange);
        this.group.add(this.electricBlue);
        this.group.add(this.meltingSilver);
        this.group.add(this.blazingRed);
        this.group.add(this.deepBlue);
        this.group.add(this.racingGreen);
        this.group.add(this.white);
        this.group.add(this.midnightBlack);
        this.group.add(this.thunderGrey);
        this.group.add(this.pepperWhite);
        this.group.add(this.moonwalkGrey);
        this.group.add(this.luxeryBlue);
        this.group.add(this.chiliRed);
        this.group.add(this.backside);

        this.items = [
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
            this.chiliRed,
        ];
    }

    public static async hide(): Promise<void> {
        return new Promise<void>((resolve: () => void): void => {
            const index: number = Settings.color;
            const mesh: THREE.Mesh = this.items[index];

            const max: number = Math.abs(12 - index);
            for (let i = 0; i <= 12; i++) {
                if (i !== index) {
                    const delay: number = Math.abs(index - i);
                    this.animate(this.items[i], 200, delay * 100);
                }
            }

            new TWEEN.Tween({
                scaleX: mesh.scale.x,
                scaleY: mesh.scale.y,
                scaleZ: mesh.scale.z,
                position: mesh.position.z,
            })
                .to(
                    {
                        scaleX: 1,
                        scaleY: 0,
                        scaleZ: 2,
                        position: 47 * 2,
                    },
                    2000 / Settings.speed
                )
                .easing(TWEEN.Easing.Cubic.InOut)
                .delay((max * 100 + 500) / Settings.speed)
                .onStart((): void => {
                    this.group.remove(this.backside);
                })
                .onUpdate((object: any): void => {
                    mesh.scale.x = object.scaleX;
                    mesh.scale.y = object.scaleY;
                    mesh.scale.z = object.scaleZ;
                    mesh.position.z = object.position;
                    mesh.updateMatrix();
                })
                .onComplete((): void => {
                    this.group.remove(mesh);
                    resolve();
                })
                // @ts-ignore
                .start();
        });
    }

    private static create(geometry: THREE.BufferGeometry, material: THREE.Material, position: number): THREE.Mesh {
        const mesh: THREE.Mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = true;
        mesh.matrixAutoUpdate = false;
        mesh.position.x = position;
        mesh.updateMatrix();
        return mesh;
    }

    private static animate(target: THREE.Mesh, duration: number, delay: number): void {
        new TWEEN.Tween({ scale: target.scale.x })
            .to({ scale: 0 }, duration / Settings.speed)
            .easing(TWEEN.Easing.Cubic.Out)
            .delay(delay / Settings.speed)
            .onUpdate((object: any): void => {
                target.scale.x = object.scale;
                target.updateMatrix();
            })
            .onComplete((): void => {
                this.group.remove(target);
            })
            // @ts-ignore
            .start();
    }
}
