const NAME_PREFIX = "name:";
const nicknames = new Map();
export function getNickname(player) {
    const tag = player.getTags().find(t => t.startsWith(NAME_PREFIX));
    return tag?.substring(NAME_PREFIX.length) ?? player.name;
}
export function set(player, name) {
    nicknames.set(player.id, name);
}
export function remove(player) {
    if (!player)
        return;
    nicknames.delete(player.id);
    player.nameTag = player.name;
}
export function applyNicknameFromTag(player) {
    const nickname = getNickname(player);
    player.nameTag = nickname;
}
export function getNicknameTag(player) {
    for (const tag of player.getTags()) {
        if (tag.startsWith(NAME_PREFIX)) {
            return tag.slice(NAME_PREFIX.length);
        }
    }
    return null;
}
export function applyNameTag(player) {
    const nickname = getNicknameTag(player);
    if (nickname) {
        player.nameTag = nickname;
    }
    else {
        player.nameTag = player.name;
    }
}
