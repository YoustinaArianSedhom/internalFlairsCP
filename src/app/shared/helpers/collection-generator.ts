import { fake } from 'faker';

export function fakeCollectionGen(length: number, model: any) {
    let i = 1;
    const records = [];
    while (i <= length) {
        const record: any = {};
        for (const key in model) {
            if (model.hasOwnProperty(key)) {
                if (Array.isArray(model[key])) record[key] = model[key];
                else record[key] = fake(`{{${model[key]}}}`);

            }
        }
        record['id'] = i;
        records.push(record);
        i++;
    }
    return records;
}
