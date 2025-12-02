import { algoliasearch } from "algoliasearch";

export type Config = {
    appId: string,
    apiKey: string
}

export type Params = {
    indexName: string,
    query: string,
    filters: string,
    aroundLatLng: string,
    aroundLatLngViaIP: boolean,
}

export type SearchIndexOptions = {
    config: Config,
    params: Params,
}

export async function searchIndex(options: SearchIndexOptions) {
    const client = algoliasearch(options.config.appId, options.config.apiKey)
    const result = await client.searchSingleIndex({
        indexName: options.params.indexName,
        searchParams: {
            query: options.params.query,
            filters: options.params.filters,
            aroundLatLng: options.params.aroundLatLng,
            aroundLatLngViaIP: options.params.aroundLatLngViaIP
        }
    })
    return result
}