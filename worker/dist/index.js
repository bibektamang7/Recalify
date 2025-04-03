"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const chrome_1 = require("selenium-webdriver/chrome");
function OpenBrowser(driver) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield driver.get("https://meet.google.com/vmi-gpew-hvb");
            const gotItButton = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath("//span[text()='Got it']")), 10000);
            yield gotItButton.click();
            const InputText = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath("//input[@placeholder='Your name']")), 10000);
            yield InputText.click();
            yield InputText.sendKeys("value", "Bibek Tamang bot");
            const joinButton = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath("//span[text()='Ask to join']")), 2000);
            yield joinButton.click();
        }
        catch (error) { }
    });
}
function getDriver() {
    return __awaiter(this, void 0, void 0, function* () {
        const option = new chrome_1.Options();
        option.addArguments("--disable-blink-features=AutomationControlled");
        option.addArguments("--use-fake-ui-for-media-stream");
        option.addArguments("--window-size=1080,720");
        option.addArguments("--auto-select-desktop-capture-source=[RECORD]");
        option.addArguments("--enable-usermedia-screen-capturing");
        option.addArguments("--allow-running-insecure-content");
        let driver = yield new selenium_webdriver_1.Builder()
            .forBrowser(selenium_webdriver_1.Browser.CHROME)
            .setChromeOptions(option)
            .build();
        return driver;
    });
}
function startScreenRecording(driver) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield driver.executeScript(`

        function wait(delayInMS) {
            return new Promise((resolve) => setTimeout(resolve, delayInMS));
        }

        function startRecording(stream, lengthInMS) {
            let recorder = new MediaRecorder(stream);
            let data = [];
            
            recorder.ondataavailable = (event) => data.push(event.data);
            recorder.start();
            
            let stopped = new Promise((resolve, reject) => {
                recorder.onstop = resolve;
                recorder.onerror = (event) => reject(event.name);
            });
            
            let recorded = wait(lengthInMS).then(() => {
                if (recorder.state === "recording") {
                recorder.stop();
                }
            });
            
            return Promise.all([stopped, recorded]).then(() => data);
        }
      
        console.log("before mediadevices")
        window.navigator.mediaDevices.getDisplayMedia({
            video: {
              displaySurface: "browser"
            },
            audio: true,
            preferCurrentTab: true
        }).then(async screenStream => {                        
            const audioContext = new AudioContext();
            const screenAudioStream = audioContext.createMediaStreamSource(screenStream)
            const audioEl1 = document.querySelectorAll("audio")[0];
            const audioEl2 = document.querySelectorAll("audio")[1];
            const audioEl3 = document.querySelectorAll("audio")[2];
            const audioElStream1 = audioContext.createMediaStreamSource(audioEl1.srcObject)
            const audioElStream2 = audioContext.createMediaStreamSource(audioEl3.srcObject)
            const audioElStream3 = audioContext.createMediaStreamSource(audioEl2.srcObject)

            const dest = audioContext.createMediaStreamDestination();

            screenAudioStream.connect(dest)
            audioElStream1.connect(dest)
            audioElStream2.connect(dest)
            audioElStream3.connect(dest)

            // window.setInterval(() => {
            //   document.querySelectorAll("audio").forEach(audioEl => {
            //     if (!audioEl.getAttribute("added")) {
            //       console.log("adding new audio");
            //       const audioEl = document.querySelector("audio");
            //       const audioElStream = audioContext.createMediaStreamSource(audioEl.srcObject)
            //       audioEl.setAttribute("added", true);
            //       audioElStream.connect(dest)
            //     }
            //   })

            // }, 2500);
          
          // Combine screen and audio streams
          const combinedStream = new MediaStream([
              ...screenStream.getVideoTracks(),
              ...dest.stream.getAudioTracks()
          ]);
          
          console.log("before start recording")
          const recordedChunks = await startRecording(combinedStream, 60000);
          console.log("after start recording")
          
          let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
          
          // Create download for video with audio
          const recording = document.createElement("video");
          recording.src = URL.createObjectURL(recordedBlob);
          
          const downloadButton = document.createElement("a");
          downloadButton.href = recording.src;
          downloadButton.download = "RecordedScreenWithAudio.webm";    
          downloadButton.click();
          
          console.log("after download button click")
          
          // Clean up streams
          screenStream.getTracks().forEach(track => track.stop());
          audioStream.getTracks().forEach(track => track.stop());
        })
        
    `);
        yield driver.sleep(100000);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const driver = yield getDriver();
        yield OpenBrowser(driver);
        yield new Promise((x) => setTimeout(x, 20000));
        yield startScreenRecording(driver);
    });
}
main();
