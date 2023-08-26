import dotenv from "dotenv";
import {join} from "node:path";
dotenv.config({path: join(process.cwd(), '.env.local')});

export function getEnvironment() {

    const {
        STORYBLOK_PAT,
        STORYBLOK_SPACE,
        STORYBLOK_API,
        STORYBLOK_PUBLIC_TOKEN,
        STORYBLOK_PREVIEW_TOKEN,
        STORYBLOK_MANAGER_API,
    } = process.env;

    if (!STORYBLOK_PAT) {
        throw new Error('STORYBLOK_PAT is not defined in .env.local');
    }

    if (!STORYBLOK_SPACE) {
        throw new Error('STORYBOOK_SPACE is not defined in .env.local');
    }

    if (!STORYBLOK_API) {
        throw new Error('STORYBLOK_API is not defined in .env.local');
    }

    if(!STORYBLOK_MANAGER_API) {
        throw new Error('STORYBLOK_MANAGER_API is not defined in .env.local');
    }

    if (!STORYBLOK_PUBLIC_TOKEN) {
        throw new Error('STORYBLOK_PUBLIC_TOKEN is not defined in .env.local');
    }

    if (!STORYBLOK_PREVIEW_TOKEN) {
        throw new Error('STORYBLOK_PREVIEW_TOKEN is not defined in .env.local');
    }


    return {
        STORYBLOK_PAT,
        STORYBLOK_SPACE,
        STORYBLOK_API,
        STORYBLOK_MANAGER_API,
        STORYBLOK_PUBLIC_TOKEN,
        STORYBLOK_PREVIEW_TOKEN,
    }
}
