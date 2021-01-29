/**
 * Latest version available at https://github.com/Ryadnov/zm2gspread/blob/main/templates/all_data/ZM_Transaction.gs
 * @version v1.0
 *
 * @info https://github.com/zenmoney/ZenPlugins/wiki/ZenMoney-API#transaction
 */

fullSyncHandlers.push(json => {
  if ('transaction' in json) {
    sheetHelper.WriteData('ZM_Transaction', json['transaction'].map(e => [
      e['id'],
      // e['changed'],
      e['created'],
      // e['user'],
      e['deleted'],
      e['hold'],

      e['incomeInstrument'],
      e['incomeAccount'],
      e['income'],
      e['outcomeInstrument'],
      e['outcomeAccount'],
      e['outcome'],

      e['tag'] === null ? "" : e['tag'].join(', '),
      e['merchant'],
      e['payee'],
      e['originalPayee'],
      e['comment'],

      e['date'],
      e['reminderMarker'],

      e['opIncome'],
      e['opIncomeInstrument'],
      e['opOutcome'],
      e['opOutcomeInstrument'],

      e['incomeBankID'],
      e['outcomeBankID'],
      e['latitude'],
      e['required'],
      e['qrCode'],
    ]));
  }
});
