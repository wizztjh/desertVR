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

      material = new THREE.MeshLambertMaterial({
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
      var self = this;
      var directionalLight = new THREE.DirectionalLight(0xffffff, 0.00);
      directionalLight.position.set(1, 1, 1).normalize();

      function animate(){
        directionalLight.intensity = 1- self.gameTimeOfDay()
      }

      return {
        mesh: directionalLight,
        animate: animate
      }
    },

    sunSphere: function() {
      var self = this
      var sunSphere = new THREE.Mesh(
        new THREE.SphereGeometry( 20000, 30, 30 ),
        new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: false })
      )

      function animate(){
        var inclination = self.gameTimeOfDay()
        var azimuth = 0.25
        var distance = 4000


        var theta = Math.PI * (inclination - 0.5)
        var phi = 2 * Math.PI * (azimuth - 0.5)

        sunSphere.position.x = distance * Math.cos(phi);
        sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
        sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
      }
      animate()

      return {
        mesh: sunSphere,
        animate: animate
      }
    },

    skybox: function(){
      var self = this
      var sky = new THREE.Sky()
      function animate(){
        var sunSphere = self.findMesh('sunSphere')
        sky.uniforms.turbidity.value=1
        sky.uniforms.reileigh.value=0.9
        sky.uniforms.mieCoefficient.value=0.005
        sky.uniforms.mieDirectionalG.value=0.8
        sky.uniforms.luminance.value=1
        sky.uniforms.sunPosition.value.copy(sunSphere.position);
      }
      animate()

      return {
        mesh: sky.mesh,
        animate: animate
      }
    }
  });

  terrain= gameObject.findMesh('terrain')


  document.body.appendChild( gameObject.renderer.domElement );
  gameObject.render()
}

function animate() {
  var terrain = gameObject.findMesh('terrain');

  terrain.position.z = 100 * Math.sin(gameObject.clock.getElapsedTime()/5)
  terrain.position.x = 100 * Math.cos(gameObject.clock.getElapsedTime()/5)

  gameObject.render()

  requestAnimationFrame( animate );
}
