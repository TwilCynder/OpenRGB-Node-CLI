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