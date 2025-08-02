/**
 * Data Manager for Resume Portfolio Generator
 * Handles separated resume data files and provides utilities for data management
 */
class ResumeDataManager {
  constructor() {
    this.dataFiles = {
      personal: './data/personal-info.json',
      skills: './data/skills.json',
      education: './data/education.json',
      experience: './data/experience.json',
      projects: './data/projects.json'
    };
    
    this.data = {
      personal: {},
      skills: {},
      education: [],
      experience: [],
      projects: []
    };
  }

  /**
   * Load all data files
   */
  async loadAllData() {
    try {
      for (const [section, filePath] of Object.entries(this.dataFiles)) {
        await this.loadDataSection(section);
      }
      console.log('All resume data loaded successfully');
      return this.data;
    } catch (error) {
      console.error('Error loading resume data:', error);
      this.initializeEmptyData();
      return this.data;
    }
  }

  /**
   * Load a specific data section
   */
  async loadDataSection(section) {
    try {
      const response = await fetch(this.dataFiles[section]);
      if (response.ok) {
        this.data[section] = await response.json();
      } else {
        this.initializeEmptySection(section);
      }
    } catch (error) {
      console.error(`Error loading ${section} data:`, error);
      this.initializeEmptySection(section);
    }
  }

  /**
   * Save data to a specific section
   */
  async saveDataSection(section, data) {
    this.data[section] = data;
    // In a real application, you would save to backend/localStorage
    // For demo purposes, we'll just store in memory
    console.log(`${section} data saved:`, data);
    
    // Simulate saving to localStorage for persistence
    try {
      localStorage.setItem(`resume_${section}`, JSON.stringify(data));
      console.log(`${section} data saved to localStorage`);
    } catch (error) {
      console.error(`Error saving ${section} to localStorage:`, error);
    }
  }

  /**
   * Save all data sections
   */
  async saveAllData() {
    for (const section of Object.keys(this.data)) {
      await this.saveDataSection(section, this.data[section]);
    }
    console.log('All resume data saved successfully');
  }

  /**
   * Load data from localStorage if available
   */
  loadFromLocalStorage() {
    for (const section of Object.keys(this.data)) {
      try {
        const stored = localStorage.getItem(`resume_${section}`);
        if (stored) {
          this.data[section] = JSON.parse(stored);
        }
      } catch (error) {
        console.error(`Error loading ${section} from localStorage:`, error);
      }
    }
  }

  /**
   * Initialize empty data structure
   */
  initializeEmptyData() {
    this.data = {
      personal: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        website: '',
        summary: '',
        objective: ''
      },
      skills: {
        technical: [],
        programming: [],
        frameworks: [],
        databases: [],
        tools: [],
        languages: [],
        soft_skills: [],
        certifications: []
      },
      education: [],
      experience: [],
      projects: []
    };
  }

  /**
   * Initialize empty data for a specific section
   */
  initializeEmptySection(section) {
    switch (section) {
      case 'personal':
        this.data.personal = {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          github: '',
          website: '',
          summary: '',
          objective: ''
        };
        break;
      case 'skills':
        this.data.skills = {
          technical: [],
          programming: [],
          frameworks: [],
          databases: [],
          tools: [],
          languages: [],
          soft_skills: [],
          certifications: []
        };
        break;
      case 'education':
        this.data.education = [];
        break;
      case 'experience':
        this.data.experience = [];
        break;
      case 'projects':
        this.data.projects = [];
        break;
    }
  }

  /**
   * Add a new item to experience
   */
  addExperience(experienceItem) {
    const newExperience = {
      title: experienceItem.title || '',
      company: experienceItem.company || '',
      location: experienceItem.location || '',
      startDate: experienceItem.startDate || '',
      endDate: experienceItem.endDate || '',
      description: experienceItem.description || '',
      responsibilities: experienceItem.responsibilities || [],
      achievements: experienceItem.achievements || [],
      technologies: experienceItem.technologies || []
    };
    this.data.experience.push(newExperience);
    this.saveDataSection('experience', this.data.experience);
    return newExperience;
  }

  /**
   * Add a new item to education
   */
  addEducation(educationItem) {
    const newEducation = {
      degree: educationItem.degree || '',
      major: educationItem.major || '',
      school: educationItem.school || '',
      location: educationItem.location || '',
      startDate: educationItem.startDate || '',
      endDate: educationItem.endDate || '',
      gpa: educationItem.gpa || '',
      honors: educationItem.honors || [],
      relevant_coursework: educationItem.relevant_coursework || [],
      activities: educationItem.activities || []
    };
    this.data.education.push(newEducation);
    this.saveDataSection('education', this.data.education);
    return newEducation;
  }

  /**
   * Add a new project
   */
  addProject(projectItem) {
    const newProject = {
      name: projectItem.name || '',
      description: projectItem.description || '',
      technologies: projectItem.technologies || [],
      github_url: projectItem.github_url || '',
      live_url: projectItem.live_url || '',
      image_url: projectItem.image_url || '',
      start_date: projectItem.start_date || '',
      end_date: projectItem.end_date || '',
      highlights: projectItem.highlights || [],
      team_size: projectItem.team_size || '',
      role: projectItem.role || ''
    };
    this.data.projects.push(newProject);
    this.saveDataSection('projects', this.data.projects);
    return newProject;
  }

  /**
   * Add skills to a specific category
   */
  addSkills(category, skills) {
    if (!this.data.skills[category]) {
      this.data.skills[category] = [];
    }
    
    const skillsArray = Array.isArray(skills) ? skills : [skills];
    this.data.skills[category].push(...skillsArray);
    
    // Remove duplicates
    this.data.skills[category] = [...new Set(this.data.skills[category])];
    
    this.saveDataSection('skills', this.data.skills);
    return this.data.skills[category];
  }

  /**
   * Update personal information
   */
  updatePersonalInfo(personalData) {
    this.data.personal = { ...this.data.personal, ...personalData };
    this.saveDataSection('personal', this.data.personal);
    return this.data.personal;
  }

  /**
   * Get all data in the original format for backward compatibility
   */
  getFormattedData() {
    return {
      personal: this.data.personal,
      experience: this.data.experience,
      education: this.data.education,
      skills: this.getAllSkillsFlat(),
      projects: this.data.projects
    };
  }

  /**
   * Get all skills as a flat array (for backward compatibility)
   */
  getAllSkillsFlat() {
    const allSkills = [];
    for (const category of Object.values(this.data.skills)) {
      if (Array.isArray(category)) {
        allSkills.push(...category);
      }
    }
    return [...new Set(allSkills)];
  }

  /**
   * Import data from the existing resume parser format
   */
  importFromParser(parsedData) {
    // Update personal information
    this.updatePersonalInfo({
      fullName: parsedData.fullName || '',
      email: parsedData.email || '',
      phone: parsedData.phone || '',
      location: parsedData.location || '',
      linkedin: parsedData.linkedin || '',
      github: parsedData.github || '',
      summary: parsedData.summary || ''
    });

    // Import experience
    if (parsedData.experience && Array.isArray(parsedData.experience)) {
      this.data.experience = parsedData.experience.map(exp => ({
        title: exp.title || '',
        company: exp.company || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: exp.description || '',
        responsibilities: [],
        achievements: [],
        technologies: []
      }));
      this.saveDataSection('experience', this.data.experience);
    }

    // Import education
    if (parsedData.education && Array.isArray(parsedData.education)) {
      this.data.education = parsedData.education.map(edu => ({
        degree: edu.degree || '',
        major: '',
        school: edu.school || '',
        location: edu.location || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        gpa: edu.gpa || '',
        honors: [],
        relevant_coursework: [],
        activities: []
      }));
      this.saveDataSection('education', this.data.education);
    }

    // Import skills (categorize them automatically)
    if (parsedData.skills && Array.isArray(parsedData.skills)) {
      this.categorizeAndImportSkills(parsedData.skills);
    }

    console.log('Data imported from parser successfully');
    return this.getFormattedData();
  }

  /**
   * Automatically categorize skills based on common patterns
   */
  categorizeAndImportSkills(skillsArray) {
    const skillCategories = {
      programming: ['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript'],
      frameworks: ['react', 'angular', 'vue', 'nodejs', 'express', 'django', 'flask', 'spring', 'laravel', '.net', 'rails'],
      databases: ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server', 'cassandra', 'dynamodb'],
      tools: ['git', 'docker', 'kubernetes', 'jenkins', 'webpack', 'npm', 'yarn', 'gulp', 'grunt', 'babel'],
      languages: ['english', 'spanish', 'french', 'german', 'chinese', 'japanese', 'arabic', 'portuguese', 'russian']
    };

    // Initialize all categories
    for (const category of Object.keys(skillCategories)) {
      this.data.skills[category] = [];
    }
    this.data.skills.technical = [];
    this.data.skills.soft_skills = [];
    this.data.skills.certifications = [];

    // Categorize each skill
    skillsArray.forEach(skill => {
      const lowerSkill = skill.toLowerCase().trim();
      let categorized = false;

      // Check against predefined categories
      for (const [category, keywords] of Object.entries(skillCategories)) {
        if (keywords.some(keyword => lowerSkill.includes(keyword))) {
          this.data.skills[category].push(skill);
          categorized = true;
          break;
        }
      }

      // If not categorized, check for certifications
      if (!categorized && (lowerSkill.includes('certified') || lowerSkill.includes('certification'))) {
        this.data.skills.certifications.push(skill);
        categorized = true;
      }

      // If still not categorized, add to technical skills
      if (!categorized) {
        this.data.skills.technical.push(skill);
      }
    });

    this.saveDataSection('skills', this.data.skills);
  }

  /**
   * Export data to JSON file (for download)
   */
  exportToJSON() {
    const dataToExport = {
      personal: this.data.personal,
      skills: this.data.skills,
      education: this.data.education,
      experience: this.data.experience,
      projects: this.data.projects,
      exported_at: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.data.personal.fullName || 'resume'}_data.json`.replace(/\s+/g, '_');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Import data from JSON file
   */
  async importFromJSON(file) {
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);
      
      // Validate and import the data
      if (importedData.personal) this.data.personal = importedData.personal;
      if (importedData.skills) this.data.skills = importedData.skills;
      if (importedData.education) this.data.education = importedData.education;
      if (importedData.experience) this.data.experience = importedData.experience;
      if (importedData.projects) this.data.projects = importedData.projects;
      
      await this.saveAllData();
      console.log('Data imported from JSON successfully');
      return this.getFormattedData();
    } catch (error) {
      console.error('Error importing JSON data:', error);
      throw new Error('Invalid JSON file format');
    }
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResumeDataManager;
}