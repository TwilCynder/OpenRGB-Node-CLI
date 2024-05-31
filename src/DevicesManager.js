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

    async getLEDs(client, deviceID){
        let devices = await this.getDevices(client);

        if (deviceID >= devices.length){
            throw `Device index above maximum (highest valid device index : ${devices.length - 1})`
        }

        console.log(devices[deviceID]);

        return devices[deviceID].colors;
    }
}