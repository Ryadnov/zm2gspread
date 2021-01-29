/**
 * main.gs v1.0
 * Latest version available at https://github.com/Ryadnov/zm2gspread/blob/main/templates/export_like_web_csv/ExportLikeWebCSV.gs
 */

const ExportLikeWebCSV = (function () {
  const unixTimeToYYYYMMDDHHMMSS = unix_timestamp => {
    const d = new Date(unix_timestamp * 1000);

    return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).substr(-2) + '-' + ("0" + d.getDate()).substr(-2) + " "
      + d.getHours() + ':' + ("0" + d.getMinutes()).substr(-2) + ':' + ("0" + d.getSeconds()).substr(-2);
  }

  const prepareData = (json) => {
    const listName = "Export";
    const showHeader = true;

    if ('transaction' in json) {
      let categories = {};
      let categoriesParent = {};
      if ('tag' in json) {
        json['tag'].forEach(e => {
          categories[e['id']] = e['title'];
          categoriesParent[e['id']] = e['parent'];
        });
      }

      let instruments = {};
      if ('instrument' in json) {
        json['instrument'].forEach(e => instruments[e['id']] = e['shortTitle']);
      }

      let accounts = {};
      if ('account' in json) {
        json['account'].forEach(e => accounts[e['id']] = e['title']);
      }

      let merchants = {};
      if ('merchant' in json) {
        json['merchant'].forEach(e => merchants[e['id']] = e['title']);
      }

      sheetHelper.WriteData(
        listName,
        []
          .concat(showHeader ? [[
            "date",
            "categoryName",
            "payee",
            "comment",
            "outcomeAccountName",
            "outcome",
            "outcomeCurrencyShortTitle",
            "incomeAccountName",
            "income",
            "incomeCurrencyShortTitle",
            "createdDate",
            "changedDate",
          ]] : [])
          .concat(json['transaction'].filter(e => !e.deleted).map(e => [
            e['date'],
            e['tag'] === null ? "" : e['tag'].map(t => (categoriesParent[t] === null ? "" : categories[categoriesParent[t]] + " / ") + categories[t]).join(', '),
            e['payee'],
            e['comment'],
            e['outcome'] > 0 ? accounts[e['outcomeAccount']] : "",
            e['outcome'] > 0 ? e['outcome'] : "",
            e['outcome'] > 0 ? instruments[e['outcomeInstrument']] : "",
            e['income'] > 0 ? accounts[e['incomeAccount']] : "",
            e['income'] > 0 ? e['income'] : "",
            e['income'] > 0 ? instruments[e['incomeInstrument']] : "",
            unixTimeToYYYYMMDDHHMMSS(e['created']),
            unixTimeToYYYYMMDDHHMMSS(e['changed']),
          ]))
      );
    }
  }

  gsMenu.addItem("Sync export", 'ExportLikeWebCSV.DoSyncExport');

  fullSyncHandlers.push(prepareData);

  const o = {};
  o.DoSyncExport = function () {
    const json = zmData.RequestForceFetch([
      'tag',
      'instrument',
      'account',
      'merchant',
      'transaction',
    ]);

    prepareData(json);
  };

  return o;
})();
