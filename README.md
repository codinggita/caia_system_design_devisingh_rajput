# 🚀 CAIA System Design Knowledge Base

## 🔗 Important Links

* 🌐 Live Project: *Coming Soon*
* 💻 GitHub Repository: https://github.com/devisingh2007/caia_system_design_devisingh_rajput
* postman url : https://devisingh-rajput.docs.buildwithfern.com/caia-backend-api/introduction
* 📂 Dataset (Google Drive): https://drive.google.com/file/d/1um-ZWp-i2SnDgYC1kOV2BOPcYhzInejV/view?usp=sharing
* 📘 Assignment Repo: https://github.com/codinggita/CGxSU_Semester_1/tree/main/assignments/05.sem2_full_stack_80_Marks_Project_02

---

## 📌 Project Overview

**CAIA System Design Knowledge Base** is a full-stack application designed to provide a centralized platform for learning, exploring, and analyzing system design concepts.

The system is built using a **real-world dataset of system design prompts and detailed responses**, enabling users to search, filter, and interact with high-quality architecture knowledge in a structured way.

---

## 🎯 Objectives

* Build a **scalable RESTful API system**
* Design schema based on **real dataset structure**
* Implement **advanced search & filtering**
* Provide **analytics & trending insights**
* Enable **user personalization (bookmarks, notes)**
* Follow **clean architecture & PR practices**

---

## ❓ Problem Statement

System design preparation is often scattered across multiple platforms with:

* ❌ No centralized knowledge base
* ❌ Poor search and filtering
* ❌ No structured categorization
* ❌ No tracking of important concepts

---

## 💡 Solution

This project solves the problem by creating a **structured knowledge base system** where users can:

* Browse system design prompts
* Read detailed explanations
* Filter by category, concept, and type
* Search across prompts and responses
* Track trending and popular topics
* Bookmark and save important content

---

## 🧠 Dataset Structure

The application is built on a structured JSON dataset:

```json id="dataset-structure"
{
  "prompt": "System design question",
  "response": "Detailed explanation",
  "metadata": {
    "category": "Foundations",
    "subcategory": "Scalability",
    "concept": "Horizontal vs vertical scaling",
    "question_type": "design",
    "generated_at": "2025-08-20T17:49:57.932316"
  }
}
```

---

## 🗄️ Database Schema Design

The schema is designed **directly based on dataset analysis**:

```js id="schema-final"
{
  prompt: String,
  response: String,
  metadata: {
    category: String,
    subcategory: String,
    concept: String,
    question_type: String,
    generated_at: Date
  },
  views: Number,
  bookmarks: Number,
  isArchived: Boolean
}
```

### ✅ Key Design Decisions

* Used `prompt` instead of `title`
* Stored full explanation in `response`
* Nested `metadata` for structured filtering
* Added `views`, `bookmarks` for analytics
* Used indexing for fast search

---

## 🏗️ System Architecture

The project follows a **modular layered architecture**:

* **Frontend (React)** → UI & user interaction
* **Backend (Express)** → API handling
* **Database (MongoDB)** → Data storage
* **Middleware Layer** → Auth, logging, validation

---

## ✨ Features

### 🔹 Core Features

* CRUD operations for concepts
* Advanced search (prompt, response)
* Filtering (category, concept, question type)
* Pagination & sorting

---

### 🔹 User Features

* Authentication (JWT)
* Bookmark concepts
* Add personal notes
* Vote on concepts

---

### 🔹 Analytics

* Trending concepts
* Most viewed topics
* Category distribution

---

### 🔹 Advanced Features

* Related concepts
* Daily system design challenges
* Personalized recommendations

---

## ⚙️ API Overview

### 📌 Concepts

* GET `/api/v1/concepts`
* GET `/api/v1/concepts/:id`
* POST `/api/v1/concepts`
* DELETE `/api/v1/concepts/:id`

---

### 🔍 Search

* GET `/api/v1/search?q=keyword`
* GET `/api/v1/search/title?q=keyword`

---

### 📊 Analytics

* GET `/api/v1/analytics/trending`
* GET `/api/v1/analytics/views/top`

---

### 🔐 Authentication

* POST `/api/v1/auth/register`
* POST `/api/v1/auth/login`

---

## 🛠️ Tech Stack

### 🔧 Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### 🎨 Frontend

* React.js
* Tailwind CSS

### 🔐 Authentication

* JWT (JSON Web Tokens)

---

## 📂 Project Structure

```id="project-structure"
caia_system_design/
│
├── backend/
│  ├── index.js                    # Entry point (loads src/app.js)
├── src/
│   ├── app.js                  # Express app setup & middleware
│   ├── config/                 # Configuration files (db.js, env.js)
│   ├── controllers/            # Route handlers for each feature
│   ├── middlewares/            # Custom middleware (auth, error handling, logging)
│   ├── models/                 # Mongoose schemas (User, Concept, Note, etc.)
│   ├── routes/                 # API route definitions
│   ├── scripts/                # Utility scripts (seed.js, etc.)
│   └── utils/                  # Helper functions (response, pagination, etc.)
├── package.json
├── .env                        # Environment variables (create from .env.example)
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```bash id="clone"
git clone whttps://github.com/mann2007-ptl/caia_system_design_mann_patel.git
```

---

### 2️⃣ Install Dependencies

```bash id="install"
cd backend
npm install
```

---

### 3️⃣ Setup Environment Variables

Create `.env` file:

```env id="env"
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

---

### 4️⃣ Run Server

```bash id="run"
npm run dev
```

---

## 📥 Data Import Strategy

The dataset is imported using:

* `insertMany()` for bulk insertion
* JSON parsing and transformation
* Metadata mapping to schema

---

## 🧪 Testing

* API testing using Postman
* CRUD validation
* Search & filter testing
* Error handling verification

---

## 📈 Performance Optimizations

* Indexed fields for fast search
* Pagination for large datasets
* Optimized MongoDB queries
* Efficient filtering logic

---

## ⚠️ Challenges Faced

* Mapping complex dataset to schema
* Designing scalable API structure
* Implementing efficient search queries
* Handling nested metadata filtering

---


## 🔮 Future Improvements

* AI-based summarization
* Voice search
* Graph-based concept visualization
* Recommendation engine

---

## 🤝 Contribution

This project is part of an academic assignment. External contributions are not open.

---

## 📜 License

Educational use only.

---

## 👨‍💻 Author

**Your Name**
GitHub: https://github.com/devisingh2007 

---

## ⭐ Acknowledgment

This project is developed as part of the CGxSU Full Stack Assignment to demonstrate real-world system design and backend architecture skills.