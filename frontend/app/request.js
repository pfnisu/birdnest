// Utility methods for data
export let request = {
    // Get/set cookie value for a key
    cookie: (key, value = null) => {
        let match = ['', value]
        if (value !== null) document.cookie = `${key}=${value}; SameSite=Strict`
        else match = document.cookie.match(new RegExp(`${key}=([\\d]+)`))
        return match?.length > 1 ? match[1] : null
    },
    // Fetch wrapper
    // TODO remove unneeded feats
    http: async (resource, method = 'GET', data = null) => {
        try {
            let resp = await fetch(resource, {
                method: method,
                headers: { 'Content-type': 'application/json' },
                body: data && JSON.stringify(data)
            })
            // Parse as json if expected, else return bool
            if (resp.ok && resp.status != 204 &&
                (method === 'GET' || method === 'POST')) return await resp.json()
            return resp.ok
        } catch(e) {
            console.log(`${method} request failed`)
        }
    },
}
