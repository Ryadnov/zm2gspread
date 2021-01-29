/**
 * Latest version available at https://github.com/Ryadnov/zm2gspread/blob/main/main.gs
 * @version v1.0
 */

const fullSyncHandlers = [];

const gsMenu = SpreadsheetApp.getUi()
  .createMenu((typeof paramMenuTitleMain !== 'undefined') ? paramMenuTitleMain : 'Zenmoney')
  .addItem((typeof paramMenuTitleFullSync !== 'undefined') ? paramMenuTitleFullSync : 'Full sync', 'doFullSync')
  .addSeparator();

function onOpen() {
  gsMenu.addToUi();
}

function doFullSync() {
  const json = zmData.RequestData();

  fullSyncHandlers.forEach(f => f(json));
}

const sheetHelper = (function () {
  const o = {};

  o.Get = function (sheetName) {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (sheet === null) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
      sheet.setName(sheetName);
    }

    return sheet;
  };

  o.GetRange = function (sheetName, range) {
    return o.Get(sheetName).getRange(range);
  };

  o.GetRangeValues = function (sheetName, range) {
    return o.GetRange(sheetName, range).getValues();
  };

  o.GetCellValue = function (sheetName, cell) {
    const values = o.GetRangeValues(sheetName, cell);

    return values[0][0];
  };

  o.WriteData = function (sheetName, data) {
    const sheet = o.Get(sheetName);
    sheet.clearContents();
    sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  };

  return o;
})();

const zmDataParams = {
  token: sheetHelper.GetCellValue(
    (typeof paramListNameSettins !== 'undefined') ? paramListNameSettins : 'Settings',
    (typeof paramSettinsTokenCell !== 'undefined') ? paramSettinsTokenCell : 'B1'
  ),
};

const zmData = (function (p) {
  function currentTimestamp() {
    return Math.round((new Date()).getTime() / 1000);
  }

  const o = {};

  o.Request = function (data) {
    try {
      const params = {
        'method': 'post',
        'contentType': 'application/json',
        'headers': {
          'Authorization': 'Bearer ' + (p.hasOwnProperty('token') ? p.token : ""),
        },
        'payload': JSON.stringify(data)
      };
      const res = UrlFetchApp.fetch("https://api.zenmoney.ru/v8/diff/", params);
      const content = res.getContentText();
      const json = JSON.parse(content);

      return json;
    } catch (err) {
      Logger.log("Error getting data");
      Logger.log(err);

      return {};
    }
  };

  o.RequestData = function () {
    const ts = currentTimestamp();
    var json = o.Request({
      'currentClientTimestamp': ts,
      'serverTimestamp': 0,
    });

    return json;
  };

  o.RequestForceFetch = function (items) {
    const ts = currentTimestamp();
    var json = o.Request({
      'currentClientTimestamp': ts,
      'serverTimestamp': ts,
      'forceFetch': items,
    });

    return json;
  };

  return o;
})(zmDataParams || {});
