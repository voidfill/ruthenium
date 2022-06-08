import { CommandClient } from "detritus-client";
import { Permissions } from "detritus-client/lib/constants";

import { Context, ParsedArgs } from "detritus-client/lib/command";
import { BaseCommand } from "../BaseCommand";

export const COMMAND_NAME = "reactable";

interface reactionEvent {
	messageId: string;
	userId: string;
	reaction: any;
}

const pages = ["page 1", "page 2", "heres a text for page 3??", "last page"];

export default class MainCommand extends BaseCommand {
	constructor(client: CommandClient) {
		super(client, {
			name: COMMAND_NAME,
			permissionsClient: [
				Permissions.SEND_MESSAGES,
				Permissions.ADD_REACTIONS,
				Permissions.MANAGE_MESSAGES,
			],
			permissions: [],
			metadata: {
				description: "react Command",
				examples: [COMMAND_NAME],
				type: "admin",
				adminOnly: true,
				usage: `${COMMAND_NAME}`,
			},
		});
	}

	async run(payload: Context, __args: ParsedArgs): Promise<any> {
		const message = payload.message;
		const newM = await message.reply("react please");
		let counter = -1;

		const reactionCallback = async ({ messageId, userId, reaction }: reactionEvent) => {
			if (newM.id != messageId || message.author.id != userId) return;
			switch (reaction.emoji.name) {
				case "❎":
					newM.delete();
					message.client.removeListener("messageReactionAdd", reactionCallback);
					break;
				case "⬅️":
					counter--;
					if (counter < 0) counter = 3;
					newM.edit(pages[counter]);
					newM.reactions.cache.get("⬅️")?.delete(message.author.id);
					break;
				case "➡️":
					counter++;
					if (counter > 3) counter = 0;
					newM.edit(pages[counter]);
					newM.reactions.cache.get("➡️")?.delete(message.author.id);
					break;
			}
		};
		message.client.addListener("messageReactionAdd", reactionCallback);

		await newM.react("❎");
		await newM.react("⬅️");
		await newM.react("➡️");
	}
}
