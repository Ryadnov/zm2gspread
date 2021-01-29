/**
 * Latest version available at https://github.com/Ryadnov/zm2gspread/blob/main/templates/all_data/ZM_Merchant.gs
 * @version v1.0
 *
 * @info https://github.com/zenmoney/ZenPlugins/wiki/ZenMoney-API#merchant
 */

fullSyncHandlers.push(json => {
  if ('merchant' in json) {
    sheetHelper.WriteData('ZM_Merchant', json['merchant'].map(e => [
      e['id'],
      // e['changed'],
      // e['user'],
      e['title'],
    ]));
  }
});
