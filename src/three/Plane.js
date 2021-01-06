import * as THREE from 'three'

const fragmentShader = `
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform float u_theme;
        uniform vec2 u_mouse;
        
        float random (vec2 st){
            float a = 12.9898 + sin(u_time);
            float b = 78.233;
            float c = 43758.5453;
            float dt = dot(st.xy, vec2(a,b));
            
            float sn = mod(dt, 3.14);
            return fract(sin(sn) * c);
        }
        
        void main() {       
            // Bigger grain
            // st *= 200.0;
            // vec ipos = floor(st);
            // vec fpos = floot(st);
            // vec color = vec3(random(ipos)) - 0.93,
            // gl_FragColor = vec4(color, 1.0);
                       
            vec2 st = gl_FragCoord.xy/u_resolution.xy;
            float rnd = random(st) + u_theme;
            gl_FragColor = vec4(vec3(rnd),1.0);
        }
        `
let uniforms = {
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2() },
    u_theme: { value: -.88 }, // .88
    u_mouse: { value: new THREE.Vector2() }
}

let time = 0

export default class Plane {
    constructor( scene, container ) {
        this.scene = scene
        this.container = container

        this.start()
    }

    start() {
        this.createPlane()
    }

    createPlane() {
        this.geometry = new THREE.PlaneBufferGeometry( window.innerWidth * 2, window.innerHeight * 2 )
        this.material = new THREE.ShaderMaterial( {
                fragmentShader: fragmentShader,
                uniforms: uniforms
            }
        )
        this.mesh = new THREE.Mesh( this.geometry, this.material )

        this.mesh.position.set( 0, 0, -200 )
        this.scene.add( this.mesh )
    }

    update() {

        time += 0.001
        uniforms.u_resolution.value.set( this.container.width, this.container.height )
        uniforms.u_time.value = time
    }

}
