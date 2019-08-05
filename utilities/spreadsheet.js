var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');

// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet('1D7CvKvJ0o6Wy8ZxZx3Oj4RfwqUaVBs-ueWC6xWZ9-_8');


// Authenticate with the Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function (err) {

    // Get all of the rows from the spreadsheet.
    doc.getRows(1, function (err, rows) {
        //console.log(rows);


         var eachRow = new Map();
        //
         rows.forEach(function (rowValue) {
             eachRow.set(rowValue.acronym, rowValue.index)
         })


        // var eachRow = rows.map(rowValue => rowValue.acronym, );
        //
        // console.log(eachRow)


        if(eachRow.has('PSM')){
            console.log('item present in index ' + eachRow.get('PSM'))
            console.log('Here is you r data' + rows[(eachRow.get('PSM'))-1].meaning)
        }
        else{
            console.log('item not present')
        }


        // console.log(rows[0].acronym);
         console.log(rows[0].meaning);
        // console.log(rows[0].def);
        // console.log(rows[0].more);

    });
});

