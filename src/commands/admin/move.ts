import { Context, ParsedArgs } from "detritus-client/lib/command";
import { Permissions } from "detritus-client/lib/constants";

import { BaseCommand } from "../BaseCommand";
import { CommandClient, Utils, Constants } from "detritus-client";

export const COMMAND_NAME = "move";

export default class MainCommand extends BaseCommand {
	constructor(client: CommandClient) {
		super(client, {
			name: COMMAND_NAME,
			permissionsClient: [Permissions.SEND_MESSAGES, Permissions.MANAGE_WEBHOOKS],
			permissions: [],
			metadata: {
				description: "move messages",
				examples: [COMMAND_NAME],
				type: "admin",
				usage: `${COMMAND_NAME}`,
				adminOnly: true,
			},
		});
		this.args = [
			{ default: 1, name: "amount", type: "number" },
			{ default: null, name: "channel", type: "string", required: true },
			{ default: false, name: "self", type: "bool" },
		];
	}

	async run(payload: Context, __args: ParsedArgs): Promise<any> {
		if (__args.channel.startsWith("<#")) {
			__args.channel = __args.channel.slice(2, -1);
		}

		console.log(__args);
		const channelTo = payload.guild?.channels.get("" + __args.channel);
		if (channelTo == null || !channelTo.isText) {
			return payload.reply(`Channel not found/not a text channel`);
		} else if (!channelTo.canManageWebhooks) {
			return payload.reply(`Unable to create webhooks in that channel`);
		}
		const webhook = await channelTo.createWebhook({
			name: "move",
			avatar: payload.message.author.avatarUrl,
		});
		const messages = await payload.channel?.messages;
	}
}
