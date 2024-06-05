export interface CookieOptions {
  expiry?: Date;
  path?: string;
  domain?: string;
  maxAge?: number;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  session?: boolean;
}

interface CookiesList {
  [key: string]: string | object;
}

export class CookieIO {
  public static all(): CookiesList {
    return document.cookie.split(';').reduce((res, c) => {
      const [key, ...val] = c.trim().split('=').map(decodeURIComponent);
      if (key) {
        try {
          return Object.assign(res, { [key]: JSON.parse(val.join('=')) });
        } catch (e) {
          return Object.assign(res, { [key]: val.join('=') });
        }
      } else {
        return res;
      }
    }, {});
  }

  public static get<T>(key: string): T | any {
    const keyName = `${key}=`;
    const cookie = document.cookie
      .split(';')
      .map((item) => decodeURIComponent(item.trim()))
      .find((item) => item.startsWith(keyName));
    if (!!cookie) {
      try {
        return JSON.parse(cookie.replace(keyName, ''));
      } catch (e) {
        return cookie.replace(keyName, '');
      }
    } else {
      return null;
    }
  }

  public static set<T>(
    name: string,
    value: T,
    options: CookieOptions = { path: '/', session: true },
  ): void {
    let cookieData;
    if (typeof value === 'string') {
      cookieData = value;
    } else {
      cookieData = JSON.stringify(value);
    }

    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(cookieData)};`;
    if (options.sameSite) {
      cookie += `SameSite=${options.sameSite};`;
    }
    if (options.session) {
      cookie += ' expires=0;';
    } else {
      new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000);
      const expiry = options.expiry
        ? options.expiry.toUTCString()
        : new Date(
            new Date().getTime() + 365 * 24 * 60 * 60 * 1000,
          ).toUTCString();
      cookie += ` expires=${expiry};`;
    }
    cookie += options.path ? ` path=${options.path};` : '';
    document.cookie = cookie;
  }

  public static remove(key: string): void {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  public static clear(): void {
    const cookies = CookieIO.all();
    if (cookies) {
      Object.keys(cookies).forEach((key) => {
        CookieIO.remove(key);
      });
    }
  }
}
