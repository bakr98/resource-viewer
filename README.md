# Resource Viewer

A small **Next.js + shadcn** app that displays **FHIR resource wrappers** from Firestore in a table with detail popups.  

The table shows:  
- **Resource Type**  
- **Processing State** (color coded)  
- **Created Time** (relative to now)  
- **Fetched Time** (relative to now)  

Clicking a row opens a detail dialog with:  
- Human Readable String  
- AI Summary  
- Internal Processing Code  
- FHIR Version  
- Timestamps (Created, Fetched, Processed)

⸻

## 🚀 How to Run

1. Clone the repo:

   ```bash
   git clone [this repo]
   cd pact-challenge

2.	Install dependencies:

    npm install


3.	Copy .env.local.example to .env.local and fill in your Firebase credentials:

    NEXT_PUBLIC_FB_API_KEY=your-api-key
    NEXT_PUBLIC_FB_AUTH_DOMAIN=your-app.firebaseapp.com
    NEXT_PUBLIC_FB_PROJECT_ID=your-project-id

4.	Start the dev server:

    npm run dev


5.	Open http://localhost:3000 in your browser.

6.  Set up Firestore

    (See 🔧 Firestore Setup below)

⸻

🔧 Firestore Setup
	1.	Create a Firebase project and enable Cloud Firestore.
	2.	Add a .env.local file in the project root with your Firebase/Firestore config:
        
        NEXT_PUBLIC_FB_API_KEY=your_api_key
        NEXT_PUBLIC_FB_AUTH_DOMAIN=your-app.firebaseapp.com
        NEXT_PUBLIC_FB_PROJECT_ID=your_project_id

    3.	Create a collection called resourceWrappers.
        Each document should contain the following fields (from the challenge pastebin):

        resource: map
            •	humanReadableStr: string
            •	aiSummary: string

        metadata: map
            •	createdTime: string
            •	fetchTime: string
            •	processedTime: string
            •	resourceType: string (e.g. "Condition", "Procedure")
            •	state: string (PROCESSING_STATE_COMPLETED, PROCESSING_STATE_FAILED, etc.)
            •	version: string (FHIR version, e.g. "FHIR_VERSION_R4")

        identifier: map
            •	key: string
            •	patientId: string
            •	uid: string


📸 Screenshots


⸻

📂 Folder Structure

src/
 app/                # Next.js app router
  -globals.css       # Global styles
  -layout.tsx        # Root layout
  -page.tsx          # Entry page
 components/
  -resource-table/   # ResourceTable & columns
  -ui/               # shadcn/ui elements (badge, button, card, dialog, table)
  -lib/              # Firebase + utilities (time helper and utils)
  -types/            # Pastebin schema


⸻

🛠️ Notes
	•	Reads from Firestore collection resourceWrappers.
	•	I added a few example documents to demonstrate multiple states (Completed, Processing, Failed, etc).
	•	Uses shadcn/ui tables, badges and dialogs for a clean, accessible UI.
	•	In the detail view (when a row is clicked), timestamps are displayed both in relative (e.g. “3 days ago”) and absolute formats.
