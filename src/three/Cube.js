import * as THREE from 'three'
import { Mesh } from 'three'
import gsap from 'gsap'
import { Flow } from "three/examples/jsm/modifiers/CurveModifier"


export default class Cube {
    constructor( scene ) {
        this.scene = scene

        this.t = 0
        this.last = 0
        this.cubesLeft = []
        this.numberCurveDivisions = 200


        this.start()
    }

    start() {
        this.createMesh()
        this.initLeftParameters()
        this.initPath()

    }

    initPath() {
        this.curvepath = new THREE.CatmullRomCurve3( this.pointsArray )

        //this.curvepath.closed = true
        this.geometry = new THREE.Geometry()
        this.geometry.vertices = this.curvepath.getPoints( this.numberCurveDivisions )
        this.material = new THREE.LineBasicMaterial( { color: 0xff0000 } )
        this.line = new THREE.Line( this.geometry, this.material )

        this.scene.add( this.line )
    }

    initLeftParameters() {
        this.a = 2.8
        this.b = 0
        this.c = 0.2

        this.pointsArray = []

        for ( let x = -1.5; x < 0; x += 0.01 ) {
            let value = -Math.log( (this.a * Math.pow( x, 2 )) + (this.b * x) + this.c )
            if ( value * 400 < -600 ) {

            } else {
                let vector = new THREE.Vector3( x * 400, value * 400, 0 )
                this.pointsArray.push( vector )

            }
        }

        /*    for ( this.x; this.x < 10; this.x += .1 ) {
                this.a += .01
                let value = this.a * (Math.pow( this.b, this.x + this.c )) + this.d

                let vector = new THREE.Vector3( this.x * 100, value * 100, 0 )
                this.pointsArray.push( vector )
            }*/
        console.log( this.pointsArray )

    }

    getRandomSpeed() {
        return Math.random() * (1.5 - 0.5) + 0.5
    }

    getRandomA() {
        let min = 3
        let max = 8
        return Math.random() * (max - min) + min
    }


    createMesh() {
        this.geometry = new THREE.BoxGeometry( 100, 100, 100 )
        this.material = new THREE.MeshBasicMaterial( { color: 0xffffff } )
        this.mesh = new Mesh( this.geometry, this.material )

        this.mesh.position.set( 400, 15, 0 )

        this.scene.add( this.mesh )

        let speed = this.getRandomSpeed()

        let cube = {
            mesh: this.mesh,
            path: 'generatePath',
            speed: speed,
            creationTime: this.t,
            deleteTime: this.t + ((0.001 * speed) * this.numberCurveDivisions) // 200 correspond to the number of division of the curve
        }
        this.cubesLeft.push( cube )
    }

    destroyMesh( o ) {
        this.scene.remove(o)
        o.geometry.dispose()
        o.material.dispose()
  /*      o.geometry.dispose()
        o.geometry = undefined
        o.material.dispose()
        o.material = undefined
        this.scene.remove( o.mesh )*/
    }

    createCubesLeft() {

    }


    update(  ) {
        this.t += 0.001


        this.position = this.curvepath.getPoint( this.t )
        if (this.mesh !== undefined){
            this.mesh.position.set( this.position.x, this.position.y, this.position.z )
            this.mesh.rotateX( 0.01 )
        }
        console.log(this.mesh)
        if(this.position.y > 400 && this.mesh !== undefined){
            this.destroyMesh(this.mesh)
            this.mesh = undefined
        }


        //console.log( this.x, this.a, this.b, this.c, this.d )
    }

}
