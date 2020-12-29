import * as THREE from 'three'

import Cube from "./Cube"

const perspective = 800

export default class Scene {
    constructor() {
        this.container = document.getElementById('stage')

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x212121 )

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.container,
            alpha: true
        })

        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(window.devicePixelRatio)

        this.cube = new Cube(this.scene)

        this.initCamera()
        this.addEvent()
    }

    initCamera(){

        const w = window.innerWidth;
        const h = window.innerHeight;
        const fov = (180 * (2 * Math.atan( h / 2 / perspective ))) / Math.PI

        this.camera = new THREE.PerspectiveCamera(fov, w/h, 0.1, 1000)
        this.camera.position.set(0, 0, perspective)
    }


    onWindowResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( w, h );
    }

    addEvent() {
        window.requestAnimationFrame(this.update.bind(this))
        window.addEventListener( "resize", this.onWindowResize.bind( this ), false );
    }

    update(){
        if ( this.renderer === undefined ) return
        requestAnimationFrame( this.update.bind( this ) )

        this.renderer.render( this.scene, this.camera )
    }
}
