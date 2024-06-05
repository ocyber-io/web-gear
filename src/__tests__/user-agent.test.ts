import { UserAgent, BrowserName } from '../user-agent';

describe('UserAgent', () => {
  it('should correctly identify the browser type', () => {
    // Mocking user agents for different browsers
    const userAgents: Record<BrowserName, string> = {
      [BrowserName.Opera]:
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) OPR/36.0.2130.32',
      [BrowserName.MicrosoftEdge]:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/17.17134',
      [BrowserName.GoogleChrome]:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82',
      [BrowserName.MozillaFirefox]:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0',
      [BrowserName.AppleSafari]:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15',
      [BrowserName.MicrosoftInternetExplorer]:
        'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
      [BrowserName.UcBrowser]:
        'Mozilla/5.0 (Linux; U; Android 4.2.2; en-US; GT-P5110 Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 UCBrowser/10.7.8.658 U3/0.8.0 Mobile',
      [BrowserName.SamsungBrowser]:
        'Mozilla/5.0 (Linux; Android 10; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/15.0 Mobile',
      [BrowserName.UnknownBrowser]: 'Some unknown user agent string',
    };

    // Loop through each browser and test the identification

    (Object.keys(userAgents) as BrowserName[]).forEach((browserName) => {
      const userAgent = userAgents[browserName];
      Object.defineProperty(global.navigator, 'userAgent', {
        value: userAgent,
        configurable: true,
        writable: true,
      });

      const instance = new UserAgent();
      expect(instance.browser).toBe(browserName);
    });
  });

  it('should correctly identify mobile devices', () => {
    const mobileUserAgents = [
      'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Mobile Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPad; CPU OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPod touch; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
      // Add more mobile user agents for testing different scenarios
    ];

    mobileUserAgents.forEach((userAgent) => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: userAgent,
        configurable: true,
        writable: true,
      });

      const instance = new UserAgent();
      expect(instance.isMobile).toBe(true);
    });
  });

  // Add more test cases for different scenarios and methods as needed
});
