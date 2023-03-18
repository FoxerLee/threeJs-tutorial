const FormData = require("form-data");
const axios = require("axios");
const openaiApi = require("./openai-api.js");

export const recordDef = () => {

  let audioChunks = [];
  let rec;

  navigator.mediaDevices.getUserMedia({audio:true})
      .then(stream => {handlerFunction(stream)})

            function handlerFunction(stream) {
            rec = new MediaRecorder(stream);
            rec.ondataavailable = e => {
              audioChunks.push(e.data);
              if (rec.state == "inactive"){
                let blob = new Blob(audioChunks,{type:'audio/mpeg-3'});
                recordedAudio.src = URL.createObjectURL(blob);
                recordedAudio.controls=true;
                recordedAudio.autoplay=true;
                openaiApi.openAiTranscription(blob);
              }
            }
          }
      

        record.onclick = e => {
          console.log('I was clicked')
          record.disabled = true;
          record.style.backgroundColor = "blue"
          stopRecord.disabled=false;
          audioChunks = [];
          rec.start();
        }
        stopRecord.onclick = e => {
          console.log("I was clicked")
          record.disabled = false;
          stop.disabled=true;
          record.style.backgroundColor = "red"
          rec.stop();
        }

}