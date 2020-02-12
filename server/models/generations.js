const mongoose = require('mongoose');

const ENTITY_NAME = 'GENERATION';

let Schema = new mongoose.Schema({
  name: String,
  lines: Object,
  families: Object,
  urn: String,
},{
  name: ENTITY_NAME,
  timestamps: true
});

module.exports = mongoose.model(ENTITY_NAME, Schema);

