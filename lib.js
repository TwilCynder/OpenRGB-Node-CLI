import { ArgumentsManager } from "@twilcynder/arguments-parser";
import { OpenRGBClient } from "openrgb";

const DEFAULT_HOST = "0.0.0.0";
const DEFAULT_PORT = 6742;

function initParser(){
    return new ArgumentsManager()
        .addParameter("host", {}, false)
        .addParameter("port")
        .addOption("-n", {dest: "name"})
        .setMissingArgumentBehavior(null, 0, true);
}
const basic_parser = initParser();

export class ClientManager {
    constructor(){
        super()
        this.client = null;
    }

    async connect(host, port, name){
        let client = new OpenRGBClient({host, port, name});
        await client.connect();
    
        this.client = client;
    }

    async connectWithArgs(args){
        let {host, port, name} = basic_parser.parseArguments(args);
    
        if (host == "default"){
            host = DEFAULT_HOST;
            port = DEFAULT_PORT;
        } else {
            if (host.includes(":")){
                [host, port] = host.split(":");
            }
        
            if (port == "default"){
                port = DEFAULT_PORT;
            }
        }
        
        if (host){
            if (port){
                return await connect(host, port, name);
            } else {
                console.warn("Host provided without port. You must provide the host and the port, separated either by a space or colon.")
            }
        }
    }
}

/**
 * @param {OpenRGBClient} client 
 */
export async function getAllDevices(client){
    const deviceCount = await client.getControllerCount();

    let res = [];
    for (let i = 0; i < deviceCount; i++){
        res.push(await client.getDeviceController(i));
    }

    return res;
}