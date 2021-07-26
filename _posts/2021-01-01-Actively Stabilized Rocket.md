---
defaults:
  # _posts
  - scope:
      path: ""
      type: posts
    values:
      layout: single
      author_profile: true
      comments: true
      share: true
      related: true
---

# Introduction

If you have ever shot a model rocket you might have seen the rocket spinning when shooting up. This spin happen in the roll axis which can have its advantages and disadvantages. One of the advantages is that spinning object will behave like a Gyroscope and will resist any rotation yaw and pitch rotation[Cite]. The primary advantage of This project was an attempt to reduce the roll by actively correcting for it. The benefits of this is that the rocket will have known orientation which will make it easier to direct the rocket. The rocket is stabilized by 3 fins connect to servo motors. For this project, Micro servo motors will be used since they have sufficient torque and are light.

<style>
  model-viewer#reveal {
    --poster-color: transparent;
    height: 500px;
    width: 500px;

  }
</style>

<script type="module">

import * as THREE from '../assets/js/three/build/three.module.js';
import {OBJLoader} from '../assets/js/three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from '../assets/js/three/examples/jsm/loaders/GLTFLoader.js';


var rocketOBJ, arrowOBJ1, arrowOBJ2;

var canvas = document.querySelector('#c');
var renderer = new THREE.WebGLRenderer({canvas, alpha: true});

var lightPos = new THREE.Vector3( 0, 10, 5 );
var cr_d = new THREE.Vector3( 0.9, 0.9, 0.9 );

const scene = new THREE.Scene();

const fov = 35;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 10, 15);
camera.lookAt(0, 0, 0);

{
  const color = 0xFFFFFF;
  const intensity = 150;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(lightPos.x ,lightPos.y, lightPos.z);
  scene.add(light);
}

const sceneInfo1 = {scene:scene, camera:camera, elem:document.querySelector('#rock')};

const loader = new OBJLoader();

var loaderFile = new THREE.FileLoader();
var vShader =   `//#version 300 es

// WebGL is nice enough to add these by default.

// = object.matrixWorld
//uniform mat4 modelMatrix;

// = camera.matrixWorldInverse * object.matrixWorld
//uniform mat4 modelViewMatrix;

// = camera.projectionMatrix
//uniform mat4 projectionMatrix;

// = camera.matrixWorldInverse
//uniform mat4 viewMatrix;

// = inverse transpose of modelViewMatrix
//uniform mat3 normalMatrix;

// = camera position in world space
//uniform vec3 cameraPosition;

out vec3 pointPos;
out vec3 normalF;

void main() {
    pointPos = position;
    normalF = normal;
    //pointPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

}  ` ;

var fShader =   `//#version 300 es

in vec3 pointPos;
in vec3 position;
in vec3 normalF;
in vec2 uv;

uniform vec3 cr; // diffuse reflectance

uniform vec3 modelColor;
uniform vec3 lightPos;


void main() {
    vec3 lightDir =normalize(lightPos - pointPos);
    float normLightDeg = abs(dot(normalF , lightDir));
    vec3 lightLamb =cr*modelColor*normLightDeg;
    gl_FragColor  =vec4( lightLamb, 1);
    //gl_FragColor  =vec4( 0.5,0.5,0.5, 1);
}  `;
//loaderFile.load('../assets/glsl/simpleVertexShader.vs',function ( data ) {vShader =  data;},);
//loaderFile.load('../assets/glsl/lambertianShader.fs',function ( data ) {fShader =  data;},);

let uniforms = {
        modelColor: {type: 'vec3', value: new THREE.Color(0x666666)},
        lightPos: {type: 'vec3', value: lightPos},
        cr :{type: 'vec3', value:cr_d},
        glslVersion: THREE.GLSL3,
    }

let lambertian =  new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: fShader,
    vertexShader: vShader,
  });

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({color: 'red'});

loader.load( "../assets/model/rocket.obj",
              function ( object ) {
                                const meshL = object.children[ 0 ];
                                var geometryL  = meshL.geometry;
                                rocketOBJ = new THREE.Mesh(geometryL, lambertian);
                                //rocketOBJ.rotation.y = 90;
                                sceneInfo1.scene.add( rocketOBJ );
                                //console.log(rocketOBJ);
                              },
            function(xhr){
              console.log((xhr.loaded/xhr.total*100)+' % loaded')
            },
            function ( error ) {console.error( error );} );

loader.load( "../assets/model/arrow.obj",
            function(object){
              const meshL = object.children[ 0 ];
              var geometryL  = meshL.geometry;
              console.log(geometryL);
              arrowOBJ1 =  new THREE.Mesh(geometryL, lambertian);
              arrowOBJ2 =  arrowOBJ1.clone();
              //sceneInfo.scene.add( meshNew );
              //sceneInfo.mesh[0] = meshNew;

              sceneInfo1.scene.add( arrowOBJ1 );
              arrowOBJ1.rotation.y = 0;
              sceneInfo1.scene.add( arrowOBJ2 );
              arrowOBJ2.rotation.y = 0;

              //console.log(sceneInfo.rocketMesh);

              //console.log(arrowOBJ);
            },
            function(xhr){
              console.log((xhr.loaded/xhr.total*100)+' % loaded')
              },
            function ( error ) {console.error( error );} );

const mesh = new THREE.Mesh(geometry, material);
sceneInfo1.scene.add(mesh);
sceneInfo1.mesh = mesh;

//console.log(rocketOBJ1);
//console.log(rocketOBJ1.rotation);

//console.log(arrowOBJ);
//console.log(arrowOBJ.rotation);
//var sceneInfo1 = setupScene1();
var attempts = 0;

requestAnimationFrame(render);


function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function renderSceneInfo(sceneInfo) {
  const {scene, camera, elem} = sceneInfo;

  // get the viewport relative position of this element
  const {left, right, top, bottom, width, height} = elem.getBoundingClientRect();

  const isOffscreen = bottom < 0 || top > renderer.domElement.clientHeight || right < 0 || left > renderer.domElement.clientWidth;

  if (isOffscreen) {
    return;
  }

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
  renderer.setScissor(left, positiveYUpBottom, width, height);
  renderer.setViewport(left, positiveYUpBottom, width, height);

  renderer.render(scene, camera);
}


function render(time) {
  time *= 0.001;

  resizeRendererToDisplaySize(renderer);

  renderer.setScissorTest(false);
  renderer.clear(true, true);
  renderer.setScissorTest(true);

  sceneInfo1.mesh.rotation.y = time * .1;

  if(rocketOBJ === undefined){
    console.log(rocketOBJ);
    //console.log(rocketOBJ.scale);
  }else{
    rocketOBJ.rotation.y = time * -1 * .1;
  }

  if(arrowOBJ1 === undefined && arrowOBJ2 === undefined){
    console.log(arrowOBJ1);
    console.log(arrowOBJ2);
    //console.log(arrowOBJ2.scale);
  }else{
    arrowOBJ1.rotation.y = time * -1 *2.0; // set rotation angle and speed
    arrowOBJ2.rotation.y = arrowOBJ1.rotation.y + 3.14; // this just makes sure the offset of half a rotation does occure
  }

  renderSceneInfo(sceneInfo1);

  requestAnimationFrame(render);
}

</script>


<div class ="page__content">
<canvas id="c"></canvas>
<span id="rock" class="diagram left"></span>
</div>
Test


<!---
!{% capture rocket_img %}
![Foo]({{ "/assets/images/Rocket.jpg" | relative_url }})
{% endcapture %}s

<figure>
  {{ rocket_img | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption> Model rocket with fins.</figcaption>
</figure>
-->

# Material and Equipment

1.  Arduino Nano
* The Arduino Nano is a small microcontroller which will make it easier to fit into the rocket. The Nano will have sufficient speed to control the servo motors, get data, and process control.
2.  Micro Servo motors
* While this servo doesn't have a lot of power, it should be sufficient to apply a corrective force to the rocket.
3.  Model Rocket
* This model rocket can be cheap but make sure it has enough space for the rocket components.
4.  3D printer
* We will need to print out  housing for the 3D printer and parachute section.
5. Lithium Ion Battery Pack
* Servo motors require a good amount of power these Lithium Ion battery will be able to supply.
6. Boot Convertor
* Lithium Ion batteries have a voltage around 3.7 voltage and with a low internal resistance. This mean more power can be draw quickly which will all us to power the 3 servo motors.
7. MPU6050
* This is a nice accelerometer, Gyro, and IMU which will be used gather data on the roll of the rocket. The Gyro will retrieve the rotation speed of our rocket which be used as feed back.

# Steps

# Conclusion
