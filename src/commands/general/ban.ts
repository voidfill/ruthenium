import { CommandClient, Utils, Constants } from "detritus-client";
import { Permissions } from "detritus-client/lib/constants";
import { Context, ParsedArgs } from "detritus-client/lib/command";
import { DiscordHTTPError } from "detritus-client-rest/lib/errors";

import { BaseCommand } from "../BaseCommand";

export const COMMAND_NAME = "ban";

export default class MainCommand extends BaseCommand {
	constructor(client: CommandClient) {
		super(client, {
			name: COMMAND_NAME,
			permissionsClient: [Permissions.SEND_MESSAGES, Permissions.BAN_MEMBERS],
			permissions: [Permissions.BAN_MEMBERS],
			metadata: {
				description: "Ban Command",
				examples: ["ban -u userid/mention -r reason -revoke"],
				type: "extra",
				usage: `${COMMAND_NAME} [-u <userid>]`,
			},
		});
		this.args = [
			{ default: "", name: "u", type: "string" },
			{ default: "", name: "r", type: "string" },
			{ default: false, name: "revoke", type: "bool" },
		];
	}

	async run(payload: Context, __args: ParsedArgs): Promise<any> {
		if (payload.channel?.isDm)
			return payload.message.reply(
				"This command can only be used in a guild! Heres how you would use it: " +
					this.metadata?.examples?.[1]
			);

		const { matches } = Utils.regex(
			Constants.DiscordRegexNames.TEXT_SNOWFLAKE,
			__args.u || __args.ban
		);
		__args.u = matches[0]?.matched;

		if (!__args.u) {
			return payload.message.reply(
				"You must specify a user to ban.\nExample usage: " + this.metadata?.examples?.[1]
			);
		}

		__args.r = __args.r || "No reason provided.";
		try {
			if (__args.revoke) {
				await payload.message.guild?.removeBan(__args.u, {
					reason: __args.r,
				});
				return payload.message.reply(
					"Unbanned <@" + __args.u + "> for " + __args.r
				);
			}

			await payload.message.guild?.createBan(__args.u, {
				reason: __args.r
			});
			return payload.message.reply(
				"Banned <@" + __args.u + "> for " + __args.r
			);
		} catch (e: any) {
			console.log(e);
			return payload.message.reply(e.raw.message || "something went wrong");
		}
	}
}
