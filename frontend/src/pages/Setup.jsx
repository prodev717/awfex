import ReactMarkdown from 'react-markdown';
import Navbar from '../components/Navbar';

const setupContent = `
# Setup Guide

## 📦 Installation and Usage

\`\`\`bash
npm install
npm run dev
cd frontend
npm install
npm run dev
\`\`\`

* Backend runs at: **[http://localhost:5000](http://localhost:5000)**
* Frontend runs at: **[http://localhost:5173](http://localhost:5173)**

## ▶️ Usage

1. Start the backend.
2. Open the frontend to design a workflow.
3. Save the workflow JSON.
4. Trigger the workflow via HTTP.
`;

export default function Setup() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />
            <div className="flex justify-center p-10 overflow-auto">
                <div className="prose prose-invert max-w-3xl w-full">
                    <ReactMarkdown>{setupContent}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
