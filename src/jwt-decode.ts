import {Buffer} from "buffer"

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

    private decodeToken<V>(token: string): V {
        let decoded: string = Buffer.from(token, "base64url").toString("ascii")

        try {
            return JSON.parse(decoded)
        } catch (e) {
            throw new InvalidTokenError(`Invalid token specified: invalid json for part #1 (${(e as Error).message})`)
        }
    }
}
