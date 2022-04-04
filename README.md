# node-qdrant

Javascript client library for the Qdrant vector search engine (https://qdrant.tech)

## Install

`npm install qdrant`

## Quick Start

Here is a basic example that creates a client connection and adds a new collection `pretty_colors` to Qdrant.  It assumes the Qdrant docker is running at localhost:6333

```javascript
import { Qdrant } from "../index.js"

const qdrant = new Qdrant("http://localhost:6333/");

const name = "pretty_colors";

//Create the new collection with the name and schema
const schema = {
	"name":name,
    "vector_size": 3,
    "distance": "Cosine"
};
let create_result = await qdrant.create_collection(name,schema);
console.log(create_result);

//Show the collection info as it exists in the Qdrant engine
let collection_result = await qdrant.get_collection(name);
console.log(collection_result);

//Upload some points
let points = [
    {
        "id": 1,
        "payload": {"color": "red"},
        "vector": [0.9, 0.1, 0.1]
    },
    {
        "id": 2,
        "payload": {"color": "green"},
        "vector": [0.1, 0.9, 0.1]
    },
    {
        "id": 3,
        "payload": {"color": "blue"},
        "vector": [0.1, 0.1, 0.9]
    },
]
let upload_result = await qdrant.upload_points(name,points);
console.log(upload_result);


//Search the closest color (k=1)
let purple = [0.9,0.1,0.9];
let search_result = await qdrant.search_collection(name,purple,1);
console.log(search_result);


//Delete the collection
let delete_result = await qdrant.delete_collection(name);
console.log(delete_result);
```

## Conventions

All requests use async/await and return a response as an array in the format `[err,data]`.

Always check for presence of err.  If err is null, then everything is fine and there should be data.

## Supported Operations

So far, the following are supported:

### `delete_collection(name)`

Deletes a collection with `name`

### `create_collection(name,body)`

Creates a new collection with `name` and the schema specified in `body`

### `get_collection(name)`

Gets the collection information for `name`

### `upload_points(name,points)`

Uploads vectors and payloads in `points` to the collection `name`

### `search_collection(name,vector,k,ef,filter)`

Searches the collection with a `vector`, to get the top `k` most similar points (default 5), using HNSW `ef` (default is 128), and an optional payload filter.