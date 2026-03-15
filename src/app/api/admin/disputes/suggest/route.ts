import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { subject, type, raised_by } = await request.json();

        if (!subject || !type || !raised_by) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const prompt = `
            You are an AI assistant helping a Super Admin resolve a support ticket for the NextNest platform (an orphanage and donor management system).
            
            Ticket Details:
            - Type: ${type}
            - Subject: ${subject}
            - Raised By: ${raised_by}

            Draft a professional, empathetic, and concise response to this ticket. Note that this is a draft that the admin will review before sending, so use placeholders like [Action Taken] if you need the admin to fill in specific details. Do NOT include greetings like "Dear [Name]" as the system handles that. Just the body of the reply. Keep it under 3 sentences.
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama3-8b-8192",
            temperature: 0.5,
            max_tokens: 150,
        });

        const suggestion = completion.choices[0]?.message?.content?.trim() || "I apologize, but I couldn't generate a suggestion at this time.";

        return NextResponse.json({ suggestion });

    } catch (error: any) {
        console.error("Groq AI Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
