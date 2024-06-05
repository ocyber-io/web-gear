import { CookieIO, CookieOptions } from '../cookie-io'; // Replace with your actual file path

describe('CookieIO', () => {
  let cookieStore: { [key: string]: string } = {};
  beforeAll(() => {
    Object.defineProperty(document, 'cookie', {
      get: () => {
        return Object.entries(cookieStore)
          .map(([key, value]) => `${key}=${value}`)
          .join('; ');
      },
      set: (cookie: string) => {
        const [cookiePair] = cookie.split(';');
        const [key, ...val] = cookiePair.split('=');
        if (key && val) {
          cookieStore[key.trim()] = val.join('=').trim();
        }
      },
      configurable: true,
    });
  });
  beforeEach(() => {
    // Clear any existing cookies before each test
    cookieStore = {};
  });

  it('should set and retrieve a cookie', () => {
    const key = 'testCookie';
    const value = { name: 'John', age: 30 };
    CookieIO.set(key, value);

    const retrievedValue = CookieIO.get<any>(key);
    expect(retrievedValue).toEqual(value);
  });

  it('should remove a cookie', () => {
    const key = 'toBeRemoved';
    const value = 'someValue';
    CookieIO.set(key, value);

    CookieIO.remove(key);
    const retrievedValue = CookieIO.get(key);
    expect(retrievedValue).toEqual('');
  });

  it('should clear all cookies', () => {
    const cookiesToSet: Record<string, any> = {
      cookie1: 'value1',
      cookie2: { key: 'value' },
      cookie3: 123,
    };

    Object.entries(cookiesToSet).forEach(([key, value]) => {
      CookieIO.set(key, value);
    });

    CookieIO.clear();

    Object.keys(cookiesToSet).forEach((key) => {
      const retrievedValue = CookieIO.get(key);
      expect(retrievedValue).toEqual('');
    });
  });

  it('should set a cookie with custom options', () => {
    const key = 'customCookie';
    const value = 'customValue';

    const options: CookieOptions = {
      path: '/',
      expiry: new Date('2024-01-01'),
      sameSite: 'strict',
      secure: true,
      session: false,
    };

    CookieIO.set(key, value, options);

    const cookieString = document.cookie;
    expect(cookieString).toContain(
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    );
  });

  it('should get cookies list with empty object', () => {
    const cookies = CookieIO.all();

    expect(cookies).toEqual({});
  });

  it('should set and Get Cookie String Value ', () => {
    const key = 'customCookie';
    const value = 'customValue';

    const options: CookieOptions = {
      path: '/',
      expiry: new Date('2024-01-01'),
      sameSite: 'strict',
      secure: true,
      session: false,
    };

    CookieIO.set(key, value, options);

    const cookieValue = CookieIO.get(key);
    expect(cookieValue).toEqual(value);
  });

  it('should set Without Expiry ', () => {
    const key = 'customCookie';
    const value = 'customValue';

    const options: CookieOptions = {
      path: '/',
      sameSite: 'strict',
      secure: true,
      session: false,
    };

    CookieIO.set(key, value, options);

    const cookieValue = CookieIO.get(key);
    expect(cookieValue).toEqual(value);
  });

  it('should set Without Path and Expiry ', () => {
    const key = 'customCookie';
    const value = 'customValue';

    const options: CookieOptions = {
      sameSite: 'strict',
      secure: true,
      session: false,
    };

    CookieIO.set(key, value, options);

    const cookieValue = CookieIO.get(key);
    expect(cookieValue).toEqual(value);
  });
});
