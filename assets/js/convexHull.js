<script type= "module">

		import * as THREE from '../js/Three/build/three.module.js';
		//import * as THREE from 'https://cdn.skypack.dev/three@0.130.1';

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );

		const renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		const geometry = new THREE.BoxGeometry();
		const materialCube = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		const cube = new THREE.Mesh( geometry, materialCube );
		scene.add( cube );

		//create a blue LineBasicMaterial
		const materialLine = new THREE.LineBasicMaterial( { color: 0x0000ff } );
		const points = [];
		points.push( new THREE.Vector3( - 10, 0, 0 ) );
		points.push( new THREE.Vector3( 0, 10, 0 ) );
		points.push( new THREE.Vector3( 10, 0, 0 ) );
		const geometryLine = new THREE.BufferGeometry().setFromPoints( points )
		const line = new THREE.Line( geometryLine, materialLine );
		scene.add( line );


		var pointsGPS = [{lat:35.06176699, lng:-106.52653382},
					 {lat:35.06175090, lng:-106.52650403},
					 {lat:35.06178922, lng:-106.52666572},
					 {lat:35.06178617, lng:-106.52655601},
					 {lat:35.06176794, lng:-106.52650507},
					 {lat:35.0618074,  lng:-106.52659488},
					 {lat:35.06184429, lng:-106.52657955},
					 {lat:35.0618345,  lng:-106.52658231},
					 {lat:35.06185507, lng:-106.52657276},
					 {lat:35.06185396, lng:-106.52665646},
					 {lat:35.06187108, lng:-106.52658958},
					 {lat:35.06191665, lng:-106.52660795},
					 {lat:35.06195936, lng:-106.52658833},
					 {lat:35.0619365,  lng:-106.526601173},
					 {lat:35.06198363, lng:-106.52668470},
					 {lat:35.06198317, lng:-106.52661210},
					 {lat:35.06201637, lng:-106.52668830}];

		var testP = [{lat:0,lng:1},
					 {lat:1,lng:0},
				 	 {lat:-1,lng:0},
				 	 {lat:1,lng:0.2}];
		const vertP = [];
		const vertPVec = [];

		for ( let i = 0; i < pointsGPS.length; i ++ ) {

			const x = ((pointsGPS[i].lat*1000)-35060)*100-190;
			const y = ((pointsGPS[i].lng*1000)+106526)*100+65;
			const z = 0.0;

			//const x = testP[i].lat;
			//const y = testP[i].lng;
			//const z = 0.0;

			vertP.push( x, y, z );
			vertPVec.push(new THREE.Vector3(x,y,z));
		}

		const geometryP = new THREE.BufferGeometry();
		geometryP.setAttribute( 'position', new THREE.Float32BufferAttribute( vertP, 3 ) );
		//geometryP.scale(10,10,10);
		const pCloud = new THREE.Points( geometryP);
		scene.add( pCloud );

		camera.position.z = 20
		camera.lookAt(0,0,0);
		var conHull = QuickHull(vertPVec.slice());
		const geometryCon = new THREE.BufferGeometry().setFromPoints( conHull );
		//geometryCon.setAttribute( 'position', new THREE.Float32BufferAttribute( conHull, 3 ) );
		const convexLine = new THREE.Line( geometryCon,);
		scene.add( convexLine );

		 const animate = function () {
			 requestAnimationFrame( animate );

			 cube.rotation.x += 0.01;
			 cube.rotation.y += 0.01;
			 line.rotation.x += 0.01;
			 line.rotation.y += 0.01;

			 renderer.render( scene, camera );
		 };
		 animate();

		function QuickHull(points){
			const convexHull = [];
			let minX = points[0].x;
			let minXIndex = 0;
			let maxX = points[0].x;
			let maxXIndex = 0;
			//find inital points to ceate line
			for(let i = 1; i<points.length; i++){
				var tmpX = points[i].x;
				if(tmpX<minX){
					minX =tmpX;
					minXIndex = i;
				}
				if(maxX<tmpX){
					maxX =tmpX;
					maxXIndex = i;
				}
			}

			var pointA = points[minXIndex].clone();
			var pointB = points[maxXIndex].clone();
			// remove Points a and b
			if(minXIndex<maxXIndex){
				points.splice(maxXIndex,1);
				points.splice(minXIndex,1);
			}else{
				points.splice(minXIndex,1);
				points.splice(maxXIndex,1);
			}

			let lineAB = pointB.clone();
			lineAB = lineAB.sub(pointA);
			var SA = [];// points CCW line
			var SB = [];// points CW line

			// works on 2d vector. This is not suited for three 3d convexhull
			//calculations.
			var pointsCheck = points.length;
			for(let i = 0; i<pointsCheck; i++){
				var lineAP = points[0].clone();
				lineAP = lineAP.sub(pointA);
				var sidedness = lineAP.x*lineAB.y-lineAB.x*lineAP.y;
				if(sidedness < 0){//CCW
					SA.push( points.splice(0,1)[0]);// since we are removing point
				}else if(sidedness> 0){//CW
					SB.push(points.splice(0,1)[0]);
				}else{
					//one the same line. We should be able to ignore this.
					points.splice(0,1);
				}

			}
			var ConHullPoints = [];
			ConHullPoints.push(pointA)
			ConHullPoints.push(...FindHull(SA.slice(),pointA.clone(),pointB.clone()))
			ConHullPoints.push(pointB)
			ConHullPoints.push(...FindHull(SB.slice(),pointB.clone(),pointA.clone()))
			ConHullPoints.push(pointA);
			return ConHullPoints;
		}

		function FindHull(A,P,Q){
			if(A.length<= 0){
				return [];
			}
			var furthestPointIndex =futherestPointFromEdge(P.clone(),Q.clone(),A.slice());
			var C = A.splice(furthestPointIndex,1)[0]
			//pointFar C
			//          C
			//         / \
			//       /    \
			//     /       \
			// 	 /     .    \
			// /             \
			//P---------------Q
			var S0 =[];// inside triangle
			var S1 =[];//left side of P C
			var S2 = [];//left side of C Q
			var totLen = A.length;
			for(let i = 0; i<totLen;i++){
				// Could use singed area to test which side points are.
				var  {v, w, u} = barycentricCoor(P, Q, C.clone(), A[0].clone());
				if(u >= 0 && w >= 0 && v >= 0){//inside triangle
					S0.push(A.splice(0,1)[0]);
				}else if(v < 0){//bellow line AP can ignore
					A.splice(0,1);
				}else if(w<0){//right of CP
					S2.push(A.splice(0,1)[0]);
				}else if(u < 0){//right of PC
					S1.push(A.splice(0,1)[0]);
				}else{//some thing wierd!!!
					A.splice(0,1);
				}
			}

			var hullPoints = [];
			hullPoints.push(...FindHull(S1.slice(),P,C));
			hullPoints.push(C);
			hullPoints.push(...FindHull(S2.slice(),C,Q));
			var filtered = hullPoints.filter(function(x) {
     			return x !== undefined;
			});

			return filtered;
		}

		function futherestPointFromEdge(a,b,points){
			var edge = b.clone().sub(a);
			var edgePerp = new THREE.Vector3( -b.y, b.x, b.z );
			var bestIndex = -1;
			var maxVal = -Number.MAX_VALUE;
			var rightMostVal = -Number.MAX_VALUE;

			for(var i =0 ; i<points.length; i++){
				var pVec2 = new THREE.Vector2(points[i].x, points[i].y);
				var edgeVec2 = new THREE.Vector2(edge.x, edge.y);
				var edgePerpVec2 = new THREE.Vector2(edgePerp.x, edgePerp.y);
				var aVec2 = new THREE.Vector2(a.x, a.y);

				var d = pVec2.clone().sub(aVec2).dot(edgePerpVec2);
				var r = pVec2.clone().sub(aVec2).dot(edgeVec2);

				if(d>maxVal||(d == maxVal &&r>rightMostVal)){
					bestIndex = i;
					maxVal = d;
					rightMostVal = r;
				}
			}
			return bestIndex
		}

		function GPS2Vector(points){
			const vectorGPS = [];
			for ( let i = 0; i < points.length; i ++ ) {

				const x = points[i].lat
				const y = points[i].lng
				const z = 0.0;

				vectorGPS.push( new THREE.Vector3( x, y, z));
			}
			return vectorGPS;
		}

		function barycentricCoor(A, B, C, P){
			var vec2A = new THREE.Vector2(A.x,A.y);
			var vec2B = new THREE.Vector2(B.x,B.y);
			var vec2C = new THREE.Vector2(C.x,C.y);
			var vec2P = new THREE.Vector2(P.x,P.y);

			var totalArea = mag(vec2B.clone().sub(vec2A).cross(vec2C.clone().sub(vec2A)));
			//#NOTE(CO): Cross product of 3D vector returns a scalar.
			var v = vec2B.clone().sub(vec2A).cross(vec2P.clone().sub(vec2B))/totalArea;
			var w = vec2C.clone().sub(vec2B).cross(vec2P.clone().sub(vec2C))/totalArea;
			var u = vec2A.clone().sub(vec2C).cross(vec2P.clone().sub(vec2A))/totalArea;
			return {v,w,u}
		}

		function mag(vec2){
			//console.log(vec2)
			//return  Math.sqrt(Math.pow(vec2.x, 2) + Math.pow(vec2.y, 2));
			return vec2;
		}

		</script>
