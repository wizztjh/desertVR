function GameObject(initObjs) {
  self = this
  this.objects = {};
  this.scene = new THREE.Scene();
  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize( window.innerWidth, window.innerHeight );
  this.camera =  new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


  Object.keys(initObjs).forEach(function(name){

    self.add(name, initObjs[name]())

  });
}

GameObject.prototype.add = function(name, object){
  this.scene.add(object);
  this.objects[name] = object;
}

GameObject.prototype.render = function(){
  this.renderer.render(this.scene, this.camera);
}

GameObject.prototype.find = function(name){
  return this.objects[name];
}
