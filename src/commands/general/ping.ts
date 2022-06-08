import { CommandClient } from "detritus-client";
import { Permissions } from "detritus-client/lib/constants";
import { Context, ParsedArgs } from "detritus-client/lib/command";

import { BaseCommand } from "../BaseCommand";

import { performance } from "perf_hooks";

export const COMMAND_NAME = "ping";

export default class MainCommand extends BaseCommand {
	constructor(client: CommandClient) {
		super(client, {
			name: COMMAND_NAME,
			permissionsClient: [Permissions.SEND_MESSAGES],
			permissions: [],
			metadata: {
				description: "Ping Command",
				examples: [COMMAND_NAME],
				type: "extra",
				usage: `${COMMAND_NAME}`,
			},
		});
	}

	async run(payload: Context, __args: ParsedArgs): Promise<any> {
		const message = payload.message;

		// This is your array of strings, usually known as args
		const args: string[] = __args[this.name].split(/ +/g);

		// Get the time now
		const before = performance.now();

		// Make a typing request
		// This is a substute for sending a
		// message and edititing said message
		await message.triggerTyping();

		// Calculate the trip length
		const total = performance.now() - before;

		// Replying to the message with pong!
		// This can be done with payload.reply('pong');
		// or message.channel.createMessage('pong');
		await message.reply(`Pong! (${total.toFixed(2)}ms)`);
	}
}
