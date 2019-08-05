var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json')
var doc = new GoogleSpreadsheet('1D7CvKvJ0o6Wy8ZxZx3Oj4RfwqUaVBs-ueWC6xWZ9-_8');
var acronym="";
var meaning="";
var know_more="";
var related_links="";
var eachRow=new Map();
var rows;


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
              //console.log(rows);
              console.log("console message")
              //console.log(rows[0].acronym)
              //console.log(message)
              //console.log(message.message.text)
              // acronym =rows[0].acronym ;
              // meaning =rows[0].meaning ;
              // know_more =rows[0].def ;
              // related_links =rows[0].more ;



              rows.forEach(function (rowValue) {
                  eachRow.set(rowValue.acronym, rowValue.index)
              })
          });
      });

      var incoming_message = message.message.text

      //this._sendMessage(senderID, "Hello 111" + msg  + " I am the Acronym Bot. Please type any term that you dont know off and I can help you wth that " ) ;
      console.log(incoming_message)

      if(incoming_message.includes("Hey")){

          this._sendMessage(senderID, "Hello !! I am the Acronym Bot. Please type any term that you dont know off and I can help you get more information on it :) " );
      }

      else if (incoming_message.includes("PSM"))
      {

          console.log(eachRow)

          if(eachRow.has('PSM')){
              console.log('item present in index ' + eachRow.get('PSM'))
              //console.log('Here is you r data' + rows[(eachRow.get('PSM'))-1].meaning)

              index=parseInt(eachRow.get('PSM'))-1;
              acronym =rows[index].acronym ;
              meaning =rows[index].meaning ;
              know_more =rows[index].def ;
              related_links =rows[index].more ;
          }

          else{
              console.log('item not present')
          }

          this._sendMessage(senderID, "I guess you want to know about PSM. PSM is " + meaning + ".  " +know_more +  " . You can read more about it in this link :  "  + related_links);

      }

      // this._sendMessage(senderID, "Hello !! Message is not matching " );
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
