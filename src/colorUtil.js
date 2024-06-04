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
export function parseColorString(str){
    try {
        if (str.includes(";")){
            let fields = str.split(";");
    
            if (fields.length != 3){
                throw "Invalid color. Must be either the color value directly or the three components separated by semicolons."
            }
    
            try {
                return {
                    red: parseInt_(fields[0]), 
                    green: parseInt_(fields[1]), 
                    blue: parseInt_(fields[2])
                };
            } catch (err) {
                throw "Invalid color : " + err;
            }
            
        } else {
            let color = parseInt_(str);
            return {
                red: color >> 16, 
                green: (color & 0xFF00) >> 8, 
                blue: color & 0xFF
            };
        }
    } catch (err){
        throw "Could not read color : " + err;
    }

}