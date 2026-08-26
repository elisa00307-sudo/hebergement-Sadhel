const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

/* TEST */

app.get("/", (req, res) => {
    res.json({
        status: "Sadhel en ligne 🟢"
    });
});

/* CHAT */

app.post("/chat", async (req, res) => {

    try {

        // Récupère les messages envoyés par le frontend
        const { messages } = req.body;

        // Vérification des messages
        if (!messages || !Array.isArray(messages)) {

            return res.status(400).json({
                reply: "❌ Messages invalides"
            });

        }

        /* Vérification API KEY */

        if (!API_KEY) {

            console.log("❌ API_KEY manquante");

            return res.status(500).json({
                reply: "❌ API KEY manquante"
            });

        }

        console.log("📨 Message reçu");

        /* REQUÊTE GROQ */

        const response = await axios.post(

            "https://api.groq.com/openai/v1/chat/completions",

            {
                model: "qwen/qwen3.6-27b",
                messages: messages,
                temperature: 0.7
            },

            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },

                timeout: 30000
            }

        );

        console.log("✅ Réponse Groq reçue");

        const data = response.data;

        console.log(JSON.stringify(data, null, 2));

        /* Vérifie la réponse */

        if (
            !data ||
            !data.choices ||
            !data.choices[0] ||
            !data.choices[0].message
        ) {

            return res.status(500).json({
                reply: "❌ Réponse IA invalide"
            });

        }

        let reply = data.choices[0].message.content;

        // Supprime le raisonnement <think>...</think>
        reply = reply
            .replace(/<think>[\s\S]*?<\/think>/gi, "")
            .trim();

        /* ENVOIE LA RÉPONSE */

        res.json({
            reply: reply
        });

    } catch (error) {

        console.log("🔥 ERREUR BACKEND");

        if (error.response) {

            console.log("Erreur Groq :", error.response.data);

        } else {

            console.log(error.message);

        }

        res.status(500).json({
            reply: "❌ Erreur serveur Sadhel"
        });

    }

});

/* PORT */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        "🚀 Sadhel tourne sur le port " + PORT
    );

});