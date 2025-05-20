const jobMap = new Map();
export function set(player, job) {
    jobMap.set(player.id, job);
}
export function get(player) {
    return jobMap.get(player.id) ?? "Unemployed";
}
export function remove(player) {
    jobMap.delete(player.id);
}
export function list() {
    const result = {};
    for (const [id, job] of jobMap.entries()) {
        result[id] = job;
    }
    return result;
}
