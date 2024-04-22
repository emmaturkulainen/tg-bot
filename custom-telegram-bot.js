// configuration
var apiToken = "6073146578:AAGYrAdG6XBoX4cZhmFQrs-aiemsg7dSExw";
var appUrl = "https://script.google.com/macros/s/AKfycbz9-F834kPuYYmwlARdjG7wvUhhRsiF2VcV9b9_P9AnkSVUxTPkyrOlL4xqONji7qtH/exec";
var apiUrl = "https://api.telegram.org/bot" + apiToken;
var galleryId = '1KlE8sfNoem548c04eukQuoNanf0vpiRv';
//commands
var command = {
   "/start": {
      type: "text",
      text: "Tervetuloa käyttämään PhotoBottia! Lähetä botille kuvia jotka haluat näytettäväksi lauantain slideshowssa",
   },
};

//set webhook
function setWebhook() {
   var url = apiUrl + "/setWebhook?url=" + appUrl;
   var req = UrlFetchApp.fetch(url).getContentText();
   Logger.log(req);
}

//set webhook
function setWebhook() {
   var url = apiUrl + "/setWebhook?url=" + appUrl;
   var req = UrlFetchApp.fetch(url).getContentText();
   Logger.log(req);
}

//handle webhook
function doPost(e) {
   var webhookData = JSON.parse(e.postData.contents);
   var from = webhookData.message.from.id;
   var text = webhookData.message.text;

   if (typeof webhookData.message.photo !== "undefined") {
      var file = null;
      var sendType = "text";
      var photos = webhookData.message.photo;
      var fileId = photos[photos.length - 1].file_id;
      var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + apiToken + '/getFile?file_id=' + fileId);
      var fileJson = JSON.parse(response.getContentText());
      
      if (fileJson.ok) {
        var fileUrl = 'https://api.telegram.org/file/bot' + apiToken + '/' + fileJson.result.file_path;
        var file = UrlFetchApp.fetch(fileUrl).getBlob();
      }
      else{
        var file = null;
      }

      if (file) {
        var galleryId = '1KlE8sfNoem548c04eukQuoNanf0vpiRv';
        var gallery = DriveApp.getFolderById(galleryId);
        var image = gallery.createFile(file).setName(fileId + '.jpg');
        var caption = 'Jee jee kuva lisätty :)'
        var sendText = encodeURIComponent(caption);
      } 
      else {
        var sendText = encodeURIComponent("Kuvan lähetys ei onnistunut. Yritä uudelleen tai valitse toinen kuva");
      }
   } 
   else if (typeof webhookData.message.video !== "undefined") {
      var file = null;
      var sendType = "text";
      var video = webhookData.message.video;
      var fileId = video.file_id;
      var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + apiToken + '/getFile?file_id=' + fileId);
      var fileJson = JSON.parse(response.getContentText());
      
      if (fileJson.ok) {
        var fileUrl = 'https://api.telegram.org/file/bot' + apiToken + '/' + fileJson.result.file_path;
        var file = UrlFetchApp.fetch(fileUrl).getBlob();
      }
      else{
        var file = null;
      }

      if (file) {
        var galleryId = '1KlE8sfNoem548c04eukQuoNanf0vpiRv';
        var gallery = DriveApp.getFolderById(galleryId);
        var image = gallery.createFile(file).setName(fileId + '.jpg');
        var caption = 'Jee jee video lisätty :)'
        var sendText = encodeURIComponent(caption);
      } 
      else {
        var sendText = encodeURIComponent("Videon lähetys ei onnistunut. Yritä uudelleen tai valitse toinen kuva");
      }
   } 
   else if (typeof command[text] == "undefined") {
      var sendType = "text";
      var sendText = encodeURIComponent("Voit lähettää botille vain kuvatiedostoja");
   }
   else {
      if (command[text]["type"] == "text") {
         var sendType = "text";
         var sendText = encodeURIComponent(command[text]["text"]);
      } else {
         var sendType = "image";
         var sendText = encodeURIComponent(command[text]["text"]);
         var sendImageUrl = encodeURIComponent(command[text]["url"]);
      }
   }

   if (sendType == "text") {
      var url = apiUrl + "/sendMessage?parseMode=HTML&chat_id=" + from + "&text=" + sendText;
   } else {
      var url = apiUrl + "/sendPhoto?parseMode=HTML&chat_id=" + from + "&caption=" + sendText + "&photo=" + sendImageUrl;
   }

   var opts = { muteHttpExceptions: true };
   UrlFetchApp.fetch(url, opts).getContentText();
}