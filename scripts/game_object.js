function GameObject(initObjs) {
  self = this

  this.objects = {};

  this.renderer = new THREE.WebGLRenderer({ antialias: false });
  this.renderer.setPixelRatio(window.devicePixelRatio);

  this.renderer.domElement.id = 'canvas'
  document.body.appendChild(this.renderer.domElement);

  this.scene = new THREE.Scene();
  this.scene.fog = new THREE.FogExp2( 0xffff99, 0.0075 );

  this.camera = new THREE.PerspectiveCamera(75, this.getWidth() / this.getHeight(), 0.3, 10000);

  this.controls = new THREE.VRControls(this.camera);

  this.effect = new THREE.VREffect(this.renderer);
  this.effect.setSize(this.getWidth(), this.getHeight());

  this.manager = new WebVRManager(this.renderer, this.effect, {hideButton: false});

  this.clock = new THREE.Clock(true)
  this.clock.start()

  Object.keys(initObjs).forEach(function(name){
    returnObject = initObjs[name].apply(self)
    self.add(name, returnObject);
  });
  window.addEventListener('resize', this.onWindowResize.bind(this), false);
}

GameObject.prototype.getWidth = function(){
  return window.innerWidth
}

GameObject.prototype.getHeight = function(){
  return window.innerHeight
}

GameObject.prototype.onWindowResize = function() {
  this.camera.aspect = this.getWidth() / this.getHeight()
  this.camera.updateProjectionMatrix();
  this.effect.setSize( this.getWidth(), this.getHeight() );
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
