import crypto from "node:crypto";
import debugMod from "debug";
const {debug} = debugMod;
const worker = debug('hashing');


export function generateHash(pack) {
    const log = worker.extend('generatePackHash');

    const hash = crypto
        .createHash('sha256')
        .update(pack)
        .digest('hex');

    log(`Generated Hash ${hash} for ${pack}`);

    return hash;
}
