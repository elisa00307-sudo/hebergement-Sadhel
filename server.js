const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 TA CLÉ GROQ
const API_KEY = "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";

app.post("/chat", async (req, res) => {

    const messages = req.body.messages;

    if (!messages || messages.length === 0) {
        return res.json({ reply: "❌ Aucun message reçu" });
    }

    try {

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages
                })
            }
        );

        const data = await response.json();

        if (!data.choices?.[0]?.message?.content) {
            return res.json({ reply: "❌ Sadhel ne répond pas" });
        }

        res.json({
            reply: data.choices[0].message.content
        });

    } catch (e) {
        res.json({ reply: "❌ Erreur serveur Sadhel" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Sadhel tourne sur le port " + PORT);
});