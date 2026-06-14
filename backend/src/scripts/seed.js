const fs = require('fs');
const connectDB = require('../config/db');
const Concept = require('../models/Concept');
const User = require('../models/User');

const seedData = async () => {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Concept.deleteMany();
    console.log('Existing data cleared.');

    // 3. Create admin user
    console.log('Creating admin user...');
    const admin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created successfully.');

    // 4. Read dataset JSON
    const possiblePaths = [
      '../../detaset.json',
      'C:/Desktop/Collage_project_2/caia_system_design_devisingh_rajput/detaset.json',
      'C:/Desktop/Collage_project_2 - Copy/caia-system-design_dataset.json',
      'C:/Desktop/Collage_project_2/caia-system-design_dataset.json',
      '../../caia-system-design_dataset.json',
      './caia-system-design_dataset.json'
    ];

    let datasetRaw = null;
    let filePath = '';

    for (const path of possiblePaths) {
      if (fs.existsSync(path)) {
        filePath = path;
        datasetRaw = fs.readFileSync(path, 'utf8');
        break;
      }
    }

    if (!datasetRaw) {
      throw new Error(`Dataset file not found in any of the checked paths: ${possiblePaths.join(', ')}`);
    }

    console.log(`Reading dataset from ${filePath}...`);
    const dataset = JSON.parse(datasetRaw);
    console.log(`Parsed ${dataset.length} items from dataset.`);

    // 5. Transform and validate items
    const conceptsToInsert = dataset.map((item, idx) => {
      const metadata = item.metadata || {};
      
      // Handle date parsing safely
      let generatedAt = null;
      if (metadata.generated_at) {
        generatedAt = new Date(metadata.generated_at);
        if (isNaN(generatedAt.getTime())) {
          generatedAt = null;
        }
      }
      
      let timestamp = null;
      if (metadata.timestamp) {
        timestamp = new Date(metadata.timestamp);
        if (isNaN(timestamp.getTime())) {
          timestamp = null;
        }
      }

      // Map difficulty to valid enum values
      let difficulty = metadata.difficulty?.toLowerCase() || 'intermediate';
      if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
        if (difficulty === 'expert') {
          difficulty = 'advanced';
        } else {
          difficulty = 'intermediate';
        }
      }
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
          question_type: metadata.question_type || 'open-ended',
          difficulty: difficulty,
          languages: languages,
          cloud_platforms: cloudPlatforms,
          technologies: technologies,
          patterns_covered: patternsCovered
        },
        createdBy: admin._id,
        isArchived: false,
        votesCount: {
          up: Math.floor(Math.random() * 100) + 5,
          down: Math.floor(Math.random() * 10)
        },
        bookmarksCount: Math.floor(Math.random() * 50) + 1
      };
    });

    // 6. Bulk insert
    console.log('Seeding dataset to MongoDB...');
    const result = await Concept.insertMany(conceptsToInsert);
    console.log(`Successfully inserted ${result.length} concepts.`);
    console.log('Database Seeding Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
