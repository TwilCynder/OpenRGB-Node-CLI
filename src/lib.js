export async function getDevice(client, id){
    const deviceCount = await client.getControllerCount();
    if (id >= deviceCount){
        throw `Device index above maximum (highest valid device index : ${devices.length - 1})`
    }
    
    return await client.getControllerData(id);
}

/**
 * @param {Client} client 
 * @returns 
 */
export async function getAllDevices(client){
    const deviceCount = await client.getControllerCount();

    let res = [];
    for (let i = 0; i < deviceCount; i++){
        res.push(await client.getControllerData(i));
    }

    return res;
}

export function stringifyLEDValue(value){
    if (value instanceof Object){
        let result = "";
        for (let k of Object.keys(value)){
            result += k + ": " + value[k] + ";";
        }
        if (result.length > 0) result = result.slice(0, -1); 

        return result;
    } else {
        return "" + value;
    }
}

