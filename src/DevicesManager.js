import { getAllDevices } from "./lib.js";

export class DevicesManager {
    #cache = null;

    constructor(){
    }

    async load(client){
        this.#cache = await getAllDevices(client);
        return this.#cache;
    }

    async getDevices(client){
        return this.#cache || await this.load(client);
    }
}