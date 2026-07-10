// ─── DATA SCIENTIST PROFILE ───────────────────────────────────────────────────

export const NAV = [
  { id: "hero",       label: "Home"       },
  { id: "about",      label: "About"      },
  { id: "skills",     label: "Skills"     },
  { id: "projects",   label: "Projects"   },
  { id: "experience", label: "Experience" },
  { id: "contact",    label: "Contact"    },
];

export const HERO_EYEBROW  = "ML Engineer & Data Scientist";
export const HERO_TAGLINE  = ["Kedar", "Limbalkar"];
export const HERO_SUB      = "Building production-grade AI systems that bridge ML architecture with data-driven business strategy.";
export const HERO_STATS    = [["10K+","Records processed"],["82%","Model accuracy"],["30%","Reliability boost"]];

export const CV_FILE = "/Kedar_Limbalkar_DS.pdf";

export const ABOUT_PARAGRAPHS = [
  "Computer Engineering graduate from GCoEJ, currently pursuing an MS in Computer Science & ML at Woolf University. I build production-grade AI systems and bridge ML architecture with actionable business strategy.",
  "With experience across data analytics, business analysis, and ML modelling, I turn raw data into high-impact decisions using Python, SQL, Power BI, and Docker.",
];

export const EDUCATION = [
  { deg: "MS — Computer Science: ML & AI", school: "Woolf University", period: "2025 – 2027", colorKey: "accent" },
  { deg: "B.Tech — Computer Engineering",  school: "GCoEJ",            period: "2021 – 2025", colorKey: "green"  },
];

export const SKILLS = {
  "ML & AI":           ["Scikit-Learn","XGBoost","LightGBM","Deep Learning","Feature Engineering","Hyperparameter Tuning","PySpark"],
  "Programming":       ["Python","Pandas","NumPy","Java (Basics)","Git"],
  "Databases & Cloud": ["MySQL","Oracle","BigQuery","Snowflake","Apache Airflow","ETL"],
  "BI & Analytics":    ["Power BI","Tableau","Advanced Excel","Data Modeling","A/B Testing","Hypothesis Testing","Statistical Analysis"],
  "MLOps & Tools":     ["Docker","MLOps","Business Strategy"],
};

export const PROJECT_FILTERS = ["All","ML","AI","Analytics","Business"];

export const CATEGORY_COLOR_KEYS = {
  ML: "accent",
  AI: "pink",
  Analytics: "green",
  Business: "purple",
};

export const PROJECTS = [
  {
    id: 1,
    Category:     "ML",
    Title:        "Tata Steel Machine Failure Prediction",
    Metric:       "30% reliability improvement",
    Description:  "Optimized 10K+ records with XGBoost and LightGBM, increasing model accuracy by 18% and dataset reliability by 30%.",
    Tech_Stack:   "Python,XGBoost,LightGBM,Scikit-Learn,Pandas,NumPy",
    YouTube_Link: "https://youtu.be/e14_ByN2KuU",
    Drive_Link:   "https://drive.google.com/file/d/1JbtAGiEsq2oKMQym7OE7sx5dYOzrYl1y/view?usp=drive_link",
    GitHub_Link:  "https://github.com/Kedarlimbalkar/tata-failure-prediction",
    LinkedIn_Link:"",
  },
  {
    id: 2,
    Category:     "ML",
    Title:        "Bengaluru House Price Prediction",
    Metric:       "R² = 0.82 · 82% accuracy",
    Description:  "Cleaned 13,320 records with PPS outlier removal. Built a Scikit-Learn Ridge Regression pipeline achieving 82% prediction accuracy across 240+ urban locations.",
    Tech_Stack:   "Python,Scikit-Learn,Ridge Regression,Pandas,NumPy",
    YouTube_Link: "https://youtu.be/TwQctnQoF3k",
    Drive_Link:   "https://drive.google.com/drive/folders/15Q2hNHltGMGN-QOvfmYep0dZj7mle3lu",
    GitHub_Link:  "https://github.com/Kedarlimbalkar/HousePricePrediction",
    LinkedIn_Link:"",
  },
  {
    id: 3,
    Category:     "ML",
    Title:        "Facial Emotion Recognition System",
    Metric:       "82% Model Accuracy",
    Description:  "A deep learning application using CNNs to detect and classify human emotions from real-time visual data.",
    Tech_Stack:   "TensorFlow,Keras,OpenCV,Streamlit",
    YouTube_Link: "https://youtu.be/BErcoP1AWvw",
    Drive_Link:   "https://drive.google.com/drive/folders/1gfjU2y_Srzy9Un76rM22wZGR9UkwQq7n",
    GitHub_Link:  "https://github.com/Kedarlimbalkar/facialRecog",
    LinkedIn_Link:"",
  },
  {
    id: 4,
    Category:     "ML",
    Title:        "E-commerce Customer Satisfaction Predictor",
    Metric:       "Optimized Support Classification",
    Description:  "A predictive analytics system that classifies customer support inquiries and forecasts satisfaction (CSAT) scores using advanced machine learning algorithms.",
    Tech_Stack:   "Python,XGBoost,SVM,Pandas,Scikit-learn",
    YouTube_Link: "https://youtu.be/WxA8WGO3j3s",
    Drive_Link:   "https://drive.google.com/drive/folders/1i8cZcXLJirIrKH-EPX18Hmox-UdatuO4",
    GitHub_Link:  "https://github.com/Kedarlimbalkar/Shopzilla-CSAT-Prediction",
    LinkedIn_Link:"",
  },
  {
    id: 5,
    Category:     "AI",
    Title:        "Retail Conversational AI Agent",
    Metric:       "92% Resolution Accuracy",
    Description:  "A production-grade AI system for automated e-commerce support and intelligent order management.",
    Tech_Stack:   "LangGraph,LangChain,Groq API,Python",
    YouTube_Link: "https://youtu.be/YncluBKHu7Q",
    Drive_Link:   "https://drive.google.com/drive/folders/1AMPPfo1AznJEC82Tu1cMGb2H8BE0dNlr",
    GitHub_Link:  "",
    LinkedIn_Link:"",
  },
  {
    id: 6,
    Category:     "Analytics",
    Title:        "FedEx Logistics Performance Analysis",
    Metric:       "22% Cost Reduction",
    Description:  "Optimized FedEx supply chain efficiency by identifying delivery bottlenecks and cost-saving fulfillment strategies through advanced multivariate data analysis.",
    Tech_Stack:   "Python",
    YouTube_Link: "https://youtu.be/-kTZhDST08I",
    Drive_Link:   "https://drive.google.com/drive/folders/13NUZkxqE-n8Y-pcE_e7p9s9qT65dctWT",
    GitHub_Link:  "https://github.com/Kedarlimbalkar/FedEx-Logistics-Performance-Analysis",
    LinkedIn_Link:"",
  },
  {
    id: 7,
    Category:     "Analytics",
    Title:        "WhatsApp Data Architecture & Product Analysis",
    Metric:       "3NF Normalized Architecture",
    Description:  "A deep-dive dissection of WhatsApp's core functionalities and the design of a production-grade relational database schema.",
    Tech_Stack:   "MySQL,ER Modeling,Database Design",
    YouTube_Link: "https://youtu.be/FmOgpKA8sIk",
    Drive_Link:   "https://drive.google.com/drive/folders/1tRUIaU9cOWKYMlIo1QJcYg966H51viOV",
    GitHub_Link:  "",
    LinkedIn_Link:"",
  },
  {
    id: 8,
    Category:     "Business",
    Title:        "Python Basics",
    Metric:       "Problem Solving",
    Description:  "By using logical thinking solved Python problems to enhance problem solving and thinking ability.",
    Tech_Stack:   "Python",
    YouTube_Link: "https://youtu.be/T4Lxxxi2Sb8",
    Drive_Link:   "https://drive.google.com/drive/folders/1sOnJj2gj2_XpA2Ud731QXg4_vnKYBgzM",
    GitHub_Link:  "",
    LinkedIn_Link:"",
  },
  {
    id: 9,
    Category:     "Business",
    Title:        "Supply Chain Health Logistics Dashboard",
    Metric:       "Logistics Cost Optimization",
    Description:  "Exploratory analysis and Tableau dashboard to optimize global freight routes and resolve delivery bottlenecks.",
    Tech_Stack:   "Tableau",
    YouTube_Link: "https://youtu.be/cPY_rdqp9nw",
    Drive_Link:   "https://drive.google.com/drive/folders/1xwhRQvb_9rFUo7YhlaBNKQGFLReZ_cmh",
    GitHub_Link:  "",
    LinkedIn_Link:"",
  },
  {
    id: 10,
    Category:     "Business",
    Title:        "Retail Demand Forecasting & Store Optimizer",
    Metric:       "Optimized Inventory Turnover",
    Description:  "Engineered a predictive sales engine that integrates macro-economic indicators and seasonal trends to drive data-informed inventory and staffing decisions.",
    Tech_Stack:   "Python,XGBoost,Streamlit,Pandas,Matplotlib",
    YouTube_Link: "https://youtu.be/2s80_Cd2yCk",
    Drive_Link:   "https://drive.google.com/drive/folders/1q_cfpt9sK1i1Cc4jntUpZFnjmgMBZDNL",
    GitHub_Link:  "https://github.com/Kedarlimbalkar/retail-ML",
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
  {
    role:"Data Analyst Intern", company:"AtliQ Technologies",
    period:"Dec 2025 – Apr 2026", colorKey:"green",
    points:[
      "Applied Python, SQL, and Power BI to real-world analytics, producing actionable business insights.",
      "Transformed raw data pipelines into decision-ready dashboards.",
    ],
  },
  {
    role:"Data Analyst Intern", company:"Unified Mentor",
    period:"Nov 2024 – Dec 2024", colorKey:"purple",
    points:[
      "Executed hands-on analytics projects using Python and Tableau.",
      "Applied Google Data Analytics Certificate learnings to live business challenges.",
    ],
  },
  {
    role:"Data Analyst Intern", company:"NullClass",
    period:"Sep 2024 – Oct 2024", colorKey:"pink",
    points:[
      "Built interactive Power BI dashboards and enhanced data cleaning techniques.",
      "Derived insights from complex datasets through comprehensive exploratory analysis.",
    ],
  },
];

export const CONTACT_LINE = "Open to entry-level roles in ML Engineering, Data Science & Business Analytics.";
