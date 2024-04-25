import * as core from '@actions/core';

import fs from 'fs';
import replaceSection from 'replace-section';
import { generateHtml } from './generate-html.js';

async function run() {
  try {
    const FARCASTER_USERNAME = core.getInput('FARCASTER_USERNAME', {
      required: true,
    });
    const DUNE_API_KEY = core.getInput('DUNE_API_KEY', { required: true });

    const code = await generateHtml({
      farcasterUsername: FARCASTER_USERNAME,
      duneApiKey: DUNE_API_KEY,
    });

    const FILE = core.getInput('FILE') || 'README.md';
    const readme = await fs.promises.readFile(FILE, 'utf8');
    const startWith = '<!-- replace-degen-sponsors -->';
    const endWith = startWith;
    if (!readme.includes(startWith)) {
      throw new Error(`File "${FILE}" missing required text "${startWith}"`);
    }
    await fs.promises.writeFile(
      FILE,
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
