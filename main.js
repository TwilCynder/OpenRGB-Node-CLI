import { MissingArgumentError } from "@twilcynder/arguments-parser";
import cl from "@twilcynder/commandline"
import { ClientManager } from "./src/ClientManager.js";
import { DevicesManager } from "./src/DevicesManager.js";

let clientManager = new ClientManager;
let devicesManager = new DevicesManager;
 
try {
    await clientManager.connectWithArgs(process.argv.slice(2));

    console.log(clientManager.reportState())
} catch (err) {
    if (err instanceof MissingArgumentError){
        //Do nothing, it's normal
    } else {
        console.error("Couldn't connect :", err);
    }
}

cl.commands = {
    connect: (args) => {
        try {
            clientManager.connectWithArgs(args);
        } catch (err) {
            if (err instanceof MissingArgumentError){
                console.error("Missing argument :", err.getMissingArgumentUsageText());
            } else {
                console.error("Couldn't connect :", err);
            }
        }
    },

    disconnect: () => {
        clientManager.disconnect()
    },

    reconnect: () => {
        clientManager.reconnect();
    },

    listDevices: async () => {
        try {
            let devices = await devicesManager.getDevices(clientManager.getClient());
            for (let i = 0; i < devices.length; i++){
                console.log(i,":", devices[i].name);
            }
            cl.stopLogging();
        } catch (err){
            console.error("Error during command execution :", err)
        }
    }
}

cl.enableExit();
cl.enableList();
cl.start();