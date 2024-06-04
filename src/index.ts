import type { Serenity } from "@serenityjs/launcher";
import type { Plugin } from "@serenityjs/plugins";

import { Player, PlayerComponent } from "@serenityjs/world";
import { Bossbar } from "@serenityjs/server-ui"
import { BossEventColor } from "@serenityjs/protocol";
import { EntityIdentifier, EntityType } from "@serenityjs/entity";

// Declare the serenity instance
let serenity: Serenity;

/**
 * Fired when the plugin is started
 * @param serenity The serenity instance of the server
 * @param data The data of the plugin, such as the logger and config
 */
export function onStartup(api: Serenity, data: Plugin): void {
	// Get the logger of the plugin
	const { logger } = data;

	// Log that the plugin has been started
	logger.info("Plugin has been started!");

	// Set the serenity instance
	serenity = api;
}

export class DebugStatsComponent extends PlayerComponent {
	public static readonly identifier = "serenity:debug_stats";

	/**
	 * The bossbar that will be displayed to the player
	*/
	public readonly bossbar = new Bossbar(this.player, this.player.type.identifier, 1, BossEventColor.Red);

	/**
	 * Whether the bossbar is visible or not
	*/
	protected visible = false;

	/**
	 * Create a new instance of the DebugStatsComponent
	 * @param player The player that the component is attached to
	 */
	public constructor(player: Player) {
		super(player, DebugStatsComponent.identifier);
	}

	public onTick(): void {
		// Show the bossbar if it is not visible
		if (!this.visible) this.bossbar.show(this.player);

		// Update the bossbar information
		const ping = this.player.ping;
		const tps = serenity?.tps ?? 0;
		const memory = process.memoryUsage().heapUsed / 1024 / 1024;
		const entities = this.player.dimension.entities.size;
		const chunks = this.player.getComponent("minecraft:chunk_rendering").chunks.size;
		
		// Set the title of the bossbar
		this.bossbar.setTitle(`Ping: ${ping}ms | TPS: ${tps} | Memory: ${memory.toFixed(2)}MB | Entities: ${entities} | Chunks: ${chunks}`);
	}
}

// Register the component to the player type
const playerType = EntityType.get(EntityIdentifier.Player) as EntityType;
DebugStatsComponent.register(playerType);
