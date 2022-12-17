// Fetch wrapper
// TODO remove unneeded feats
export const request = async (resource, method = 'GET', data = null) => {
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
}
