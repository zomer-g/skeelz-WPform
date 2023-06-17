function splitHTMLText() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  var dataRange = sheet.getRange("C:C");
  var dataValues = dataRange.getValues();

  var allowedKeys = [
    "שם מלא",
    "דוא&quot;ל",
    "שם החברה",
    "מס&#39; עובדים בחברה",
    "במה החברה עוסקת?",
    "שם המשרה",
    "תיאור המשרה",
    "דרישות התפקיד",
    "שעות וימי פעילות",
    "מספר דרושים?",
    "יישומי מחשב נדרשים",
    "*יישומי מחשב נדרשים",
    "שפות נדרשות",
    "*שפות נדרשות",
    "האם לפרסם את השכר במודעה",
    "שכר",
    "האם לפרסם את השכר במודעה",
    "*האם לפרסם את השכר במודעה",
    "היקף המשרה",
    "*היקף המשרה",
    "מיקום המשרה",
    "*מיקום המשרה",
    "מיקום גיאוגרפי (ישוב)",
    "סוג העסקה",
    "*סוג העסקה",
    "(לשימוש פנימי) טלפון נייד",
    "מידע נוסף",
    "תאריך",
    "זמן"
  ];

  var targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet2");
  targetSheet.clearContents(); // Clear the existing contents of Sheet2

  var targetRange = targetSheet.getRange(1, 1, dataValues.length + 1, allowedKeys.length);

  // Set column headers on row 1
  for (var c = 0; c < allowedKeys.length; c++) {
    targetRange.getCell(1, c + 1).setValue(allowedKeys[c]);
  }

  for (var i = 0; i < dataValues.length; i++) {
    var htmlText = dataValues[i][0];

    if (htmlText && typeof htmlText === 'string') {
      var splitList = htmlText.split("<br>");

      // Process each object in the split list
      var processedList = splitList.map(function(object) {
        var keyValueArray = object.split(":");

        if (keyValueArray.length >= 2) {
          var key = keyValueArray[0].trim();
          var value = keyValueArray.slice(1).join(":").trim();

          // Check if the key is allowed
          if (allowedKeys.includes(key)) {
            // Decode HTML entities
            value = value.replace(/&#(\d+);|&quot;/g, function(match, dec) {
              if (dec) {
                return String.fromCharCode(dec);
              } else {
                return '"';
              }
            });

            // Remove HTML tags
            value = value.replace(/<[^>]+>/g, '');

            // Create key-value pair
            var keyValue = {};
            keyValue[key] = value;

            return keyValue;
          }
        }

        return object; // Return the object as is if no key-value pair is found or the key is not allowed
      });

      // Write the processed list to Sheet2
      for (var j = 0; j < processedList.length; j++) {
        var row = processedList[j];
        var column = 0;

        for (var key in row) {
          if (row.hasOwnProperty(key)) {
            var columnIndex = allowedKeys.indexOf(key);

            if (columnIndex !== -1) {
              targetRange.getCell(i + 2, columnIndex + 1).setValue(row[key]);
            }
          }
        }
      }
    }
  }
}
