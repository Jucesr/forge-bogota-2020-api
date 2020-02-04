var fs = require('fs');

var AuthClientTwoLegged = require('./auth/OAuth2TwoLegged');
var {CLIENT_ID, CLIENT_SECRET} = require('./config');

	// Initialize the 2-legged oauth2 client
	var oAuth2TwoLegged = new AuthClientTwoLegged(CLIENT_ID, CLIENT_SECRET,
		['data:write', 'data:read', 'bucket:read','bucket:update','bucket:create'], true);

module.exports = {
	auth: oAuth2TwoLegged
}
