// ------------------------ FRONT END ------------------------

// drag and drop table rows
// reference: https://bootsnipp.com/snippets/P2pn5
var fixHelperModified = function(e, tr) {
    var $originals = tr.children();
    var $helper = tr.clone();
    $helper.children().each(function(index) {
        $(this).width($originals.eq(index).width())
    });
    return $helper;
},
    updateIndex = function(e, ui) {
        $('td.index', ui.item.parent()).each(function (i) {
            $(this).html(i+1);
        });
        $('input[type=text]', ui.item.parent()).each(function (i) {
            $(this).val(i + 1);
        });
    };

$("#april-4th-table tbody").sortable({
    helper: fixHelperModified,
    stop: updateIndex
}).disableSelection();

    $("tbody").sortable({
    distance: 5,
    delay: 100,
    opacity: 0.6,
    cursor: 'move',
    update: function() {}
        });



// Data Picker Initialization
$('.datepicker').datepicker({
    inline: true
  });










// ------------------------ BACK END ------------------------

var CLIENT_ID = config.MY_CLIENT_ID;
var API_KEY = config.MY_API_KEY;
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";
var SHEET_ID = "1vZgO8rbWy5ns95FQ1I_MYlQ7iB3U_mee_FJ7WP_75l8";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
}).then(function () {
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    }, function(error) {
      appendPre(JSON.stringify(error, null, 2));
    });
  }

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    generateTumorBoardTables();
    listPatients();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function makeRowEditable(lastName, firstName, stage, primaryProvider, pathCode, radCode, needsMedOnc, needsRadOnc, needsSurgery, needsDerm, MRN) {
  var rowHTML = "<tr>";
  rowHTML += ("<th scope=\"row\">" +lastName + ", " + firstName + "</th>");
  rowHTML += "<td>" + stage + "</td>";
  rowHTML += "<td>" + primaryProvider + "</td>";
  console.log(MRN);
  if (pathCode != undefined) {
    rowHTML += "<td>" + pathCode + "</td>";
  } else {
    rowHTML += "<td> </td>";
  }
  if (radCode != undefined) {
    rowHTML += "<td>" + radCode + "</td>";
  } else {
    rowHTML += "<td> </td>";
  }
  if (needsMedOnc == "TRUE") {
    rowHTML += "<td><input type=\"checkbox\" name=\"medonc\" id=" + MRN + " checked></td>";
  } else {
    rowHTML += "<td><input type=\"checkbox\" name=\"medonc\" id=" + MRN + "></td>";
  }
  if (needsRadOnc == "TRUE") {
    rowHTML += "<td><input type=\"checkbox\" name=\"radonc\" id=" + MRN + " checked></td>";
  } else {
    rowHTML += "<td><input type=\"checkbox\" name=\"radonc\" id=" + MRN + "></td>";
  }
  if (needsSurgery == "TRUE") {
    rowHTML += "<td><input type=\"checkbox\" name=\"surg\" id=" + MRN + " checked></td>";
  } else {
    rowHTML += "<td><input type=\"checkbox\" name=\"surg\" id=" + MRN + "></td>";
  }
  if (needsDerm == "TRUE") {
    rowHTML += "<td><input type=\"checkbox\" name=\"derm\" id=" + MRN + " checked></td>";
  } else {
    rowHTML += "<td><input type=\"checkbox\" name=\"derm\" id=" + MRN + "></td>";
  }
  rowHTML += "</tr>";
  return rowHTML;
}

function deptToCol (department){
  if (department == "medonc"){
    return 'G';
  } else if (department == "radonc"){
    return 'H';
  } else if (department == "surg"){
    return 'I';
  } else if (department == "derm"){
    return 'J';
  } else {
    alert("couldn't find that department");
  }
}

function makeRowNotEditable(lastName, firstName, stage, primaryProvider, pathCode, radCode, needsMedOnc, needsRadOnc, needsSurgery, needsDerm, MRN) {
  var rowHTML = "<tr>";
  rowHTML += ("<th scope=\"row\">" +lastName + ", " + firstName + "</th>");
  rowHTML += "<td>" + stage + "</td>";
  rowHTML += "<td>" + primaryProvider + "</td>";
  console.log(pathCode);
  if (pathCode != undefined) {
    rowHTML += "<td>" + pathCode + "</td>";
  } else {
    rowHTML += "<td> </td>";
  }
  if (radCode != undefined) {
    rowHTML += "<td>" + radCode + "</td>";
  } else {
    rowHTML += "<td> </td>";
  }
  if (needsMedOnc == "TRUE") {
    rowHTML += "<td><img src=\"assets/checkbox.svg\"></td>";
  } else {
    rowHTML += "<td></td>";
  }
  if (needsRadOnc == "TRUE") {
    rowHTML += "<td><img src=\"assets/checkbox.svg\"></td>";
  } else {
    rowHTML += "<td></td>";
  }
  if (needsSurgery == "TRUE") {
    rowHTML += "<td><img src=\"assets/checkbox.svg\"></td>";
  } else {
    rowHTML += "<td></td>";
  }
  if (needsDerm == "TRUE") {
    rowHTML += "<td><img src=\"assets/checkbox.svg\"></td>";
  } else {
    rowHTML += "<td></td>";
  }
  rowHTML += "</tr>";
  return rowHTML;
}

function generateTumorBoardTables(){
  // generate all the needed tumor board tables
}

function listPatients() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'PatientData!A2:L',
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        if (row[10]=="04/04/2022"){
          document.getElementById('table-body-editable').innerHTML += makeRowEditable(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[11]);
        } else {
          document.getElementById('table-body-not-editable').innerHTML += makeRowNotEditable(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[11]);
        }
      }
      // add listener to all checkboxes
      var checkboxes = document.querySelectorAll('input[type=checkbox]');
      for(var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('change', function(checkbox){
          console.log(this.checked);
          console.log('the checkbox changed');
          console.log(this.name);
          updateCheck(this.id, this.checked, this.name);
        });
      }
    } else {
    alert('No data found.');
    }
  }, function(response) {
    alert('Error: ' + response.result.error.message);
  });
}

// get all checkboxes on tumor board page
var checkboxes = document.querySelectorAll('input[type=checkbox]');
console.log(checkboxes);

// add a change event listener
function updateCheck(MRN, isChecked, dept){
  console.log(isChecked);
  var body = {"values": [["=MATCH(" + MRN + ", PatientData!L:L, 0)"]]}
  gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'LookUp!A2',
    valueInputOption: 'USER_ENTERED',
    resource: body
  }).then((response) => {
   var result = response.result;
   console.log("added");
  });
  
  // get matched row
  var params = {spreadsheetId: SHEET_ID, range: 'LookUp!A2'};
  var request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(function(response) {
    console.log(response.result.values[0][0]);
    var rowToUpdate = response.result.values[0][0];
    console.log(rowToUpdate + dept);
    console.log(deptToCol(dept));

      // update correct cell
    gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: 'PatientData!' + deptToCol(dept) + rowToUpdate,
      valueInputOption: 'USER_ENTERED',
      resource: {"values": [[isChecked]]}
    }).then((response) => {
      console.log("updated");
    });
  });
}

