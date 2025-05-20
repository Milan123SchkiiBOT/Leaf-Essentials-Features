import { world, system } from "@minecraft/server";
import config from "../versionData";
import uiManager from "../uiManager";
import { ModalForm, ActionForm } from "../lib/form_func";
import { Storage } from "api/scriptDB";
const scriptDb = new Storage("scripts");
uiManager.addUI(config.uiNames.ScriptExecutor, "Script Executor", (player, error = null) => {
    const form = new ActionForm();
    form.title("Script Executor");
    if (error)
        form.body(`Error: ${error}`);
    else
        form.body("Choose an option:");
    form.button("Add Script");
    form.button("Run Script");
    form.button("Loop Script");
    form.button("Delete Script");
    form.show(player, false, (player, res) => {
        if (res.canceled)
            return;
        const choice = res.selection;
        switch (choice) {
            case 0: return uiManager.open(player, config.uiNames.ScriptExecutor_Add);
            case 1: return uiManager.open(player, config.uiNames.ScriptExecutor_Run);
            case 2: return uiManager.open(player, config.uiNames.ScriptExecutor_Loop);
            case 3: return uiManager.open(player, config.uiNames.ScriptExecutor_Delete);
        }
    });
});
uiManager.addUI(config.uiNames.ScriptExecutor_Add, "Add Script", (player) => {
    const form = new ModalForm();
    form.title("Add Script");
    form.textField("Script Name", "Example: greet");
    form.textField("JavaScript Code", "Example: player.runCommandAsync('say Hello')");
    form.show(player, false, (player, res) => {
        if (res.canceled)
            return;
        const [name, code] = res.formValues;
        if (!name || !code) {
            return uiManager.open(player, config.uiNames.ScriptExecutor, "Invalid input");
        }
        scriptDb.set(name, code);
        player.sendMessage(`Script '${name}' saved.`);
        uiManager.open(player, config.uiNames.ScriptExecutor);
    });
});
uiManager.addUI(config.uiNames.ScriptExecutor_Run, "Run Script", (player) => {
    const scripts = scriptDb.keys();
    const form = new ActionForm();
    form.title("Run Script");
    if (scripts.length === 0) {
        form.body("No scripts found.");
        return form.show(player);
    }
    scripts.forEach(k => form.button(k));
    form.show(player, false, (player, res) => {
        if (res.canceled)
            return;
        const key = scripts[res.selection];
        const code = scriptDb.get(key);
        try {
            const result = eval(`(function(player, world, system){${code}})(player, world, system)`);
            player.sendMessage(`[Result] ${result ?? "Executed."}`);
        }
        catch (e) {
            player.sendMessage(`[Error] ${e.message}`);
        }
    });
});
uiManager.addUI(config.uiNames.ScriptExecutor_Loop, "Loop Script", (player) => {
    const scripts = scriptDb.keys();
    const form = new ActionForm();
    form.title("Loop Script");
    if (scripts.length === 0) {
        form.body("No scripts available.");
        return form.show(player);
    }
    scripts.forEach(k => form.button(k));
    form.show(player, false, (player, res) => {
        if (res.canceled)
            return;
        const key = scripts[res.selection];
        const code = scriptDb.get(key);
        let count = 0;
        const max = 10;
        const interval = system.runInterval(() => {
            try {
                const func = new Function("player", "world", "system", code);
                const result = func(player, world, system);
                count++;
                if (count >= max)
                    system.clearRun(interval);
            }
            catch (e) {
                player.sendMessage(`[Loop Error] ${e.message}`);
                system.clearRun(interval);
            }
        }, 40);
        player.sendMessage(`Running '${key}' in loop (${max} times)...`);
    });
});
uiManager.addUI(config.uiNames.ScriptExecutor_Delete, "Delete Script", (player) => {
    const scripts = scriptDb.keys();
    const form = new ActionForm();
    form.title("Delete Script");
    if (scripts.length === 0) {
        form.body("No saved scripts.");
        return form.show(player);
    }
    scripts.forEach(k => form.button(k));
    form.show(player, false, (player, res) => {
        if (res.canceled)
            return;
        const key = scripts[res.selection];
        scriptDb.remove(key);
        player.sendMessage(`Script '${key}' deleted.`);
    });
});
