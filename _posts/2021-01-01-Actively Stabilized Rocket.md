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

var rocketOBJ = {};
var arrowOBJ = {};

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas, alpha: true});

const sceneInfo1 = setupScene1();

requestAnimationFrame(render);



function makeScene(elem,path,path2) {
  const scene = new THREE.Scene();

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 1, 15);
  camera.lookAt(0, 0, 0);

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 15);
    scene.add(light);
  }

  return {scene, camera, elem};
}


function setupScene1() {
  var sceneInfo = makeScene(document.querySelector('#rock'));

  const loader = new OBJLoader();

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({color: 'red'});

  loader.load( "../assets/model/rocket.obj",
                function ( object ) { //const sceneL = object.scene;
                                  rocketOBJ = object;
                                  rocketOBJ.rotation.y = 90;
                                  sceneInfo.scene.add( rocketOBJ );
                                  //var meshL = sceneL.children[ 2 ];
                                  //var geometryL  = meshL.geometry;
                                  //var meshNew =  new THREE.Mesh(geometryL, material);
                                  //sceneInfo.scene.add( meshNew );
                                  //sceneInfo.mesh[0] = meshNew;
                                  //console.log(sceneInfo.rocketMesh);
                                  return rocketOBJ;
                                },
              undefined,
              function ( error ) {console.error( error );} );

  loader.load( "../assets/model/arrow.obj",
              function ( object  ) {// const sceneL = arrowOBJ.scene;
                                  arrowOBJ = object;
                                  arrowOBJ.rotation.y = 90;
                                  sceneInfo.scene.add( arrowOBJ );
                                  //const meshL = sceneL.children[ 3 ];
                                  //const geometryL  = meshL.geometry;
                                  //const meshNew =  new THREE.Mesh(geometryL, material);
                                  //sceneInfo.scene.add( meshNew );
                                  //sceneInfo.mesh[1] = meshNew;
                                },
              undefined,
              function ( error ) {console.error( error );} );

  const mesh = new THREE.Mesh(geometry, material);
  sceneInfo.scene.add(mesh);
  sceneInfo.mesh = mesh;

  console.log(sceneInfo.mesh);
  return sceneInfo;
}


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
  const {left, right, top, bottom, width, height} =
      elem.getBoundingClientRect();

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
  //rocketOBJ.rotation.y = time * .1;
  //arrowOBJ.rotation.y = time * .1;

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
