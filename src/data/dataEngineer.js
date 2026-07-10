// ─── DATA ENGINEER PROFILE ────────────────────────────────────────────────────
// NOTE: the source resume (Kedar_Limbalkar_DE.pdf) isn't available in this
// session — only the prior handoff's summary of it. Skills/projects below
// follow that summary; double check the skill pills below against your
// actual resume and adjust src/data/dataEngineer.js as needed.

export const NAV = [
  { id: "hero",       label: "Home"       },
  { id: "about",      label: "About"      },
  { id: "skills",     label: "Skills"     },
  { id: "projects",   label: "Projects"   },
  { id: "experience", label: "Experience" },
  { id: "contact",    label: "Contact"    },
];

export const HERO_EYEBROW  = "Data Engineer";
export const HERO_TAGLINE  = ["Kedar", "Limbalkar"];
export const HERO_SUB      = "Designing reliable data pipelines that turn messy, high-volume sources into trustworthy, query-ready infrastructure.";
export const HERO_STATS    = [["44K+","Records piped"],["3","Production pipelines"],["100%","Dockerized"]];

export const CV_FILE = "/Kedar_Limbalkar_DE.pdf";

export const ABOUT_PARAGRAPHS = [
  "Computer Engineering graduate from GCoEJ, currently pursuing an MS in Computer Science & ML at Woolf University. On the engineering side, I care about the plumbing behind the model: ingestion, orchestration, storage, and making sure data is trustworthy before anything gets trained on it.",
  "I build ETL/ELT pipelines end-to-end — API ingestion, transformation with Pandas, orchestration with Airflow, and containerized delivery with Docker — with retry logic and data-quality checks baked in rather than bolted on.",
];

export const EDUCATION = [
  { deg: "MS — Computer Science: ML & AI", school: "Woolf University", period: "2025 – 2027", colorKey: "accent" },
  { deg: "B.Tech — Computer Engineering",  school: "GCoEJ",            period: "2021 – 2025", colorKey: "green"  },
];

export const SKILLS = {
  "Languages":          ["Python","SQL","Java (Basics)","Git"],
  "Orchestration & ETL":["Apache Airflow","DAG Design","Retry & Backoff Logic","Pandas","ETL / ELT"],
  "Databases & Storage":["PostgreSQL","MySQL","Oracle","BigQuery","Snowflake","FAISS (Vector Store)"],
  "DevOps & Infra":     ["Docker","Containerization","REST APIs","CI-friendly Pipelines"],
  "Data Quality":       ["Schema Validation","Data Cleaning","Outlier Handling","Monitoring & Logging"],
};

export const PROJECT_FILTERS = ["All","ETL","Pipeline"];

export const CATEGORY_COLOR_KEYS = {
  ETL: "accent",
  Pipeline: "green",
};

const GITHUB_PLACEHOLDER = "https://github.com/Kedarlimbalkar";

export const PROJECTS = [
  {
    id: 1,
    Category:     "ETL",
    Title:        "Crypto ETL Pipeline",
    Metric:       "Automated retry-safe ingestion",
    Description:  "Pulls live market data from the CoinGecko API, transforms it with Pandas, and loads it into PostgreSQL on a schedule. Orchestrated with Airflow DAGs that include retry logic, fully Dockerized for reproducible deploys.",
    Tech_Stack:   "Python,Pandas,PostgreSQL,Apache Airflow,Docker,CoinGecko API",
    YouTube_Link: "",
    Drive_Link:   "",
    GitHub_Link:  GITHUB_PLACEHOLDER,
    LinkedIn_Link:"",
  },
  {
    id: 2,
    Category:     "Pipeline",
    Title:        "Conversational AI for Retail — Data Pipeline",
    Metric:       "44,884 records indexed",
    Description:  "The data-engineering backbone behind the Retail Conversational AI Agent: ingesting and chunking 44,884 records, embedding them into a FAISS vector store, and serving retrieval through a LangGraph-orchestrated pipeline.",
    Tech_Stack:   "Python,LangGraph,FAISS,Vector Embeddings,Pandas",
    YouTube_Link: "",
    Drive_Link:   "",
    GitHub_Link:  GITHUB_PLACEHOLDER,
    LinkedIn_Link:"",
  },
  {
    id: 3,
    Category:     "Pipeline",
    Title:        "Emotion Recognition — Data & Inference Pipeline",
    Metric:       "82% Model Accuracy",
    Description:  "The data and inference pipeline behind the Facial Emotion Recognition System: real-time frame capture, preprocessing with OpenCV, and low-latency CNN inference served through Streamlit.",
    Tech_Stack:   "Python,OpenCV,TensorFlow,Keras,Streamlit",
    YouTube_Link: "https://youtu.be/BErcoP1AWvw",
    Drive_Link:   "https://drive.google.com/drive/folders/1gfjU2y_Srzy9Un76rM22wZGR9UkwQq7n",
    GitHub_Link:  "https://github.com/Kedarlimbalkar/facialRecog",
    LinkedIn_Link:"",
  },
];

export const EXPERIENCE = [
  {
    role:"Business Analyst Intern", company:"Intucate",
    period:"Jan 2026 – Apr 2026", colorKey:"accent",
    points:[
      "Spearheaded end-to-end lifecycle of core content assets, improving educational value and engagement metrics.",
      "Implemented communication protocols aligning departmental goals with the product technical roadmap.",
    ],
  },
];

export const CONTACT_LINE = "Open to entry-level roles in Data Engineering, ETL Development & Data Infrastructure.";
