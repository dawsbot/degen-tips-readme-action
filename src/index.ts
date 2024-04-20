import * as core from '@actions/core';

import fs from 'fs';
import replaceSection from 'replace-section';
import { generateHtml } from './generate-html.js';

async function run() {
  try {
    const farcaster_username = core.getInput('farcaster_username', {
      required: true,
    });
    const neynar_api_key = core.getInput('neynar_api_key', { required: true });
    const dune_api_key = core.getInput('dune_api_key', { required: true });
    const code = await generateHtml({
      farcasterUsername: farcaster_username,
      neynarApiKey: neynar_api_key,
      duneApiKey: dune_api_key,
    });

    const file = core.getInput('file', { required: true });
    const readme = await fs.promises.readFile(file, 'utf8');
    const startWith = '<!-- replace-degen-sponsors -->';
    const endWith = startWith;
    await fs.promises.writeFile(
      file,
      replaceSection({
        input: readme,
        startWith,
        endWith,
        replaceWith: `${startWith}
${code}
${endWith}`,
      }),
      'utf-8',
    );
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

void run();
