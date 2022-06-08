import { CommandClient } from "detritus-client";
import { Permissions } from "detritus-client/lib/constants";
import { Command, Context, ParsedArgs } from "detritus-client/lib/command";

import { BaseCommand } from "../BaseCommand";

export const COMMAND_NAME = "help";

export default class MainCommand extends BaseCommand {
	constructor(client: CommandClient) {
		super(client, {
			name: COMMAND_NAME,
			permissionsClient: [Permissions.SEND_MESSAGES],
			permissions: [],
			metadata: {
				description: "Help Command",
				examples: [COMMAND_NAME, "help -c ping"],
				type: "extra",
				usage: `${COMMAND_NAME} [-c <command>]`,
			},
		});
		this.args = [{ default: "", name: "c", type: "string" }];
	}

	async run(payload: Context, __args: ParsedArgs): Promise<any> {
		__args.c ||= __args.help;
		if (__args.c) {
			const command: Command = payload.client.commandClient?.cmap.get(__args.c);
			if (command) {
				let string = Object.keys(command.metadata).reduce(
					(pre, next) => pre + `${next}: ${command.metadata[next]}\n`,
					""
				);
				if(command.argParser.args.length !== 0) {
					string += `args: ${command.argParser.args.map(a => a.name + "[" + a.type + "]").join(", ")}`;
				}
				return payload.reply(`${string}`);
			}
		}

		const string = payload.message.client.commandClient?.commands?.reduce(
			(pre, next) =>
				pre +
				`\n${next.name} - ${next.metadata.description} - type: ${
					next.metadata.type || "none"
				}`,
			""
		);
		payload.message.reply(string);
	}
}
