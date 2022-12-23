// Utility methods for data
export let request = {
    // Get/set cookie value for a key
    cookie: (key, value = null) => {
        let match = ['', value]
        if (value !== null) document.cookie = `${key}=${value}; SameSite=Strict`
        else match = document.cookie.match(new RegExp(`${key}=([\\d]+)`))
        return match?.length > 1 ? match[1] : null
    },
    // Fetch as json, null on error
    http: async (resource, method = 'GET') => {
        try {
            let resp = await fetch(resource, {
                method: method,
                headers: { 'Content-type': 'application/json' },
            })
            if (resp.ok) return await resp.json()
        } catch(e) {
            return null
        }
    },
}
