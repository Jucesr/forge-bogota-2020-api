
var options = {
   env: 'AutodeskProduction',
   api: 'derivativeV2',
   getAccessToken: function(callback) {
      fetch('/token').then(res => {
        res.json().then(data => {
          callback(data.access_token, data.expires_in);
        });
      })
   }

};
// var documentId = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9yZ2Vfc2FtcGxlXzdkamQydGZkdmV0Zm9kcDZjdjhpaGV6Y2Zpd3hkc3dqL2FyY2EucnZ0';
//var documentId = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6aTMtbW9kZWxzL3BjMDEuZHdn';
var urn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6aTMtbW9kZWxzL3Nhbml0YXJ5LnBkZg';

Autodesk.Viewing.Initializer(options, () => {
   viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('MyViewerDiv'));
   viewer.start();
   var documentId = 'urn:' + urn;
   Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
 });

 function onDocumentLoadSuccess(doc) {
   // if a viewableId was specified, load that view, otherwise the default view
   // var viewables = (viewableId ? doc.getRoot().findByGuid(viewableId) : doc.getRoot().getDefaultGeometry());
   // var viewableDefault = doc.getRoot().getDefaultGeometry();
   // var viewables = doc.getRoot().findAllViewables();
   var viewables = doc.getRoot().search({'type':'geometry'});
   viewer.loadDocumentNode(doc, viewables[2]).then(i => {
     // any additional action here?
   });
 }

 function onDocumentLoadFailure(viewerErrorCode) {
   console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
 }

