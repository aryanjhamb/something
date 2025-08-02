# Resume Data Structure Documentation

This document explains the separated resume data structure implementation that organizes resume information into distinct, manageable sections.

## Overview

The resume data has been separated into 5 main sections, each with its own JSON file and data structure:

1. **Personal Information** (`data/personal-info.json`)
2. **Skills** (`data/skills.json`)
3. **Education** (`data/education.json`)
4. **Work Experience** (`data/experience.json`)
5. **Projects** (`data/projects.json`)

## Data Structure Details

### 1. Personal Information
```json
{
  "fullName": "string",
  "email": "string", 
  "phone": "string",
  "location": "string",
  "linkedin": "string",
  "github": "string",
  "website": "string",
  "summary": "string",
  "objective": "string"
}
```

### 2. Skills (Categorized)
```json
{
  "technical": ["skill1", "skill2"],
  "programming": ["JavaScript", "Python"],
  "frameworks": ["React", "Node.js"],
  "databases": ["MySQL", "MongoDB"],
  "tools": ["Git", "Docker"],
  "languages": ["English", "Spanish"],
  "soft_skills": ["Communication", "Leadership"],
  "certifications": ["AWS Certified", "Google Analytics"]
}
```

### 3. Education
```json
[
  {
    "degree": "Bachelor of Science in Computer Science",
    "major": "Computer Science",
    "school": "University Name",
    "location": "City, State",
    "startDate": "2018-09",
    "endDate": "2022-05",
    "gpa": "3.8",
    "honors": ["Magna Cum Laude", "Dean's List"],
    "relevant_coursework": ["Data Structures", "Algorithms"],
    "activities": ["Computer Science Club", "Hackathon Winner"]
  }
]
```

### 4. Work Experience
```json
[
  {
    "title": "Software Developer",
    "company": "Tech Company Inc.",
    "location": "City, State",
    "startDate": "2022-06",
    "endDate": "Present",
    "description": "Developed web applications using modern frameworks",
    "responsibilities": [
      "Built responsive web applications",
      "Collaborated with cross-functional teams"
    ],
    "achievements": [
      "Improved application performance by 40%",
      "Led a team of 3 developers"
    ],
    "technologies": ["React", "Node.js", "MongoDB"]
  }
]
```

### 5. Projects
```json
[
  {
    "name": "E-commerce Platform",
    "description": "Full-stack e-commerce application with user authentication",
    "technologies": ["React", "Node.js", "Express", "MongoDB"],
    "github_url": "https://github.com/username/project",
    "live_url": "https://project-demo.com",
    "image_url": "https://example.com/project-image.png",
    "start_date": "2023-01",
    "end_date": "2023-03",
    "highlights": [
      "Implemented secure payment processing",
      "Built responsive design for mobile devices"
    ],
    "team_size": "3",
    "role": "Full-stack Developer"
  }
]
```

## Data Manager Usage

### Initialize the Data Manager
```javascript
const dataManager = new ResumeDataManager();
await dataManager.loadAllData();
```

### Adding Data

#### Personal Information
```javascript
dataManager.updatePersonalInfo({
  fullName: "John Doe",
  email: "john@example.com",
  summary: "Experienced software developer..."
});
```

#### Skills (Categorized)
```javascript
dataManager.addSkills('programming', ['JavaScript', 'Python']);
dataManager.addSkills('frameworks', ['React', 'Vue.js']);
dataManager.addSkills('soft_skills', ['Communication', 'Problem Solving']);
```

#### Experience
```javascript
dataManager.addExperience({
  title: "Senior Developer",
  company: "Tech Corp",
  startDate: "2023-01",
  endDate: "Present",
  responsibilities: ["Lead development team", "Code review"],
  technologies: ["React", "Node.js"]
});
```

#### Education
```javascript
dataManager.addEducation({
  degree: "Master of Science",
  major: "Computer Science",
  school: "Tech University",
  gpa: "3.9",
  honors: ["Summa Cum Laude"]
});
```

#### Projects
```javascript
dataManager.addProject({
  name: "Task Management App",
  description: "React-based task management application",
  technologies: ["React", "Firebase"],
  github_url: "https://github.com/user/task-app",
  highlights: ["Real-time collaboration", "Mobile responsive"]
});
```

### Retrieving Data

#### Get All Data (Formatted for Portfolio)
```javascript
const portfolioData = dataManager.getFormattedData();
// Returns: { personal, experience, education, skills: flatArray, projects }
```

#### Get Specific Sections
```javascript
const skills = dataManager.data.skills;
const experience = dataManager.data.experience;
const projects = dataManager.data.projects;
```

#### Get Skills as Flat Array
```javascript
const allSkills = dataManager.getAllSkillsFlat();
// Returns: ["JavaScript", "React", "Python", ...]
```

### Data Persistence

#### Save to LocalStorage
```javascript
await dataManager.saveAllData();
```

#### Load from LocalStorage
```javascript
dataManager.loadFromLocalStorage();
```

#### Export to JSON File
```javascript
dataManager.exportToJSON();
// Downloads a JSON file with all resume data
```

#### Import from JSON File
```javascript
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];
await dataManager.importFromJSON(file);
```

## Advanced Usage Examples

### 1. Generate Resume Summary
```javascript
const summary = ResumeDataExamples.generateResumeSummary(dataManager);
console.log(`${summary.candidate} has ${summary.yearsOfExperience} years of experience`);
```

### 2. Filter Data for Job Applications
```javascript
// Frontend developer resume
const frontendResume = ResumeDataExamples.generateTailoredResume(dataManager, 'frontend');

// Backend developer resume  
const backendResume = ResumeDataExamples.generateTailoredResume(dataManager, 'backend');
```

### 3. Validate Resume Completeness
```javascript
const validation = ResumeDataExamples.validateResumeData(dataManager);
console.log(`Resume is ${validation.completeness}% complete`);
console.log('Issues:', validation.issues);
console.log('Suggestions:', validation.suggestions);
```

### 4. Export Specific Sections
```javascript
const skillsData = ResumeDataExamples.exportSectionData(dataManager, 'skills');
const projectsData = ResumeDataExamples.exportSectionData(dataManager, 'projects');
```

## Benefits of Separated Data Structure

### 1. **Modularity**
- Each section can be managed independently
- Easy to add/remove specific data types
- Clear separation of concerns

### 2. **Flexibility**
- Skills are categorized for better organization
- Projects section supports portfolios
- Enhanced data structure with more fields

### 3. **Reusability**
- Data can be filtered for different job types
- Easy to generate tailored resumes
- Supports multiple export formats

### 4. **Maintainability**
- Structured validation
- Clear data relationships
- Easier debugging and updates

### 5. **Extensibility**
- Easy to add new fields
- Support for future features
- Scalable architecture

## Integration with Existing Code

The separated data structure maintains backward compatibility with the existing resume generator:

```javascript
// The existing code still works
const resumeData = dataManager.getFormattedData();
// This returns the same structure as before: { personal, experience, education, skills, projects }
```

## File Structure
```
resume-portfolio-generator/
├── data/
│   ├── personal-info.json
│   ├── skills.json
│   ├── education.json
│   ├── experience.json
│   └── projects.json
├── data-manager.js
├── data-usage-examples.js
├── script.js (updated)
└── index.html (updated)
```

## Next Steps

1. **Enhanced Resume Parser**: The parser now detects and categorizes projects automatically
2. **Skills Categorization**: Skills are automatically sorted into relevant categories
3. **Data Validation**: Built-in validation ensures data completeness
4. **Export Options**: Multiple export formats for different use cases
5. **Resume Tailoring**: Generate different resume versions for specific job types

This separated data structure provides a solid foundation for building more sophisticated resume and portfolio management features.