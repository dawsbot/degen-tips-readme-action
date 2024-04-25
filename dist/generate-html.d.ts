import { z } from 'zod';
export declare function generateHtml({ farcasterUsername, duneApiKey, }: {
    farcasterUsername: string;
    duneApiKey: string;
}): Promise<string>;
export declare const fetchValidTips: (farcasterUsername: string, duneApiKey: string) => Promise<Omit<{
    actual_tip_amount: number;
    display_name: string;
    donor_fid: number;
    fname: string;
    timestamp: string;
    valid_tip: string;
}, "valid_tip">[]>;
export declare function fetchProfilePhotoUrls(fids: number[]): Promise<string[]>;
export declare const hubProfileSchema: z.ZodObject<{
    data: z.ZodObject<{
        type: z.ZodString;
        timestamp: z.ZodNumber;
        network: z.ZodString;
        userDataBody: z.ZodObject<{
            type: z.ZodString;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            type: string;
        }, {
            value: string;
            type: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        timestamp: number;
        network: string;
        userDataBody: {
            value: string;
            type: string;
        };
    }, {
        type: string;
        timestamp: number;
        network: string;
        userDataBody: {
            value: string;
            type: string;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        type: string;
        timestamp: number;
        network: string;
        userDataBody: {
            value: string;
            type: string;
        };
    };
}, {
    data: {
        type: string;
        timestamp: number;
        network: string;
        userDataBody: {
            value: string;
            type: string;
        };
    };
}>;
