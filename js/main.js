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
console.log("hi " + CLIENT_ID);
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
    if ( document.URL.includes("tumor-board.html") ) {
      generateTumorBoardTables();
      listPatients();
    };
    if ( document.URL.includes("patient-record.html") ) {
      generatePatientList();
    };
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
  rowHTML += ("<th scope=\"row\" class=\"name\">" + "<img class=\"six-dots\" src=\"assets/six_dots.svg\"\/>" +lastName + ", " + firstName + "</th>");
  rowHTML += "<td>" + stage + "</td>";
  rowHTML += "<td>" + primaryProvider + "</td>";
  console.log("MRN: " + MRN);
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
// attach three dots and dropdown at the end (sorry bad code style..)
  if (needsDerm == "TRUE") {
    rowHTML += "<td><input type=\"checkbox\" name=\"derm\" id=" + MRN + " checked> <div class=\"dropdown\"> <button class=\"tb-dropdown\" id=\"tb-dropdown\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\"> <img class=\"three-dots\" src=\"assets/three_dots.svg\" /></button> <ul class=\"dropdown-menu dropdown-menu-end\" aria-labelledby=\"tb-dropdown\"> <li class=\"dropdown-row \"> <img class=\"dropdown-icon\" src=\"assets/edit.svg\"/> <a class=\"dropdown-item\">Edit Patient </a> </li> <li class=\"dropdown-row \"> <img class=\"dropdown-icon\" src=\"assets/arrow-up.svg\"/> <a class=\"dropdown-item\">Move to Top </a> </li> <li class=\"dropdown-row \"> <img class=\"dropdown-icon\" src=\"assets/delete-patient.svg\"/> <a class=\"dropdown-item\"> Remove Patient</a> </li> <li> <img class=\"dropdown-icon\" src=\"assets/calendar.svg\"/> <a class=\"dropdown-item\">Change Date </a> </li> </ul></div></td>"

  } else {
    rowHTML += "<td><input type=\"checkbox\" name=\"derm\" id=" + MRN + " checked> <div class=\"dropdown\"> <button class=\"tb-dropdown\" id=\"tb-dropdown\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\"> <img class=\"three-dots\" src=\"assets/three_dots.svg\" /></button> <ul class=\"dropdown-menu dropdown-menu-end\" aria-labelledby=\"tb-dropdown\"> <li class=\"dropdown-row \"> <img class=\"dropdown-icon\" src=\"assets/edit.svg\"/> <a class=\"dropdown-item\">Edit Patient </a> </li> <li class=\"dropdown-row \"> <img class=\"dropdown-icon\" src=\"assets/arrow-up.svg\"/> <a class=\"dropdown-item\">Move to Top </a> </li> <li class=\"dropdown-row \"> <img class=\"dropdown-icon\" src=\"assets/delete-patient.svg\"/> <a class=\"dropdown-item\"> Remove Patient</a> </li> <li> <img class=\"dropdown-icon\" src=\"assets/calendar.svg\"/> <a class=\"dropdown-item\">Change Date </a> </li> </ul></div></td>"
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


function generatePatientList(){
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'PatientData!A2:AK',
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];

      }
    } else {
    alert('No data found.');
    }
  }, function(response) {
    alert('Error: ' + response.result.error.message);
  });
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
          console.log('the checkbox changed to ' + this.checked);
          console.log('for the patient with MRN ' + this.id);
          console.log('for the department ' + this.name);
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

// add a change event listener
function updateCheck(MRN, isChecked, dept){
  console.log("updating: i got that the box status is: " + isChecked);

  // calculate what row has the MRN
  var body = {"values": [["=MATCH(" + MRN + ", PatientData!L:L, 0)"]]}
  gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'LookUp!A2',
    valueInputOption: 'USER_ENTERED',
    includeValuesInResponse: true,
    resource: body
  }).then((response) => {
   console.log("updated lookup sheet " + response.result.updatedData.values);
   
   // get which row needs to be updated
   var rowToUpdate = response.result.updatedData.values;
   
   // update the cell
   gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'PatientData!' + deptToCol(dept) + rowToUpdate,
    valueInputOption: 'USER_ENTERED',
    resource: {"values": [[isChecked]]}
    }).then((response) => {
      console.log("finished updating");
    });
  });
}


// ==================== Add New Patient Functions ====================

var t = "TX";
var n = "NX";
var m = "MX";

function updateT(tStage){
  this.t = tStage;
  getOverallStage();
}

function updateN(nStage){
  this.n = nStage;
  getOverallStage();
}

function updateM(mStage){
  this.m = mStage;
  getOverallStage();
}

function getOverallStage(){
  console.log(this.t+this.n+this.m);
  var body = {"values": [["=MATCH(\"" + this.t + this.n + this.m + "\", StagingGroups!B:B, 0)"]]}
  gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'LookUp!A3',
    valueInputOption: 'USER_ENTERED',
    includeValuesInResponse: true,
    resource: body
  }).then((response) => {
    console.log("updated lookup sheet " + response.result.updatedData.values);
   
    // get which row has the right group number
    var groupNumRow = response.result.updatedData.values;
    if (groupNumRow != "#N/A"){ 
      // get group number
      gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'StagingGroups!A' + groupNumRow + ":E" + groupNumRow
      }).then((response) => {
        var stageGroup = response.result.values[0][0];
        var survivalRate = response.result.values[0][2];
        var pathStage = response.result.values[0][3];
        var clinicalStage = response.result.values[0][4];
        console.log (stageGroup + survivalRate + pathStage);
        document.getElementById("overall-stage").classList.remove("stage-autofill");
        document.getElementById("overall-stage").innerHTML = clinicalStage;
        document.getElementById("survival-rate").classList.remove("stage-autofill");
        document.getElementById("survival-rate").innerHTML = survivalRate;
      }, function(response) {
        alert('Error: ' + response.result.error.message);
      });
    } else {
      document.getElementById("survival-rate").classList.add("stage-autofill");
      document.getElementById("overall-stage").classList.add("stage-autofill");
      document.getElementById("overall-stage").innerHTML = "NA";
      document.getElementById("survival-rate").innerHTML = "NA";
    }
  });
}


// for generating dermatologic history
// age, anatomical location, ulcerated, malignant, subtype, Breslow depth, positive lymph nodes, additional comments