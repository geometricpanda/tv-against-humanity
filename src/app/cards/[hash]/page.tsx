import {Card} from "@/components/card";
import {join} from 'node:path';
import {FC} from "react";
import {Headers} from "next/dist/compiled/@edge-runtime/primitives";
import {Logger} from "@/components/logger";
import {notFound} from "next/navigation";

const {
    STORYBLOK_PREVIEW_TOKEN,
    STORYBLOK_API,
} = process.env

if (!STORYBLOK_API) {
    throw new Error('Storyblok API not defined')
}

if (!STORYBLOK_PREVIEW_TOKEN) {
    throw new Error('Storyblok Preview Token not defined');
}

export interface PageProps {
    params: {
        hash: string
    }
}


interface Story<T = Record<string, any>> {
    content: T;
}

interface WhiteCard {
    component: 'white_card';
    official: boolean;
    pack: string;
    text: string;
    _uid: string;
}

interface BlackCard {
    component: 'black_card';
    official: boolean;
    pack: string;
    pick: number;
    text: string;
    _uid: string;
}

async function getCard(hash: string): Promise<Story<BlackCard | WhiteCard> | null> {

    const url = join('v2/cdn/stories/cards', hash);
    const apiUrl = new URL(url, STORYBLOK_API);
    apiUrl.searchParams.set('token', STORYBLOK_PREVIEW_TOKEN!);

    const headers = new Headers();
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    const resp = await fetch(apiUrl, {headers});
    const data = await resp.json();
    return data.story;
}


const Page: FC<PageProps> = async ({params}) => {
    const {hash} = params;

    const story = await getCard(hash);

    if (!story) {
        return notFound();
    }

    return (
        <Card
            white={story.content.component === 'white_card'}
            text={story.content.text}/>
    )
}

export default Page;
