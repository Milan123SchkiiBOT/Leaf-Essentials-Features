import { world, system } from "@minecraft/server";
export class Storage {
    constructor(namespace) {
        this.namespace = namespace;
        this.store = new Map();
        this.load();
    }
    load() {
        system.run(() => {
            const raw = world.getDynamicProperty(this.namespace);
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    for (const key in parsed) {
                        this.store.set(key, parsed[key]);
                    }
                }
                catch { }
            }
        });
    }
    save() {
        const obj = {};
        for (const [key, value] of this.store.entries()) {
            obj[key] = value;
        }
        world.setDynamicProperty(this.namespace, JSON.stringify(obj));
    }
    set(key, value) {
        this.store.set(key, value);
        this.save();
    }
    get(key) {
        return this.store.get(key);
    }
    remove(key) {
        this.store.delete(key);
        this.save();
    }
    keys() {
        return [...this.store.keys()];
    }
    clear() {
        this.store.clear();
        this.save();
    }
    getAll() {
        const result = {};
        for (const [key, value] of this.store.entries()) {
            result[key] = value;
        }
        return result;
    }
}
