// TODO - insert your CLIENT_ID and CLIENT_SECRET
const CLIENT_ID = '7DjD2TfDVetfoDP6cv8IHezcFIwxDsWJ';
const CLIENT_SECRET = 'qV8yymbsmGGnP72a';

// TODO - Choose a bucket key - a unique name to assign to a bucket. It must be globally unique across all applications and
// regions, otherwise the call will fail. Possible values: -_.a-z0-9 (between 3-128 characters in
// length). Note that you cannot change a bucket key.
var BUCKET_KEY = 'forge_sample_' + CLIENT_ID.toLowerCase();

// TODO - Choose a filename - a key for the uploaded object
var FILE_NAME = 'arca.rvt';

// TODO - specify the full filename and path
var FILE_PATH = `/Users/Dell/Documents/Code/forge-api-nodejs-client/resources/models/rvt/${FILE_NAME}`

module.exports = {
  CLIENT_ID,
  CLIENT_SECRET,
  BUCKET_KEY,
  FILE_NAME,
  FILE_PATH
}
