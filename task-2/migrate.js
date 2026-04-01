import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const DATA_FILE = join(__dirname, "data/data.json");
const DB_FILE = join(__dirname, "data/flashcards.db");

const raw = readFileSync(DATA_FILE, "utf-8");
const data = JSON.parse(raw);

const db = new Database(DB_FILE);

const insertDeck = db.prepare(
  "INSERT INTO decks (id, name, description) VALUES (?, ?, ?)",
);

const insertCard = db.prepare(
  "INSERT INTO cards (id, question, answer, learned, deck_id) VALUES (?, ?, ?, ?, ?)",
);

const migrate = db.transaction(() => {
  for (const deck of data.decks) {
    insertDeck.run(deck.id, deck.name, deck.description);
  }

  for (const card of data.cards) {
    insertCard.run(
      card.id,
      card.question,
      card.answer,
      card.learned ? 1 : 0,
      card.deckId,
    );
  }
});

migrate();

console.log("Migration completed.");
