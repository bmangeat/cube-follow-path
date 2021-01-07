import * as THREE from 'three'
import { Mesh } from 'three'

export default class Cube {
    constructor( scene, theme ) {
        this.scene = scene

        this.t = 0
        this.i = 0

        this.cubes = []
        this.numberCurveDivisions = 200

        this.setTheme(theme)

        this.start()
    }

    start() {
        this.createMesh()
    }

    setTheme(theme){
        this.cubes.forEach(cube => this.scene.remove(cube))
        this.theme = theme === 0 ? (-1) : 1
        this.cubes = []


    }


    initPath() {
        this.a = this.getRandomA()
        this.b = 0
        this.c = -0.2

        let pointsArray = []

        if ( Math.random() < 0.5 ) {

            for ( let x = -2; x < 0; x += 0.01 ) {
                let value = this.theme * Math.log( (this.a * Math.pow( x, 2 )) + (this.b * x) + this.c )
                if ( value * 400 < -600 || value * 400 > 600 ) {

                } else {
                    let vector = new THREE.Vector3( x * 400, value * 400, 0 )
                    pointsArray.push( vector )

                }
            }
        } else {

            for ( let x_prime = 2; x_prime > 0; x_prime -= 0.01 ) {
                let value_prime = this.theme * Math.log( (this.a * Math.pow( x_prime, 2 )) + (this.b * x_prime) + this.c )
                if ( value_prime * 400 < -600 || value_prime * 400 > 600 ) {
                } else {
                    let vector = new THREE.Vector3( x_prime * 400, value_prime * 400, 0 )
                    pointsArray.push( vector )
                }
            }
        }


        let curvepath = new THREE.CatmullRomCurve3( pointsArray )

        let geometry = new THREE.Geometry()
        geometry.vertices = curvepath.getPoints( this.numberCurveDivisions )
        let material = new THREE.LineBasicMaterial( { color: 0xff0000 } )
        let line = new THREE.Line( geometry, material )


        //this.scene.add( line )
        return new THREE.CatmullRomCurve3( pointsArray )

    }

    getRandomSpeed() {
        return Math.random() * (1.5 - 0.5) + 0.5
    }


    getRandomA() {
        let min = 1.5
        let max = 8
        return Math.random() * (max - min) + min
    }

    getRandom( max, min ) {
        return Math.random() * (max - min) + min
    }


    createMesh() {
        this.geometry = new THREE.BoxGeometry( 100, 100, 100 )
        this.material = new THREE.MeshBasicMaterial( {
            color: this.theme === -1 ? 0xffffff : 0x000000,

        } )
        this.mesh = new Mesh( this.geometry, this.material )

        let speed = this.getRandomSpeed()

        let cube = {
            mesh: this.mesh,
            path: this.initPath(),
            speed: speed,
            creation: 0,
            rotationAngle: Math.random() < 0.5 ? .01 : -.01

        }

        this.mesh.layers.enable( 1 )


        this.scene.add( this.mesh )


        this.cubes.push( cube )
    }

    destroyMesh( o ) {
        this.scene.remove( o )
        o.geometry.dispose()
        o.material.dispose()
    }


    update() {
        this.t += 0.001

        if ( ++this.i % 120 === 0 ) this.createMesh()

        for ( let i = 0; i < this.cubes.length; i++ ) {
            let position = this.cubes[i].path.getPoint( this.cubes[i].creation * this.cubes[i].speed )
            this.cubes[i].creation += 0.001
            if ( this.theme < 0 ) {
                if ( position.y < 590 ) {
                    this.cubes[i].mesh.position.set( position.x, position.y, 0 )
                    this.cubes[i].mesh.rotateX( this.cubes[i].rotationAngle )
                    this.cubes[i].mesh.rotateY( this.cubes[i].rotationAngle )

                } else if ( this.cubes[i].mesh !== undefined ) {
                    this.destroyMesh( this.cubes[i].mesh )
                }
            } else {
                if ( position.y > -590 ) {
                    this.cubes[i].mesh.position.set( position.x, position.y, 0 )
                    this.cubes[i].mesh.rotateX( this.cubes[i].rotationAngle )
                    this.cubes[i].mesh.rotateY( this.cubes[i].rotationAngle )
                } else if ( this.cubes[i].mesh !== undefined ) {
                    this.destroyMesh( this.cubes[i].mesh )
                }
            }
        }

    }

}
