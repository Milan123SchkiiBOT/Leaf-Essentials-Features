import config from "../versionData";
import uiManager from "../uiManager";
import { ModalForm } from "../lib/form_func";
import * as NameDB from "../api/nameDB";
uiManager.addUI(config.uiNames.Nickname, "Change your Name", (player, error = null) => {
    const modalForm = new ModalForm();
    modalForm.title(error ? `§c${error}` : "Nickname");
    modalForm.textField("Enter nickname", "e.g. CoolGuy", "");
    modalForm.show(player, false, (player, response) => {
        if (response.canceled)
            return;
        const nicknameRaw = response.formValues[0];
        if (typeof nicknameRaw !== "string" || nicknameRaw.length < 1 || nicknameRaw.length > 20) {
            uiManager.open(player, config.uiNames.Nickname, "Name must be 1–20 characters");
            return;
        }
        NameDB.set(player, nicknameRaw);
        player.sendMessage(`§aYour nickname is now §e${nicknameRaw}`);
    });
});
