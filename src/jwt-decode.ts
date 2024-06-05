export interface JwtHeader {
    typ?: string
    alg?: string
    kid?: string
}


export class InvalidTokenError extends Error {
    name = "InvalidTokenError"
}

export class JwtDecode<T> {
    readonly headers: JwtHeader
    readonly payload: T

    constructor(private readonly token: string) {
        if (typeof token !== 'string') {
            throw new InvalidTokenError('Invalid token specified: must be a string')
        }

        if (token.split(".").length !== 3) {
            throw new InvalidTokenError('Invalid token specified: invalid token length')
        }

        const [header, payload] = this.token.split('.')
        this.headers = this.decodeToken<JwtHeader>(header)
        this.payload = this.decodeToken<T>(payload)
    }

    private b64DecodeUnicode(str: string) {
        return decodeURIComponent(
            atob(str).replace(/(.)/g, (m, p) => {
                let code = (p as string).charCodeAt(0).toString(16).toUpperCase();
                if (code.length < 2) {
                    code = "0" + code;
                }
                return "%" + code;
            }),
        );
    }

    private base64UrlDecode(str: string) {
        let output = str.replace(/-/g, "+").replace(/_/g, "/");
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += "==";
                break;
            case 3:
                output += "=";
                break;
            default:
                throw new Error("base64 string is not of the correct length");
        }

        try {
            return this.b64DecodeUnicode(output);
        } catch (err) {
            return atob(output);
        }
    }

    private decodeToken<V>(token: string): V {
        const decoded: string = this.base64UrlDecode(token)

        try {
            return JSON.parse(decoded)
        } catch (e) {
            throw new InvalidTokenError(`Invalid token specified: invalid json for part #1 (${(e as Error).message})`)
        }
    }
}
