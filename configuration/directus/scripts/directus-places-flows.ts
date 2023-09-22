import { createDirectus, staticToken, rest, readFlows, createFlow, NestedPartial, DirectusFlow } from '@directus/sdk';
import dotenv from "dotenv";
import  { FlowConfig, OperationsConfig, TriggerConfig, createDirectusFlow } from './flows';

interface Place {
	id: string;
	name: string;
}

interface Schema {
	places: Place[];
}

dotenv.config();

class Main {
	static buildDirectusFlowName(collection: string, action: string){
		return `${collection}-${action}-event`;
	}

	static buildDirectusFlow (collection: string, action: string, webhookUrl: string) {
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

	static async main(){

		const flowActions = [
			"create", 
			"update", 
			"delete"
		];
		
		let placesCollection = process.env.CMS_DIRECTUS_PLACES_COLLECTION ?? '';
		console.log(`CMS DIRECTUS PLACES COLLECTION: ${placesCollection}`);
		let cmsUrl = process.env.CMS_DIRECTUS_URL;
		console.log(`CMS DIRECTUS PUBLIC URL: ${cmsUrl}`);
		let permToken = process.env.CMS_DIRECTUS_PERMTOKEN;
		console.log(`CMS DIRECTUS USER STATIC TOKEN: ${permToken?.substring(0,2)}...${permToken?.slice(-2)}`);
		let webhookUrl = process.env.API_WEBHOOK_URL ?? '';
		console.log(`API WEBHOOK URL: ${webhookUrl}`);

		try{
			const client = createDirectus<Schema>(cmsUrl as string)
				.with(staticToken(process.env.CMS_DIRECTUS_PERMTOKEN as string))
				.with(rest());

			let flows = await client.request(
				readFlows({
					fields: ['id', 'name'],
				})
			);

			flowActions.forEach(async flowAction => {
				let flowName = Main.buildDirectusFlowName(placesCollection, flowAction);
				console.log(`[INFORMATION] Looking for flow: ${flowName}`);

				let foundEntry = flows.find((flow: { name: string; }) => {
					return flow.name == flowName;
				});

				if(foundEntry != null) {
					console.log(`[INFORMATION] flow found: ${flowName}`);
				} else {
					console.log(`[INFORMATION] flow not found: ${flowName}. Let's create it!`);
					let flow = Main.buildDirectusFlow(placesCollection, flowAction, webhookUrl);
					let responseCreateFlow = await client.request(createFlow(flow));
					console.log(responseCreateFlow);
					console.log(`[INFORMATION] flow created: ${flowName}`);
				}
			});
			
		} catch($error) {
			console.log($error);
			throw $error;
		}
	}
}

Main.main();