import { CommandClient, ShardClient } from "detritus-client";
import { readFileSync } from "fs";
import afterStart from "./afterStart";

const config = JSON.parse(readFileSync("./config.json", "utf8"));
const shard = new ShardClient(config.userToken);
const commandClient = new CommandClient(shard, {
	prefix: "..",
	isBot: false,
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
