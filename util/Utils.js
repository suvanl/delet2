const crypto = require("crypto");

class Utils {
    static base64(text, mode = "encode") {
        if (mode === "encode") return Buffer.from(text).toString("base64");
        if (mode === "decode") return Buffer.from(text, "base64").toString("utf8") || null;
        throw new TypeError(`${mode} is not a supported Base64 mode`);
    }
    
    static hash(text, algorithm) {
        return crypto.createHash(algorithm).update(text).digest("hex");
    }
}

module.exports = Utils;