---
layout: '../../layouts/BlogLayout.astro'
title: 'Simple Note-Taking API in Hono'
date: '2023-03-30'
description: 'A simple note-taking API using Bun, Hono, and Sequelize.'
category: 'Backend'
author: 'Adarsh'
---

# Build a Simple Note-Taking API with Bun, Hono, and Sequelize

_A beginner’s guide to understanding the fundamentals of building a CRUD
backend_

When learning a new framework or tool, I believe it’s better to start small and
grasp the core fundamentals first. That’s why I built this minimal note-taking
API using **Hono** (a lightweight web framework) and **Sequelize** (an ORM), all
powered by **Bun** for speed.

This guide is perfect for anyone starting with REST APIs, TypeScript, or backend
development in general.

## What We’re Building

We’ll create a simple **CRUD API** for managing notes:

- Create a note
- Read all notes or one by ID
- Update a note
- Delete a note

It uses:

- **Hono** for handling HTTP routes
- **Sequelize** is a promise-based [Node.js](https://nodejs.org/en/about/)
  [ORM tool](https://en.wikipedia.org/wiki/Object-relational_mapping) for
  [Postgres](https://en.wikipedia.org/wiki/PostgreSQL),
  [MySQL](https://en.wikipedia.org/wiki/MySQL),
  [MariaDB](https://en.wikipedia.org/wiki/MariaDB),
  [SQLite](https://en.wikipedia.org/wiki/SQLite),
  [Microsoft SQL Server](https://en.wikipedia.org/wiki/Microsoft_SQL_Server),
  [Oracle Database](https://en.wikipedia.org/wiki/Oracle_Database),
  [Amazon Redshift](https://docs.aws.amazon.com/redshift/index.html) and
  [Snowflake’s Data Cloud](https://docs.snowflake.com/en/user-guide/intro-key-concepts.html)
- **TypeScript** for better structure and type safety
- **SQLite** for lightweight local storage
- **Bun** for fast runtime and package management

## Folder Structure Overview

```
make-note/
├── bun.lockb               # Bun's lockfile
├── database.sqlite         # SQLite database
├── package.json            # Scripts and dependencies
├── tsconfig.json           # TypeScript config
└── src/
    ├── index.ts                  # Main entry — bootstraps server & routes
    ├── config/
    │   └── db.ts                 # Sequelize DB instance setup
    ├── models/
    │   └── Notes.model.ts        # Sequelize schema for the Note model
    ├── types/
    │   └── notes.ts              # Type definition for Note structure
    ├── service/
    │   ├── create-note.ts        # Logic to create a note
    │   ├── list-all.ts           # Logic to fetch all notes
    │   ├── list-note-by-id.ts    # Logic to fetch note by ID
    │   ├── update-note.ts        # Logic to update an existing note
    │   └── delete-note.ts        # Logic to delete a note
    └── controller/
        ├── handle-create-note.ts  # HTTP handler for POST /note
        ├── handle-all-notes.ts    # HTTP handler for GET /notes
        ├── handle-note-by-id.ts   # HTTP handler for GET /note/:id
        ├── handle-update-note.ts  # HTTP handler for PUT /note/:id
        └── handle-delete-note.ts  # HTTP handler for DELETE /note/:id
```

## Step 1: Set Up the Project

Install Bun (if you haven’t already):

```
curl -fsSL https://bun.sh/install | bash
```

Create and enter the project folder:

```
bun create hono@latest make-note
cd make-note
```

I Choose the **Node** template.

Install dependencies:

```
bun add sequelize sqlite3
bun add -d typescript @types/node
```

## Step 2: Configure SQLite with Sequelize

`src/config/db.ts`

**_Purpose_**_: Sets up Sequelize with SQLite._

```
import { Sequelize } from "sequelize";
export const sequelizeInstance = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: console.log,
});
```

## Step 3: Define the Note Model

`src/models/Notes.model.ts`

> **_Purpose_**_: Defines the Note model schema with fields like_ `_title_`_,_
> `_content_`_,_ `_createdAt_`_, and_ `_updatedAt_`

```
import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/db.js";
export class Note extends Model {
  declare id?: number;
  declare title: string;
  declare content: string;
}
Note.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize: sequelizeInstance,
  modelName: "Notes",
  timestamps: true,
});
```

## Step 4: Add Type Definitions

`src/types/notes.ts`

**_Purpose_**_: Defines the TypeScript type for a note object._

```
export type NoteAttribute = {
  id?: number;
  title: string;
  content: string;
};
```

## Step 5: Add Service Logic

Each file here performs the business logic — database operations for each
endpoint.

`src/service/create-note.ts`

> **_Creates a new note in the database_**

```
import { Note } from "../models/Notes.model.js";
export const createNote = async (title: string, content: string) => {
  if (!title || !content) throw new Error("Title and content are required");
  return await Note.create({ title, content });
};
```

`src/service/list-all.ts`

> **_Fetches all notes_**

```
import { Note } from "../models/Notes.model.js";
export const allNotes = async () => {
  return await Note.findAll();
};
```

`src/service/list-note-by-id.ts`

> **_Fetches a single note by ID_**

```
import { Note } from "../models/Notes.model.js";
export const listNoteById = async (id: number) => {
  return await Note.findByPk(id);
};
```

`src/service/update-note.ts`

> **_Updates an existing note by ID_**

```
import { Note } from "../models/Notes.model.js";
export const updateNote = async (id: number, title: string, content: string) => {
  const note = await Note.findByPk(id);
  if (!note) throw new Error("Note not found");
  await note.update({ title, content });
  return note;
};
```

`src/service/delete-note.ts`

> **_Deletes a note by ID_**

```
import { Note } from "../models/Notes.model.js";
export const deleteNote = async (id: number) => {
  const note = await Note.findByPk(id);
  if (!note) throw new Error("Note not found");
  await note.destroy();
  return note;
};
```

## Step 6: Add Controllers

These map service logic to API routes using Hono’s context.

`src/controller/handle-create-note.ts`

> **_POST /note_** _— Creates a new note_

```
import { createNote } from "../service/create-note.js";
import type { Context } from "hono";
export const handleCreateNote = async (c: Context) => {
  const { title, content } = await c.req.json();
  const note = await createNote(title, content);
  return c.json({ status: 200, message: "Note created", data: note });
};
```

`src/controller/handle-all-notes.ts`

> **_GET /notes_** _— Gets all notes_

```
import { allNotes } from "../service/list-all.js";
import type { Context } from "hono";
export const handleAllNotes = async (c: Context) => {
  const notes = await allNotes();
  return c.json({ status: 200, data: notes });
};
```

`src/controller/handle-note-by-id.ts`

> **_GET /note/:id_** _— Gets a single note_

```
import { listNoteById } from "../service/list-note-by-id.js";
import type { Context } from "hono";
export const handleNoteById = async (c: Context) => {
  const { id } = c.req.param();
  const note = await listNoteById(Number(id));
  return c.json({ status: 200, data: note });
};
```

`src/controller/handle-update-note.ts`

> **_PUT /note/:id_** _— Updates a note_

```
import { updateNote } from "../service/update-note.js";
import type { Context } from "hono";
export const handleUpdateNote = async (c: Context) => {
  const { id } = c.req.param();
  const { title, content } = await c.req.json();
  const note = await updateNote(Number(id), title, content);
  return c.json({ status: 200, message: "Note updated", data: note });
};
```

`src/controller/handle-delete-note.ts`

> **_DELETE /note/:id_** _— Deletes a note_

```
import { deleteNote } from "../service/delete-note.js";
import type { Context } from "hono";
export const handleDeleteNote = async (c: Context) => {
  const { id } = c.req.param();
  const note = await deleteNote(Number(id));
  return c.json({ status: 200, message: "Note deleted", data: note });
};
```

## Step 7: Bootstrap the Server

`src/index.ts`

> **_Boots up the Hono app, syncs the DB, and registers routes_**

```
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { sequelizeInstance } from "./config/db.js";
import {
  handleCreateNote,
  handleAllNotes,
  handleNoteById,
  handleUpdateNote,
  handleDeleteNote,
} from "./controller/index.js";
const app = new Hono();
/*  .sync() ensures your model schema is applied to the DB. In dev,
it helps auto-create the table if not present. */
await sequelizeInstance.sync()
app.get("/notes", handleAllNotes);
app.get("/note/:id", handleNoteById);
app.post("/note", handleCreateNote);
app.put("/note/:id", handleUpdateNote);
app.delete("/note/:id", handleDeleteNote);
serve({ fetch: app.fetch, port: 3000 }, (info) =>
  console.log(`Server running at http://localhost:${info.port}`)
);
```

## Step 8: Test the API

Start the server:

```
bun run dev
```

## Example requests

**Create a note:**

```
curl -X POST http://localhost:3000/note \
-H "Content-Type: application/json" \
-d '{"title":"Hello","content":"My first note"}'
```

**Get all notes:**

```
curl http://localhost:3000/notes
```

**Get a note by ID:**

```
curl http://localhost:3000/note/1
```

**Update a note:**

```
curl -X PUT http://localhost:3000/note/1 \
-H "Content-Type: application/json" \
-d '{"title":"Updated","content":"Changed content"}'
```

**Delete a note:**

```
curl -X DELETE http://localhost:3000/note/1
```

## 🎯 Why Start Simple?

Instead of diving into advanced topics like authentication or validation, this
project helped me build a strong foundation in:

- Routing with **Hono**
- Working with **Sequelize** models
- Clean project structuring
- Using **Bun** for a snappy dev experience

## What’s Next?

You can easily extend this API with:

- Input validation using [Zod](https://github.com/colinhacks/zod)
- JWT-based user authentication
- Deploy to [Render](https://render.com/) or [Vercel](https://vercel.com/)
- Add a frontend using React or SvelteKit

## Final Thoughts

This project started as a way for me to explore the fundamentals of building a
backend with **Bun**, **Hono**, and **Sequelize** — and it’s been an incredibly
fun and fast experience. If you’re just getting into backend development, I
**highly recommend** creating a simple CRUD API like this from scratch. You’ll
gain a deeper understanding of routing, databases, and project structuring by
doing it yourself.

🛠️ **Want to build on this or learn by contributing?** The project is
open-source and beginner-friendly! Whether you’re exploring Bun, learning REST
APIs, or just want to help improve this project, your contributions are welcome.

👉 Check it out here:
[**github.com/adarshswaminath/bun-hono-notes-api**](https://github.com/adarshswaminath/bun-hono-notes-api.git)
