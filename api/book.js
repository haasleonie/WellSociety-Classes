export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, telefon, notiz, trialclass } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email required" });
  }

  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = "31f0f8905ada80af8e1ffd6b16ebde68";

  try {
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          Name: { title: [{ text: { content: name } }] },
          Email: { rich_text: [{ text: { content: email } }] },
          Telefon: { rich_text: [{ text: { content: telefon || "" } }] },
          Trialclass: { rich_text: [{ text: { content: trialclass || "" } }] },
          Notiz: { rich_text: [{ text: { content: notiz || "" } }] },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Notion error:", error);
      return res.status(500).json({ error: "Notion API error" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
