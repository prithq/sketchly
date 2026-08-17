# Sketchly

> A real-time collaborative whiteboard for technical interviews.

Sketchly is a collaborative whiteboard application designed for technical interviews. Multiple participants can join the same room and work together in real time using a shared canvas.

The project focuses on building the core collaboration infrastructure from scratch using **Next.js, Express, WebSockets, Prisma, PostgreSQL, and HTML Canvas**.

---

## Features

### 🎨 Whiteboard

* Rectangle
* Circle
* Line
* Arrow
* Text
* Image
* Stroke color selection
* Background color selection
* Adjustable canvas drawing
* Eraser

### 🖱️ Selection

The selection tool currently supports:

* Selecting text
* Selecting images
* Moving text
* Moving images

Other shapes intentionally remain non-selectable for now.

### ⚡ Real-time Collaboration

Changes are synchronized between participants using WebSockets.

Currently synchronized:

* New shapes
* Text
* Images
* Shape deletion
* Movement of text/images

### 💾 Persistence

Whiteboard shapes are stored in the database as JSON.

When a participant enters a room, previously created shapes are loaded from the backend and rendered on the canvas.

### 🏠 Rooms

Each room has:

* Unique room slug
* Room name
* Owner
* Created timestamp
* Associated shapes

Users can create and join rooms.

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* HTML Canvas
* Lucide React

### Backend

* Node.js
* Express
* WebSocket (`ws`)
* TypeScript

### Database

* PostgreSQL
* Prisma ORM

### Monorepo

* pnpm
* Turborepo

---

## Architecture

```text
                         ┌──────────────────┐
                         │     Next.js      │
                         │    Frontend      │
                         └────────┬─────────┘
                                  │
                         HTTP REST API
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     Express      │
                         │      Server      │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     Prisma       │
                         │   PostgreSQL     │
                         └──────────────────┘


                         ┌──────────────────┐
                         │     Canvas       │
                         │     Client A     │
                         └────────┬─────────┘
                                  │
                              WebSocket
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  WebSocket       │
                         │     Server       │
                         └────────┬─────────┘
                                  │
                              WebSocket
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     Canvas       │
                         │     Client B     │
                         └──────────────────┘
```

---

## How Real-Time Collaboration Works

When a user creates a shape:

```text
User draws shape
      ↓
Canvas creates Shape object
      ↓
WebSocket message
      ↓
WebSocket server
      ↓
Broadcast to other users
      ↓
Other clients update canvas
```

For example:

```ts
{
  type: "RECTANGLE",
  shape: {
    id: "abc123",
    type: "RECTANGLE",
    x: 100,
    y: 200,
    width: 300,
    height: 150,
    strokeColor: "#000000"
  }
}
```

The receiving clients add the shape to their local shape collection and redraw the canvas.

---

## Shape Architecture

Every object on the canvas is represented as a typed shape.

Example:

```ts
interface RectangleShape {
  id: string;
  type: "RECTANGLE";
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
}
```

The application uses a discriminated union:

```ts
type Shape =
  | RectangleShape
  | CircleShape
  | LineShape
  | ArrowShape
  | TextShape
  | ImageShape;
```

This allows `drawShape()` to determine how each object should be rendered.

```text
Shape
  │
  ├── RECTANGLE
  ├── CIRCLE
  ├── LINE
  ├── ARROW
  ├── TEXT
  └── IMAGE
```

---

## Database Design

The core room model:

```prisma
model Room {
  id        String   @id @default(cuid())
  slug      String   @unique
  name      String
  ownerId   String
  owner     User     @relation(fields: [ownerId], references: [id])
  createdAt DateTime @default(now())
  shapes    Shape[]

  @@index([ownerId])
}
```

Shapes are stored separately:

```prisma
model Shape {
  id        String   @id @default(cuid())
  shapeData Json
  roomId    String
  userId    String

  room Room @relation(fields: [roomId], references: [id])
  user User @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())

  @@index([roomId])
  @@index([userId])
}
```

The `shapeData` field allows different shape types to be stored without requiring a separate database table for every shape.

---

## Image Handling

Images currently use a simple client-side approach.

When a user selects an image:

```text
Image file
    ↓
FileReader
    ↓
Base64 Data URL
    ↓
Image Shape
    ↓
WebSocket
    ↓
Other participants
```

The image data is stored inside the shape.

Example:

```ts
{
  id: "image123",
  type: "IMAGE",
  x: 100,
  y: 100,
  width: 300,
  height: 200,
  imageData: "data:image/png;base64,..."
}
```

This approach keeps the MVP simple and avoids requiring an external image-storage service.

For a production-scale application, object storage would be preferable.

---

## Image Rendering Optimization

Canvas redraws happen frequently, especially while moving objects.

Creating a new `Image()` every time the canvas redraws can cause image flickering.

Sketchly therefore uses an image cache:

```text
imageData
    ↓
HTMLImageElement
    ↓
Image Cache
    ↓
Canvas redraw
```

Once an image has loaded, subsequent redraws reuse the cached image instead of decoding it again.

---

## Eraser

The eraser operates on the shape itself rather than erasing pixels.

For example:

```text
User clicks the stroke
        ↓
Detect matching shape
        ↓
Remove shape from local state
        ↓
Send DELETE_SHAPE
        ↓
Server removes persisted shape
        ↓
Broadcast deletion
```

This makes the eraser work consistently for vector objects, text, and images.

---

## Room API

The Express server currently exposes room-related endpoints such as:

```text
POST   /rooms/create
GET    /rooms/:slug
GET    /rooms/:slug/shapes
POST   /rooms/:slug/join
GET    /rooms/my-rooms
```

Authentication is applied to protected routes using the project's authentication middleware.

---

## WebSocket Events

The WebSocket server handles collaborative events such as:

```text
RECTANGLE
CIRCLE
LINE
ARROW
TEXT
IMAGE
DELETE_SHAPE
MOVE_SHAPE
```

A typical movement event looks like:

```json
{
  "type": "MOVE_SHAPE",
  "shapeId": "abc123",
  "x": 500,
  "y": 250
}
```

The server updates the persisted shape and broadcasts the movement to other clients in the room.

---

## Project Structure

The project uses a Turborepo-style monorepo.

A simplified structure:

```text
sketchly/
│
├── apps/
│   ├── web/
│   │   └── Next.js application
│   │
│   ├── api/
│   │   └── Express REST API
│   │
│   └── ws/
│       └── WebSocket server
│
├── packages/
│   ├── common/
│   │   ├── types
│   │   └── canvas drawing utilities
│   │
│   └── db/
│       └── Prisma client and schema
│
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd sketchly
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create the required `.env` files for the web application, API, WebSocket server, and database package.

Example:

```env
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-secret"
```

Use the environment variables expected by the corresponding applications in the repository.

### 4. Generate Prisma Client

```bash
pnpm prisma generate
```

### 5. Run database migrations

```bash
pnpm prisma migrate dev
```

### 6. Start the development environment

```bash
pnpm dev
```

The frontend, REST API, and WebSocket server should then run together through the Turborepo development configuration.

---

## Development Workflow

A typical development flow is:

```text
Create room
    ↓
Enter room
    ↓
Connect WebSocket
    ↓
Load persisted shapes
    ↓
Draw on canvas
    ↓
Broadcast changes
    ↓
Persist changes
```

For testing collaboration:

```text
Browser A
   │
   ├── Create / Join room
   │
   ▼
WebSocket Server
   │
   ▼
Browser B
```

Open the same room in two browser windows to test real-time collaboration.

---

## Current Limitations

This is an MVP/portfolio project, so some functionality is intentionally simplified.

* Images are currently transferred as Base64 data.
* Image storage is not yet handled by object storage.
* Selection is limited to text and images.
* Text editing is intentionally minimal.
* Shapes do not currently have advanced resize/rotation handles.
* WebSocket movement is optimized around synchronization rather than high-frequency operational transforms.
* The WebSocket server currently maintains room connections in memory.

---

## Future Improvements

Possible future improvements include:

* [ ] Production image storage
* [ ] Image resizing
* [ ] Resize and rotation handles
* [ ] Better text editing
* [ ] Cursor presence
* [ ] User presence indicators
* [ ] Undo / redo
* [ ] Room dashboard
* [ ] Room sharing links
* [ ] Permissions
* [ ] Drawing/freehand tool
* [ ] Shape selection for all objects
* [ ] Optimistic synchronization
* [ ] WebSocket reconnection
* [ ] Horizontal scaling with Redis/pub-sub
* [ ] Production deployment

---

## Why I Built Sketchly

The main goal of Sketchly is to understand how real-time collaborative applications work internally rather than relying entirely on third-party collaboration services.

The project combines:

```text
React
+
Canvas
+
WebSockets
+
REST APIs
+
Prisma
+
PostgreSQL
```

to create a complete collaborative application from the ground up.

---

## License

This project is available for learning and portfolio purposes.
