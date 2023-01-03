import * as fs from "fs";
import { PluginInstance } from "../PluginInstance";

export async function constructEnvFromJson(db: any, hasuraPort: any) {
	const keys: any = {
		HASURA_GRAPHQL_DB_NAME: db.db_name,
		HASURA_GRAPHQL_METADATA_DATABASE_URL: `postgresql://${db.username}:${db.password}@host.docker.internal:${db.port}/${db.db_name}`,
		HASURA_GRAPHQL_ADMIN_SECRET: "admin-secret",
		HASURA_GRAPHQL_URL: `http://localhost:${hasuraPort}`,
		HASURA_GRAPHQL_JWT_SECRET: "{\\\"type\\\": \\\"HS256\\\", \\\"key\\\": \\\"ThisShouldBeAtLeast32CharacterLong\\\"}",
		HASURA_GRAPHQL_UNAUTHORIZED_ROLE: "guest",
		HASURA_GRAPHQL_LOG_LEVEL: "DEBUG",
		HASURA_GRAPHQL_ENABLE_CONSOLE: "true",
		HASURA_GRAPHQL_CORS_DOMAIN: "*"
	};

	return keys;
}

export async function writeEnv(graphqlInstance: PluginInstance, db: any) {
	const path = `${graphqlInstance.getInstallationPath()}/.env`;
	const port = await graphqlInstance.getContainerController().getPortNumber();

	let env = "";
	const keys: any = await constructEnvFromJson(db, port);
	Object.keys(keys).map((key) => {
		env += `${key}="${keys[key]}"
`;
	});

	fs.writeFileSync(path, env);
}