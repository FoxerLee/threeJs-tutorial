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
                Authorization: `Bearer ${"{openai-api-key"}`,
                "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            },
        })
        .then((response) => {
            console.log(response.data);
            const speechResult = response.data;
            document.getElementById('speechResult').innerHTML = speechResult.text;
        })
        .catch((error) => {
            console.error(error);
        });
}

