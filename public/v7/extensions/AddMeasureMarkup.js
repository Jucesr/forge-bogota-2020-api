// Content for 'my-awesome-extension.js'

function AddMeasureMarkup(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);

  // Preserve "this" reference when methods are invoked by event handlers.
  this.saveJson = this.saveJson.bind(this);
  this.getJson = this.getJson.bind(this);
  this.count = 0;
}

AddMeasureMarkup.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
AddMeasureMarkup.prototype.constructor = AddMeasureMarkup;

AddMeasureMarkup.prototype.saveJson = function() {
  const measureExtension = this.viewer.getExtension('Autodesk.Measure');
  const data = measureExtension.measureToolbar.measureTool.getJson()

  fetch('/save',{
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(result => {
    alert(result);
  })
};

AddMeasureMarkup.prototype.getJson = function() {
  const measureExtension = this.viewer.getExtension('Autodesk.Measure');
  // const data = 

  fetch('/json').then(result => {
    return result.json();
    // console.log(result)
  }).then(body => {
    measureExtension.measureToolbar.measureTool.loadJson(body)
    console.log(body)
  })
};


AddMeasureMarkup.prototype.load = function() {
  alert('AddMeasureMarkup is loaded!');

  this._saveBtn = document.getElementById('btn_add_save');
  this._saveBtn.addEventListener('click', this.saveJson);

  this._loadBtn = document.getElementById('btn_load');
  this._loadBtn.addEventListener('click', this.getJson);

  return true;
};

 AddMeasureMarkup.prototype.unload = function() {
  alert('AddMeasureMarkup is now unloaded!');

  if (this._saveBtn) {
    this._saveBtn.removeEventListener('click', this.addItem);
    this._saveBtn = null;
  }

  if (this._loadBtn) {
      this._loadBtn.removeEventListener('click', this.getJson);
      this._loadBtn = null;
  }

  return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('AddMeasureMarkup', AddMeasureMarkup);
