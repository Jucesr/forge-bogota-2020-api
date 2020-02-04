// Content for 'my-awesome-extension.js'

function AddGeometry(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);

  // Preserve "this" reference when methods are invoked by event handlers.
  this.addItem = this.addItem.bind(this);
  this.count = 0;
}

AddGeometry.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
AddGeometry.prototype.constructor = AddGeometry;

AddGeometry.prototype.addItem = function() {
  // this.viewer.setNavigationLock(true);
  // var geom = new THREE.SphereGeometry(10, 8, 8);

  var addItem = (p1,p2) => {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3( p1.x, p1.y, p1.z ),
        new THREE.Vector3( p2.x, p2.y, p2.z )
    );
    var material = new THREE.LineBasicMaterial({ 
      color: 0xff000,
      linewidth: 50,
      opacity: 1.0
    });
    var line = new THREE.Line( geometry, material );
    // line.position.set(0, 0, 0);

    this.viewer.overlays.addMesh(line, 'custom-scene');
  }

  if(this.count == 0){
    addItem({
      x: 0,
      y: 0,
      z: 0
    },{
      x: 500,
      y: 0,
      z: 0
    });
  }else if(this.count == 1){
    addItem({
      x: 0,
      y: 20,
      z: 0
    },{
      x: 50,
      y: 20,
      z: 0
    })
  }else{
    addItem({
      x: 0,
      y: 50,
      z: 0
    },{
      x: 50,
      y: 0,
      z: 0
    })
  }

  this.count++;
  
};

AddGeometry.prototype.cleanItems = function() {
  this.viewer.setNavigationLock(false);
};

AddGeometry.prototype.load = function() {
  // alert('AddGeometry is loaded!');

  if (!this.viewer.overlays.hasScene('custom-scene')) {
    this.viewer.overlays.addScene('custom-scene');
  }

  this._lockBtn = document.getElementById('btn_add_item');
  this._lockBtn.addEventListener('click', this.addItem);

  this._unlockBtn = document.getElementById('btn_clean');
  this._unlockBtn.addEventListener('click', this.cleanItems);

  return true;
};

 AddGeometry.prototype.unload = function() {
  // alert('AddGeometry is now unloaded!');

  if (this._lockBtn) {
    this._lockBtn.removeEventListener('click', this.addItem);
    this._lockBtn = null;
  }

  if (this._unlockBtn) {
      this._unlockBtn.removeEventListener('click', this.cleanItems);
      this._unlockBtn = null;
  }

  return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('AddGeometry', AddGeometry);
