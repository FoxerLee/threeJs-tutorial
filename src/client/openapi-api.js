const { Configuration, OpenAIApi } = require("openai");
// fs = require('fs');

const configuration = new Configuration({
  apiKey: "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",
});


export const getSpeechResult = async () => {
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Say this is a test",
    temperature: 0,
    max_tokens: 7,
    });
    console.log(response);
    // let data = readFile('./asset/audio/Wandering_Star.mp3');
    // console.log(data);
    // mp3File = fs.createReadStream("/Users/liyuan/Developer/zoeThree/foxerlee/dist/client/asset/audio/Wandering_Star.mp3");
    // console.log(mp3File);
    // const resp = await openai.createTranscription(
    //   mp3File,
    //   "whisper-1"
    // );
    // console.log(resp);


//     // const resp = await openai.createTranscription(
//     //     readFile("./asset/audio/Wandering_Star.mp3"),
//     //     "whisper-1"
//     //   );
}

// getSpeechResult();    

