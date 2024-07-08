import axios from 'axios';

const OPENAI_API_KEY = 'sk-proj-C1umowmbR58IraNdfoYAT3BlbkFJUiciCAzTy1p6PtIgVmW4';

const OpenAISpeechService = async (audioBlob) => {
  const formData = new FormData();
  formData.append('file', {
    uri: audioBlob._data.uri,
    name: audioBlob._data.name,
    type: 'audio/wav', // Asegúrate de que el tipo MIME sea correcto
  });
  formData.append('model', 'whisper-1');

  try {
    console.log('Form Data:', formData);
    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('OpenAI API Response:', response);
    return response.data.text;
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    throw error;
  }
};

export default OpenAISpeechService;
