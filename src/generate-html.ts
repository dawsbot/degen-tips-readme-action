import { Dune } from 'dune-api-client';
import omit from 'just-omit';
import { z } from 'zod';

export async function generateHtml({
  farcasterUsername,
  duneApiKey,
}: {
  farcasterUsername: string;
  duneApiKey: string;
}) {
  console.log(
    `fetching tips from dune for https://warpcast.com/${farcasterUsername} ...`,
  );
  const tips = await fetchValidTips(farcasterUsername, duneApiKey);
  console.log(`found ${tips.length} tips`);

  const fids = tips.map((tip) => tip.donor_fid);
  console.log(
    `fetching photo urls from hub for all sponsors with fids: ${fids.toString()}`,
  );
  const profilePhotos = await fetchProfilePhotoUrls(fids);
  console.dir({ profilePhotos });

  return tips
    .map((tip, index) => {
      return `<a href="https://warpcast.com/${tip.fname}"><img src="${profilePhotos[index]}" width="60px" alt="${tip.display_name}" /></a>\n`;
    })
    .join('');
}

// https://dune.com/queries/3626954/6109458
const QUERY_ID = 3626954;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export const fetchValidTips = async (
  farcasterUsername: string,
  duneApiKey: string,
) => {
  const dune = new Dune(duneApiKey);
  const execute = await dune.execute(QUERY_ID, {
    params: { username: farcasterUsername },
  });
  let state: string;
  do {
    await sleep(1_500);
    state = (await dune.status(execute.execution_id)).state;
  } while (
    state === 'QUERY_STATE_PENDING' ||
    state === 'QUERY_STATE_EXECUTING'
  );
  const duneResult = await dune
    .results(execute.execution_id)
    .then((res) => duneResultSchema.parse(res.result));
  const tips = duneResult.rows;
  let validTips = tips
    .filter((tip) => {
      return tip.valid_tip === '✅';
    })
    .map((validTip) => {
      return omit(validTip, 'valid_tip');
    });
  const totalTipAmountByRecipient = validTips.reduce(
    (acc, tip) => {
      const recipientFid = tip.donor_fid;
      if (!acc[recipientFid]) {
        acc[recipientFid] = 0;
      }
      acc[recipientFid] += tip.actual_tip_amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  validTips = validTips
    .sort((validTipA, validTipB) => {
      return (
        totalTipAmountByRecipient[validTipB.donor_fid] -
        totalTipAmountByRecipient[validTipA.donor_fid]
      );
    })
    .filter((tip) => {
      // remove tips which have a duplicate donor_fid
      return tip.donor_fid !== validTips[validTips.indexOf(tip) - 1]?.donor_fid;
    });

  return validTips;
};

export async function fetchProfilePhotoUrls(fids: number[]) {
  const pfps = await Promise.all(
    fids.map((fid) =>
      fetch(
        `https://nemes.farcaster.xyz:2281/v1/userDataByFid?fid=${fid}&user_data_type=USER_DATA_TYPE_PFP`,
      )
        .then((res) => res.json())
        .then((res) => hubProfileSchema.parse(res))
        .then((data) => data.data.userDataBody.value),
    ),
  );
  return pfps;
}
const duneResultSchema = z.object({
  rows: z.array(
    z.object({
      //   accumulated_points: z.number(),
      //   avatar_url: z.string(),
      actual_tip_amount: z.number(),
      //   cast_hash: z.string(),
      //   cast_link: z.string(),
      //   channel_boost: z.string(),
      //   day: z.string(),
      display_name: z.string(),
      //   donated_amount: z.number(),
      donor_fid: z.number(),
      //   donor_tip_allowance: z.number(),
      //   event_day: z.string(),
      fname: z.string(),
      //   mgt_display_name: z.string(),
      //   mgt_fid: z.number(),
      //   mgt_fname: z.string(),
      //   mgt_tip_count: z.number(),
      //   mgt_total_tip_amount: z.number(),
      //   mta_cast: z.string(),
      //   mta_cast_link: z.string(),
      //   mta_parent_hash: z.string(),
      //   mta_tip_count: z.number(),
      //   mta_total_tip_amount: z.number(),
      //   mtc_cast: z.string(),
      //   mtc_cast_link: z.string(),
      //   mtc_parent_hash: z.string(),
      //   mtc_tip_count: z.number(),
      //   mtc_total_tip_amount: z.number(),
      //   parent_hash: z.string(),
      //   recipient_fid: z.number(),
      //   recipient_name: z.string(),
      timestamp: z.string(),
      //   tip_amount: z.number(),
      valid_tip: z.string(),
      // wallet_address: z.string(),
    }),
  ),
});

export const hubProfileSchema = z.object({
  data: z.object({
    type: z.string(),
    timestamp: z.number(),
    network: z.string(),
    userDataBody: z.object({ type: z.string(), value: z.string() }),
  }),
});
