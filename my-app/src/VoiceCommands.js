// src/services/OpenAISpeechService.js
import axios from 'axios';

const OPENAI_API_KEY = 'sk-proj-C1umowmbR58IraNdfoYAT3BlbkFJUiciCAzTy1p6PtIgVmW4';

const OpenAISpeechService = async (audioBlob) => {
  const formData = new FormData();
  formData.append('file', audioBlob);
  formData.append('model', 'whisper-1');

  try {
    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.text;
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    throw error;
  }
};

export default OpenAISpeechService;
