/**
 * Latest version available at https://github.com/Ryadnov/zm2gspread/blob/main/templates/all_data/ZM_Tag.gs
 * @version v1.0
 *
 * @info https://github.com/zenmoney/ZenPlugins/wiki/ZenMoney-API#tag
 */

fullSyncHandlers.push(json => {
  if ('tag' in json) {
    sheetHelper.WriteData('ZM_Tag', json['tag'].map(e => [
      e['id'],
      // e['changed'],
      // e['user'],
      e['parent'],
      e['title'],
      // e['icon'],
      // e['picture'],
      // e['color'],
      e['showIncome'],
      e['showOutcome'],
      e['budgetIncome'],
      e['budgetOutcome'],
      e['required']
    ]));
  }
});
