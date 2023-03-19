const FormData = require("form-data");
const axios = require("axios");


export const openAiTranscription = async (data) => {
 
    const model = "whisper-1";
    const mp3File = new File([data], 'record.mp3');
    const formData = new FormData();
    formData.append("model", model);
    formData.append("file", mp3File);
    axios
        .post("https://api.openai.com/v1/audio/transcriptions", formData, {
            headers: {
                Authorization: `Bearer ${"OPEN-AI-KEY"}`,
                "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            },
        })
        .then((response) => {
            console.log(response.data);
            const speechResult = response.data.text;
            document.getElementById('record-message').innerHTML = speechResult;
            openAiChat(speechResult);
            //document.getElementById('textToCode').innerHTML = "<button>This is a new button</button>";
        })
        .catch((error) => {
            console.error(error);
        });
}


export const openAiChat = async (data) => {
    const model = "gpt-3.5-turbo";
    const messages = [
        {
            "role": "user",
            "content": data
        }
    ];
    const formData = {
        "model": model,
        "messages": messages,
        "stop": "4"
    }
    console.log("this function has been called");
    axios
        .post("https://api.openai.com/v1/chat/completions", formData, {
            headers: {
                Authorization: `Bearer ${"OPEN-AI-KEY"}`,
                "Content-Type": `application/json`,
            },
        })
        .then((response) => {
            console.log(response);
            const responseChoices = response.data.choices[0].message.content;
            console.log(responseChoices);
            document.getElementById('respond-message').innerHTML = responseChoices;
            //document.getElementById('textToCode').innerHTML = "<button>This is a new button</button>";
        })
        .catch((error) => {
            console.error(error);
            // console.log(error.)
        });
}

