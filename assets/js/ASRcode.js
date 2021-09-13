import * as THREE from './three/build/three.module.js';
import {OBJLoader} from './three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';


var rocketOBJ, arrowOBJZ1, arrowOBJZ2,arrowOBJY1, arrowOBJY2,arrowOBJX1, arrowOBJX2;

var canvas = document.querySelector('#c');
var renderer = new THREE.WebGLRenderer({canvas, alpha: true});
renderer.setClearColor(0xFFFFFF);

//renderer.domElement.addEventListener('mousedown', () => { this.press = true })

var lightPos = new THREE.Vector3( 10, 5, 10 );
var cr_d = new THREE.Vector3( 0.9, 0.9, 0.9 );

const scene = new THREE.Scene();

const fov = 45;
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

const sceneInfo1 = {scene:scene, camera:camera, elem:document.querySelector('#rocket')};

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
    pointPos = (projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0)).xyz;
    normalF = normalMatrix * normal;
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

var fSolidShader =   `//#version 300 es

in vec3 pointPos;
in vec3 position;
in vec3 normalF;
in vec2 uv;

uniform vec3 cr; // diffuse reflectance

uniform vec3 modelColor;
uniform vec3 lightPos;


void main() {
    //vec3 lightDir =normalize(lightPos - pointPos);
    //float normLightDeg = abs(dot(normalF , lightDir));
    //vec3 lightLamb =cr*modelColor*normLightDeg;
    //gl_FragColor  =vec4( lightLamb, 1);
    gl_FragColor  =vec4( modelColor, 1);
}  `;
//loaderFile.load('../assets/glsl/simpleVertexShader.vs',function ( data ) {vShader =  data;},);
//loaderFile.load('../assets/glsl/lambertianShader.fs',function ( data ) {fShader =  data;},);

loader.load( "../assets/model/rocket.obj",
              function ( object ) {
                const meshL = object.children[ 0 ];
                var geometryL  = meshL.geometry;
                var positionL = meshL.geometry.attributes.position.array;
                var normalL = meshL.geometry.attributes.normal.array;
                var normalLCount = meshL.geometry.attributes.normal.count;
                //smoothNormal(positionL, normalL, normalLCount);
                //meshL.geometry.attributes.normal.array = normalL;

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

              let uniforms = {
                      modelColor: {type: 'vec3', value: new THREE.Color(0x0000ff)},
                      lightPos: {type: 'vec3', value: lightPos},
                      cr :{type: 'vec3', value:cr_d},
                      glslVersion: THREE.GLSL3,
                  }

              let lambertian =  new THREE.ShaderMaterial({
                  uniforms: uniforms,
                  fragmentShader: fSolidShader,
                  vertexShader: vShader,
                });

              arrowOBJY1 =  new THREE.Mesh(geometryL, lambertian);
              arrowOBJY2 =  arrowOBJY1.clone();
              //sceneInfo.scene.add( meshNew );
              //sceneInfo.mesh[0] = meshNew;

              sceneInfo1.scene.add( arrowOBJY1 );
              arrowOBJY1.rotation.y = 0;
              arrowOBJY1.position.y = 5;
              sceneInfo1.scene.add( arrowOBJY2 );
              arrowOBJY2.rotation.y = 0;
              arrowOBJY2.position.y = 5;

              //console.log(sceneInfo.rocketMesh);

              //console.log(arrowOBJ);
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

              let uniforms = {
                      modelColor: {type: 'vec3', value: new THREE.Color(0x00ff00)},
                      lightPos: {type: 'vec3', value: lightPos},
                      cr :{type: 'vec3', value:cr_d},
                      glslVersion: THREE.GLSL3,
                  }

              let lambertian =  new THREE.ShaderMaterial({
                  uniforms: uniforms,
                  fragmentShader: fSolidShader,
                  vertexShader: vShader,
                });

              arrowOBJX1 =  new THREE.Mesh(geometryL, lambertian);
              arrowOBJX2 =  arrowOBJX1.clone();
              //sceneInfo.scene.add( meshNew );
              //sceneInfo.mesh[0] = meshNew;

              sceneInfo1.scene.add( arrowOBJX1 );
              arrowOBJX1.rotation.z = Math.PI / 2;
              arrowOBJX1.position.x = 5;
              sceneInfo1.scene.add( arrowOBJX2 );
              arrowOBJX2.rotation.z = Math.PI / 2;
              arrowOBJX2.position.x = 5;

              //console.log(sceneInfo.rocketMesh);

              //console.log(arrowOBJ);
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

                          let uniforms = {
                                  modelColor: {type: 'vec3', value: new THREE.Color(0xff0000)},
                                  lightPos: {type: 'vec3', value: lightPos},
                                  cr :{type: 'vec3', value:cr_d},
                                  glslVersion: THREE.GLSL3,
                              }

                          let lambertian =  new THREE.ShaderMaterial({
                              uniforms: uniforms,
                              fragmentShader: fSolidShader,
                              vertexShader: vShader,
                            });

                          arrowOBJZ1 =  new THREE.Mesh(geometryL, lambertian);
                          arrowOBJZ2 =  arrowOBJZ1.clone();
                          //sceneInfo.scene.add( meshNew );
                          //sceneInfo.mesh[0] = meshNew;

                          sceneInfo1.scene.add( arrowOBJZ1 );
                          arrowOBJZ1.rotation.x = Math.PI / 2;
                          arrowOBJZ1.position.z = 5;
                          sceneInfo1.scene.add( arrowOBJZ2 );
                          arrowOBJZ2.rotation.x = Math.PI / 2;
                          arrowOBJZ2.position.z = 5;

                          //console.log(sceneInfo.rocketMesh);

                          //console.log(arrowOBJ);
                        },
                        function(xhr){
                          console.log((xhr.loaded/xhr.total*100)+' % loaded')
                          },
                        function ( error ) {console.error( error );} );
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

  if(rocketOBJ === undefined){
    console.log(rocketOBJ);
    //console.log(rocketOBJ.scale);
  }else{
    rocketOBJ.rotation.y = time * -1 * .1;
  }

  if(arrowOBJY1 === undefined && arrowOBJY2 === undefined){
    //console.log(arrowOBJZ2.scale);
  }else{
    arrowOBJY1.rotation.y = time * -1 *2.0; // set rotation angle and speed
    arrowOBJY2.rotation.y = arrowOBJY1.rotation.y + 3.14; // this just makes sure the offset of half a rotation does occure
  }
  if(arrowOBJZ1 === undefined && arrowOBJZ2 === undefined){
    //console.log(arrowOBJZ2.scale);
  }else{
    arrowOBJZ1.rotation.y = time * -1 *2.0; // set rotation angle and speed
    arrowOBJZ2.rotation.y = arrowOBJZ1.rotation.y + 3.14; // this just makes sure the offset of half a rotation does occure
  }
  if(arrowOBJX1 === undefined && arrowOBJX2 === undefined){
    //console.log(arrowOBJZ2.scale);
  }else{
    arrowOBJX1.rotation.x = time * 1 *2.0; // set rotation angle and speed
    arrowOBJX2.rotation.x = arrowOBJX1.rotation.x + 3.14; // this just makes sure the offset of half a rotation does occure
  }
  renderSceneInfo(sceneInfo1);

  requestAnimationFrame(render);
}

function smoothNormal(posArray,normalArr, count){
  //generate list
  var floatError = 0.00000005
  var normalList = [];

  var currX;
  var currY;
  var currZ;

  var currNX;
  var currNY;
  var currNZ;

  var found = false;

  for(var i = 0; i <count/3; i++){
    currX = posArray[i*3 + 0];
    currY = posArray[i*3 + 1];
    currZ = posArray[i*3 + 2];

    currNX = normalArr[i*3 + 0];
    currNY = normalArr[i*3 + 1];
    currNZ = normalArr[i*3 + 2];

    for(var j = 0; j <normalList.length; j++){
      if( currX<= normalList[j].position[0]+floatError && currX >= normalList[j].position[0]-floatError &&
          currY<= normalList[j].position[1]+floatError && currY >= normalList[j].position[1]-floatError &&
          currZ<= normalList[j].position[2]+floatError && currZ >= normalList[j].position[2]-floatError){
            normalList[j].normal[0] = normalList[j].normal[0] + currNX;
            normalList[j].normal[1] = normalList[j].normal[1] + currNY;
            normalList[j].normal[2] = normalList[j].normal[2] + currNZ;
            normalList[j].count = normalList[j].count + 1;
            found = true;
            continue;
          }
    }
    if(!found){
      normalList.push({position:[currX,currY,currZ],normal:[currNX,currNY,currNZ],count: 1})
    }else{
      found = false;
    }
  }

  //average all the vectors and normalize.
  for(var i = 0; i<normalList.length; i++){
    var average = 1/normalList[i].count;
    var normal = normalList[i].normal;
    normal[0] = average * normal[0];
    normal[1] = average * normal[1];
    normal[2] = average * normal[2];
    //normalize
    var fac = 1/Math.sqrt(Math.pow(normal[0],2) + Math.pow(normal[1],2) + Math.pow(normal[2],2));

    normal[0] = fac * normal[0];
    normal[1] = fac * normal[1];
    normal[2] = fac * normal[2];
    normalList[i].normal = normal;
  }

  for(var i = 0; i <count/3; i++){
    currX = posArray[i*3 + 0];
    currY = posArray[i*3 + 1];
    currZ = posArray[i*3 + 2];

    for(var j = 0; j <normalList.length; j++){
      if( currX<= normalList[j].position[0]+floatError && currX >= normalList[j].position[0]-floatError &&
          currY<= normalList[j].position[1]+floatError && currY >= normalList[j].position[1]-floatError &&
          currZ<= normalList[j].position[2]+floatError && currZ >= normalList[j].position[2]-floatError){
            normalArr[i] = normalList[j].normal;
            continue;
          }
    }
  }
  console.log(normalList);
}

function onDocumentMouseMove( event ) {
  console.log("mouse Event")

    event.preventDefault();

    if ( isMouseDown ) {

        theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 )
                + onMouseDownTheta;
        phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 )
              + onMouseDownPhi;

        phi = Math.min( 180, Math.max( 0, phi ) );

        camera.position.x = radious * Math.sin( theta * Math.PI / 360 )
                            * Math.cos( phi * Math.PI / 360 );
        camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
        camera.position.z = radious * Math.cos( theta * Math.PI / 360 )
                            * Math.cos( phi * Math.PI / 360 );
        camera.updateMatrix();

    }

    mouse3D = projector.unprojectVector(
        new THREE.Vector3(
            ( event.clientX / renderer.domElement.width ) * 2 - 1,
            - ( event.clientY / renderer.domElement.height ) * 2 + 1,
            0.5
        ),
        camera
    );
    ray.direction = mouse3D.subSelf( camera.position ).normalize();

    interact();
    render();

}
