import { createDirectus, staticToken, rest, createCollection, DirectusCollection, NestedPartial, readCollection } from '@directus/sdk';
import dotenv from "dotenv";

type CollectionWithFields = {
    fields : any[] // fields prop is not available through the sdk
}

type ExtendedCollection = NestedPartial<DirectusCollection<any>> & CollectionWithFields;

dotenv.config();

class Main {
	static async main() {
		let cmsUrl = process.env.CMS_DIRECTUS_URL;
		console.log(`CMS DIRECTUS PUBLIC URL: ${cmsUrl}`);
		// let adminEmail = process.env.CMS_DIRECTUS_ADMIN_EMAIL;
        // console.log(`CMS DIRECTUS ADMIN EMAIL: ${adminEmail}`);
        // let adminPwd = process.env.CMS_DIRECTUS_ADMIN_PASSWORD;
		// console.log(`CMS DIRECTUS ADMIN PASSWORD: ${adminPwd?.substring(0,2)}...${adminPwd?.slice(-2)}`);
		let permToken = process.env.CMS_DIRECTUS_PERMTOKEN;
		console.log(`CMS DIRECTUS USER STATIC TOKEN: ${permToken?.substring(0,2)}...${permToken?.slice(-2)}`);

        let placesCollectionName = process.env.CMS_DIRECTUS_PLACES_COLLECTION ?? '';
		console.log(`CMS DIRECTUS PLACES COLLECTION: ${placesCollectionName}`);

        const client = createDirectus<any>(<string>cmsUrl)
            .with(staticToken(<string>process.env.CMS_DIRECTUS_PERMTOKEN))
            .with(rest());
    
        let foundCollection = null;
        try{
            console.log(`[INFORMATION] Looking for collection: ${placesCollectionName}`);
            foundCollection = await client.request(
                readCollection(<string>placesCollectionName)
            );
        } catch($error) { }

        if(foundCollection != null) {
            console.log(`[INFORMATION] collection found: ${foundCollection.collection}`);

        } else {
            console.log(`[INFORMATION] collection not found: ${placesCollectionName}. Let's create it!`);
            try {
                const directusCollection: ExtendedCollection = {
                    collection: placesCollectionName,
                    schema: {
                        name: placesCollectionName,
                        schema: "directus",
                        comment: ""
                    },
                    meta:  {
                        collection: placesCollectionName,
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

                let createCollectionResp = await client.request(
                    createCollection(directusCollection as Partial<DirectusCollection<any>>)
                );
                console.log(createCollectionResp);

            } catch($error) {
                console.log($error);
                throw $error;
            }
        }
	}
}

Main.main();