import { utils } from "openrgb-sdk";

/**
 * 
 * @param {string} str 
 */
function parseInt_(str){
    let number = Number.parseInt(str);

    if (isNaN(number)){
        throw "Invalid value (cannot be parsed as a number) : " + str;
    }

    return number;
}

/**
 * 
 * @param {string} str 
 */
function parseFloat_(str){
    let number = Number.parseFloat(str);

    if (isNaN(number)){
        throw "Invalid value (cannot be parsed as a number) : " + str;
    }

    return number;
}

const colorFunctions = {
    rgb: (r, g, b) => {
        return utils.color(parseInt_(r), parseInt_(g), parseInt_(b))
    },
    hsv: (h, s, v) => {
        return utils.HSVColor(parseInt_(h), parseFloat_(s), parseFloat_(v))
    },
    hsl: (h, s, l) => {
        return utils.HSLColor(parseInt_(h), parseFloat_(s), parseFloat_(l))
    },
}

/**
 * 
 * @param {string} str 
 */
export function parseColorString(str, notation = "rgb"){
    try {
        if (str.includes(";")){
            let fields = str.split(";");
    
            if (fields.length != 3){
                throw "Invalid color. Must be either the color value directly or the three components separated by semicolons."
            }
    
            const colorFunction = colorFunctions[notation];

            if (!colorFunction){
                throw "Invalid color notation code (valid ones are rgb, hsv and hsl)";
            }

            try {
                console.log(colorFunction(fields[0], fields[1], fields[2]))
                return colorFunction(fields[0], fields[1], fields[2])
            } catch (err) {
                throw "Invalid color : " + err;
            }
            
        } else {

            if (str.startsWith("#")){
                return utils.hexColor(str);
            } else {

                let color = parseInt_(str);
                return {
                    red: color >> 16, 
                    green: (color & 0xFF00) >> 8, 
                    blue: color & 0xFF
                };
            }

        }
    } catch (err){
        throw "Could not read color : " + err;
    }

}