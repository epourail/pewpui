import { 
    authentication,
    createDirectus, 
    createCollection, 
    DirectusCollection, 
    NestedPartial, 
    readCollection,
    rest, 
} from '@directus/sdk';
import dotenv from "dotenv";

dotenv.config();

type CollectionWithFields = {
    fields : any[] // fields prop is not available through the sdk
}

type ExtendedCollection = NestedPartial<DirectusCollection<any>> & CollectionWithFields;

class Main {
	// Define constants for admin environment variables
	static readonly CMS_URL : string = <string> process.env.CMS_DIRECTUS_URL;
	static readonly ADMIN_EMAIL: string  = <string> process.env.CMS_DIRECTUS_ADMIN_EMAIL;
	static readonly ADMIN_PWD : string = <string> process.env.CMS_DIRECTUS_ADMIN_PASSWORD;
    // Define constants for the collection
    static readonly CMS_PLACES_COLLECTION : string = <string> process.env.CMS_DIRECTUS_PLACES_COLLECTION;

    /***
	 * Log the .env variables
	 */
	static logEnvInfo() {
		console.log(`CMS DIRECTUS PUBLIC URL: ${Main.CMS_URL}`);
		console.log(`CMS DIRECTUS ADMIN EMAIL: ${Main.ADMIN_EMAIL}`);
		console.log(`CMS DIRECTUS ADMIN PASSWORD: ${Main.ADMIN_PWD?.substring(0,2)}...${Main.ADMIN_PWD?.slice(-2)}`);
		console.log(`CMS DIRECTUS PLACES COLLECTION: ${Main.CMS_PLACES_COLLECTION}`);
	}

    static buildPlacesCollectionPayload(name: string) {
        const directusCollection: ExtendedCollection = {
            collection: name,
            schema: {
                name: name,
                schema: "directus",
                comment: ""
            },
            meta:  {
                collection: name,
                singleton: false,
                hidden: false,
                archive_app_filter: true,
                collapse: 'open',
                icon: null,
                note: null,
                display_template: null,
                translations: null,
                archive_value: null,
                archive_field: null,
                unarchive_value: null,
                sort_field: null,
                accountability: "all",
                color: null,
                item_duplication_fields: null,
                sort: null,
                group: null,
                preview_url: null
            },
            fields : [
                {
                    field: "id",
                    type: "uuid",
                    meta: {
                        hidden: true,
                        readonly: true,
                        interface: "input",
                        special: [
                            "uuid"
                        ]
                    },
                    schema: {
                        is_primary_key: true,
                        length: 36,
                        has_auto_increment: false
                    }
                },
                {
                    field: "date_created",
                    type: "timestamp",
                    meta: {
                        special: [
                            "date-created"
                        ],
                        interface: "datetime",
                        readonly: true,
                        hidden: true,
                        width: "half",
                        display: "datetime",
                        display_options: {
                            relative: true
                        }
                    },
                    schema: {}
                },
                {
                    field: "date_updated",
                    type: "timestamp",
                    meta: {
                        special: [
                            "date-updated"
                        ],
                        interface: "datetime",
                        readonly: true,
                        hidden: true,
                        width: "half",
                        display: "datetime",
                        display_options: {
                            relative: true
                        }
                    },
                    schema: {}
                },
                {
                    field: "name",
                    type: "string",
                    meta: {
                        interface: "input",
                        special: null,
                        required: true
                    },
                    collection: "test",
                    schema: {}
                },
                {
                    field: "coordinates",
                    type: "geometry.Point",
                    meta: {
                        interface: "map",
                        special: null,
                        options: {
                            defaultView: {
                                center: {
                                    lng: 1.3257630801804225,
                                    lat: 45.79738424968784
                                },
                                zoom: 3.515614070857044,
                                bearing: 0,
                                pitch: 0
                            },
                            geometryType: "Point"
                        }
                    },
                    schema: {}
                }
            ]
        };
        return directusCollection;
    }

    /***
	 * If the useful collection not exist, create it.
	 * @param client - Directus client
	 */
	static async createCollectionIfNotExist(client: any) {
		try {
			const foundCollection = await Main.getCollectionByName(client, Main.CMS_PLACES_COLLECTION);
			if (foundCollection) {
				console.log(`[INFO] collection found: ${foundCollection.collection}`);
			} else {
				console.log(`[INFO] collection not found: ${Main.CMS_PLACES_COLLECTION}. Let's create it!`);

				const directusCollection = Main.buildPlacesCollectionPayload(Main.CMS_PLACES_COLLECTION);
				let createCollectionResp = await client.request(
                    createCollection(directusCollection as Partial<DirectusCollection<any>>)
                );
                console.log(createCollectionResp);
			}

		} catch (error) {
			console.error(`[ERROR] Failed to create a new collection`);
            console.error(error);
			throw error;

		}
	}

    /***
	 * Find a Directus collection by a name
	 * @param client - Directus client
	 * @param email - Email of the user
	 */
	static async getCollectionByName(client: any, name: string) : Promise<DirectusCollection<any> | undefined> {
		try{
            console.log(`[INFO] Looking for collection: ${name}`);
            return client.request(
                readCollection(name)
            );
        } catch($error) { }
	}

    /***
	 * Main execution function
	 */
	static async main() {
        const client = createDirectus<any>(Main.CMS_URL)
            .with(authentication('json'))
            .with(rest());

        try {
			Main.logEnvInfo();

			await client.login(Main.ADMIN_EMAIL, Main.ADMIN_PWD);
			await Main.createCollectionIfNotExist(client);
	

		} catch (error: any) {
			console.error(`[ERROR] Main function encountered an error`, error);
            console.error(error.errors[0].extensions);

		} finally {
            await client.logout();
            
        }
	}
}

Main.main();