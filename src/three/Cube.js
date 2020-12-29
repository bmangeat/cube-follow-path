import * as THREE from 'three'
import { Mesh } from "three"

export default class Cube{
    constructor(scene) {
        this.scene = scene
        this.start()
    }

    start(){
        this.createMesh()
    }

    createMesh(){
        this.geometry = new THREE.BoxGeometry(100, 100, 100)
        this.material = new THREE.MeshBasicMaterial({color: 0xffffff})
        this.mesh = new Mesh(this.geometry, this.material)

        this.scene.add(this.mesh)
    }
}
