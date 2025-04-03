function startScreenShare() {
	window.navigator.mediaDevices
		.getDisplayMedia({
			video: {
				displaySurface: "browser",
			},
			audio: true,
		})
		.then(async (stream) => {
			const audioContext = new AudioContext();
			// consider this, because we don't need bot audio
			const screenAudioStream = audioContext.createMediaStreamSource(stream);
			const audioElement1 = document.querySelectorAll("audio")[0];
			const audioElement2 = document.querySelectorAll("audio")[1];
			const audioElement3 = document.querySelectorAll("audio")[2];

			const audioELementStream1 = audioContext.createMediaStreamSource(
				audioElement1.srcObject as MediaStream
			);
			const audioELementStream2 = audioContext.createMediaStreamSource(
				audioElement2.srcObject as MediaStream
			);
			const audioELementStream3 = audioContext.createMediaStreamSource(
				audioElement3.srcObject as MediaStream
			);

			const destination = audioContext.createMediaStreamDestination();

			screenAudioStream.connect(destination);
			audioELementStream1.connect(destination);
			audioELementStream2.connect(destination);
			audioELementStream3.connect(destination);

			const combinedStream = new MediaStream([
				...stream.getVideoTracks(),
				...destination.stream.getAudioTracks(),
			]);

			const recordedChunks = await startRecord(stream, 20000);

			let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
			const recording = document.createElement("video");
			recording.src = URL.createObjectURL(recordedBlob);

			const downloadButton = document.createElement("a");
			downloadButton.href = recording.src;
			downloadButton.download = "RecordedScreen.webm";
			downloadButton.click();

			stream.getTracks().forEach((track) => track.stop());
		})

		.catch((error: any) =>
			console.log("something went wrong while recording screen", error)
		);
}

function startRecord(stream: MediaStream, recordingLength: number) {
	const recorder = new MediaRecorder(stream);
	let recordedChunck: Blob[] = [];

	recorder.ondataavailable = (event: BlobEvent) => {
		recordedChunck.push(event.data);
	};

	recorder.onstop = function (event) {};

	let stopped = new Promise((resolve, reject) => {
		recorder.onstop = resolve;
		recorder.onerror = (event: any) => reject(event.name);
	});

	let recorded = wait(recordingLength).then(() => {
		if (recorder.state === "recording") {
			recorder.stop();
		}
	});

	return Promise.all([stopped, recorded]).then(() => recordedChunck);
}

function wait(timeLength: number) {
	return new Promise((resolve) => setTimeout(resolve, timeLength));
}
