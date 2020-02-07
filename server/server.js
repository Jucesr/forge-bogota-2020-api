
require('dotenv').config()
const path = require('path')
const express = require('express')
const cors = require('cors');
const fs = require('fs');
var bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 8000
const publicPath = path.join(__dirname,'..','public', 'v7')
const uuidv1 = require('uuid/v1');

const {getFactor, sleep, convertObjToDesignAutomationFormat, objectToString} = require('./utils/business')
const {
  createWorkItem,
  getWorkItem,
  postItem,
  getItem,
  getFolderContent,
  postStorage,
  getToken 
} = require('./utils/forge')

// allow cross origin requests, configure to only allow requests from certain origins
app.use(cors());

app.use(express.static(publicPath))
app.use(bodyParser.json())

app.get('/token', async (req, res) => {
  const {
    AU_CLIENT_ID,
    AU_SECRET_ID,
  } = process.env

  const {
    credentials
  } = await getToken(AU_CLIENT_ID, AU_SECRET_ID)
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(credentials))
  console.log('Token has been sent')
})

app.post('/save', bodyParser.json(), (req, res) => {
  fs.writeFileSync(path.join(__dirname, 'db', 'data.json'), JSON.stringify(req.body, null, 2));
  res.send({
    message: 'Se guardo'
  });
  console.log('Se guardo')
})

app.get('/json', bodyParser.json(), (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'data.json')));
  res.send(data);
  console.log('Se envio el json')
})

app.post('/generate_model', async (req, res, next) => {

  const {
    DA_CLIENT_ID,
    DA_CLIENT_PASSWORD,
    AU_CLIENT_ID,
    AU_SECRET_ID,
    projectId, // AU 2019
    bim360_result_folder_id, //// AU2019/PLANS/MODELS/DA_RESULTS
    activityId
  } = process.env

  //  0. Convert Input JSON file to required format.

  const data = req.body;

  const factor = getFactor(data[0].measurementList[0])
  const parsedData = convertObjToDesignAutomationFormat(data ,factor)
  const bodyFormated = {
    walls: parsedData,
    floors: []
  }
  fs.writeFileSync(path.join(__dirname ,'db', 'data_design_automation.json'), JSON.stringify(bodyFormated, null, 2))
  
  //  1. Get token.

  const {
    credentials, oAuth2TwoLegged
  } = await getToken(AU_CLIENT_ID, AU_SECRET_ID)
  
  const {
    credentials: credentialsDA, oAuth2TwoLegged: oAuthDA
  } = await getToken(DA_CLIENT_ID, DA_CLIENT_PASSWORD)

  //  2. Get number of files to enum the last one

  // const folderContent = await getFolderContent(projectId, bim360_result_folder_id, credentials.access_token)
  const version = uuidv1();
  const filename = `ResultFile${version}.rvt`

  //  3. Create the storage 

  const {body: storage} = await postStorage(projectId, filename, bim360_result_folder_id, oAuth2TwoLegged, credentials)

  const object_id = storage.data.id.split("/")[1]

  //  4. Call Design Automation (Create work item)
  const inputJsonUrl = `data:application/json,${objectToString(bodyFormated)}`

  let workItem

  try {

      workItem = await createWorkItem({
          activityId: activityId,
          arguments: {
              inputFile: {
                  "url": `https://developer.api.autodesk.com/oss/v2/buckets/bogota2020walls/objects/inputFile.rvt`,
                  "Headers": {
                      "Authorization": `Bearer ${credentialsDA.access_token}`
                  }
              },

              sketchItInput: {
                  url: inputJsonUrl
              },

              result: {
                  "verb": "put",
                  "url": `https://developer.api.autodesk.com/oss/v2/buckets/wip.dm.prod/objects/${object_id}`,
                  "Headers": {
                      "Authorization": `Bearer ${credentials.access_token}`
                  }
              }
          }
      }, credentialsDA.access_token)

      
  } catch (error) {
      console.log(error)
  }

  

  //  5. Check status
  let status = workItem.status;
  do {
      //  Wait 2 seconds to call again
      await sleep(2000)
      const getKI = await getWorkItem(workItem.id, credentialsDA.access_token)
      status = getKI.status
  } while (status == 'pending' || status == 'inprogress');

  //  6. Convert to Fist Version
  let item ;

  try {
      item = await postItem(projectId, {
          "jsonapi": { "version": "1.0" },
          "data": {
              "type": "items",
              "attributes": {
                  "displayName": filename,
                  "extension": {
                      "type": "items:autodesk.bim360:File",
                      "version": "1.0"
                  }
              },
              "relationships": {
                  "tip": {
                      "data": {
                          "type": "versions", "id": "1"
                      }
                  },
                  "parent": {
                      "data": {
                          "type": "folders",
                          "id": bim360_result_folder_id
                      }
                  }
              }
          },
          "included": [
              {
                  "type": "versions",
                  "id": "1",
                  "attributes": {
                      "name": filename,
                      "extension": {
                          "type": "versions:autodesk.bim360:File",
                          "version": "1.0"
                      }
                  },
                  "relationships": {
                      "storage": {
                          "data": {
                              "type": "objects",
                              "id": `urn:adsk.objects:os.object:wip.dm.prod/${object_id}`
                          }
                      }
                  }
              }
          ]
      }, credentials.access_token)
  } catch (error) {
      console.log(error)
  }

  //  7. Check processing in BIM360

  const item_id = item.included[0].id
  const version_url = item.included[0].links.self.href

  //  8. Check status
  let status2 = 'Pending';
  do {
      //  Wait 2 seconds to call again
      await sleep(2000)
      const versionItem = await getItem(version_url, credentials.access_token)
      status2 = versionItem.data.attributes.extension.data.processState
  } while (status2 != 'PROCESSING_COMPLETE');

  // 9. Return URN
  
  let buff = new Buffer(item_id);
  let urn = `urn:${buff.toString('base64')}`;

  res.status(200).send({
      urn: urn
  });
  console.log(`Model created ${urn}`)

});

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'))
})

app.listen(port, ()=> {
  console.log(`Server runing in ${port}`)
})
