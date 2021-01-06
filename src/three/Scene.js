import * as THREE from 'three'
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"

import Cube from "./Cube"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { Color } from "three"
import Plane from "./Plane"

const perspective = 800

export default class Scene {
    constructor() {
        this.container = document.getElementById( 'stage' )

        this.scene = new THREE.Scene()
        this.scene.background = new Color( 0x000000 )

        this.renderer = new THREE.WebGLRenderer( {
            canvas: this.container,
            alpha: true,
            antialias: true,
        } )

        this.renderer.toneMapping = THREE.ReinhardToneMapping

        this.i = 0


        this.renderer.setSize( window.innerWidth, window.innerHeight )
        this.renderer.setPixelRatio( window.devicePixelRatio )

        this.plane = new Plane( this.scene, this.container )
        this.cube = new Cube( this.scene )

        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()

        this.initCamera()
        this.addEvent()

        this.initComposer()
    }

    initComposer() {
        this.rendererScene = new RenderPass( this.scene, this.camera )

        this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 )
        this.bloomPass.threshold = 0
        this.bloomPass.strength = 1.5
        this.bloomPass.radius = 0
        this.bloomPass.renderToScreen = true

        this.composer = new EffectComposer( this.renderer )
        this.composer.setSize( window.innerWidth, window.innerHeight )

        this.composer.addPass( this.rendererScene )
        this.composer.addPass( this.bloomPass )

    }


    initCamera() {

        const w = window.innerWidth;
        const h = window.innerHeight;
        const fov = (180 * (2 * Math.atan( h / 2 / perspective ))) / Math.PI

        this.camera = new THREE.PerspectiveCamera( fov, w / h, 0.1, 1000 )
        this.camera.position.set( 0, 0, perspective )
        this.camera.layers.enable( 1 )
    }


    onWindowResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( w, h );
    }

    onPointerDown( e ) {
        e.preventDefault()

        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

        this.raycaster.setFromCamera( this.mouse, this.camera )
        const intersects = this.raycaster.intersectObjects( this.scene.children )

        if ( intersects.length > 0 ) {
            const object = intersects[0].object
            let white = new THREE.Color( 1, 1, 1 )
            console.log( white )
            //console.log(object.material.color)
            if ( object.material.color.r === 1 &&
                object.material.color.g === 1 &&
                object.material.color.b === 1 ) {

                object.material.color = new THREE.Color(1, 0, 0)
            } else {
                object.material.color = new THREE.Color(1, 1, 1)
            }
        }
    }

    addEvent() {
        window.requestAnimationFrame( this.update.bind( this ) )
        window.addEventListener( 'resize', this.onWindowResize.bind( this ), false )
        window.addEventListener( 'pointerdown', this.onPointerDown.bind( this ), false )
    }


    update() {
        if ( this.renderer === undefined ) return
        requestAnimationFrame( this.update.bind( this ) )

        this.cube.update()
        this.plane.update()
        //this.renderer.render(this.scene, this.camera)
        this.composer.render();
    }
}
