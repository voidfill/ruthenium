import { CommandClient, ShardClient } from "detritus-client";
import { make, Events } from "nests";
import { readFileSync, writeFileSync } from "fs";

import afterStart from "./afterStart";

const config = make(JSON.parse(readFileSync("./config.json", "utf8")));
const updateConfig = () => {
	try {
		writeFileSync("./config.json", JSON.stringify(config.ghost), "utf8");
	} catch (e) {
		console.log("Failed to save config file:", e);
	}
};

config.on(Events.SET, () => {
	updateConfig();
});
config.on(Events.DELETE, () => {
	updateConfig();
});
config.on(Events.UPDATE, () => {
	updateConfig();
});

const shard = new ShardClient(config.ghost.userToken, {
	gateway: {
		identifyProperties: {
			$browser: "Discord Client",
			$device: "Computer", //trole
			$os: "Windows",
			os: "Windows",
			browser: "Discord Client",
			release_channel: "ptb",
			client_version: "1.0.1017",
			os_version: "10.0.19043",
			os_arch: "x64",
			client_build_number: 143946,
		},
		intents: "",
	},
	isBot: false
});

const oldFunc = shard.gateway.getIdentifyData;
shard.gateway.getIdentifyData = () => {
	const data = oldFunc.call(shard.gateway);
	delete data.intents;
	return data;
}

const commandClient = new CommandClient(shard, {
	prefix: "..",
	isBot: false,
	useClusterClient: false
});
commandClient.config = config;

commandClient.addMultipleIn("commands", { subdirectories: true });

(async () => {
	await shard.run();
	await commandClient.run();
	afterStart(shard, commandClient);

	console.log("Successfully connected to Discord!");
	console.log(`Currently have ${shard.guilds.length} guilds in cache.`);
	shard.gateway.setPresence({
		activity: {
			name: "your mother cry",
			type: 2,
		},
		status: "dnd",
	});
})();
