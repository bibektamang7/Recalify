import {
	Builder,
	Browser,
	By,
	Key,
	until,
	WebDriver,
} from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";

async function OpenBrowser(driver: WebDriver) {
	try {
		await driver.get("https://meet.google.com/vmi-gpew-hvb");

		const gotItButton = await driver.wait(
			until.elementLocated(By.xpath("//span[text()='Got it']")),
			10000
		);
		await gotItButton.click();

		const InputText = await driver.wait(
			until.elementLocated(By.xpath("//input[@placeholder='Your name']")),
			10000
		);
		await InputText.click();
		await InputText.sendKeys("value", "Bibek Tamang bot");

		const joinButton = await driver.wait(
			until.elementLocated(By.xpath("//span[text()='Ask to join']")),
			2000
		);
		await joinButton.click();
	} catch (error) {}
}

async function getDriver() {
	const option = new Options();

	option.addArguments("--disable-blink-features=AutomationControlled");
	option.addArguments("--use-fake-ui-for-media-stream");
	option.addArguments("--window-size=1080,720");
	option.addArguments("--auto-select-desktop-capture-source=[RECORD]");
	option.addArguments("--enable-usermedia-screen-capturing");
	option.addArguments("--allow-running-insecure-content");

	let driver = await new Builder()
		.forBrowser(Browser.CHROME)
		.setChromeOptions(option)
		.build();

	return driver;
}

async function startScreenRecording(driver: WebDriver) {
	const response = await driver.executeScript(`

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

	await driver.sleep(100000);
}

async function main() {
	const driver = await getDriver();
	await OpenBrowser(driver);

	await new Promise((x) => setTimeout(x, 20000));
	await startScreenRecording(driver);
}

main();
