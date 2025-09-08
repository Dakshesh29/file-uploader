SyncSphere - Personal Cloud Storage
SyncSphere is a full-stack web application that mimics the core functionalities of a personal cloud storage service like Google Drive or Dropbox. Users can register, log in, create folders, upload files with tags, and generate temporary, shareable links for their folders.

Live Demo -> https://my-file-uploader.onrender.com

Features
Secure User Authentication: Full registration, login, and logout functionality using Passport.js with persistent, database-backed sessions.

Folder Management: Users can create, view, update, and delete their own folders (full CRUD operations).

File Uploads: Upload files to specific folders. File metadata (name, size, type) is stored in the database.

Tagging System: Add comma-separated tags to files during upload for better organization.

Smart Search: A powerful search engine to find files by their original name or by their associated tags.

File Previews: Intelligently previews common file types (images, PDFs, text) directly in the browser, with a fallback to download for other types.

Shareable Links: Generate unique, temporary links for folders that can be shared publicly with anyone.

Responsive Design: A clean, modern UI that works on both desktop and mobile devices.

Tech Stack
Backend
Runtime: Node.js

Framework: Express.js

Database: PostgreSQL

ORM: Prisma

Authentication: Passport.js (Local Strategy)

File Handling: Multer

View Engine: EJS (Embedded JavaScript)

Frontend
Templating: EJS

Styling: CSS3 (with Flexbox & Grid)

Interactivity: Client-Side JavaScript (Fetch API)

Deployment
Platform: Render (for both the Web Service and PostgreSQL database)
