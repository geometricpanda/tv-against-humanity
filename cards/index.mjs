import {program} from "commander";
import debugMod from "debug";
import {createBlackCard, createWhiteCard, getCards} from "./helpers/cards.mjs";
import {
    createGamePack,
    getGamePacks,
    getPackFiles,
    readPackFile
} from "./helpers/game-packs.mjs";
import {throttle} from "./helpers/utils.mjs";

const {debug} = debugMod;
const log = debug('app');

log('Getting Pack Files');
const packFiles = await getPackFiles();

program
    .option('-p, --packFile <string>', 'Pack to use', packFiles[0])
    .parse();

const {packFile: packFileName} = program.opts();

// Preload Cards and Game Packs
await getCards();
await getGamePacks();

const packFile = await readPackFile(packFileName);

for (const {name, white, black, official} of packFile) {
    const hash = await createGamePack(name);

    for (const {text, pick} of black) {
        await createBlackCard(hash, text, official, pick);
    }

    for (const {text} of white) {
        await createWhiteCard(hash, text, official);
    }

}
