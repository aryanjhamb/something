/**
 * Resume Data Usage Examples
 * This file demonstrates how to use the separated resume data structure
 */

// Example: How to access and use different sections of resume data
function demonstrateDataUsage() {
  // Initialize the data manager
  const dataManager = new ResumeDataManager();
  
  console.log('=== Resume Data Structure Examples ===');
  
  // 1. Personal Information
  console.log('\n1. Personal Information:');
  const personalInfo = dataManager.data.personal;
  console.log('Full Name:', personalInfo.fullName);
  console.log('Email:', personalInfo.email);
  console.log('Professional Summary:', personalInfo.summary);
  
  // 2. Skills by Category
  console.log('\n2. Skills by Category:');
  const skills = dataManager.data.skills;
  console.log('Programming Languages:', skills.programming);
  console.log('Frameworks:', skills.frameworks);
  console.log('Databases:', skills.databases);
  console.log('Tools:', skills.tools);
  console.log('Soft Skills:', skills.soft_skills);
  
  // 3. Work Experience
  console.log('\n3. Work Experience:');
  dataManager.data.experience.forEach((job, index) => {
    console.log(`Job ${index + 1}:`);
    console.log(`  Title: ${job.title}`);
    console.log(`  Company: ${job.company}`);
    console.log(`  Duration: ${job.startDate} - ${job.endDate}`);
    console.log(`  Responsibilities: ${job.responsibilities.length} items`);
  });
  
  // 4. Education
  console.log('\n4. Education:');
  dataManager.data.education.forEach((edu, index) => {
    console.log(`Education ${index + 1}:`);
    console.log(`  Degree: ${edu.degree}`);
    console.log(`  School: ${edu.school}`);
    console.log(`  GPA: ${edu.gpa}`);
  });
  
  // 5. Projects
  console.log('\n5. Projects:');
  dataManager.data.projects.forEach((project, index) => {
    console.log(`Project ${index + 1}:`);
    console.log(`  Name: ${project.name}`);
    console.log(`  Technologies: ${project.technologies.join(', ')}`);
    console.log(`  GitHub: ${project.github_url}`);
    console.log(`  Live URL: ${project.live_url}`);
  });
}

// Example: Creating a resume summary from separated data
function generateResumeSummary(dataManager) {
  const data = dataManager.data;
  
  const summary = {
    candidate: data.personal.fullName,
    yearsOfExperience: calculateExperience(data.experience),
    totalProjects: data.projects.length,
    skillCount: dataManager.getAllSkillsFlat().length,
    education: data.education.length,
    topSkills: getTopSkills(data.skills),
    recentJob: data.experience[0] || null,
    featuredProject: data.projects[0] || null
  };
  
  return summary;
}

// Helper function to calculate years of experience
function calculateExperience(experience) {
  if (!experience.length) return 0;
  
  const totalMonths = experience.reduce((total, job) => {
    if (job.startDate && job.endDate) {
      const start = new Date(job.startDate);
      const end = job.endDate === 'Present' ? new Date() : new Date(job.endDate);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                    (end.getMonth() - start.getMonth());
      return total + months;
    }
    return total;
  }, 0);
  
  return Math.round(totalMonths / 12 * 10) / 10; // Round to 1 decimal place
}

// Helper function to get top skills across all categories
function getTopSkills(skills, limit = 5) {
  const allSkills = [];
  Object.values(skills).forEach(category => {
    if (Array.isArray(category)) {
      allSkills.push(...category);
    }
  });
  return allSkills.slice(0, limit);
}

// Example: Filtering data for specific use cases
function filterResumeData(dataManager, criteria) {
  const filtered = {
    personal: dataManager.data.personal,
    skills: {},
    experience: [],
    education: [],
    projects: []
  };
  
  // Filter skills by category
  if (criteria.skillCategories) {
    criteria.skillCategories.forEach(category => {
      if (dataManager.data.skills[category]) {
        filtered.skills[category] = dataManager.data.skills[category];
      }
    });
  }
  
  // Filter experience by years
  if (criteria.minYears || criteria.maxYears) {
    filtered.experience = dataManager.data.experience.filter(job => {
      const years = calculateJobDuration(job);
      return (!criteria.minYears || years >= criteria.minYears) &&
             (!criteria.maxYears || years <= criteria.maxYears);
    });
  } else {
    filtered.experience = dataManager.data.experience;
  }
  
  // Filter projects by technology
  if (criteria.technologies) {
    filtered.projects = dataManager.data.projects.filter(project => 
      criteria.technologies.some(tech => 
        project.technologies.some(projTech => 
          projTech.toLowerCase().includes(tech.toLowerCase())
        )
      )
    );
  } else {
    filtered.projects = dataManager.data.projects;
  }
  
  // Filter education by degree level
  if (criteria.degreeLevel) {
    filtered.education = dataManager.data.education.filter(edu =>
      edu.degree.toLowerCase().includes(criteria.degreeLevel.toLowerCase())
    );
  } else {
    filtered.education = dataManager.data.education;
  }
  
  return filtered;
}

// Helper function to calculate job duration
function calculateJobDuration(job) {
  if (!job.startDate || !job.endDate) return 0;
  
  const start = new Date(job.startDate);
  const end = job.endDate === 'Present' ? new Date() : new Date(job.endDate);
  const years = (end.getFullYear() - start.getFullYear()) + 
                (end.getMonth() - start.getMonth()) / 12;
  
  return Math.round(years * 10) / 10;
}

// Example: Generating different resume formats
function generateTailoredResume(dataManager, jobType) {
  let filteredData;
  
  switch (jobType.toLowerCase()) {
    case 'frontend':
      filteredData = filterResumeData(dataManager, {
        skillCategories: ['programming', 'frameworks', 'tools'],
        technologies: ['react', 'vue', 'angular', 'javascript', 'css', 'html']
      });
      break;
      
    case 'backend':
      filteredData = filterResumeData(dataManager, {
        skillCategories: ['programming', 'databases', 'tools'],
        technologies: ['node', 'python', 'java', 'sql', 'api']
      });
      break;
      
    case 'fullstack':
      filteredData = filterResumeData(dataManager, {
        skillCategories: ['programming', 'frameworks', 'databases', 'tools']
      });
      break;
      
    case 'entry-level':
      filteredData = filterResumeData(dataManager, {
        maxYears: 2,
        skillCategories: ['programming', 'technical', 'soft_skills']
      });
      break;
      
    default:
      filteredData = dataManager.getFormattedData();
  }
  
  return filteredData;
}

// Example: Exporting specific sections
function exportSectionData(dataManager, section) {
  const sectionData = {
    exportDate: new Date().toISOString(),
    section: section,
    data: null
  };
  
  switch (section) {
    case 'skills':
      sectionData.data = {
        categorized: dataManager.data.skills,
        flat: dataManager.getAllSkillsFlat(),
        count: dataManager.getAllSkillsFlat().length
      };
      break;
      
    case 'experience':
      sectionData.data = {
        jobs: dataManager.data.experience,
        totalYears: calculateExperience(dataManager.data.experience),
        companies: [...new Set(dataManager.data.experience.map(job => job.company))]
      };
      break;
      
    case 'projects':
      sectionData.data = {
        projects: dataManager.data.projects,
        technologies: [...new Set(dataManager.data.projects.flatMap(p => p.technologies))],
        withGithub: dataManager.data.projects.filter(p => p.github_url).length,
        withLiveURL: dataManager.data.projects.filter(p => p.live_url).length
      };
      break;
      
    case 'education':
      sectionData.data = {
        degrees: dataManager.data.education,
        schools: [...new Set(dataManager.data.education.map(edu => edu.school))],
        averageGPA: calculateAverageGPA(dataManager.data.education)
      };
      break;
      
    default:
      sectionData.data = dataManager.data[section] || null;
  }
  
  return sectionData;
}

// Helper function to calculate average GPA
function calculateAverageGPA(education) {
  const gpas = education
    .map(edu => parseFloat(edu.gpa))
    .filter(gpa => !isNaN(gpa));
    
  if (gpas.length === 0) return null;
  
  const average = gpas.reduce((sum, gpa) => sum + gpa, 0) / gpas.length;
  return Math.round(average * 100) / 100;
}

// Example: Data validation and completeness check
function validateResumeData(dataManager) {
  const validation = {
    isValid: true,
    completeness: 0,
    issues: [],
    suggestions: []
  };
  
  const data = dataManager.data;
  let completedFields = 0;
  let totalFields = 0;
  
  // Validate personal information
  const requiredPersonalFields = ['fullName', 'email', 'phone', 'summary'];
  requiredPersonalFields.forEach(field => {
    totalFields++;
    if (data.personal[field] && data.personal[field].trim()) {
      completedFields++;
    } else {
      validation.issues.push(`Missing ${field} in personal information`);
    }
  });
  
  // Check experience
  totalFields++;
  if (data.experience.length > 0) {
    completedFields++;
  } else {
    validation.issues.push('No work experience provided');
  }
  
  // Check education
  totalFields++;
  if (data.education.length > 0) {
    completedFields++;
  } else {
    validation.suggestions.push('Consider adding education information');
  }
  
  // Check skills
  totalFields++;
  const skillCount = dataManager.getAllSkillsFlat().length;
  if (skillCount > 0) {
    completedFields++;
    if (skillCount < 5) {
      validation.suggestions.push('Consider adding more skills (recommended: 5+)');
    }
  } else {
    validation.issues.push('No skills provided');
  }
  
  // Check projects
  if (data.projects.length > 0) {
    validation.suggestions.push(`Great! You have ${data.projects.length} project(s)`);
  } else {
    validation.suggestions.push('Consider adding projects to showcase your work');
  }
  
  validation.completeness = Math.round((completedFields / totalFields) * 100);
  validation.isValid = validation.issues.length === 0;
  
  return validation;
}

// Usage examples
if (typeof window !== 'undefined') {
  // Browser environment - attach to window for console testing
  window.ResumeDataExamples = {
    demonstrateDataUsage,
    generateResumeSummary,
    filterResumeData,
    generateTailoredResume,
    exportSectionData,
    validateResumeData
  };
  
  console.log('Resume Data Examples loaded. Try:');
  console.log('- ResumeDataExamples.demonstrateDataUsage()');
  console.log('- ResumeDataExamples.generateResumeSummary(dataManager)');
  console.log('- ResumeDataExamples.validateResumeData(dataManager)');
}

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    demonstrateDataUsage,
    generateResumeSummary,
    filterResumeData,
    generateTailoredResume,
    exportSectionData,
    validateResumeData
  };
}