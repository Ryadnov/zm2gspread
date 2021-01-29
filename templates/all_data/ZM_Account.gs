/**
 * Latest version available at https://github.com/Ryadnov/zm2gspread/blob/main/templates/all_data/ZM_Account.gs
 * @version v1.0
 *
 * @info https://github.com/zenmoney/ZenPlugins/wiki/ZenMoney-API#account
 */

fullSyncHandlers.push(json => {
  if ('account' in json) {
    sheetHelper.WriteData('ZM_Account', json['account'].map(e => [
      e['id'],
      // e['changed'],
      e['user'],
      e['role'],
      e['instrument'],
      e['company'],
      e['type'],
      e['title'],
      e['syncID'] === null ? "" : e['syncID'].join(', '),
      e['syncID'],
      e['balance'],
      e['startBalance'],
      e['creditLimit'],
      e['inBalance'],
      e['savings'],
      e['enableCorrection'],
      e['enableSMS'],
      e['archive'],
      e['capitalization'],
      e['percent'],
      e['startDate'],
      e['endDateOffset'],
      e['endDateOffsetInterval'],
      e['payoffStep'],
      e['payoffInterval'],
    ]));
  }
});
