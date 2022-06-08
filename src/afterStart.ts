import { CommandClient, ShardClient } from "detritus-client";
import { readFileSync, writeFileSync } from "fs";

export default function afterStart(shard: ShardClient, commandClient: CommandClient) {
	commandClient.reloadEvents = [];
	for (const name of Object.keys(commandClient.config)) {
		if (name.endsWith("SetArray")) {
			const setName = name.replace("SetArray", "");
			commandClient.config[setName] = new Set(commandClient.config[name]);
		}
	}

	commandClient.cmap = new Map();
	for (const command of commandClient.commands) {
		commandClient.cmap.set(command.name, command);
	}

	commandClient.saveConfig = () => {
		const c = commandClient.config;
		//delete c.default;
		for (const name of Object.keys(c)) {
			if (c[name] instanceof Set) {
				c[name + "SetArray"] = Array.from(c[name]);
				delete c[name];
			}
		}
		writeFileSync("./config.json", JSON.stringify(c, null, 2));

		const newConfig = JSON.parse(readFileSync("./config.json", "utf8"));
		commandClient.config = newConfig;

		for (const name of Object.keys(newConfig)) {
			if (name.endsWith("SetArray")) {
				const setName = name.replace("SetArray", "");
				commandClient.config[setName] = new Set(newConfig[name]);
			}
		}
	};
}
