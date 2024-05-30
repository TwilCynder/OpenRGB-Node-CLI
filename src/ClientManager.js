import { ArgumentsManager } from "@twilcynder/arguments-parser";
import { Client } from "openrgb-sdk";

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


/**
 * Design philosophy : you cannot initalize a client without connecting
 */
export class ClientManager {
    constructor(){
        this.client = null;
    }

    async reconnect(){
        if (this.client){
            if (this.client.isConnected){
                throw "Already connected"
            } else {
                this.client.connect();
            }
        } else {
            throw "No config - please connect with a host and port first"
        }
    }

    async connect(host, port, name){
        let client = new Client({host, port, name});
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
                return await this.connect(host, port, name);
            } else {
                console.warn("Host provided without port. You must provide the host and the port, separated either by a space or colon.")
            }
        }
    }

    disconnect(){
        this.client.disconnect();
    }

    reportState(){
        if (this.client){
            return (this.client.isConnected ? "Connected" : "Disconnected") + ". Host : " + this.client.host + " | Port : " + this.client.port;  
        }
        return "Connexion is not configured."
    }

    /**
     * Checks if there is a connected client and returns it
     * @returns 
     */
    getClient(){
        if (this.client){
            if (this.client.isConnected){
                return this.client
            } else {
                throw "Client is disconnected ; please reconnect"
            }
            
        } else {
            throw "Connexion is not configured, please connect with a host and port first"
        }
    }
}