import React, { useState } from 'react';
// 1. Import the GoogleGenerativeAI class
import { GoogleGenerativeAI } from "@google/generative-ai";

// 2. Initialize the Google AI Client outside of the component
// This prevents it from being re-initialized on every render
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! Tell me your symptoms and I will suggest which type of doctor you should see.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];

        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            // --- START OF CHANGES ---

            // 1. Create a detailed "system prompt" to guide the AI's response format.
            const fullPrompt = `
        You are an expert AI assistant that suggests potential doctor specializations based on user-described symptoms. Your goal is to provide clear, helpful, and well-structured advice.

        IMPORTANT: Do not provide a medical diagnosis. Your primary role is to suggest the *type* of medical professional a person should consider seeing.

        Based on the user's symptom: "${input}"

        Tell what doctor should i go between General Physician, Gynecologist, Dermatologist, Pediatrician, Neurologist, Gastroenterologist

        please format your response in one line 
        `;

            // 2. Prepare the chat history (this part is the same as before)
            const history = messages
                .slice(1)
                .map(msg => ({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                }));

            const chat = model.startChat({
                history: history,
            });

            // 3. Send the new, detailed prompt instead of just the raw input
            const result = await chat.sendMessage(fullPrompt);

            // --- END OF CHANGES ---

            const response = result.response;
            const aiMessage = response.text();

            setMessages([...newMessages, { role: 'assistant', content: aiMessage }]);

        } catch (err) {
            console.error("API Error:", err);
            setMessages([...newMessages, { role: 'assistant', content: 'Sorry, there was an error. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };
    // The JSX for your UI is perfectly fine, no changes needed here!
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] py-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-green-600 mb-2">AI Doctor Suggestion Chatbot</h2>
                <div className="flex-1 overflow-y-auto max-h-80 border rounded p-2 bg-gray-50 mb-2">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            <span className={`inline-block px-3 py-2 rounded-lg ${msg.role === 'user' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>{msg.content}</span>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        type="text"
                        value={input}
                        placeholder="Describe your symptoms..."
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        disabled={loading}
                    />
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
                        onClick={handleSend}
                        disabled={loading}
                    >
                        {loading ? '...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
