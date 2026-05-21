const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const fetch = (...args) =>
  import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_KEY = process.env.API_KEY;

app.get("/", (req, res) => {
    res.json({ status: "Sadhel en ligne 🟢" });
});

app.post("/chat", async (req, res) => {

    const messages = req.body.messages;

    if (!messages) {
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
                    messages: messages
                })
            }
        );

        const data = await response.json();

        console.log("GROQ RESPONSE:", data);

        if (!data.choices || !data.choices[0]) {
            return res.json({
                reply: "❌ Sadhel n'a pas reçu de réponse IA"
            });
        }

        res.json({
            reply: data.choices[0].message.content
        });

    } catch (error) {
        console.log(error);
        res.json({ reply: "❌ Erreur serveur Sadhel" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Sadhel tourne sur " + PORT);
});