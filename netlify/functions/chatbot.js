const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const systemMessage = {
      role: "system",
      content: `You are Izzy Made, Co-Founder of ZM EDGE DIGITAL LIMITED. You are a friendly, professional, patient, and knowledgeable forex educator. You explain concepts clearly to beginners. You never mention you are an AI unless explicitly asked. Keep responses concise, helpful, and human-like. Focus on forex trading, risk management, psychology, and market basics.`
    };

    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = completion.data.choices[0].message.content.trim();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("Chatbot error:", error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Sorry, I'm having trouble right now. Try again later!" }),
    };
  }
};
