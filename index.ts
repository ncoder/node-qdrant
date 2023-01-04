import { body_request, url_request } from "./request.js";

const base_url = "http://localhost:6333/";

class QdrantResponse {
	err: any
	response: any
	constructor(response) {
		this.err = response[0];
		this.response = response[1];
	}
}

export class Qdrant {
	url: string
	api_key?: string
	constructor({ url, api_key }: {url?: string, api_key?: string}) {
		this.url = url || base_url;
		if(!this.url.endsWith("/")) {
			this.url += "/";
		}
		if(!this.url.startsWith("http")) {
			this.url = "https://" + this.url;
		}
		this.api_key = api_key;
	}

	async req(path, body, method) {
		let qdrant_url = this.url;
		let url = `${qdrant_url}${path}`;
		return new QdrantResponse(await body_request(url, body, method, this.api_key));
	}

	//DELETE http://localhost:6333/collections/{collection_name}
	async delete_collection(name: string) {
		return this.req(`collections/${name}`, null, 'DELETE');
	}

	//PUT http://localhost:6333/collections/{collection_name}
	async create_collection(name: string, body: any) {
		return this.req(`collections/${name}`, body, 'PUT');
	}

	//GET http://localhost:6333/collections/{collection_name}
	async get_collection(name: string) {
		return this.req(`collections/${name}`, null, 'GET');
	}

	//PUT http://localhost:6333/collections/{collection_name}/points
	async upload_points(name: string, points: any) {
		return this.req(`collections/${name}/points`, { points: points }, 'PUT');
	}
	//POST http://localhost:6333/collections/{collection_name}/points/search
	async search_collection(name: string, vector: any, k: number, ef: number, filter: any) {
		k = k || 5;
		ef = ef || 128;
		let query: any = {
			"params": {
				"hnsw_ef": ef
			},
			"vector": vector,
			"top": k
		};
		if (filter) query.filter = filter;
		return this.req(`collections/${name}/points/search`, query, 'POST');
	}
	//Same as search_collection but allows free-form query by the client
	async query_collection(name: string, query: any) {
		return this.req(`collections/${name}/points/search`, query, 'POST');
	}

	//retrieve the specific points by ids
	// ids as numbers don't work. you can't express the full i64 range in JSON
	async retrieve_points(name: string, ids: string[], with_payload?: boolean, with_vector?: boolean) {
		return this.req(`collections/${name}/points`, { ids, with_payload, with_vector }, 'POST');
	}

};

