import { Context, ParsedArgs } from "detritus-client/lib/command";
import { Permissions } from "detritus-client/lib/constants";

import { BaseCommand } from "../BaseCommand";
import { CommandClient } from "detritus-client";

export const COMMAND_NAME = "source";

export default class MainCommand extends BaseCommand {
	constructor(client: CommandClient) {
		super(client, {
			name: COMMAND_NAME,
			permissionsClient: [Permissions.SEND_MESSAGES, Permissions.ADD_REACTIONS],
			permissions: [],
			metadata: {
				description: "Source Code Command",
				examples: [COMMAND_NAME],
				type: "extra",
				usage: `${COMMAND_NAME}`,
			},
		});
	}

	async run(payload: Context, __args: ParsedArgs): Promise<any> {
		await payload.message
			.reply(
				"Repo: <https://github.com/erwin1234777/detritus-example>\nLibrary: <https://detritusjs.com/>"
			)
			.catch(async (err) => {
				await payload.message.react("❎").catch(() => {
					/* Voided */
				});
				console.error(err);
			});
	}
}
