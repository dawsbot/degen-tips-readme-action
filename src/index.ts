import * as core from '@actions/core';

import fs from 'fs';
import replaceSection from 'replace-section';
import { generateHtml } from './degen-sponsors/generate-html';

async function run() {
  try {
    const farcasterUsername = core.getInput('farcaster_username', {
      required: true,
    });
    const neynarApiKey = core.getInput('neynar_api_key', { required: true });
    const duneApiKey = core.getInput('dune_api_key', { required: true });
    const code = await generateHtml({
      farcasterUsername,
      neynarApiKey,
      duneApiKey,
    });

    const readme = await fs.promises.readFile('README.md', 'utf8');
    const startWith = '<!-- replace-degen-sponsors -->';
    const endWith = startWith;
    await fs.promises.writeFile(
      'README.md',
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
