import { world } from "@minecraft/server";
import * as JobDB from "../../api/JobDB";
import { prismarineDb } from "../../lib/prismarinedb";
// Crops, die vom Farmer bezahlt werden
const cropBlocks = [
    "minecraft:wheat", "minecraft:carrots", "minecraft:potatoes", "minecraft:beetroots",
    "minecraft:pumpkin", "minecraft:melon", "minecraft:sweet_berry_bush"
];
// Hostile mobs für den Hunter-Job
const hostileEntities = [
    "minecraft:zombie", "minecraft:skeleton", "minecraft:creeper",
    "minecraft:spider", "minecraft:enderman", "minecraft:husk",
    "minecraft:stray", "minecraft:drowned", "minecraft:wither_skeleton"
];
// Event: Block abbauen
world.afterEvents.playerBreakBlock.subscribe((ev) => {
    const player = ev.player;
    const job = JobDB.get(player);
    const blockId = ev.brokenBlockPermutation.type.id;
    let amount = 0;
    if (job === "Miner") {
        amount = 5;
    }
    else if (job === "Farmer" && cropBlocks.includes(blockId)) {
        amount = 3;
    }
    if (amount > 0) {
        prismarineDb.economy.addMoney(player, amount);
        player.sendMessage(`§a+${amount} coins for working as a §e${job}`);
    }
});
// Event: Block platzieren
world.afterEvents.playerPlaceBlock.subscribe((ev) => {
    const player = ev.player;
    const job = JobDB.get(player);
    if (job === "Builder") {
        const amount = 3;
        prismarineDb.economy.addMoney(player, amount);
        player.sendMessage(`§a+${amount} coins for building as a §eBuilder`);
    }
});
// Event: Mob töten
world.afterEvents.entityDie.subscribe((ev) => {
    const { damageSource, deadEntity } = ev;
    const killer = damageSource.damagingEntity;
    if (!killer?.isPlayer())
        return;
    const player = killer;
    const job = JobDB.get(player);
    const typeId = deadEntity.typeId;
    if (job === "Hunter" && hostileEntities.includes(typeId)) {
        const amount = 4;
        prismarineDb.economy.addMoney(player, amount);
        player.sendMessage(`§a+${amount} coins for hunting as a §eHunter`);
    }
});
