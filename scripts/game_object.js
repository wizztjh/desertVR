function GameObject(initObjs) {
  self = this

  this.objects = {};

  this.renderer = new THREE.WebGLRenderer({ antialias: false });
  this.renderer.setPixelRatio(window.devicePixelRatio);

  document.body.appendChild(this.renderer.domElement);

  this.scene = new THREE.Scene();
  this.scene.fog = new THREE.FogExp2( 0xffff99, 0.0075 );

  this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 10000);

  this.controls = new THREE.VRControls(this.camera);

  this.effect = new THREE.VREffect(this.renderer);
  this.effect.setSize(window.innerWidth, window.innerHeight);

  this.manager = new WebVRManager(this.renderer, this.effect, {hideButton: false});

  this.clock = new THREE.Clock(true)
  this.clock.start()

  Object.keys(initObjs).forEach(function(name){
    returnObject = initObjs[name].apply(self)
    self.add(name, returnObject);
  });
  window.addEventListener('resize', this.onWindowResize.bind(this), false);
}

GameObject.prototype.onWindowResize = function() {
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();
  this.effect.setSize( window.innerWidth, window.innerHeight );
}

GameObject.prototype.add = function(name, returnObject){
  this.scene.add(returnObject.mesh);
  this.objects[name] = returnObject;
}

GameObject.prototype.render = function(){
  var self = this
  Object.keys(this.objects).forEach(function(name){
    object = self.objects[name]
    if (typeof(object.animate) == 'function') {
      object.animate()
    }
  })

  this.controls.update()
  this.manager.render(this.scene, this.camera)
}

GameObject.prototype.find = function(name){
  return this.objects[name];
}

GameObject.prototype.findMesh = function(name){
  return this.objects[name].mesh;
}
