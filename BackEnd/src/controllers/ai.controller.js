const aiService = require("../services/ai.services");

// CORRECT EXPORT: Export an object with the function named 'getResponse'
module.exports.getReview = async (req, res) => {
    const code = req.body.code;

    if (!code) {
        // Use consistent status codes and formats for API errors
        return res.status(400).json({ error: "Prompt is required in the query parameter or body." });
    }

    try {
        // aiService is now correctly exported as a function that takes a prompt
        const responseText = await aiService(code); 

        // Send the response text back
        res.json({ response: responseText });

    } catch (error) {
        console.error("Error in ai.controller.getResponse:", error.message);
        res.status(500).json({ error: "Internal server error during AI processing." });
    }
};
