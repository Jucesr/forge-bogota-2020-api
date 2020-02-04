
const path = require('path')
const express = require('express')
const fs = require('fs');
var bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 8000
const publicPath = path.join(__dirname,'..','public', 'v7')
const {auth} = require('./get_token')

app.use(express.static(publicPath))
app.use(bodyParser.json())

app.get('/token', (req, res) => {

  auth.authenticate().then(function(credentials){

  	//credentials.access_token
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(credentials))
    console.log('Token has been sent')
  });
})

app.post('/save', bodyParser.json(), (req, res) => {
  fs.writeFileSync(path.join(__dirname, 'db', 'data.json'), JSON.stringify(req.body));
  res.send('Se guardo');
  console.log('Se guardo')
})

app.get('/json', bodyParser.json(), (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'data.json')));
  res.send(data);
  console.log('Se envio el json')
})

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'))
})

app.listen(port, ()=> {
  console.log(`Server runing in ${port}`)
})
