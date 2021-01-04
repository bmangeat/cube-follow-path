import * as THREE from 'three'
import { Mesh } from 'three'

export default class Cube {
    constructor( scene ) {
        this.scene = scene

        this.t = 0
        this.i = 0
        this.last = 0
        this.cubesLeft = []
        this.numberCurveDivisions = 200

        this.direction = 1

        this.start()
    }

    start() {
        this.createMesh()
    }


    initPath() {
        this.a = this.getRandomA()
        this.b = 0
        this.c = 0.2

        let pointsArray = []

        for ( let x = -1.5; x < 0; x += 0.01 ) {
            let value = this.direction * Math.log( (this.a * Math.pow( x, 2 )) + (this.b * x) + this.c )
            if ( value * 400 < -600 ) {

            } else {
                let vector = new THREE.Vector3( x * 400, value * 400, 0 )
                pointsArray.push( vector )

            }
        }

        let curvepath = new THREE.CatmullRomCurve3( pointsArray )

        let geometry = new THREE.Geometry()
        geometry.vertices = curvepath.getPoints( this.numberCurveDivisions )
        let material = new THREE.LineBasicMaterial( { color: 0xff0000 } )
        let line = new THREE.Line( geometry, material )

        this.scene.add( line )
        return new THREE.CatmullRomCurve3( pointsArray )

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

        let speed = this.getRandomSpeed()

        let cube = {
            mesh: this.mesh,
            path: this.initPath(),
            speed: speed,
            creation : 0

        }

        this.scene.add( this.mesh )

        this.cubesLeft.push( cube )
    }

    destroyMesh( o ) {
        this.scene.remove( o )
        o.geometry.dispose()
        o.material.dispose()
    }

    createCubesLeft() {

    }


    update() {
        this.t += 0.001

        if (++this.i % 120 === 0) this.createMesh()

        if(this.direction < 0){
            for ( let i = 0; i < this.cubesLeft.length; i++ ) {
                let position = this.cubesLeft[i].path.getPoint( this.cubesLeft[i].creation * this.cubesLeft[i].speed )
                this.cubesLeft[i].creation += 0.001
                if ( position.y < 400 ) {
                    this.cubesLeft[i].mesh.position.set( position.x, position.y, position.z )
                    this.cubesLeft[i].mesh.rotateX( 0.01 )
                } else if ( this.cubesLeft[i].mesh !== undefined ) {
                    this.destroyMesh( this.cubesLeft[i].mesh )
                }
            }
        } else {
            for ( let i = 0; i < this.cubesLeft.length; i++ ) {
                let position = this.cubesLeft[i].path.getPoint( this.cubesLeft[i].creation * this.cubesLeft[i].speed )
                this.cubesLeft[i].creation += 0.001
                if ( position.y > -400  ) {
                    this.cubesLeft[i].mesh.position.set( position.x, position.y, position.z )
                    this.cubesLeft[i].mesh.rotateX( 0.01 )
                } else if ( this.cubesLeft[i].mesh !== undefined ) {
                    this.destroyMesh( this.cubesLeft[i].mesh )
                }
            }
        }

    }

}
