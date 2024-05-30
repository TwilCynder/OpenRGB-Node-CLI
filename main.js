import orgb, { OpenRGBClient } from "openrgb"
import { ClientManager, connect, connectWithArgs, getAllDevices } from "./lib.js";
import { MissingArgumentError } from "@twilcynder/arguments-parser";
import cl from "@twilcynder/commandline"

let clientManager = new ClientManager;

try {
    await clientManager.connectWithArgs(process.argv.slice(2));

    console.log("Connected ! Host")
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
            client = connectWithArgs(args);
        } catch (err) {
            if (err instanceof MissingArgumentError){
                console.error("Missing argument :", err.getMissingArgumentUsageText());
            } else {
                console.error("Couldn't connect :", err);
            }
        }
    }
}

console.log(await getAllDevices(client));

client.disconnect();