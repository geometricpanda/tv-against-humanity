import {join} from "node:path";
import debugMod from "debug";
import {getEnvironment} from "./environment.mjs";
import {throttle} from "./utils.mjs";
import {generateHash} from "./hashing.mjs";
import slugify from "slugify";

const {debug} = debugMod;
const worker = debug('cards');

const {
    STORYBLOK_MANAGER_API,
    STORYBLOK_SPACE,
    STORYBLOK_PAT,
} = getEnvironment();


async function getCardPage(page, per_page = 100) {
    const log = worker.extend('getCardPage');

    log(`Getting page ${page}`);

    const storyblokApi = new URL(join(STORYBLOK_MANAGER_API, `v1/spaces/${STORYBLOK_SPACE}/stories/`));
    storyblokApi.searchParams.set('page', page.toString());
    storyblokApi.searchParams.set('per_page', per_page.toString());
    storyblokApi.searchParams.set('starts_with', 'cards/');

    const headers = new Headers();
    headers.set('Authorization', STORYBLOK_PAT);
    headers.set('Content-Type', 'application/json');

    const resp = await fetch(storyblokApi, {headers});

    if (!resp.ok) {
        throw new Error(`Storyblok: ${resp.statusText}`);
    }

    const data = await resp.json();
    return data.stories;
}


const cards = new Set();

export async function getCards() {
    const log = worker.extend('getCards');

    if (cards.size > 0) {
        log('Getting cards from cache');
        return cards;
    }

    log('Getting cards from Storyblok');

    let results = -1;
    let iteration = 0;

    do {
        iteration++;
        const stories = await getCardPage(iteration);
        results = stories.length;
        stories.forEach(({slug}) => cards.add(slug))
        await throttle(1000/6);
    } while (results > 0);

    log(`Found ${cards.size} stories`);
    return cards;
}


export async function createWhiteCard(pack, text, official) {
    const log = worker.extend('createWhiteCard');

    const slug = generateHash(text);

    if (!cards.has(slug)) {

        const body = {
            publish: 1,
            story: {
                parent_id: 360681975,
                name: text,
                slug,
                content: {
                    component: 'white_card',
                    pack,
                    text,
                    official
                }
            }
        }

        const storyblokApi = new URL(join(STORYBLOK_MANAGER_API, `/v1/spaces/${STORYBLOK_SPACE}/stories/`));
        const headers = new Headers();
        headers.set('Authorization', STORYBLOK_PAT);
        headers.set('Content-Type', 'application/json');

        const options = {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        }

        const resp = await fetch(storyblokApi, options);

        if (!resp.ok) {
            throw new Error(`Storyblok: ${resp.status} / ${resp.statusText}`);
        }
        log(`Card Saved:`, text);
        cards.add(slug);
        await throttle(1000/6);
    }
}


export async function createBlackCard(pack, text, official, pick) {
    const log = worker.extend('createBlackCard');

    const slug = generateHash(text);

    if (!cards.has(slug)) {
        const body = {
            publish: 1,
            story: {
                parent_id: 360681975,
                name: text,
                slug,
                content: {
                    component: 'black_card',
                    pack,
                    text,
                    official,
                    pick,
                }
            }
        }

        const storyblokApi = new URL(join(STORYBLOK_MANAGER_API, `/v1/spaces/${STORYBLOK_SPACE}/stories/`));
        const headers = new Headers();
        headers.set('Authorization', STORYBLOK_PAT);
        headers.set('Content-Type', 'application/json');

        const options = {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        }

        const resp = await fetch(storyblokApi, options);

        if (!resp.ok) {
            throw new Error(`Storyblok: ${resp.status} / ${resp.statusText}`);
        }
        log(`Card Saved:`, text);
        cards.add(slug);
        await throttle(1000/6);
    }
}
