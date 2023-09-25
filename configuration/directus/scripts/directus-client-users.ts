import { createDirectus, authentication, rest, DirectusUser, readUser, createUser } from '@directus/sdk';
import dotenv from "dotenv";

dotenv.config();

class Main {
	static async main() {
		let cmsUrl = process.env.CMS_DIRECTUS_URL;
		console.log(`CMS DIRECTUS PUBLIC URL: ${cmsUrl}`);
		let adminEmail = process.env.CMS_DIRECTUS_ADMIN_EMAIL;
        console.log(`CMS DIRECTUS ADMIN EMAIL: ${adminEmail}`);
        let adminPwd = process.env.CMS_DIRECTUS_ADMIN_PASSWORD;
		console.log(`CMS DIRECTUS ADMIN PASSWORD: ${adminPwd?.substring(0,2)}...${adminPwd?.slice(-2)}`);
		let clientEmail = process.env.CMS_DIRECTUS_CLIENT_EMAIL;
        console.log(`CMS DIRECTUS CLIENT EMAIL: ${clientEmail}`);
		let clientPwd = process.env.CMS_DIRECTUS_CLIENT_PASSWORD;
		console.log(`CMS DIRECTUS CLIENT PASSWORD: ${clientPwd?.substring(0,2)}...${clientPwd?.slice(-2)}`);
		let clientToken = process.env.CMS_DIRECTUS_CLIENT_TOKEN;
		console.log(`CMS DIRECTUS CLIENT STATIC TOKEN: ${clientToken?.substring(0,2)}...${clientToken?.slice(-2)}`);

        const client = createDirectus<any>(<string>cmsUrl)
            .with(authentication('json'))
            .with(rest());

        await client.login(<string>adminEmail, <string>adminPwd);

        let foundUser = null;
        try{
            console.log(`[INFORMATION] Looking for user: ${clientEmail}`);
            foundUser = await client.request(
                readUser(<string>clientEmail)
            );
        } catch($error) { }

        if(foundUser != null) {
            console.log(`[INFORMATION] client found: ${foundUser.email}`);

        } else {
            console.log(`[INFORMATION] client not found: ${clientEmail}. Let's create it!`);
            try {
                const clientUser: DirectusUser = { 
                    email: <string>clientEmail,
                    password: <string>clientPwd,
                    token: <string>clientToken,
                    status: 'active'
                }
                let createUserResp = await client.request(
                    createUser(clientUser)
                );
                console.log(createUserResp);

            } catch($error) {
                console.log($error);
                throw $error;
            }
        }

        await client.logout();
	}
}

Main.main();