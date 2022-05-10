// Client ID and API key from the Developer Console
var CLIENT_ID = config.MY_CLIENT_ID;
var API_KEY = config.MY_API_KEY;

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

var blankTable = "<tr><th>Name</th><th>Contact</th><th>Likes dogs?</th></tr>";

/**
 * On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
}).then(function () {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    }, function(error) {
      appendPre(JSON.stringify(error, null, 2));
    });
  }

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listContacts();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

function listContacts() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1vZgO8rbWy5ns95FQ1I_MYlQ7iB3U_mee_FJ7WP_75l8',
    range: 'Test!A2:C',
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
    for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        var likesDogs = "Doesn't like dogs";
        if (row[2] == "TRUE") { likesDogs =  "Likes Dogs"; }
        // appendPre(row[0] + ', ' + row[1] + ', ' + likesDogs);
        document.getElementById('sheet-data').innerHTML = document.getElementById('sheet-data').innerHTML + "<tr><td>" + row[0] + "</td><td>" + row[1] + "</td><td>" + likesDogs + "</td></tr>";
    }
    } else {
    appendPre('No data found.');
    }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });
}

function addContactToSheet() {
  var likesDogs = document.getElementById("likes-dogs").checked;
  var contactName = document.getElementById("contact-name").value;
  var contactNumber = document.getElementById("contact-number").value;
  var params = {
    spreadsheetId: '1vZgO8rbWy5ns95FQ1I_MYlQ7iB3U_mee_FJ7WP_75l8',
    range: 'Test!A2:B11',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
  };

  var valueRangeBody = {
    "majorDimension": "rows",
    "values": [[contactName, contactNumber, likesDogs]]
  };

  var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
  request.then(function(response) {
    document.getElementById('sheet-data').innerHTML = "<tr><th>Name</th><th>Contact</th><th>Likes dogs?</th></tr>";
    listContacts();
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}

function updateContact(){
  var updateRow = String((parseInt(document.getElementById("update-row").value) + 1));
  console.log(updateRow);
  console.log('Test!A' + updateRow);
  var likesDogsEdit = document.getElementById("likes-dogs-edit").checked;
  var contactNameEdit = document.getElementById("contact-name-edit").value;
  var contactNumberEdit = document.getElementById("contact-number-edit").value;
  var values = [[contactNameEdit, contactNumberEdit, likesDogsEdit]];
  var body = {
    values: values
  };
  gapi.client.sheets.spreadsheets.values.update({
     spreadsheetId: '1vZgO8rbWy5ns95FQ1I_MYlQ7iB3U_mee_FJ7WP_75l8',
     range: 'Test!A' + updateRow,
     valueInputOption: 'USER_ENTERED',
     resource: body
  }).then((response) => {
    var result = response.result;
    console.log(`${result.updatedCells} cells updated.`);
    document.getElementById('sheet-data').innerHTML = blankTable;
    listContacts();
  });
}
