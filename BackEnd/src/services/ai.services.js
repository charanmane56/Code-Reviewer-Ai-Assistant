// ai.services.js

const dotenv = require('dotenv');
dotenv.config(); 

const { GoogleGenAI } = require("@google/genai");

const GOOGLE_GEMINI_KEY = process.env.GOOGLE_GEMINI_KEY;

const ai = new GoogleGenAI({ apiKey: GOOGLE_GEMINI_KEY });

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateAiContent(code) {
    const MAX_RETRIES = 4;
    
    if (!GOOGLE_GEMINI_KEY) { 
        throw new Error("FATAL: GOOGLE_GEMINI_KEY environment variable is not set.");
    }

    const codeReviewPrompt = `
        You are an experienced Senior Code Reviewer. 
        Analyze the following code for **quality, best practices, efficiency, readability, and security**.
        
        Format your entire response using **Markdown** only, structured with these clear headings:
        
        ## 🚀 Summary of Review
        A brief, encouraging summary.
        
        ## 🔍 Issues Found
        Use bullet points to detail all issues (bugs, anti-patterns, security risks).
        
        ## ✅ Recommended Improvements
        Provide concrete, refactored code examples where significant changes are needed, wrapped in code blocks (\`\`\`).
        
        ## 💡 Best Practices & Notes
        Final tips and observations.

        The code to review is:
        
        \`\`\`
        ${code}
        \`\`\`
    `;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            // 🟢 FIX APPLIED HERE: Use ai.models.generateContent
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash", 
                contents: codeReviewPrompt 
            });
            
            if (!response.text) {
                 throw new Error("The AI service returned an empty or blocked response.");
            }

            return response.text; 

        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error.message);

            if (attempt === MAX_RETRIES) {
                console.error("AI Service failed after 4 retries.");
                throw new Error("AI Service failed after multiple retries. Check API key and network.");
            }

            const waitTime = Math.pow(2, attempt) * 1000;
            console.log(`Retrying in ${waitTime / 1000} seconds...`);
            await delay(waitTime);
        }
    }
}

module.exports = generateAiContent;