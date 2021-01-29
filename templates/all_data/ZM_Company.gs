/**
 * Latest version available at https://github.com/Ryadnov/zm2gspread/blob/main/templates/all_data/ZM_Company.gs
 * @version v1.0
 *
 * @info https://github.com/zenmoney/ZenPlugins/wiki/ZenMoney-API#company
 */

fullSyncHandlers.push(json => {
  if ('company' in json) {
    sheetHelper.WriteData('ZM_Company', json['company'].map(e => [
      e['id'],
      // e['changed'],
      e['title'],
      e['fullTitle'],
      e['www'],
      e['country'],
    ]));
  }
});
