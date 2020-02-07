let exportse = module.exports = {};
const fetch = require('node-fetch');
exportse.fetchApi = (url, options) => {
    return fetch(url, options)
        .then(response => {
            if (response.status == 400)
                return Promise.reject(response);
            return response.json()
        })
};
exportse.fetchWithError = (url, options) => {
    return fetch(url, options)
        .then(response => {
            return response.json()
        })
};

exportse.fetchRaw = (url, options) => {
    return fetch(url, options)
        .then(response => {
            if (response.status == 400)
                return Promise.reject(response);
            return response.text()
        })
};


exportse.callApi = async (url, options = {}) => {
    let {
        json = true,
        params = {},
        method = 'GET',
        headers = {}
    } = options

    if (json) {
        headers = {
            ...headers,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    } else {
        if (method != 'GET' && options.body) {
            let formBody = new FormData();
            for (var key in options.body) {
                formBody.append(key, options.body[key]);
            }

            options.body = formBody;
        }
    }

    //  Add URL parameters
    const fullURL = new URL(`${url}`);
    Object.keys(params).forEach(key => fullURL.searchParams.append(key, params[key]))

    try {
        const response = await fetch(fullURL, {
            ...options,
            method,
            headers
        })

        const body = await response.json()

        return {
            status: response.status,
            body
        }
    } catch (e) {
        throw e.message
    }
}