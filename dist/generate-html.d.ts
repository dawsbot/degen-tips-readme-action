import { z } from 'zod';
export declare function generateHtml({ farcasterUsername, neynarApiKey, duneApiKey, }: {
    farcasterUsername: string;
    neynarApiKey: string;
    duneApiKey: string;
}): Promise<string>;
export declare const fetchValidTips: (farcasterUsername: string, duneApiKey: string) => Promise<Omit<{
    actual_tip_amount: number;
    display_name: string;
    fname: string;
    timestamp: string;
    valid_tip: string;
    wallet_address: string;
}, "valid_tip">[]>;
export declare function fetchProfilePhotoUrls(addresses: string[], neynarApiKey: string): Promise<Record<string, string>>;
export declare const neynarResultSchema: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
    pfp_url: z.ZodUnion<[z.ZodString, z.ZodNull]>;
}, "strip", z.ZodTypeAny, {
    pfp_url: string | null;
}, {
    pfp_url: string | null;
}>, "many">>;
