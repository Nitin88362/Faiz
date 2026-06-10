const axios = require('axios');

async function translate(text, { from, to }) {
  try {
    const sl = from || 'auto';
    const tl = to;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await axios.get(url);
    
    if (response.data && response.data[0]) {
      const translatedText = response.data[0].map(item => item[0]).join('');
      return { text: translatedText };
    } else {
      throw new Error('Invalid response structure from translation API');
    }
  } catch (err) {
    throw new Error('Translation API request failed: ' + err.message);
  }
}

module.exports = { translate };
