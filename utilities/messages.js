var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json')
var doc = new GoogleSpreadsheet('1D7CvKvJ0o6Wy8ZxZx3Oj4RfwqUaVBs-ueWC6xWZ9-_8');
var acronym="";
var meaning="";
var know_more="";
var related_links="";
var eachRow=new Map();
var rowsval;


module.exports = function(graph_api){

  //Get messages sent to the bot by the user
  module._getMessages = function(req) {
    let msgs = [],
        data = req.body;
    // Make sure this is a page subscription
    if(data.object == 'page'){
      for(let pageEntry of data.entry){
        for(let messagingEvent of pageEntry.messaging){
          if(messagingEvent.message) msgs.push(messagingEvent);
        }
      }
    }
    return msgs;
  }

  //Handle received message
  module._handleMessage = function(message) {


    let senderID = message.sender.id;
      doc.useServiceAccountAuth(creds, function (err) {

          // Get all of the rows from the spreadsheet.
          doc.getRows(1, function (err, rows) {
              console.log("console message")
              rows.forEach(function (rowValue) {
                  eachRow.set(rowValue.acronym, rowValue.index)

                  rowsval=rows;
              })
          });
      });

      var incoming_message = message.message.text
      console.log(incoming_message)

      if(incoming_message.includes("Hey")){

          this._sendMessage(senderID, "Hello !! I am the Acronym Bot. Please type any term that you dont know off and I can help you get more information on it :) " );
      }

      else if(incoming_message.length > 0)
      {


          // if (incoming_message.includes("PSM")) {
          //     if (eachRow.has('PSM')) {
          //         console.log('item present in index ' + eachRow.get('PSM'))
          //         index = eachRow.get('PSM') - 1;
          //         acronym = rowsval[index].acronym;
          //         meaning = rowsval[index].meaning;
          //         know_more = rowsval[index].def;
          //         related_links = rowsval[index].more;
          //     }
                  if (eachRow.has(incoming_message)) {
                      console.log('item present in index ' + eachRow.get(incoming_message))
                      index = eachRow.get('PSM') - 1;
                      acronym = rowsval[index].acronym;
                      meaning = rowsval[index].meaning;
                      know_more = rowsval[index].def;
                      related_links = rowsval[index].more;

                      this._sendMessage(senderID, "I guess you want to know about " + incoming_message + ". I can help with you that :)" + incoming_message + " is " + meaning + ". " + know_more + " . You can read more about it in this link :  " + related_links);
                  }

          // } else if (incoming_message.includes("PDM")) {
          //     if (eachRow.has('PDM')) {
          //         console.log('item present in index ' + eachRow.get('PDM'))
          //         index = eachRow.get('PDM') - 1;
          //         acronym = rowsval[index].acronym;
          //         meaning = rowsval[index].meaning;
          //         know_more = rowsval[index].def;
          //         related_links = rowsval[index].more;
          //     }
          //     this._sendMessage(senderID, "I guess you want to know about " + incoming_message + ". I can help with you that :)" + incoming_message + " is " + meaning + ". " + know_more + " . You can read more about it in this link :  " + related_links);

          }


      else {
              this._sendMessage(senderID, "item not present");
          }
      

  }

  //Send message from the bot to the user
  module._sendMessage = function(recipientId, text) {
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: text,
            metadata: 'DEVELOPER_DEFINED_METADATA'
        }
    };
    graph_api._callSendAPI(messageData);
  }

  return module;

}
