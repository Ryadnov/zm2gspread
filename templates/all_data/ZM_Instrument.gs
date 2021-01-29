/**
 * Latest version available at https://github.com/Ryadnov/zm2gspread/blob/main/templates/all_data/ZM_Instrument.gs
 * @version v1.0
 *
 * @info https://github.com/zenmoney/ZenPlugins/wiki/ZenMoney-API#instrument
 */

fullSyncHandlers.push(json => {
  if ('instrument' in json) {
    sheetHelper.WriteData('ZM_Instrument', json['instrument'].map(e => [
      e['id'],
      // e['changed'],
      e['title'],
      e['shortTitle'],
      e['symbol'],
      e['rate'],
    ]));
  }
});
