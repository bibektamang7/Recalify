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
function startScreenShare() {
    window.navigator.mediaDevices
        .getDisplayMedia({
        video: {
            displaySurface: "browser",
        },
        audio: true,
    })
        .then((stream) => __awaiter(this, void 0, void 0, function* () {
        const audioContext = new AudioContext();
        // consider this, because we don't need bot audio
        const screenAudioStream = audioContext.createMediaStreamSource(stream);
        const audioElement1 = document.querySelectorAll("audio")[0];
        const audioElement2 = document.querySelectorAll("audio")[1];
        const audioElement3 = document.querySelectorAll("audio")[2];
        const audioELementStream1 = audioContext.createMediaStreamSource(audioElement1.srcObject);
        const audioELementStream2 = audioContext.createMediaStreamSource(audioElement2.srcObject);
        const audioELementStream3 = audioContext.createMediaStreamSource(audioElement3.srcObject);
        const destination = audioContext.createMediaStreamDestination();
        screenAudioStream.connect(destination);
        audioELementStream1.connect(destination);
        audioELementStream2.connect(destination);
        audioELementStream3.connect(destination);
        const combinedStream = new MediaStream([
            ...stream.getVideoTracks(),
            ...destination.stream.getAudioTracks(),
        ]);
        const recordedChunks = yield startRecord(stream, 20000);
        let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
        const recording = document.createElement("video");
        recording.src = URL.createObjectURL(recordedBlob);
        const downloadButton = document.createElement("a");
        downloadButton.href = recording.src;
        downloadButton.download = "RecordedScreen.webm";
        downloadButton.click();
        stream.getTracks().forEach((track) => track.stop());
    }))
        .catch((error) => console.log("something went wrong while recording screen", error));
}
function startRecord(stream, recordingLength) {
    const recorder = new MediaRecorder(stream);
    let recordedChunck = [];
    recorder.ondataavailable = (event) => {
        recordedChunck.push(event.data);
    };
    recorder.onstop = function (event) { };
    let stopped = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = (event) => reject(event.name);
    });
    let recorded = wait(recordingLength).then(() => {
        if (recorder.state === "recording") {
            recorder.stop();
        }
    });
    return Promise.all([stopped, recorded]).then(() => recordedChunck);
}
function wait(timeLength) {
    return new Promise((resolve) => setTimeout(resolve, timeLength));
}
