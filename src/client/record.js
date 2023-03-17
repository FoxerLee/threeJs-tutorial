const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});

export const recordDef = () => {

  let audioChunks = [];
  let rec;
  const openai = new OpenAIApi(configuration);

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
                sendData(blob);
              }
            }
          }
        async function sendData(data) {
          console.log(data);
          const resp = await openai.createTranscription(
              data,
              "whisper-1"
          );
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