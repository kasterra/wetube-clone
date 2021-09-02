const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullscreenBtn = document.getElementById("fullscreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let volumeValue = 0.5;
let controlsTimeout = null;
let controlsMovementTimeout = null;

const init = () => {
    video.volume = volumeValue;
};

const handlePlayClick = (e) => {
    //if the video is playing, pause it
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtn.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.classList = video.muted ? "fas fa-volume-up" : "fas fa-volume-mute";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
    const {
        target: { value },
    } = event;
    if (video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    video.volume = value;
};

const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOString().substr(11, 8);

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = video.duration;
};
const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
    const {
        target: { value },
    } = event;
    video.currentTime = value;
};
const handleFullscreen = (e) => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
        fullscreenBtn.classList = "fas fa-expand";
        document.exitFullscreen();
    } else {
        videoContainer.requestFullscreen();
        fullscreenBtn.classList = "fas fa-compress";
    }
};

const hideControls = () => {
    videoControls.classList.remove("showing");
};

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
};
const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
};
const handleKeyDown = (e) => {
    switch (e.code) {
        case "Space":
            handlePlayClick();
            break;
        case "KeyM":
            handleMute();
            break;
    }
};
const handleEnded = (e) => {
    const { videoid } = videoContainer.dataset;
    fetch(`/api/videos/${videoid}/view`, { method: "POST" });
};

if (video.readyState == 4) {
    handleLoadedMetadata();
}

init();

document.addEventListener("keydown", handleKeyDown);
playBtn.addEventListener("click", handlePlayClick);
video.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullscreenBtn.addEventListener("click", handleFullscreen);
