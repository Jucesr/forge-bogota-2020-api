const ForgeSDK = require('forge-apis');
const {fetchApi} = require('../utils/api');

const getToken = async (client, secret) => {
   var oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(client, secret, [
      'data:read',
      'data:write',
      'data:create',
      'code:all'
   ], true);
   const credentials = await oAuth2TwoLegged.authenticate()
   return {credentials, oAuth2TwoLegged};
}

const createWorkItem = (body, token) => {
   return fetchApi('https://developer.api.autodesk.com/da/us-east/v3/workitems', {
       method: 'POST',
       body: JSON.stringify(body),
       headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
       }
   })
}

const getWorkItem = (workitem_id, token) => {
   return fetchApi(`https://developer.api.autodesk.com/da/us-east/v3/workitems/${workitem_id}`, {
       method: 'GET',
       headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
       }
   })
}

const postItem = (project_id, body, token) => {
   return fetchApi(`https://developer.api.autodesk.com/data/v1/projects/${project_id}/items`, {
       method: 'POST',
       body: JSON.stringify(body),
       headers: {
           'Content-Type': 'application/vnd.api+json',
           'Authorization': `Bearer ${token}`
       }
   })
}

const getItem = (url, token) => {
   return fetchApi(url, {
       method: 'GET',
       headers: {
           'Content-Type': 'application/vnd.api+json',
           'Authorization': `Bearer ${token}`
       }
   })
}

const getFolderContent = (project_id, folder_id, token) => {
   return fetchApi(`https://developer.api.autodesk.com/data/v1/projects/${project_id}/folders/${folder_id}/contents`, {
       method: 'GET',
       headers: {
           'Content-Type': 'application/vnd.api+json',
           'Authorization': `Bearer ${token}`
       }
   })
}

const postStorage = (projectId, filename, bim360_result_folder_id, oAuth2TwoLegged, credentials) => {
   const ProjectsApi = new ForgeSDK.ProjectsApi();
   return ProjectsApi.postStorage(projectId, {
      "jsonapi": { "version": "1.0" },
      "data": {
          "type": "objects",
          "attributes": {
              "name": filename
          },
          "relationships": {
              "target": {
                  "data": {
                      "type": "folders",
                      "id": bim360_result_folder_id
                  }
              }
          }
      }
  }, oAuth2TwoLegged, credentials)
}

module.exports = {
   createWorkItem,
   getWorkItem,
   postItem,
   getItem,
   getFolderContent,
   getToken,
   postStorage
}