import fetch from "node-fetch";

type HTTPMethod = "PUT" | "GET" | "DELETE" | "PATCH" | "POST";

export async function body_request(url: string, body: any, method: HTTPMethod, api_key?: string) {
    method = method || "POST";

    let fetch_spec:any = {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    };

    if (api_key) {
        fetch_spec.headers['api-key'] = api_key;
    }

    if (body) fetch_spec.body = JSON.stringify(body);

    let response = await fetch(url, fetch_spec);

    try {
        const output = await response.json();
        return [null, output];
    } catch (ex) {
        const output = null;
        return [ex, output];
    }
}


export async function url_request(url, params) {
    if (params) {
        url += "?" + new URLSearchParams(params).toString();
    }

    let response = await fetch(url);

    try {
        const output = await response.json();
        return [null, output];
    } catch (ex) {
        const output = null;
        return [ex, output];
    }
}