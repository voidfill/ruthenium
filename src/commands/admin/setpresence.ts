import { Context, ParsedArgs } from "detritus-client/lib/command";
import { Permissions, GatewayOpCodes } from "detritus-client/lib/constants";

import { BaseCommand } from "../BaseCommand";
import { CommandClient, Utils, Constants } from "detritus-client";

import { PresenceActivity } from "detritus-client/lib/structures/presence";

export const COMMAND_NAME = "setpresence";

export default class MainCommand extends BaseCommand {
	constructor(client: CommandClient) {
		super(client, {
			name: COMMAND_NAME,
			permissionsClient: [Permissions.ADD_REACTIONS],
			permissions: [],
			metadata: {
				description: "Set the bots activity",
				examples: [COMMAND_NAME],
				type: "admin",
				usage: `${COMMAND_NAME}`,
				adminOnly: true,
			},
		});
		this.args = [
			{ default: 0, name: "type", type: "number" },
			{ default: "", name: "name", type: "string" },
			{ default: "", name: "status", type: "string" },
			{ default: "", name: "url", type: "string" },
			{ default: "", name: "details", type: "string" },
			{ default: "", name: "state", type: "string" },
			{ default: false, name: "sexo", type: "bool" },
		];
	}

	async run(payload: Context, __args: ParsedArgs): Promise<any> {
		if (__args.sexo) {
			payload.client.gateway.send(GatewayOpCodes.PRESENCE_UPDATE, {
				status: "online",
				since: null,
				afk: false,
				activities: [
					{
						name: "owo",
						type: 2,
						created_at: Date.now() - 1000,
						buttons: ["hi", "what"],
						details: "owo",
						state: "wat",
						metadata: {
							button_urls: ["https://discord.com", "https://youtube.com"],
						},
					},
				],
			});

			return;
		}

		let presence: any = {
			activity: {
				name: __args.name,
				type: __args.type,
			},
		};

		if (__args.url) presence.activity.url = __args.url;
		if (__args.details) presence.activity.details = __args.details;
		if (__args.state) presence.activity.state = __args.state;

		if (!__args.name || !__args.type) presence = {};
		if (__args.status) presence.status = __args.status;

		console.log(presence);
		payload.client.gateway.setPresence(presence);
		return await payload.message.react("✅");
	}
}
