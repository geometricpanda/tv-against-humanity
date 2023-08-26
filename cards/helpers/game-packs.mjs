import {join} from "node:path";
import {readdir, readFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import debugMod from "debug";
import {getEnvironment} from "./environment.mjs";
import {generateHash} from "./hashing.mjs";
import {throttle} from "./utils.mjs";

const {debug} = debugMod;
const worker = debug('packs');
const {
    STORYBLOK_MANAGER_API,
    STORYBLOK_PAT,
    STORYBLOK_SPACE,
} = getEnvironment();


const gamePacks = new Set();
const packsPath = fileURLToPath(new URL('../packs', import.meta.url));

const datasource_id = 221708;

export async function getPackFiles() {
    const log = worker.extend('readPackFiles');
    log('Reading Pack Files', packsPath);
    const packsDirContents = await readdir(packsPath);
    return packsDirContents.filter((pack) => pack.includes('.json'));
}

export async function readPackFile(packFile) {
    const log = worker.extend('readPackFile');
    log('Reading Pack File', packsPath, packFile);
    const packPath = join(packsPath, packFile);
    const pack = await readFile(packPath, 'utf-8');
    return JSON.parse(pack);
}


export async function getGamePacks() {
    const log = worker.extend('getGamePacks');

    if (gamePacks.size > 0) {
        log('From cache');
        return gamePacks;
    }

    log('From Storyblok');
    const storyblokApi = new URL(`v1/spaces/${STORYBLOK_SPACE}/datasource_entries`, STORYBLOK_MANAGER_API);
    storyblokApi.searchParams.set('datasource_id', datasource_id);
    storyblokApi.searchParams.set('per_page', '999');

    const headers = new Headers();
    headers.set('Authorization', STORYBLOK_PAT);
    headers.set('Content-Type', 'application/json');

    const resp = await fetch(storyblokApi, {headers});

    if (!resp.ok) {
        throw new Error(`Storyblok: ${resp.statusText}`);
    }

    const data = await resp.json();

    for (const pack of data.datasource_entries) {
        gamePacks.add(pack.value);
    }

    log(`Found ${gamePacks.size} Card Packs`);
    return gamePacks;
}


export async function createGamePack(name) {
    const log = worker.extend('createGamePack');
    const hash = generateHash(name);

    if (!gamePacks.has(hash)) {
        log(`Pack not found:`, name)
    }

    if (!gamePacks.has(hash)) {
        const storyblokApi = new URL(`v1/spaces/${STORYBLOK_SPACE}/datasource_entries/`, STORYBLOK_MANAGER_API);

        const headers = new Headers();
        headers.set('Authorization', STORYBLOK_PAT);
        headers.set('Content-Type', 'application/json');

        const body = JSON.stringify({
            datasource_entry: {
                name,
                value: hash,
                datasource_id,
            }
        });

        const resp = await fetch(storyblokApi, {
            method: 'POST',
            headers,
            body,
        });

        if (!resp.ok) {
            throw new Error(`Storyblok: ${resp.status}/${resp.statusText}`);
        }

        gamePacks.add(hash);
        log(`Pack:`, name, 'successfully written to Storyblok');
        await throttle(200);
    }

    return hash;
}
