var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json')
var doc = new GoogleSpreadsheet('1D7CvKvJ0o6Wy8ZxZx3Oj4RfwqUaVBs-ueWC6xWZ9-_8');
var msg="";


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
              console.log(rows);
              console.log(rows[0].value)
              msg=rows[0].value

          });
      });




    this._sendMessage(senderID, "Hello MJH!" + msg);
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
