import { FileInput } from 'ngx-material-file-input';

/**
 * 
 * @summary Copy properties of normal JS object to passed formData obj
 * 
 */
export function buildFormData(formData: FormData, data: object | File | any, name: string = ''): FormData {
    if (!isEmpty(data)) {
        // Incase of Obj or Array
        if (typeof data === 'object' && !(data instanceof FileInput) && !(data instanceof File) && data != null) {
            // console.log('key is ->', name, 'and his value is -> ', data, 'and type of it is', typeof data);
            for (const key of Object.keys(data)) {
                const value = data[key];
                buildFormData(formData, value, name ? name + '[' + key + ']' : key);
            }

            // Incase of File
        } else if ((data instanceof FileInput)) formData.append(name, data.files[0], data.files[0].name);
        else if ((data instanceof File)) formData.append(name, data, data.name);
        // Incase of normal key-value
        else formData.append(name, data);

    }


    return formData;
}

function isEmpty(value) {
    return (
        // null or undefined
        (value == null) ||

        // has length and it's zero
        (value.hasOwnProperty('length') && value.length === 0) ||

        // is an Object and has no keys
        (value.constructor === Object && Object.keys(value).length === 0)
    )
}
