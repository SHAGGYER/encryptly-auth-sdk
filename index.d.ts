declare module "encryptly-auth-sdk" {
    export interface Options {
        serverUrl: string;
        clientId: string;
        clientSecret: string;
        token: string;
    }

    export function checkToken(options: Options);
}