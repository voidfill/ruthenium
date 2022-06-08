// Settings type. Allows any string as a key
export type Settings = Record<string, any>;

// Make sure to add anything here that you'll be attaching to your client
// In the example below, client.config will now not show an error
// Remember that this is ONLY DECLARATIONS, meaning this is just so you dont get errors when compiling/writing
// You still need to do client.config = something somewhere in ur code
declare module "detritus-client/lib/commandclient" {
	interface CommandClient {
		config: Settings;
		reloadEvents: any;
		cmap: Map<string, any>;
		saveConfig: () => void;
	}
}
