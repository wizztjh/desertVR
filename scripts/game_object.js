function GameObject(initObjs) {
  self = this

  this.SCREEN_WIDTH = window.innerWidth
  this.SCREEN_HEIGHT = window.innerHeight

  this.objects = {};

  this.scene = new THREE.Scene();
  this.scene.fog = new THREE.FogExp2( 0xffff99, 0.0075 );

  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize( this.SCREEN_WIDTH, this.SCREEN_HEIGHT );

  this.camera =  new THREE.PerspectiveCamera( 75, this.SCREEN_WIDTH / this.SCREEN_HEIGHT, 1, 20000 );
  this.camera.position.z = 0.0001;

  this.controls = new THREE.OrbitControls( this.camera );
  this.clock = new THREE.Clock(true)
  this.clock.start()

  Object.keys(initObjs).forEach(function(name){
    returnObject = initObjs[name].apply(self)
    self.add(name, returnObject);
  });
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

  this.renderer.render(this.scene, this.camera);
}

GameObject.prototype.find = function(name){
  return this.objects[name];
}

GameObject.prototype.findMesh = function(name){
  return this.objects[name].mesh;
}
