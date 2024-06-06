import { ArgumentsManager, MissingArgumentError } from "@twilcynder/arguments-parser";
import cl from "@twilcynder/commandline"
import { ClientManager } from "./src/ClientManager.js";
import { getAllDevices, getDevice, stringifyLEDValue } from "./src/lib.js";
import { parseColorString } from "./src/colorUtil.js";

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

    devices: async () => {
        return command(async () => {
            let devices = await getAllDevices(clientManager.getClient());
            for (let i = 0; i < devices.length; i++){
                console.log(i,":", devices[i].name);
            }
        })
    },

    leds: async (args) => {
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

    modes: async (args) => {
        return command (async () => {
            let {id} = new ArgumentsManager().addParameter("id", {type: "number"}, false).parseArguments(args);

            let device = await getDevice(clientManager.getClient(), id);

            console.log(device.modes);
        })
    },

    setmode: async (args) => {
        return command (async () => {
            let parameters = new ArgumentsManager()
                .addParameter("deviceID", {type: "number"}, false)
                .addParameter("modeID", {}, false)
                .enableHelpParameter(true)

            let {deviceID, modeID, help} = parameters.parseArguments(args);
            
            if (help){
                console.log(parameters.getHelp())
                return;
            }

            let device = await getDevice(clientManager.getClient(), deviceID);
            let mode = device.modes[modeID];

            if (!mode){
                throw `Selected device does not have a mode with ID ${modeID}. Use "modes ${deviceID}" to get a list of all modes for this device`
            }

            let client = clientManager.getClient();

            client.updateMode(deviceID, mode.id);
        })
    },

    setled: async (args) => {
        return command(async () => {
            let parameters = new ArgumentsManager()
                .addParameter("deviceID", {type: "number"}, false)
                .addParameter("ledID", {type: "number"}, false)
                .addParameter("colorStr", {}, false)
                .addOption("-n", {dest: "colorNotation"})
                .enableHelpParameter(true)

            let {deviceID, ledID, colorStr, colorNotation, help} = parameters.parseArguments(args);
            
            if (help){
                console.log(parameters.getHelp())
                return;
            }

            let orgbColor = parseColorString(colorStr, colorNotation);

            let client = clientManager.getClient();

            client.updateSingleLed(deviceID, ledID, orgbColor);
        })
    }
}

cl.enableExit();
cl.enableList();
cl.start();