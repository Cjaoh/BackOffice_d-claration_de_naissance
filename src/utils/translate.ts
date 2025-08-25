import axios from 'axios';

export type LanguageCode = 'fr' | 'en' | 'mg';

export const translateText = async (text: string, targetLang: LanguageCode): Promise<string> => {
  if (!text.trim()) return '';

  try {
    const response = await axios.post(
      'https://libretranslate.de/translate',
      {
        q: text,
        source: 'auto',
        target: targetLang,
        format: 'text',
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return response.data.translatedText;
  } catch (error) {
    console.error(error);
    return 'Erreur de traduction';
  }
};
