// insertStories.ts (in frontend root)
const { Client } = require("pg");
const { stories } = require("./story-card-data/card-data"); // ✅ updated relative import

const client = new Client({
  user: "postgres",
  password: "db123",
  host: "localhost",
  port: 5432,
  database: "test_hmi",
});

async function seedStories() {
  await client.connect();

  for (const story of stories) {
    console.log(`📦 Inserting: ${story.id}`);

    await client.query(
      `INSERT INTO stories (
        id, title, subtitle, intro, author, publish_date, category,
        actors, document_id, story_references, visual_data, sections, indicators
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (id) DO NOTHING`,
      [
        story.id,
        story.title,
        story.subtitle,
        story.intro,
        story.author || null,
        story.publishDate || null,
        story.category || null,
        story.actors || [],
        story.document_id || null,
        story.references || [],
        JSON.stringify(story.visual_data || []),
        JSON.stringify(story.sections || []),
        JSON.stringify(story.indicators || []),
      ]
    );

    console.log(`✅ Done: ${story.title}`);
  }

  await client.end();
  console.log("🎉 All stories inserted (or skipped if already existed).");
}

seedStories().catch((err) => {
  console.error("❌ Insert failed:", err);
  client.end();
});
