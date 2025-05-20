import config from "../../versionData";
import uiManager from "../../uiManager";
import { ActionForm } from "../../lib/form_func";
import * as JobDB from "../../api/JobDB";
import "./job";
const jobList = [
    "Farmer", "Hunter", "Miner"
];
uiManager.addUI(config.uiNames.Jobs, "Choose your Job", (player, error = null, currencyScoreboard = null) => {
    const actionForm = new ActionForm();
    actionForm.title(error ? `§c${error}` : "§f§0§0§a§l§t§b§t§n§l§f§3§0§rJobs");
    actionForm.body("Select your profession:");
    for (const job of jobList) {
        actionForm.button(`${job}`, "textures/items/diamond");
    }
    actionForm.show(player, false, (player, response) => {
        if (response.canceled)
            return;
        const selectedJob = jobList[response.selection];
        JobDB.set(player, selectedJob);
        player.sendMessage(`§aYou are now a §e${selectedJob}§a!`);
    });
});
