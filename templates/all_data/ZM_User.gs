/**
 * Latest version available at https://github.com/Ryadnov/zm2gspread/blob/main/templates/all_data/ZM_User.gs
 * @version v1.0
 *
 * @info https://github.com/zenmoney/ZenPlugins/wiki/ZenMoney-API#user
 */

fullSyncHandlers.push(json => {
  if ('user' in json) {
    sheetHelper.WriteData('ZM_User', json['user'].map(e => [
      e['id'],
      //e['changed'],
      e['login'],
      e['currency'],
      e['parent'],
    ]));
  }
});
