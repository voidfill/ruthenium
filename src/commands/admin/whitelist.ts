import { Context, ParsedArgs } from "detritus-client/lib/command";
import { Permissions } from "detritus-client/lib/constants";

import { BaseCommand } from "../BaseCommand";
import { CommandClient, Utils, Constants } from "detritus-client";
const fs = require("fs");

export const COMMAND_NAME = "whitelist";

export default class MainCommand extends BaseCommand {
	constructor(client: CommandClient) {
		super(client, {
			name: COMMAND_NAME,
			permissionsClient: [Permissions.SEND_MESSAGES],
			permissions: [],
			metadata: {
				description: "Add/Remove whitelisted people",
				examples: [COMMAND_NAME],
				type: "admin",
				usage: `${COMMAND_NAME}`,
				adminOnly: true,
			},
		});
		this.label = "code";
		this.args = [
			{ default: "", name: "add", type: "string" },
			{ default: "", name: "remove", type: "string" },
		];
	}

	async run(payload: Context, __args: ParsedArgs): Promise<any> {
		const {ghost, store} = payload.commandClient.config;

		if (__args.add) {
			const { matches } = Utils.regex(Constants.DiscordRegexNames.TEXT_SNOWFLAKE, __args.add);
			if (matches.length == 0) return this.run(payload, {});
			if(ghost.whitelist.includes(matches[0].matched)) return payload.reply("User is already whitelisted");
			ghost.whitelist.push(matches[0].matched);
			return payload.message.reply({
				content: `Added <@${matches[0].matched}> to the whitelist`,
				allowedMentions: {
					parse: [],
				},
			});
		}

		if (__args.remove) {
			const { matches } = Utils.regex(
				Constants.DiscordRegexNames.TEXT_SNOWFLAKE,
				__args.remove
			);
			if (matches.length == 0) return this.run(payload, {});
			let didRemove = false;
			store.whitelist = ghost.whitelist.filter((id: String) => {
				if(id == matches[0].matched) {
					didRemove = true;
					return false;
				}
				return true;
			});

			return payload.message.reply({
				content: didRemove
					? `Removed <@${matches[0].matched}> from the whitelist`
					: `Could not find <@${matches[0].matched}> in the whitelist`,
				allowedMentions: {
					parse: [],
				},
			});
		}
		return payload.message.reply({
			content: `Current Admins: ${ghost.whitelist.join(", ")}`,
			allowedMentions: {
				parse: [],
			},
		});
	}
}
