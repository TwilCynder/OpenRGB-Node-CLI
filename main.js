import { ClientManager, getAllDevices } from "./lib.js";
import { MissingArgumentError } from "@twilcynder/arguments-parser";
import cl from "@twilcynder/commandline"

let clientManager = new ClientManager;

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
            console.log(await getAllDevices(clientManager.getClient()));
        } catch (err){
            console.error("Error during command execution :", err)
        }
    }
}

cl.start();