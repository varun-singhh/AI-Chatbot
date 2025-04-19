import { createClient } from "jsr:@supabase/supabase-js@2";
import OpenAI from "npm:openai";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let { userId, userMessage, model } = await req.json();
    const userMessageTimestamp = new Date().toISOString()
    
    if (!userId) {
     userId = crypto.randomUUID();
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let { data: userData } = await supabase
      .from("users")
      .select("id, name, age, gender")
      .eq("id", userId)
      .single();

    let hasUserInfo = !!userData;

    if (!hasUserInfo) {
      const { error: userError } = await supabase.from("users").insert([
        {
          id: userId,
          name: null,
          age: null,
          gender: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      if (userError) {
        console.error("Insert error:", userError);
        throw new Error("Failed to create user.");
      }

      const { data: newUser } = await supabase
        .from("users")
        .select("id, name, age, gender")
        .eq("id", userId)
        .single();
      userData = newUser;
      hasUserInfo = false;
    }

    const { data: history = [] } = await supabase
      .from("messages")
      .select("role, content")
      .eq("user_id", userId)
      .order("timestamp", { ascending: true });

    const messages = [
      {
        role: "system",
        content: `You're Lara, a polite AI assistant for dating app Hazel. ${
          !hasUserInfo
            ? "First ask for the user's name, age, and gender in a friendly way."
            : `${
                !(userData?.name && userData?.age && userData?.gender)
                  ? "Introduce yourself and ask for the user's name, age, and gender in a friendly way."
                  : "Continue conversation based on previous conversation."
              }`
        }`,
      },
      ...history.map((msg) => ({ role: msg.role, content: msg.content })),
      { role: "user", content: userMessage },
    ];

    const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY")! });
    const completion = await openai.chat.completions.create({
      model: model,
      messages,
    });

    const assistantMessage = completion.choices[0]?.message?.content ?? "";

    const { error: insertError } = await supabase.from("messages").insert([
      { user_id: userId, role: "user", content: userMessage, timestamp:  userMessageTimestamp},
      { user_id: userId, role: "assistant", content: assistantMessage, timestamp: new Date().toISOString() },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save messages.");
    }

    if (!(userData?.name && userData?.age && userData?.gender) && history.length >= 2) {
      const infoPrompt = [
        ...history
          .filter((msg) => msg.role === "user")
          .map((msg) => ({ role: "user", content: msg.content })),
        {
          role: "system",
          content:
            "Based on our input message so far, what is the user’s name, age, and gender? Reply in JSON with fields: name, age, gender. Leave any unknown as null.",
        },
      ];

      const infoResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: infoPrompt,
      });

      let infoJson = {};

      try {
        infoJson = JSON.parse(
          infoResponse.choices?.[0]?.message?.content || "{}"
        );
      } catch (err) {
        console.error("Failed to parse user info JSON:", err);
      }

      const { name, age, gender } = infoJson as {
        name?: string | null;
        age?: number | null;
        gender?: string | null;
      };

      if (name || age || gender) {
        await supabase
          .from("users")
          .update({
            ...(name && { name }),
            ...(age && { age }),
            ...(gender && { gender }),
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
      }
    }

    return new Response(JSON.stringify({ assistantMessage, userId }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});