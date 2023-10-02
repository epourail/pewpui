import {
	authentication,
	createDirectus,
	createPermissions,
	createRole,
	createUser,
	DirectusRole,
	DirectusUser,
	NestedPartial,
	readUsers,
	readRoles,
	updateRole,
	rest
} from '@directus/sdk';
import dotenv from "dotenv";

dotenv.config();

// Type for the actions of the permissions
type PermissionsAction = "create" | "read" | "update" | "delete" | "share";

class Main {
	// Define constants for admin environment variables
	static readonly CMS_URL: string = <string>process.env.CMS_DIRECTUS_URL;
	static readonly ADMIN_EMAIL: string = <string>process.env.CMS_DIRECTUS_ADMIN_EMAIL;
	static readonly ADMIN_PWD: string = <string>process.env.CMS_DIRECTUS_ADMIN_PASSWORD;
	// Define constants for user environment variables
	static readonly CLIENT_EMAIL: string = <string>process.env.CMS_DIRECTUS_CLIENT_EMAIL;
	static readonly CLIENT_PWD: string = <string>process.env.CMS_DIRECTUS_CLIENT_PASSWORD;
	static readonly CLIENT_TOKEN: string = <string>process.env.CMS_DIRECTUS_CLIENT_TOKEN;

	/***
	 * Log the .env variables
	 */
	static logEnvInfo() {
		console.log(`CMS DIRECTUS PUBLIC URL: ${Main.CMS_URL}`);
		console.log(`CMS DIRECTUS ADMIN EMAIL: ${Main.ADMIN_EMAIL}`);
		console.log(`CMS DIRECTUS CLIENT EMAIL: ${Main.CLIENT_EMAIL}`);
	}

	/***
	 * Find an user or not by his email in the Directus users collection
	 * @param client - Directus client
	 * @param email - Email of the user
	 */
	static async findUserByEmail(client: any, email: string): Promise<DirectusUser<any> | undefined> {
		try {
			const query = { filter: { email: { _eq: email } } }
			const users = await client.request(readUsers(query));
			if (users.length > 1) {
				throw new Error('Multiple user(s) found');
			}
			return users[0];

		} catch (error) {
			console.error('Failed to list user emails:', error);

		}
	}

	/***
 * @param client - Directus client
 * @param name - Name of the role
 */
	static async findRoleByName(client: any, name: string): Promise<DirectusRole<any> | undefined> {
		try {
			const query = { filter: { name: { _eq: name } } }
			const roles = await client.request(readRoles(query));
			if (roles.length > 1) {
				throw new Error('multiple role(s) found');
			}
			return roles[1];

		} catch (error) {
			console.error('Failed to fetch role:', error);

		}
	}

	/***
	 * If the user is not found, then we will create one and return it.
	 * @param client - Directus client
	 */
	static async createUserIfNotExist(client: any) {
		try {
			const foundUser = await Main.findUserByEmail(client, Main.CLIENT_EMAIL);
			if (foundUser) {
				console.log(`[INFO] Client found: ${foundUser.email}`);

			} else {
				console.log(`[INFO] Client with email: ${Main.CLIENT_EMAIL} not found. Let's create it!`);

				const clientUser: NestedPartial<DirectusUser<any>> = {
					first_name: "Places",
					last_name: "Client",
					email: Main.CLIENT_EMAIL,
					password: Main.CLIENT_PWD,
					token: Main.CLIENT_TOKEN,
					status: 'active'
				};

				return await client.request(createUser(clientUser));
			}

		} catch (error) {
			console.error(`[ERROR] Failed to create a new user`, error);
			throw error;

		}
	}

	/***
	 * If the role is not found, then we will create one and return it.
	 * @param client - Directus client
	 * @param roleName - The name of the role
	 * @param userId - The id of the user to add in the role
	 */
	static async createRoleIfNotExist(client: any, roleName: string, userId: string) {
		try {
			const foundRole = await Main.findRoleByName(client, roleName);
			if (foundRole) {
				console.log(`[INFO] Role found: ${foundRole.name}`);

			} else {
				console.log(`[INFO] Role with name: ${roleName} not found. Let's create it!`);

				const rolePayload: NestedPartial<DirectusRole<any>> = {
					"name": roleName,
					"app_access": false,
					"admin_access": false
				};

				const newRole = await client.request(createRole(rolePayload));
				await Main.addRolePermissions(client, newRole.id, "places");

				return newRole;
			}

		} catch (error) {
			console.error(`[ERROR] Failed to create a new role`, error);
			throw error;

		}
	}

	/***
	 * If the role is not found, then we will create one and return it.
	 * @param client - Directus client
	 * @param roleName - The name of the role
	 * @param userId - The id of the user to add in the role
	 */
	static async attachRoleToUser(client: any, roleId: string, userId: string) {
		try {
			const rolePayload: NestedPartial<DirectusRole<any>> = {
				"users": [userId]
			};

			const newRole = await client.request(updateRole(roleId, rolePayload));

		} catch (error) {
			console.error(`[ERROR] Failed to create a new role`, error);
			throw error;

		}
	}

	/***
	 * Create permissions on a collection for a role
	 * @param client - Directus client
	 * @param role - Id of the role
	 * @param collection - The collection name
	 */
	static async addRolePermissions(client: any, role: string, collection: string) {
		try {
			console.log("[INFO] Creating role permissions");
			const actions: PermissionsAction[] = ["create", "read", "update", "delete"];

			const permissions = actions.map(action => ({
				role,
				collection,
				action,
				fields: "*",
				permissions: {},
				validation: {}
			}));

			return await client.request(createPermissions(permissions));

		} catch (error) {
			console.error(`[ERROR] Failed to create permissions`, error);
			throw error;

		}
	}

	/***
	 * First create an user, if created it will attach a role to it
	 * @param client - Directus client
	 */
	static async createUserAndAttachRole(client: any) {
		try {
			const createdUser = await Main.createUserIfNotExist(client);
			if (createdUser) {
				const role = await Main.createRoleIfNotExist(client, "PLACES CONTRIBUTORS", createdUser.id);
				await Main.attachRoleToUser(client, role.id, createdUser.id);
			}

		} catch (error: any) {
			console.error("[ERROR] : Can't create the user and role: ", error);
			throw error;

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
			await Main.createUserAndAttachRole(client);
			await client.logout();

		} catch (error) {
			console.error(`[ERROR] Main function encountered an error`, error);

		}
	}
}

Main.main();