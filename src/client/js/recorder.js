import { createFFmpeg, fetchFile }  from "@ffmpeg/ffmpeg";

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

const handleDownload = async() =>{
    const ffmpeg = createFFmpeg({log:true});
    await ffmpeg.load();

    ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFIle));

    const a = document.createElement("a");
    a.href = videoFile;
    a.download = "Myrecording.webm";
    document.body.appendChild(a);
    a.click();
}

const handleStart = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    });
    video.srcObject = stream;
    video.play();
};

startBtn.addEventListener("click", handleStart);
