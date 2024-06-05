export enum BrowserName {
  Opera = 'Opera',
  MicrosoftEdge = 'Microsoft Edge',
  GoogleChrome = 'Google Chrome',
  MozillaFirefox = 'Mozilla Firefox',
  AppleSafari = 'Apple Safari',
  MicrosoftInternetExplorer = 'Microsoft Internet Explorer',
  UcBrowser = 'UC Browser',
  SamsungBrowser = 'Samsung Browser',
  UnknownBrowser = 'Unknown Browser',
}

export class UserAgent {
  static instance: UserAgent = new UserAgent();
  readonly browser: BrowserName;

  constructor() {
    this.browser = this.getBrowserType();

    if (typeof self !== 'undefined') {
      Object.assign(self, {
        UserAgent: this,
      });
    }
  }

  get isOpera(): boolean {
    return this.browser === BrowserName.Opera;
  }

  get isEdge(): boolean {
    return this.browser === BrowserName.MicrosoftEdge;
  }

  get isChrome(): boolean {
    return this.browser === BrowserName.GoogleChrome;
  }

  get isFireFox(): boolean {
    return this.browser === BrowserName.MozillaFirefox;
  }

  get isSafari(): boolean {
    return this.browser === BrowserName.AppleSafari;
  }

  get isInternetExplorer(): boolean {
    return this.browser === BrowserName.MicrosoftInternetExplorer;
  }

  get isUC(): boolean {
    return this.browser === BrowserName.UcBrowser;
  }

  get isSamsung(): boolean {
    return this.browser === BrowserName.SamsungBrowser;
  }

  get isUnknown(): boolean {
    return this.browser === BrowserName.UnknownBrowser;
  }

  get isMobile(): boolean {
    const regex =
      /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return this.validate(regex);
  }

  get isIOS() {
    return this.validate(/iPad|iPhone|iPod/i);
  }

  get isIphone() {
    return this.validate(/iPhone/i);
  }

  get isIpad() {
    return this.validate(/iPad/i);
  }

  get isIpod() {
    return this.validate(/iPod/i);
  }

  get isAndroid() {
    return this.validate(/Android/i);
  }

  private getBrowserType(): BrowserName {
    if (this.validate(/opr\//i)) {
      return BrowserName.Opera;
    } else if (this.validate(/edg/i)) {
      return BrowserName.MicrosoftEdge;
    } else if (this.validate(/chrome|chromium|crios/i)) {
      return BrowserName.GoogleChrome;
    } else if (this.validate(/firefox|fxios/i)) {
      return BrowserName.MozillaFirefox;
    } else if (this.validate(/safari/i)) {
      return BrowserName.AppleSafari;
    } else if (this.validate(/trident/i)) {
      return BrowserName.MicrosoftInternetExplorer;
    } else if (this.validate(/ucbrowser/i)) {
      return BrowserName.UcBrowser;
    } else if (this.validate(/samsungbrowser/i)) {
      return BrowserName.SamsungBrowser;
    } else {
      return BrowserName.UnknownBrowser;
    }
  }

  private validate = (regexp: RegExp) => {
    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.userAgent !== 'undefined'
    ) {
      return regexp.test(navigator.userAgent);
    }
    return regexp.test('');
  };
}
