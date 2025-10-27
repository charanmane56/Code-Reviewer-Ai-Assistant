const aiService = require("../services/ai.services");

module.exports.getReview = async (req, res) => {
    const code = req.body.code;

    if (!code) {
        
        return res.status(400).json({ error: "Prompt is required in the query parameter or body." });
    }

    try {

        const responseText = await aiService(code); 

        res.json({ review: responseText });

    } catch (error) {
        console.error("Error in ai.controller.getResponse:", error.message);
        res.status(500).json({ error: "Internal server error during AI processing." });
    }
};
