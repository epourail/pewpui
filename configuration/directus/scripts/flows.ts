import { v4 as uuidv4 } from "uuid";
import { DirectusFlow, NestedPartial } from "@directus/sdk";

interface FlowConfig {
	name: string;
	description: string;
	trigger: string;
	color?: string;
	icon?: string;
}

interface TriggerConfig {
	type: string; // e.g., "action"
	scope: string[]; // e.g., ["items.create", "items.update", "items.delete"]
	collections: string[]; // e.g., ["area", "building", "facility"]
}

interface OperationOptions {
	url: string;
	headers: { header: string; value: string }[];
	body: string;
	method: string;
}

interface OperationsConfig {
	name: string;
	key: string;
	type: string;
	position_x: number;
	position_y: number;
	options: OperationOptions;
	resolve: any | null;
	reject: any | null;
}

const createDirectusFlow = (
	flowConfig: FlowConfig,
	triggerConfig: TriggerConfig,
	operations: OperationsConfig[] = []
): NestedPartial<DirectusFlow<any>> => {
	const flowId = uuidv4();

	const operationsConfig = operations.map((operation) => ({
		...operation,
		id: uuidv4(),
		flow: flowId,
	}));

	return {
		id: flowId,
		name: flowConfig.name,
		icon: flowConfig.icon,
		color: flowConfig.color || "#3399FF",
		description: flowConfig.description,
		status: "active",
		trigger: flowConfig.trigger,
		accountability: "all",
		options: {
			type: triggerConfig.type,
			scope: triggerConfig.scope,
			collections: triggerConfig.collections,
		},
		operation: operationsConfig[0]?.id,
		operations: operationsConfig,
	};
};

export {
	createDirectusFlow,
	FlowConfig,
	OperationsConfig,
	TriggerConfig,
	OperationOptions,
};