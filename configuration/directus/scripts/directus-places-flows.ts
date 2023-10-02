import {
	authentication,
	createDirectus,
	createFlow,
	DirectusFlow,
	NestedPartial,
	readFlows,
	rest,
} from '@directus/sdk';
import dotenv from "dotenv";
import {
	createDirectusFlow,
	FlowConfig,
	OperationsConfig,
	TriggerConfig,
} from './flows';

interface Place {
	id: string;
	name: string;
}

interface Schema {
	places: Place[];
}

dotenv.config();

class Main {
	// Define constants for admin environment variables
	static readonly CMS_URL: string = <string>process.env.CMS_DIRECTUS_URL;
	static readonly ADMIN_EMAIL: string = <string>process.env.CMS_DIRECTUS_ADMIN_EMAIL;
	static readonly ADMIN_PWD: string = <string>process.env.CMS_DIRECTUS_ADMIN_PASSWORD;
	// Define constants for user environment variables
	static readonly CMS_PLACES_COLLECTION: string = <string>process.env.CMS_DIRECTUS_PLACES_COLLECTION;
	static readonly API_WEBHOOK_URL: string = <string>process.env.API_WEBHOOK_URL;

	/***
	 * Log the .env variables
	 */
	static logEnvInfo() {
		console.log(`CMS DIRECTUS PUBLIC URL: ${Main.CMS_URL}`);
		console.log(`CMS DIRECTUS ADMIN EMAIL: ${Main.ADMIN_EMAIL}`);
		console.log(`CMS DIRECTUS PLACES COLLECTION: ${Main.CMS_PLACES_COLLECTION}`);
		console.log(`API WEBHOOK URL: ${Main.API_WEBHOOK_URL}`);
	}


	static buildDirectusFlowName(collection: string, action: string) {
		return `${collection}-${action}-event`;
	}

	static buildDirectusFlow(collection: string, action: string, webhookUrl: string) {
		const flowConfig: FlowConfig = {
			name: Main.buildDirectusFlowName(collection, action),
			description: Main.buildDirectusFlowName(collection, action),
			trigger: "event",
			icon: "bolt",
		};

		const triggerConfig: TriggerConfig = {
			type: "action",
			scope: [`items.${action}`],
			collections: [collection],
		};

		const operationsConfig: OperationsConfig[] = [{
			name: `webhook-${collection}-${action}`,
			key: `webhook-${collection}-${action}`,
			type: "request",
			position_x: 19,
			position_y: 1,
			options: {
				url: `${webhookUrl}/${action}`,
				headers: [
					{
						header: "Content-Type",
						value: "application/json",
					},
					{
						header: "Accept",
						value: "application/json",
					}
				],
				body: '{\n  "event-data": {{$trigger}}\n}',
				method: 'POST'
			},
			resolve: null,
			reject: null,
		}];

		const directusFlow: NestedPartial<DirectusFlow<any>> = createDirectusFlow(
			flowConfig,
			triggerConfig,
			operationsConfig
		);

		return directusFlow;
	}

	static async createFlowsIfNotExist(client: any) {

		const flowActions = [
			"create",
			"update",
			"delete"
		];

		try {

			let flows = await client.request(
				readFlows({
					fields: ['id', 'name'],
				})
			);

			flowActions.forEach(async flowAction => {
				const flowName = Main.buildDirectusFlowName(Main.CMS_PLACES_COLLECTION, flowAction);
				console.log(`[INFO] Looking for flow: ${flowName}`);

				const foundEntry = flows.find((flow: { name: string; }) => {
					return flow.name == flowName;
				});

				if (foundEntry != null) {
					console.log(`[INFO] flow found: ${flowName}`);

				} else {
					console.log(`[INFO] flow not found: ${flowName}. Let's create it!`);
					const flow = Main.buildDirectusFlow(Main.CMS_PLACES_COLLECTION, flowAction, Main.API_WEBHOOK_URL);
					const responseCreateFlow = await client.request(createFlow(flow));
					console.log(`[INFO] flow created: ${flowName}`);
				}
			});

		} catch ($error) {
			throw $error;

		}
	}

	/***
 * Main execution function
 */
	static async main() {
		try {
			Main.logEnvInfo();

			const client = createDirectus<any>(Main.CMS_URL)
				.with(authentication('json'))
				.with(rest());

			await client.login(Main.ADMIN_EMAIL, Main.ADMIN_PWD);
			await Main.createFlowsIfNotExist(client);
			await client.logout();

		} catch (error) {
			console.error(`[ERROR] Main function encountered an error`, error);

		}
	}
}

Main.main();