// Build querystring from passed object of params
export function buildQueryString(params: {[key: string]: any}) {
    let queryString = '?';
    for (const key in params) {
        if (params[key] != null || params[key] === 0) {
            queryString += `${key}=${params[key]}&`;
        }

    }
    // Empty string incase of there're no params
    if (queryString.length === 1) return queryString.slice(0, 1);
    return queryString;
}
