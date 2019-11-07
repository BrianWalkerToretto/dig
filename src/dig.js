const win = window;
// 构造函数
const Dig = function(url, data = {}) {
  if(this instanceof Dig){
    return this.init(url, data);
  }
  return new Dig(url, data);
}

Dig.prototype = {
  constructor: Dig,
  version: 'default',
  init: function(url, props) {
    // 'autotrack': true, // 是否打开全埋点监测
    this.url = url;
    this.params = {
      ...props,
      performance: this.performance(),
      ...this.getAll()
    }
    this.send({
      tp: 'load',
      ev: 'load'
    });
    return this;
  },
  // 在原型上添加一堆方法
  performance: function() {
    if(!win.performance){
      return {};
    }
    const {
      navigationStart,
      unloadEventStart,
      unloadEventEnd,
      redirectStart,
      redirectEnd,
      fetchStart,
      domainLookupStart,
      domainLookupEnd,
      connectStart,
      connectEnd,
      secureConnectionStart,
      requestStart,
      responseStart,
      responseEnd,
      domLoading,
      domInteractive,
      domContentLoadedEventStart,
      domContentLoadedEventEnd,
      domComplete,
      loadEventStart,
      loadEventEnd
    } = performance.timing;
    const dns = domainLookupEnd - domainLookupStart; // DNS查询耗时
    const tcp = connectEnd - connectStart; // TCP链接耗时
    const req = responseEnd - responseStart; // request请求耗时
    const parse = domComplete - domInteractive; // 解析dom树耗时
    // const white = responseStart - navigationStart; // 首字节时间
    const white = domInteractive - navigationStart; // 白屏时间
    const ready = domContentLoadedEventEnd - navigationStart; // domready时间
    const load = loadEventEnd - navigationStart; // onload时间
    const redirect = redirectEnd - redirectStart; // 重定向耗时

    const resourceCount = performance.getEntries().length// 静态资源的数组列表

    const {
      type: sourceType,
      redirectCount
    } = performance.navigation;
    const {
      usedJSHeapSize = 0, // JS 对象（包括V8引擎内部对象）占用的内存，一定小于 totalJSHeapSize，否则可能出现内存泄漏
      totalJSHeapSize = 0, // 可使用的内存
      jsHeapSizeLimit = 0 // 内存大小限制
    } = performance.memory || {};
    return JSON.stringify({
      dns, tcp, req, parse, white, ready, load, redirect, // timing
      resourceCount, // getEntries
      sourceType, redirectCount, // navigation
      usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit // memory
    });
  },
  getOS: function() {
    var sUserAgent = navigator.userAgent;
    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
    if (isMac) return "Mac";
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    if (isUnix) return "Unix";
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
    if (isLinux) return "Linux";
    if (isWin) {
        var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
        if (isWin2K) return "Win2000";
        var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
        if (isWinXP) return "WinXP";
        var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
        if (isWin2003) return "Win2003";
        var isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
        if (isWinVista) return "WinVista";
        var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
        if (isWin7) return "Win7";
        var isWin10 = sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 10") > -1;
        if (isWin10) return "Win10";
    }
    return "other";
  },
  Browse: function() {
    var browser = {};
    var userAgent = navigator.userAgent.toLowerCase();
    var s;
    (s = userAgent.match(/msie ([\d.]+)/)) ? browser.ie = s[1] : (s = userAgent.match(/firefox\/([\d.]+)/)) ? browser.firefox = s[1] : (s = userAgent.match(/chrome\/([\d.]+)/)) ? browser.chrome = s[1] : (s = userAgent.match(/opera.([\d.]+)/)) ? browser.opera = s[1] : (s = userAgent.match(/version\/([\d.]+).*safari/)) ? browser.safari = s[1] : 0;
    var version = "";
    if (browser.ie) {
      version = 'IE ' + browser.ie;
    } else {
        if (browser.firefox) {
            version = 'firefox ' + browser.firefox;
        }
        else {
            if (browser.chrome) {
                version = 'chrome ' + browser.chrome;
            }
            else {
                if (browser.opera) {
                    version = 'opera ' + browser.opera;
                }
                else {
                    if (browser.safari) {
                        version = 'safari ' + browser.safari;
                    }
                    else {
                        version = '未知浏览器';
                    }
                }
            }
        }
    }
    return version;
  },
  getAll: function(){
    return {
      // pc/移动端/小程序
      os: this.getOS(), // 操作系统
      br: this.Browse(),  // 浏览器类型+版本
      v: this.version, // dig版本
      // tp: '埋点类型', // event load(performance) error"
      // ev: '事件', // load click, change error...
      na: navigator.userAgent,
      domain: document.domain, // domain
      t: Date.now(), //  Date.now()
      u: location.href, // location.href
      su: document.referrer, // document.referrer
      title: document.title, // document.title
      ln: navigator.language, // navigator.language
      cl:  window.screen.colorDepth + '-bit', // window.screen.colorDepth
      // lat: '纬度',
      // lgt: '经度',
      ds: window.screen.width + '*' + window.screen.height, // window.screen.width * window.screen.height
    };
  },
  getParams: function(params){
    let paramStr = '';
    Object.keys(params).forEach(key => {
      paramStr += key + '=' + params[key] + '&';
    });

    return paramStr.substr(0, paramStr.length -1);
  },
  send: function(props = {}){
    const params = this.getParams({
      ...this.params,
      ...props
    });
    const img = new Image();

    img.crossOrigin = 'anonymous';
    img.src = this.url + '?' + params;

    return this;
  },
}

export default Dig;
