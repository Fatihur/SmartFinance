import axios from 'axios';
import { API_CONFIG } from '../constants';
import { ParsedTransaction, GeminiResponse } from '../types';
import { parseAmount } from '../utils';

export class GeminiService {
  private static readonly API_URL = API_CONFIG.GEMINI_API_URL;
  private static readonly API_KEY = API_CONFIG.GEMINI_API_KEY;

  static async parseVoiceToTransaction(voiceText: string): Promise<ParsedTransaction> {
    try {
      const prompt = this.createPrompt(voiceText);
      
      const response = await axios.post(
        `${this.API_URL}?key=${this.API_KEY}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 seconds timeout
        }
      );

      const geminiResponse: GeminiResponse = response.data;
      
      if (!geminiResponse.candidates || geminiResponse.candidates.length === 0) {
        throw new Error('No response from Gemini API');
      }

      const responseText = geminiResponse.candidates[0].content.parts[0].text;
      return this.parseGeminiResponse(responseText);
      
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Fallback to local parsing if API fails
      return this.fallbackParsing(voiceText);
    }
  }

  private static createPrompt(voiceText: string): string {
    return `
Analisis teks berikut dan ekstrak informasi transaksi keuangan dalam format JSON:

Teks: "${voiceText}"

Tolong ekstrak:
1. type: "income" atau "expense" 
2. amount: jumlah uang dalam angka (tanpa mata uang)
3. category: kategori yang sesuai dari daftar berikut:
   - Untuk income: Gaji, Freelance, Investasi, Bonus, Hadiah, Lainnya
   - Untuk expense: Makanan, Transportasi, Belanja, Hiburan, Kesehatan, Pendidikan, Tagihan, Lainnya
4. description: deskripsi singkat transaksi
5. confidence: tingkat kepercayaan parsing (0-1)

Contoh output:
{
  "type": "expense",
  "amount": 25000,
  "category": "Makanan",
  "description": "Beli kopi",
  "confidence": 0.9
}

Kata kunci untuk income: terima, dapat, gaji, bonus, hadiah, untung, masuk
Kata kunci untuk expense: beli, bayar, buat, keluar, habis, spend

Berikan hanya JSON response tanpa penjelasan tambahan.
`;
  }

  private static parseGeminiResponse(responseText: string): ParsedTransaction {
    try {
      // Clean the response text to extract JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        type: parsed.type === 'income' ? 'income' : 'expense',
        amount: parseAmount(parsed.amount?.toString() || '0'),
        category: parsed.category || 'Lainnya',
        description: parsed.description || '',
        confidence: Math.min(Math.max(parsed.confidence || 0.5, 0), 1),
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      throw new Error('Failed to parse Gemini response');
    }
  }

  private static fallbackParsing(voiceText: string): ParsedTransaction {
    const text = voiceText.toLowerCase();
    
    // Determine transaction type
    const incomeKeywords = ['terima', 'dapat', 'gaji', 'bonus', 'hadiah', 'untung', 'masuk'];
    const expenseKeywords = ['beli', 'bayar', 'buat', 'keluar', 'habis', 'spend'];
    
    let type: 'income' | 'expense' = 'expense'; // default to expense
    
    if (incomeKeywords.some(keyword => text.includes(keyword))) {
      type = 'income';
    } else if (expenseKeywords.some(keyword => text.includes(keyword))) {
      type = 'expense';
    }

    // Extract amount
    const amount = parseAmount(voiceText);

    // Simple category detection
    let category = 'Lainnya';
    if (text.includes('makan') || text.includes('kopi') || text.includes('nasi')) {
      category = 'Makanan';
    } else if (text.includes('bensin') || text.includes('ojek') || text.includes('bus')) {
      category = 'Transportasi';
    } else if (text.includes('baju') || text.includes('sepatu') || text.includes('belanja')) {
      category = 'Belanja';
    }

    return {
      type,
      amount,
      category,
      description: voiceText,
      confidence: 0.6, // Lower confidence for fallback parsing
    };
  }

  static isApiKeyConfigured(): boolean {
    return this.API_KEY !== 'YOUR_GEMINI_API_KEY_HERE' && this.API_KEY.length > 0;
  }
}
