import { CommandClient } from "detritus-client";
import { Permissions } from "detritus-client/lib/constants";
import { Context, ParsedArgs } from "detritus-client/lib/command";

import { BaseCommand } from "../BaseCommand";

export const COMMAND_NAME = "uptime";

export default class MainCommand extends BaseCommand {
	constructor(client: CommandClient) {
		super(client, {
			name: COMMAND_NAME,
			permissionsClient: [
				Permissions.SEND_MESSAGES,
				Permissions.EMBED_LINKS,
				Permissions.MANAGE_MESSAGES,
			],
			permissions: [],
			metadata: {
				description: "shows the uptime of the bot",
				examples: [COMMAND_NAME],
				type: "extra",
				usage: `${COMMAND_NAME}`,
			},
		});
	}

	async run(payload: Context, __args: ParsedArgs): Promise<any> {
		let t = process.uptime();
		const d = Math.floor(t / 86400);
		t -= d * 86400;
		const h = Math.floor(t / 3600);
		t -= h * 3600;
		const m = Math.floor(t / 60);
		t -= m * 60;
		const s = Math.floor(t);
		payload.message.reply("Uptime: " + (d > 0 ? d + " days, " : "") + (h > 0 ? h + " hours, " : "") + (m > 0 ? m + " minutes, " : "") + s + " seconds");
	}
}
