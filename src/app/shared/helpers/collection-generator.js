"use strict";
exports.__esModule = true;
var faker_1 = require("faker");
function fakeCollectionGen(length, model) {
    var i = 1;
    var records = [];
    while (i <= length) {
        var record = {};
        for (var key in model) {
            if (model.hasOwnProperty(key)) {
                if (Array.isArray(model[key]))
                    record[key] = model[key];
                else
                    record[key] = faker_1.fake("{{" + model[key] + "}}");
            }
        }
        record['id'] = i;
        records.push(record);
        i++;
    }
    return records;
}
exports.fakeCollectionGen = fakeCollectionGen;
