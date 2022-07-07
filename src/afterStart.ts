import { CommandClient, ShardClient } from "detritus-client";

export default function afterStart(shard: ShardClient, commandClient: CommandClient) {
	commandClient.reloadEvents = [];

	commandClient.cmap = new Map();
	for (const command of commandClient.commands) {
		commandClient.cmap.set(command.name, command);
	}
}
