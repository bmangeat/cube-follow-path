import * as THREE from 'three'
import { Mesh } from 'three'
import gsap from 'gsap'
import { Flow } from "three/examples/jsm/modifiers/CurveModifier"



export default class Cube {
    constructor( scene ) {
        this.scene = scene

        this.initPath()

        this.start()

        this.t = 0


    }

    start() {
        this.createMesh()
    }

    initPath(){
        this.curvepath = new THREE.CatmullRomCurve3([
            new THREE.Vector3( -400, -400, 0 ),
            new THREE.Vector3( -350, -400, 0 ),
            new THREE.Vector3( -400, -350, 0 ),
            new THREE.Vector3( 0, -200, 0 ),
            new THREE.Vector3( 200, 0, 0 ),
        ] )

        this.curvepath.closed = true
        this.geometry = new THREE.Geometry()
        this.geometry.vertices = this.curvepath.getPoints(200)
        this.material = new THREE.LineBasicMaterial({color: 0xff0000})
        this.line = new THREE.Line(this.geometry, this.material)

        this.scene.add(this.line)
    }

    createMesh() {
        this.geometry = new THREE.BoxGeometry( 100, 100, 100 )
        this.material = new THREE.MeshBasicMaterial( { color: 0xffffff } )
        this.mesh = new Mesh( this.geometry, this.material )

        this.mesh.position.set(400, 15,0)



        this.scene.add( this.mesh )

    }

    update(){
        this.t += 0.001

        this.position = this.curvepath.getPoint(this.t)
        this.mesh.position.set(this.position.x, this.position.y, this.position.z)
    }

}
