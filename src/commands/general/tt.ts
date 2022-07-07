import { CommandClient } from "detritus-client";
import { Permissions } from "detritus-client/lib/constants";
import { Context, ParsedArgs } from "detritus-client/lib/command";

import { BaseCommand } from "../BaseCommand";

export const COMMAND_NAME = "tt";

export default class MainCommand extends BaseCommand {
	constructor(client: CommandClient) {
		super(client, {
			name: COMMAND_NAME,
			permissionsClient: [
				Permissions.SEND_MESSAGES,
				Permissions.EMBED_LINKS,
			],
			permissions: [],
			metadata: {
				description: "get a video link to a tiktok",
				examples: [COMMAND_NAME],
				type: "extra",
				usage: `${COMMAND_NAME}`,
			},
		});
	}

	async run(payload: Context, __args: ParsedArgs): Promise<any> {
		if(payload.message.guild?.can(Permissions.MANAGE_MESSAGES)) {
			payload.message.delete();
		}
		return payload.message.reply(`https://tt-embed.com/?q=${__args[COMMAND_NAME]}`);
	}
}
