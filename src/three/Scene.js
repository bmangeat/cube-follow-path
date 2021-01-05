import * as THREE from 'three'
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass"
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass"
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader"
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass"

import Cube from "./Cube"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"

const perspective = 800

export default class Scene {
    constructor() {
        this.container = document.getElementById('stage')

        this.scene = new THREE.Scene()
        //this.scene.background = new THREE.Color(0x212121 )


        this.renderer = new THREE.WebGLRenderer({
            canvas: this.container,
            alpha: true,
            antialias: true,
        })

        this.renderer.toneMapping = THREE.ReinhardToneMapping;




        this.i = 0



        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(window.devicePixelRatio)

        this.cube = new Cube(this.scene)

        this.initCamera()
        this.addEvent()

        this.initComposer()
    }

    initComposer(){
        this.rendererScene = new RenderPass(this.scene, this.camera,null,new THREE.Color('red'),0)

/*        this.effectFXAA = new ShaderPass(FXAAShader)
        this.effectFXAA.uniforms.resolution.value.set(1 / window.innerWidth, 1 / window.innerHeight)*/

        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight),1.5, 0.4, 0.85)
        this.bloomPass.threshold = 0
        this.bloomPass.strength = 1.5
        this.bloomPass.radius = 0
        this.bloomPass.renderToScreen = true

        this.composer = new EffectComposer(this.renderer)
        this.composer.setSize(window.innerWidth, window.innerHeight)

        this.composer.addPass(this.rendererScene)
        //this.composer.addPass(this.effectFXAA)
        this.composer.addPass(this.bloomPass)


        //this.renderer.toneMappingExposure = Math.pow(0.9, 4)

    }


    initCamera(){

        const w = window.innerWidth;
        const h = window.innerHeight;
        const fov = (180 * (2 * Math.atan( h / 2 / perspective ))) / Math.PI

        this.camera = new THREE.PerspectiveCamera(fov, w/h, 0.1, 1000)
        this.camera.position.set(0, 0, perspective)
        this.camera.layers.enable(1)
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


    render() {



    }

    update(){
        if ( this.renderer === undefined ) return
        requestAnimationFrame( this.update.bind( this ) )

        this.cube.update()








        this.composer.render()
        //this.renderer.render( this.scene, this.camera )


    }
}
