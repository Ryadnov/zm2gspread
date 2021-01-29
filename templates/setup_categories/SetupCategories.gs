/**
 * main.gs v1.0
 * Latest version available at https://github.com/Ryadnov/zm2gspread/blob/main/templates/setup_categories/SetupCategories.gs
 *
 * @info https://github.com/zenmoney/ZenPlugins/wiki/ZenMoney-API#tag
 */

const SetupCategories = (function() {
  const listName = "Setup Categories"

  const prepareData = (json) => {
    const formatBool = x => x ? "TRUE" : "FALSE";
    const formatBoolRequired = x => x || x === null ? "TRUE" : "FALSE";

    if ('tag' in json) {
      const result = {};
      json['tag'].forEach(function (element) {
        result[element['title'] + "::::" + element['id']] = element;
      });

      const ordered = {};
      Object.keys(result).sort().forEach(function (key) {
        ordered[key] = result[key];
      });

      const data = [];
      for (let [key, element] of Object.entries(ordered)) {
        if (!element['parent']) {
          data.push([
            element['id'],
            element['parent'],
            element['title'],
            element['color'],
            element['icon'],

            formatBool(element['showIncome']),
            formatBool(element['showOutcome']),
            formatBool(element['budgetIncome']),
            formatBool(element['budgetOutcome']),
            formatBoolRequired(element['required']),
          ]);

          for (let [k, e] of Object.entries(ordered)) {
            if (e['parent'] == element['id']) {
              data.push([
                e['id'],
                e['parent'],
                e['title'],
                e['color'],
                e['icon'],

                formatBool(e['showIncome']),
                formatBool(e['showOutcome']),
                formatBool(e['budgetIncome']),
                formatBool(e['budgetOutcome']),
                formatBoolRequired(e['required']),
              ]);
            }
          }
        }
      }

      var sheet = sheetHelper.Get(listName);
      sheet.clearContents();
      sheet.clearFormats();
      sheet.getRange('F2:J').insertCheckboxes();

      const header = [
        "ID",
        "Parent ID",
        "Title",
        "Color",
        "Icon",
        "showIncome",
        "showOutcome",
        "budgetIncome",
        "budgetOutcome",
        "required",
      ];

      sheet.getRange(1, 1, 1, header.length).setValues([header]);

      if (data.length > 0) {
        sheet.getRange(2, 1, data.length, data[0].length).setValues(data)

        var i = 1;
        data.forEach(function (element) {
          ++i;
          if (element['3'] > 0) {
            let num = element['3'];
            num >>>= 0;
            const b = num & 0xFF;
            const g = (num & 0xFF00) >>> 8;
            const r = (num & 0xFF0000) >>> 16;

            const cell = sheet.getRange("D" + i);
            cell.setBackground("#" + Number(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).substring(1));
            cell.setValue("");
          }
        });
      }
    }
  }

  const subMenu = SpreadsheetApp.getUi().createMenu("Setup categories")
    .addItem("Load", "SetupCategories.DoLoad")
    .addItem("Save", "SetupCategories.DoUpdate");
  gsMenu.addSubMenu(subMenu);

  fullSyncHandlers.push(prepareData);

  const o  = {};

  o.DoLoad = function() {
    const json = zmData.RequestForceFetch([
      'tag',
    ]);

    prepareData(json);
  };

  o.DoUpdate = function() {
    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }

    const json = zmData.RequestForceFetch([
      'tag',
    ]);
    const tags = json['tag'];

    let newTags = [];

    const ts = Math.round((new Date()).getTime() / 1000);

    const range = sheetHelper.GetRange(listName, "A2:J");
    const values = range.getValues();

    for (var i = 0; i < values.length; i++) {
      const tagId = range.getCell(i+1, 1).getValue();
      let tag = {};
      let tagExist = false

      tags.forEach(function (element) {
        if (element['id'] == tagId) {
          tagExist = true;
          tag = element;
        }
      });

      if (tagExist) {
        const bg = range.getCell(i+1, 4).getBackground();
        if (bg == "#ffffff") {
          tag.color = null
        } else {
          let color = hexToRgb(bg);
          tag.color = (1 << 24) + (color.r << 16) + (color.g << 8) + (color.b << 0)
        }

        tag.parent = range.getCell(i+1, 2).getValue() === "" ? null : range.getCell(i+1, 2).getValue();
        tag.title = range.getCell(i+1, 3).getValue();
        tag.icon = range.getCell(i+1, 5).getValue();
        tag.showIncome = range.getCell(i+1, 6).getValue();
        tag.showOutcome = range.getCell(i+1, 7).getValue();
        tag.budgetIncome = range.getCell(i+1, 8).getValue();
        tag.budgetOutcome = range.getCell(i+1, 9).getValue();
        tag.required = range.getCell(i+1, 10).getValue();

        tag.changed = ts;

        newTags.push(tag);
      }
    }

    let data = {
      'currentClientTimestamp': ts,
      'serverTimestamp': ts
    };
    data['tag'] = newTags

    const result = zmData.Request(data);
    Logger.log(result);

    o.DoLoad();
  };

  return o;
})();
