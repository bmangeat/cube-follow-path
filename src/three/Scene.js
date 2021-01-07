import * as THREE from 'three'
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"

import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"

import Cube from "./Cube"
import gsap from 'gsap'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { Color } from "three"
import Plane from "./Plane"

const perspective = 800
let isWheeling = false

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

        this.theme = 1

        this.plane = new Plane( this.scene, this.container, this.theme )
        this.cube = new Cube( this.scene, this.theme )

        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()


        this.initCamera()
        this.addEvent()

        this.initComposer()
    }

    setTheme( theme ) {
        while ( this.scene.children.length ) {
            this.scene.remove( this.scene.children[0] );
        }

        this.theme = theme
        this.plane = undefined
        this.cube = undefined

        this.plane = new Plane( this.scene, this.container, this.theme )
        this.cube = new Cube( this.scene, this.theme )
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

    onWheeling() {
        isWheeling = true;
        setTimeout( () => {
                //this.addEvent()
                isWheeling = false

            }
            , 5000 );
    }


    onWindowResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( w, h );
    }

    onScroll( e ) {
        if ( !isWheeling && e.deltaY > 50 ) {
            this.onWheeling()
            if ( this.theme === 0 ) {
                this.setTheme( 1 )
            } else {
                this.setTheme( 0 )
            }
        }
    }

    onPointerDown( e ) {
        e.preventDefault()

        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

        this.raycaster.setFromCamera( this.mouse, this.camera )
        const intersects = this.raycaster.intersectObjects( this.scene.children )

        if ( intersects.length > 0 ) {
            const object = intersects[0].object
            if ( (object.material.color.r === 1 && object.material.color.g === 1 && object.material.color.b === 1) ||
                (object.material.color.r === 0 && object.material.color.g === 0 && object.material.color.b === 0)
            ) {

                gsap.to( object.material.color, 1, {
                    r: 1,
                    g: 0,
                    b: 0
                }, { ease: 'elastic' } )
            } else {
                gsap.to( object.material.color, 1, {
                    r: 1,
                    g: 1,
                    b: 1
                } )
            }
        }
    }

    addEvent() {
        window.requestAnimationFrame( this.update.bind( this ) )
        window.addEventListener( 'resize', this.onWindowResize.bind( this ), false )
        window.addEventListener( 'pointerdown', this.onPointerDown.bind( this ), false )
        window.addEventListener( 'mousewheel', this.onScroll.bind( this ), false )
    }


    update() {
        if ( this.renderer === undefined ) return
        requestAnimationFrame( this.update.bind( this ) )

        this.cube.update()
        this.plane.update()

        this.composer.render();
    }
}
