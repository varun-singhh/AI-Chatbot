import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const url = new URL(req.url);
  const pathname = url.pathname;

  try {
    if (req.method === "GET" && pathname.includes("/getUsers")) {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;

      return new Response(JSON.stringify({ users: data }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (req.method === "GET" && pathname.includes("/getMessages")) {
      const userId = url.searchParams.get("userId");
      if (!userId) return new Response("Missing userId", { status: 400 });

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ messages: data }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || err }), {
      status: 500,
    });
  }
});
