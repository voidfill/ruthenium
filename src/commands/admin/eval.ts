import { Context, ParsedArgs } from "detritus-client/lib/command";
import { Permissions } from "detritus-client/lib/constants";
import { Message } from "detritus-client/lib/structures";

import { BaseCommand } from "../BaseCommand";
import { CommandClient, Utils, Constants } from "detritus-client";
import { inspect } from "util";

export const COMMAND_NAME = "eval";

export default class MainCommand extends BaseCommand {
	constructor(client: CommandClient) {
		super(client, {
			name: COMMAND_NAME,
			permissionsClient: [Permissions.SEND_MESSAGES],
			permissions: [],
			metadata: {
				description: "evaluate some garbage",
				examples: [COMMAND_NAME],
				type: "admin",
				usage: `${COMMAND_NAME}`,
				adminOnly: true,
			},
		});
		this.label = "code";
		this.args = [
			{ default: false, name: "noreply", type: "bool" },
			{ default: 100, name: "depth", type: "number" },
			{ default: false, name: "full", type: "bool" },
			{ default: false, name: "flat", type: "bool" },
		];
	}

	async run(payload: Context, __args: ParsedArgs): Promise<any> {
		const { matches } = Utils.regex(Constants.DiscordRegexNames.TEXT_CODEBLOCK, payload.message.content);
		if (matches.length) {
			__args.code = matches[0].text;
		}

		let language = "js";
		let message: String;
		let evalRet: any;
		if (__args.flat) {
			__args.depth = 0;
			__args.full = true;
		}
		try {
			evalRet = await Promise.resolve(eval(__args.code));
			message = inspect(
				evalRet,
				__args.full
					? {
							getters: true,
							depth: __args.depth,
							showHidden: true,
					  }
					: { depth: __args.depth }
			);
			language = "json";
		} catch (error: any) {
			message = error ? error.stack || error.message : error;
		}

		if(__args.noreply) {
			console.log(message);
			return;
		}

		if (message.constructor == Message.constructor && evalRet?.author?.id == payload.client.user?.id) {
			return;
		}

		message = message
			.replaceAll(payload.commandClient.config.ghost.userToken, "TOKEN")
			.replaceAll(payload.client.user?.email || "", "EMAIL")
			.replaceAll(payload.client.user?.phone || "", "PHONE");

		const max = 1990 - language.length;
		return message ? payload.reply(["```" + language, String(message).slice(0, max), "```"].join("\n")) : null;
	}
}
