import { ArgumentsManager, MissingArgumentError } from "@twilcynder/arguments-parser";
import cl from "@twilcynder/commandline"
import { ClientManager } from "./src/ClientManager.js";
import { getAllDevices, getDevice, stringifyLEDValue } from "./src/lib.js";

let clientManager = new ClientManager;
//let devicesManager = new DevicesManager;
 
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

async function command(f){
    try {
        await f();
    } catch (err){
        if (err instanceof MissingArgumentError){
            console.error("Missing argument :", err.message);
        } else {
            console.error("Error during command execution :", err)
        }
        
    }
    cl.stopLogging();
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

    /*
    loadDevices: () => {
        return command(async () => {
            await devicesManager.load(clientManager.getClient());
        })
    },
    */

    listDevices: async () => {
        return command(async () => {
            let devices = getAllDevices(clientManager.getClient());
            for (let i = 0; i < devices.length; i++){
                console.log(i,":", devices[i].name);
            }
        })
    },

    listLEDs: async (args) => {
        return command(async () => {
            let {id} = new ArgumentsManager().addParameter("id", {type: "number"}, false).parseArguments(args);
            
            let device = await getDevice(clientManager.getClient(), id);

            for (let i = 0; i < device.leds.length; i++){
                let led = device.leds[i];
                let color = device.colors[i];
                console.log(i, `: ${led.name} (current value : ${color ? stringifyLEDValue(color) : "No color found"})`);
            }
        })
    },

    setLED: async (args) => {
        return command(async () => {
            let {id, color} = new ArgumentsManager().addParameter("id", {type: "number"}, false).addParameter("color", {}, false).enableHelpParameter(true)
                .parseArguments(args);
            
            console.log("yeah")
        })
    }
}

cl.enableExit();
cl.enableList();
cl.start();