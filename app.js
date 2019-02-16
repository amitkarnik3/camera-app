<style>
    html,
    body {
        margin: 0 !important;
        padding: 0 !important;
    }
</style>

<title>Video Recording | RecordRTC</title>
<h1>Simple Video Recording using RecordRTC</h1>

<br>

<button id="btn-start-recording">Start Recording</button>
<button id="btn-stop-recording" disabled>Stop Recording</button>

<hr>
<video controls autoplay playsinline></video>
<filter id="displacement" x="0%" y="0%" height="100%" width="100%">
    <feDisplacementMap scale="100" in2="SourceGraphic" xChannelSelector="G" />
</filter>

<script src="https://cdn.webrtc-experiment.com/RecordRTC.js"></script>
<script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
<script>
    var video = document.querySelector('video');

    function captureCamera(callback) {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function (camera) {
            callback(camera);
        }).catch(function (error) {
            alert('Unable to capture your camera. Please check console logs.');
            console.error(error);
        });
    }

    function stopRecordingCallback() {
        video.src = video.srcObject = null;
        video.muted = false;
        video.volume = 1;
        video.src = URL.createObjectURL(recorder.getBlob());
        video.style.webkitFilter = 'url(#displacement)';
        video.style.mozFilter = 'url(#displacement)';
        video.style.filter = 'url(#displacement)'
        recorder.camera.stop();
        recorder.destroy();
        recorder = null;
    }

    var recorder; // globally accessible

    document.getElementById('btn-start-recording').onclick = function () {
        this.disabled = true;
        captureCamera(function (camera) {
            video.muted = true;
            video.volume = 0;
            video.srcObject = camera;

            recorder = RecordRTC(camera, {
                type: 'video'
            });

            recorder.startRecording();

            // release camera on stopRecording
            recorder.camera = camera;

            document.getElementById('btn-stop-recording').disabled = false;
        });
    };

    document.getElementById('btn-stop-recording').onclick = function () {
        this.disabled = true;
        recorder.stopRecording(stopRecordingCallback);
    };
</script>

<footer style="margin-top: 20px;"><small id="send-message"></small></footer>
<script src="https://cdn.webrtc-experiment.com/common.js"></script>
