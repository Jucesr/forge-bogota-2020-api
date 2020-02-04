var viewerApp;
  var options = {
      env: 'AutodeskProduction',
      api: 'derivativeV2',
          // TODO: for models uploaded to EMEA change this option to 'derivativeV2_EU'
      getAccessToken: function(onGetAccessToken) {
          let request = new XMLHttpRequest();
          let url = '/token';

          request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
              let response = JSON.parse(this.responseText);
              var accessToken = response.access_token;
              var expireTimeSeconds = response.expires_in;
              onGetAccessToken(accessToken, expireTimeSeconds);
            }
          }
          request.open("GET", url, true);
          request.send();
          
          // var accessToken = '<YOUR_APPLICATION_TOKEN>';
          // var expireTimeSeconds = 60 * 30;
          // onGetAccessToken(accessToken, expireTimeSeconds);
      }

  };
  var documentId = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6aTMtbW9kZWxzL3Nhbml0YXJ5LnBkZg';
  Autodesk.Viewing.Initializer(options, function onInitialized(){
      var config3d = {
        extensions: ['AddMeasureMarkup']
      };
      viewerApp = new Autodesk.Viewing.ViewingApplication('MyViewerDiv');
      viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D, config3d);
      viewerApp.loadDocument(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
  });

  function onDocumentLoadSuccess(doc) {

      // We could still make use of Document.getSubItemsWithProperties()
      // However, when using a ViewingApplication, we have access to the **bubble** attribute,
      // which references the root node of a graph that wraps each object from the Manifest JSON.
      var viewables = viewerApp.bubble.search({'type':'geometry'});
      if (viewables.length === 0) {
          console.error('Document contains no viewables.');
          return;
      }

      // Choose any of the avialble viewables
      viewerApp.selectItem(viewables[2].data, onItemLoadSuccess, onItemLoadFail);
  }

  function onDocumentLoadFailure(viewerErrorCode) {
      console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
  }

  function onItemLoadSuccess(viewer, item) {
      console.log('onItemLoadSuccess()!');
      console.log(viewer);
      console.log(item);

      // Congratulations! The viewer is now ready to be used.
      console.log('Viewers are equal: ' + (viewer === viewerApp.getCurrentViewer()));
  }

  function onItemLoadFail(errorCode) {
      console.error('onItemLoadFail() - errorCode:' + errorCode);
  }