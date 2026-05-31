const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('../config/db');
const Concept = require('../models/Concept');

const seedData = async () => {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. Clear existing concepts
    console.log('Clearing existing concepts...');
    await Concept.deleteMany();
    console.log('Existing concepts cleared.');

    // 3. Read dataset JSON
    const filePath = 'C:/Desktop/Collage_project_2 - Copy/caia-system-design_dataset.json';
    console.log(`Reading dataset from ${filePath}...`);
    const datasetRaw = fs.readFileSync(filePath, 'utf8');
    const dataset = JSON.parse(datasetRaw);
    console.log(`Parsed ${dataset.length} items from dataset.`);

    // 4. Transform and validate items
    const conceptsToInsert = dataset.map((item, idx) => {
      const metadata = item.metadata || {};
      
      // Handle date parsing safely
      let generatedAt = null;
      if (metadata.generated_at) {
        generatedAt = new Date(metadata.generated_at);
        if (isNaN(generatedAt.getTime())) generatedAt = null;
      }
      
      let timestamp = null;
      if (metadata.timestamp) {
        timestamp = new Date(metadata.timestamp);
        if (isNaN(timestamp.getTime())) timestamp = null;
      }

      // Default values for other metadata fields
      const languages = Array.isArray(metadata.languages) ? metadata.languages : [];
      const cloudPlatforms = Array.isArray(metadata.cloud_platforms) ? metadata.cloud_platforms : [];
      const technologies = Array.isArray(metadata.technologies) ? metadata.technologies : [];
      const patternsCovered = Array.isArray(metadata.patterns_covered) ? metadata.patterns_covered : [];

      return {
        prompt: item.prompt || 'No Prompt Provided',
        response: item.response || 'No Response Provided',
        metadata: {
          category: metadata.category || 'Uncategorized',
          subcategory: metadata.subcategory || 'General',
          concept: metadata.concept || `Concept ${idx + 1}`,
          question_type: metadata.question_type || 'explain',
          generated_at: generatedAt,
          difficulty: metadata.difficulty || 'intermediate',
          timestamp: timestamp,
          technology_level: metadata.technology_level || 'standard',
          domain_type: metadata.domain_type || 'general',
          languages: languages,
          cloud_platforms: cloudPlatforms,
          technologies: technologies,
          patterns_covered: patternsCovered
        },
        views: Math.floor(Math.random() * 500) + 10, // Mock some initial views
        bookmarksCount: Math.floor(Math.random() * 50) + 1, // Mock some initial bookmarks count
        upvotes: Math.floor(Math.random() * 100) + 5,
        downvotes: Math.floor(Math.random() * 10),
        get votesCount() {
          return this.upvotes - this.downvotes;
        },
        isArchived: false,
        versionHistory: []
      };
    });

    // 5. Bulk insert
    console.log('Seeding dataset to MongoDB...');
    await Concept.insertMany(conceptsToInsert);
    console.log('Database Seeding Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
