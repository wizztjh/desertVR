var gameObject;

init()
animate()

function init() {
  var directionalLight, terrain;

  gameObject = new GameObject({

    terrain: function() {
      var geometry, texture, material, animate, mesh;
      var self = this
      geometry = new THREE.PlaneGeometry( 1000, 1000, 32, 32);
      geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

      animate = function(){
        var verticeCount = geometry.vertices.length
        var elapsedTime = self.clock.getElapsedTime()  
        for ( var i = 0, verticeCount ; i < verticeCount; i ++ ) {
          geometry.vertices[ i ].y =  (10 * Math.sin( (i/2) )+ 3* Math.cos( i/2));
        }

        geometry.verticesNeedUpdate = true;

      }

      animate()

      geometry.computeFaceNormals();
      geometry.computeVertexNormals();

      material = new THREE.MeshBasicMaterial({
        color: 0xcfb68d,
        side: THREE.DoubleSide
      } );

      mesh = new THREE.Mesh( geometry, material );
      mesh.overdraw = true;
      mesh.position.y=-15;

      return {
        mesh: mesh,
        animate: animate
      }
    },

    light: function() {     
      return {
        mesh: new THREE.AmbientLight(0x222222)
      }
	  
    },

    directionalLight: function(){
      var directionalLight = new THREE.DirectionalLight(0xffffff, 0.00);
      directionalLight.position.set(1, 1, 1).normalize();
	  
      return {
        mesh: directionalLight
      }
    },

    sunSphere: function() {
      var inclination = 0.38
      var azimuth = 0.25
      var distance = 4000

      var sunSphere = new THREE.Mesh(
        new THREE.SphereGeometry( 20000, 30, 30 ),
        new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: false })
      )

      var theta = Math.PI * (inclination - 0.5)
      var phi = 2 * Math.PI * (azimuth - 0.5)
	
      sunSphere.position.x = distance * Math.cos(phi);
      sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
      sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);

      console.log(sunSphere.position.x);
      console.log(sunSphere.position.y);
      console.log(sunSphere.position.z);

      sunSphere.geometry.dynamic = true;
      var animate = function(){
	 var verticeCount = sunSphere.geometry.vertices.length;
	 console.log(verticeCount);
	 var elapsedTime = self.clock.getElapsedTime();
	 
	 for (var i = 0, verticeCount; i < verticeCount; i++){
           inclination = inclination + 0.1;
	   console.log(inclination);
	   theta = Math.PI * (inclination - 0.5);
           phi = 2 * Math.PI * (azimuth - 0.5);
	   sunSphere.position.x = distance * Math.cos(phi) * Math.sin(elapsedTime);
	   sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta) * Math.sin(elapsedTime);
	   sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta) * Math.sin(elapsedTime);
	   sunSphere.position.needsUpdate = true;
	   //sunSphere.geometry.vertices[ i ].x = 10 * Math.sin( (i/2) );
	   //sunSphere.geometry.vertices[ i ].y = (10 * Math.sin( (i/2) )+ 3* Math.cos( i/2));
           //sunSphere.geometry.vertices[ i ].z = (10 * Math.sin( (i/2) )+ 3* Math.cos( i/2)); 	  
	   sunSphere.geometry.verticesNeedUpdate = true;
	   sunSphere.position.needsUpdate = true;
	   sunSphere.geometry.normalsNeedUpdate = true;  
	 }
	  
      }
      animate();
      return {
        mesh: sunSphere
      }
    },

    skybox: function(){
      var sunSphere = this.findMesh('sunSphere')
      var geometry = new THREE.PlaneGeometry( 1000, 1000, 32, 32);
      var sky = new THREE.Sky()
      sky.uniforms.turbidity.value=1
      sky.uniforms.reileigh.value=0.9
      sky.uniforms.mieCoefficient.value=0.005
      sky.uniforms.mieDirectionalG.value=0.8
      sky.uniforms.luminance.value=1
      sky.uniforms.sunPosition.value.copy(sunSphere.position);
      
      /*geometry.dynamic = true;
      var animate = function(){
	   var verticeCount = geometry.vertices.length;
	   var elapsedTime = self.clock.getElapsedTime();
      for( var i = Math.PI/2; i < 2*Math.PI; i++){ 
	sky.uniforms.reileigh.value = sky.uniforms.reileigh.value * Math.sin(i);
	sky.uniforms.needsUpdate = true;
	
      }
      	
      
      }*/
      
      
      //animate();
      return sky;
	      //animae:animate
    }
  });

  terrain= gameObject.findMesh('terrain')
  directionalLight = gameObject.findMesh('directionalLight')


  document.body.appendChild( gameObject.renderer.domElement );
  gameObject.render()
}

function animate() {
  var terrain = gameObject.findMesh('terrain');
  var directionalLight = gameObject.findMesh('directionalLight');
  var sunSphere = gameObject.findMesh('sunSphere');
  terrain.position.z = 100 * Math.sin(gameObject.clock.getElapsedTime()/5)
  terrain.position.x = 100 * Math.cos(gameObject.clock.getElapsedTime()/5)
  
  sunSphere.position.x = 100 * Math.sin(gameObject.clock.getElapsedTime()/5);
  sunSphere.position.y = 100 * Math.cos(gameObject.clock.getElapsedTime()/5);
  sunSphere.position.z = 100 * Math.sin(gameObject.clock.getElapsedTime()/5);
  gameObject.render();

  requestAnimationFrame( animate );
}
