import * as THREE from 'three';

export default class Loader {
    private readonly manager: THREE.LoadingManager;

    constructor(manager: THREE.LoadingManager) {
        this.manager = manager;
    }

    public load(url: string, onLoad: (geometry: THREE.Geometry) => void): void {
        const loader: THREE.FileLoader = new THREE.FileLoader(this.manager);
        loader.load(url, (text: string | ArrayBuffer): void => {
            if (typeof text === 'string') {
                const json: any = JSON.parse(text);
                const geometry: THREE.Geometry = new THREE.Geometry();
                this.parse(json, geometry);
                onLoad(geometry);
            }
        });
    }

    private isBitSet(value: number, position: number): number {
        return value & (1 << position);
    }

    private parse(json: any, geometry: THREE.Geometry) {
        let fi: number = 0;
        let offset: number;
        let length: number;
        let normalIndex: number = 0;
        let uvIndex: number = 0;
        let materialIndex: number = 0;
        let type: number = 0;
        let isQuad: number = 0;
        let hasMaterial: number = 0;
        let hasFaceVertexUv: number = 0;
        let hasFaceNormal: number = 0;
        let hasFaceVertexNormal: number = 0;
        let vertex: THREE.Vector3;
        let face: THREE.Face3;
        let faceA: THREE.Face3;
        let faceB: THREE.Face3;
        let normal: THREE.Vector3;
        let uvLayer: number[];
        let uv: THREE.Vector2;
        let u: number = 0;
        let v: number = 0;
        const faces: number[] = json.faces;
        const vertices: number[] = json.vertices;
        const normals: number[] = json.normals;
        const scale: number = json.scale;
        let uvLayers: number = 0;

        if (json.uvs !== undefined) {
            for (let i: number = 0; i < json.uvs.length; i++) {
                if (json.uvs[i].length) {
                    uvLayers++;
                }
            }
            for (let i: number = 0; i < uvLayers; i++) {
                geometry.faceVertexUvs[i] = [];
            }
        }

        offset = 0;
        length = vertices.length;

        while (offset < length) {
            vertex = new THREE.Vector3();
            vertex.x = vertices[offset++] * scale;
            vertex.y = vertices[offset++] * scale;
            vertex.z = vertices[offset++] * scale;
            geometry.vertices.push(vertex);
        }

        offset = 0;
        length = faces.length;

        while (offset < length) {
            type = faces[offset++];

            isQuad = this.isBitSet(type, 0);
            hasMaterial = this.isBitSet(type, 1);
            hasFaceVertexUv = this.isBitSet(type, 3);
            hasFaceNormal = this.isBitSet(type, 4);
            hasFaceVertexNormal = this.isBitSet(type, 5);

            if (isQuad) {
                faceA = new THREE.Face3(faces[offset], faces[offset + 1], faces[offset + 3]);

                faceB = new THREE.Face3(faces[offset + 1], faces[offset + 2], faces[offset + 3]);

                offset += 4;

                if (hasMaterial) {
                    materialIndex = faces[offset++];
                    faceA.materialIndex = materialIndex;
                    faceB.materialIndex = materialIndex;
                }

                fi = geometry.faces.length;

                if (hasFaceVertexUv) {
                    for (let i: number = 0; i < uvLayers; i++) {
                        uvLayer = json.uvs[i];
                        geometry.faceVertexUvs[i][fi] = [];
                        geometry.faceVertexUvs[i][fi + 1] = [];

                        for (let j = 0; j < 4; j++) {
                            uvIndex = faces[offset++];
                            u = uvLayer[uvIndex * 2];
                            v = uvLayer[uvIndex * 2 + 1];
                            uv = new THREE.Vector2(u, v);
                            if (j !== 2) geometry.faceVertexUvs[i][fi].push(uv);
                            if (j !== 0) geometry.faceVertexUvs[i][fi + 1].push(uv);
                        }
                    }
                }

                if (hasFaceNormal) {
                    normalIndex = faces[offset++] * 3;
                    faceA.normal.set(normals[normalIndex++], normals[normalIndex++], normals[normalIndex]);
                    faceB.normal.copy(faceA.normal);
                }

                if (hasFaceVertexNormal) {
                    for (let i: number = 0; i < 4; i++) {
                        normalIndex = faces[offset++] * 3;
                        normal = new THREE.Vector3(normals[normalIndex++], normals[normalIndex++], normals[normalIndex]);
                        if (i !== 2) faceA.vertexNormals.push(normal);
                        if (i !== 0) faceB.vertexNormals.push(normal);
                    }
                }

                geometry.faces.push(faceA);
                geometry.faces.push(faceB);
            } else {
                face = new THREE.Face3(faces[offset++], faces[offset++], faces[offset++]);

                if (hasMaterial) {
                    materialIndex = faces[offset++];
                    face.materialIndex = materialIndex;
                }

                fi = geometry.faces.length;

                if (hasFaceVertexUv) {
                    for (let i: number = 0; i < uvLayers; i++) {
                        uvLayer = json.uvs[i];
                        geometry.faceVertexUvs[i][fi] = [];

                        for (let j: number = 0; j < 3; j++) {
                            uvIndex = faces[offset++];
                            u = uvLayer[uvIndex * 2];
                            v = uvLayer[uvIndex * 2 + 1];
                            uv = new THREE.Vector2(u, v);
                            geometry.faceVertexUvs[i][fi].push(uv);
                        }
                    }
                }

                if (hasFaceNormal) {
                    normalIndex = faces[offset++] * 3;
                    face.normal.set(normals[normalIndex++], normals[normalIndex++], normals[normalIndex]);
                }

                if (hasFaceVertexNormal) {
                    for (let i: number = 0; i < 3; i++) {
                        normalIndex = faces[offset++] * 3;
                        normal = new THREE.Vector3(normals[normalIndex++], normals[normalIndex++], normals[normalIndex]);
                        face.vertexNormals.push(normal);
                    }
                }

                geometry.faces.push(face);
            }
        }
    }
}
