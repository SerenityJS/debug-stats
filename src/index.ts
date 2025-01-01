import { Plugin, PluginEvents, PluginType } from "@serenityjs/plugins";

import { Bossbar, CardinalDirection, EntityIdentifier, Player, PlayerChunkRenderingTrait, PlayerTrait, WorldInitializeSignal } from "@serenityjs/core";
import { BossEventColor } from "@serenityjs/protocol";

export class DebugStatsTrait extends PlayerTrait {
	public static readonly identifier = "debug_stats";
	public static readonly types = [EntityIdentifier.Player];

	/**
	 * The bossbar that will be displayed to the player
	*/
	public readonly bossbar = new Bossbar(this.player, this.player.type.identifier, 1, BossEventColor.Red);

	public onSpawn(): void {
		// Show the bossbar to the player
		this.bossbar.show(this.player);
	}

	public onTick(): void {
		// Update the bossbar information
		const direction = CardinalDirection[this.player.getCardinalDirection()];
		const tps = this.entity.world.serenity?.tps ?? 0;
		const memory = process.memoryUsage().heapUsed / 1024 / 1024;
		const entities = this.player.dimension.entities.size;
		const chunks = this.player.getTrait(PlayerChunkRenderingTrait).chunks.size;
		
		// Set the title of the bossbar
		this.bossbar.setTitle(`Direction: ${direction} | TPS: ${tps} | Memory: ${memory.toFixed(2)}MB | Entities: ${entities} | Chunks: ${chunks}`);
	}
}

class DebugStatsPlugin extends Plugin implements PluginEvents {
	public readonly type = PluginType.Addon;

	public constructor() {
		super("DebugStats", "1.0.0");
	}

	public onWorldInitialize(event: WorldInitializeSignal): void {
		// Register the trait to the entity palette
		event.world.entityPalette.registerTrait(DebugStatsTrait);

		// Log that the trait has been registered
		this.logger.info("Registered DebugStatsTrait to the entity palette");
	}
}

export default new DebugStatsPlugin();
