const puppeteer = require("puppeteer-core");
const EventEmiter = require("events");
const path = require("path");

class Client extends EventEmiter {
  /**
   * @param {Object} obj
   * @param {String} obj.chromePath
   * @param {Boolean} obj.continuous
   */
  constructor({ chromePath, continuous }) {
    super();
    console.log("is it  recreating new class?");
    this.chromePath = chromePath;
    this.continuous = continuous || false;
    console.log("is it initting a new client?");
    this.init();
    Client.instance = this;
    return Client.instance;
  }

  record() {
    console.log("==== WSRN START ====");
    if (this.page)
      this.page.evaluate(
        (continuous) => startRecording(continuous),
        this.continuous
      );
    console.log("==== WSRN START ====");
  }

  stopRecording() {
    console.log("==== WSRN ABORT ====");
    if (this.page) this.page.evaluate(() => stopRecording(), this.continuous);
    this.browser.close();
    console.log("==== WSRN ABORT ====");
  }
  halt() {
    console.log("==== WSRN HALT ====");
    this.browser.close();
    console.log("==== WSRN HALT ====");
  }
  async openBrowser() {
    this.browser = await puppeteer.launch({
      headless: false,
      args: [
        "--window-size=0,0",
        "--enable-speech-input",
        "--window-position=0,0",
        "--enable-speech-dispatcher", // Needed for Linux?
        "--use-fake-ui-for-media-stream", // dissable mic popup
        "--no-first-run",
        "--no-default-browser-check",
      ],
      executablePath: this.chromePath,
      ignoreDefaultArgs: "--mute-audio",
    });
    const [page] = await this.browser.pages();
    this.page = page;
  }
  async init() {
    try {
      this.browser = await puppeteer.launch({
        headless: false,
        args: [
          "--window-size=0,0",
          "--enable-speech-input",
          "--window-position=0,0",
          "--enable-speech-dispatcher", // Needed for Linux?
          "--use-fake-ui-for-media-stream", // dissable mic popup
          "--no-first-run",
          "--no-default-browser-check",
        ],
        executablePath: this.chromePath,
        ignoreDefaultArgs: "--mute-audio",
      });

      const [page] = await this.browser.pages();
      this.page = page;

      await page.exposeFunction("newTranscript", (e) => {
        /**
         * @event Client#data
         * @type {String}
         */
        this.emit("data", e);
      });
      await page.exposeFunction("newError", (e) => this.emit("error", e));
      await page.exposeFunction("newEnd", () => this.emit("end"));
      await page.exposeFunction("newStart", () => this.emit("start"));
      await page.exposeFunction("newReady", () => this.emit("ready"));
      await page.goto(`file:${path.join(__dirname, "/html/index.html")}`);
    } catch (err) {
      this.emit("error", err);
    }
  }
}

module.exports = Client;
