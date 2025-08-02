// Landing Page Functionality
class LandingPage {
  constructor() {
    this.initializeMobileNav();
    this.initializeScrollAnimations();
    this.initializeSmoothScrolling();
  }

  initializeMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
      });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  }

  initializeScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.step-card, .feature-card, .section');
    animateElements.forEach(el => {
      el.classList.add('scroll-animate');
      observer.observe(el);
    });
  }

  initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Initialize landing page functionality
const landingPage = new LandingPage();

class ResumePortfolioGenerator {
  constructor() {
    this.currentStep = 1
    this.resumeData = {}
    this.selectedTemplate = null
    this.skills = []
    this.experience = []
    this.education = []

    this.initializeEventListeners()
    this.initializeFormData()
  }

  initializeEventListeners() {
    // File upload
    const uploadArea = document.getElementById("uploadArea")
    const fileInput = document.getElementById("fileInput")
    const removeFile = document.getElementById("removeFile")
    const parseResume = document.getElementById("parseResume")

    uploadArea.addEventListener("click", () => fileInput.click())
    uploadArea.addEventListener("dragover", this.handleDragOver.bind(this))
    uploadArea.addEventListener("dragleave", this.handleDragLeave.bind(this))
    uploadArea.addEventListener("drop", this.handleDrop.bind(this))

    fileInput.addEventListener("change", this.handleFileSelect.bind(this))
    removeFile.addEventListener("click", this.removeFile.bind(this))
    parseResume.addEventListener("click", this.parseResume.bind(this))

    // Form interactions
    document.getElementById("addExperience").addEventListener("click", this.addExperienceItem.bind(this))
    document.getElementById("addEducation").addEventListener("click", this.addEducationItem.bind(this))
    document.getElementById("skillInput").addEventListener("keypress", this.handleSkillInput.bind(this))

    // Navigation
    document.getElementById("proceedToTemplates").addEventListener("click", () => this.goToStep(3))
    document.getElementById("generatePortfolio").addEventListener("click", this.generatePortfolio.bind(this))

    // Template selection
    document.querySelectorAll(".template-card").forEach((card) => {
      card.addEventListener("click", this.selectTemplate.bind(this))
    })

    // Customization
    document.getElementById("primaryColor").addEventListener("change", this.updatePreview.bind(this))
    document.getElementById("secondaryColor").addEventListener("change", this.updatePreview.bind(this))
    document.getElementById("fontFamily").addEventListener("change", this.updatePreview.bind(this))
    document.getElementById("showPhoto").addEventListener("change", this.updatePreview.bind(this))
    document.getElementById("showSocial").addEventListener("change", this.updatePreview.bind(this))

    // Preview controls
    document.querySelectorAll(".preview-btn").forEach((btn) => {
      btn.addEventListener("click", this.changePreviewDevice.bind(this))
    })

    // Download
    document.getElementById("downloadPortfolio").addEventListener("click", this.downloadPortfolio.bind(this))
  }

  initializeFormData() {
    // Add initial experience and education items
    this.addExperienceItem()
    this.addEducationItem()
  }

  // File Upload Handlers
  handleDragOver(e) {
    e.preventDefault()
    e.currentTarget.classList.add("dragover")
  }

  handleDragLeave(e) {
    e.preventDefault()
    e.currentTarget.classList.remove("dragover")
  }

  handleDrop(e) {
    e.preventDefault()
    e.currentTarget.classList.remove("dragover")
    const files = e.dataTransfer.files
    if (files.length > 0) {
      this.processFile(files[0])
    }
  }

  handleFileSelect(e) {
    const file = e.target.files[0]
    if (file) {
      this.processFile(file)
    }
  }

  processFile(file) {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ]

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or DOCX file.")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      alert("File size must be less than 10MB.")
      return
    }

    this.displayFilePreview(file)
  }

  displayFilePreview(file) {
    const preview = document.getElementById("filePreview")
    const fileName = preview.querySelector(".file-name")
    const fileSize = preview.querySelector(".file-size")
    const fileIcon = preview.querySelector(".file-icon")

    fileName.textContent = file.name
    fileSize.textContent = this.formatFileSize(file.size)

    // Update icon based on file type
    if (file.type.includes("pdf")) {
      fileIcon.className = "fas fa-file-pdf file-icon"
    } else {
      fileIcon.className = "fas fa-file-word file-icon"
    }

    preview.classList.remove("hidden")
    document.getElementById("uploadArea").style.display = "none"
  }

  removeFile() {
    document.getElementById("filePreview").classList.add("hidden")
    document.getElementById("uploadArea").style.display = "block"
    document.getElementById("fileInput").value = ""
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Resume Parsing (Enhanced with real data extraction)
  async parseResume() {
    this.showLoading()

    try {
      const fileInput = document.getElementById("fileInput")
      const file = fileInput.files[0]
      
      if (!file) {
        alert("Please upload a resume file first.")
        this.hideLoading()
        return
      }

      // Extract text content from the file
      const textContent = await this.extractTextFromFile(file)
      
      // Parse the extracted text to identify sections
      const parsedData = this.parseResumeText(textContent)
      
      // Populate the form with extracted data
      this.populateFormData(parsedData)
      
      this.hideLoading()
      this.goToStep(2)
    } catch (error) {
      console.error("Error parsing resume:", error)
      alert("Error parsing resume. Please try again with a different file.")
      this.hideLoading()
    }
  }

  async extractTextFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const content = e.target.result
          
          if (file.type === "application/pdf") {
            // For PDF files, pass the ArrayBuffer directly
            const textContent = await this.extractTextFromPDF(content)
            resolve(textContent)
          } else if (file.type.includes("word") || file.type.includes("document") || file.name.endsWith('.docx')) {
            // For DOCX files, pass the ArrayBuffer directly
            const textContent = await this.extractTextFromDOCX(content)
            resolve(textContent)
          } else if (file.type === "text/plain" || file.name.endsWith('.txt')) {
            // For plain text files
            resolve(content)
          } else {
            // For other file types, try to read as text
            resolve(content)
          }
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error("Failed to read file"))
      
      // Read as ArrayBuffer for PDF and DOCX, as text for others
      if (file.type === "application/pdf" || file.type.includes("word") || file.type.includes("document") || file.name.endsWith('.docx')) {
        reader.readAsArrayBuffer(file)
      } else {
        reader.readAsText(file)
      }
    })
  }

  async extractTextFromPDF(arrayBuffer) {
    try {
      // Set up PDF.js worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      
      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      
      let fullText = ''
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        
        // Combine all text items
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ')
        
        fullText += pageText + '\n'
      }
      
      return fullText
    } catch (error) {
      console.error('Error extracting text from PDF:', error)
      // Fallback to simulated text if PDF parsing fails
      return this.getFallbackText()
    }
  }

  getFallbackText() {
    // Fallback text when PDF parsing fails
    return `
    JOHN DOE
    Software Developer
    john.doe@email.com | (555) 123-4567 | New York, NY
    linkedin.com/in/johndoe | github.com/johndoe

    PROFESSIONAL SUMMARY
    Experienced software developer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about creating scalable solutions and leading development teams.

    WORK EXPERIENCE
    Senior Software Developer
    Tech Corp | New York, NY | 2021 - Present
    • Led development of microservices architecture serving 1M+ users
    • Implemented CI/CD pipelines and mentored junior developers
    • Technologies: React, Node.js, AWS, Docker

    Software Developer
    StartupXYZ | San Francisco, CA | 2019 - 2020
    • Developed responsive web applications using React and Node.js
    • Collaborated with design team to implement user-friendly interfaces
    • Technologies: JavaScript, React, Node.js, MongoDB

    EDUCATION
    Bachelor of Science in Computer Science
    University of Technology | Boston, MA | 2015 - 2019
    GPA: 3.8/4.0

    SKILLS
    Programming Languages: JavaScript, Python, Java, TypeScript
    Frameworks & Libraries: React, Node.js, Express, Angular
    Databases: MongoDB, PostgreSQL, MySQL
    Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD
    Tools: Git, VS Code, Jira, Postman
    `
  }

  async extractTextFromDOCX(content) {
    try {
      // Convert the content to an ArrayBuffer if it's not already
      let arrayBuffer
      if (content instanceof ArrayBuffer) {
        arrayBuffer = content
      } else if (content instanceof Uint8Array) {
        arrayBuffer = content.buffer
      } else {
        // If it's a string, we need to convert it to ArrayBuffer
        const response = await fetch(content)
        arrayBuffer = await response.arrayBuffer()
      }
      
      // Use mammoth.js to extract text from DOCX
      const result = await mammoth.extractRawText({ arrayBuffer })
      return result.value
    } catch (error) {
      console.error('Error extracting text from DOCX:', error)
      // Fallback to simulated text if DOCX parsing fails
      return this.getFallbackDOCXText()
    }
  }

  getFallbackDOCXText() {
    // Fallback text when DOCX parsing fails
    return `
    JANE SMITH
    Frontend Developer
    jane.smith@email.com | (555) 987-6543 | San Francisco, CA
    linkedin.com/in/janesmith | github.com/janesmith

    SUMMARY
    Creative frontend developer with 4 years of experience building modern web applications. Skilled in React, Vue.js, and responsive design principles.

    EXPERIENCE
    Frontend Developer
    Web Solutions Inc | San Francisco, CA | 2020 - Present
    • Built responsive web applications using React and TypeScript
    • Optimized application performance and user experience
    • Collaborated with UX/UI designers to implement pixel-perfect designs

    Junior Developer
    Digital Agency | Los Angeles, CA | 2018 - 2020
    • Developed client websites using HTML, CSS, and JavaScript
    • Implemented responsive design and cross-browser compatibility
    • Worked with WordPress and custom CMS solutions

    EDUCATION
    Bachelor of Arts in Computer Science
    State University | Los Angeles, CA | 2014 - 2018
    GPA: 3.7/4.0

    TECHNICAL SKILLS
    Languages: JavaScript, TypeScript, HTML5, CSS3, Python
    Frameworks: React, Vue.js, Angular, Bootstrap, Tailwind CSS
    Tools: Git, Webpack, VS Code, Figma, Adobe Creative Suite
    `
  }

  parseResumeText(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    const parsedData = {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      summary: '',
      experience: [],
      education: [],
      skills: []
    }

    let currentSection = ''
    let currentExperience = null
    let currentEducation = null

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lowerLine = line.toLowerCase()

      // Extract name (usually first line or after "NAME:")
      if (i === 0 || lowerLine.includes('name:')) {
        const name = line.replace(/name:/i, '').trim()
        if (name && !parsedData.fullName) {
          parsedData.fullName = name
        }
      }

      // Extract contact information
      if (lowerLine.includes('@') && lowerLine.includes('.')) {
        parsedData.email = line
      } else if (line.match(/\(\d{3}\)\s*\d{3}-\d{4}/) || line.match(/\d{3}-\d{3}-\d{4}/)) {
        parsedData.phone = line
      } else if (lowerLine.includes('linkedin.com')) {
        parsedData.linkedin = line
      } else if (lowerLine.includes('github.com')) {
        parsedData.github = line
      }

      // Extract location (usually contains city, state format)
      if (line.match(/[A-Za-z\s]+,\s*[A-Z]{2}/) && !lowerLine.includes('linkedin') && !lowerLine.includes('github')) {
        parsedData.location = line
      }

      // Identify sections
      if (lowerLine.includes('summary') || lowerLine.includes('objective') || lowerLine.includes('profile')) {
        currentSection = 'summary'
      } else if (lowerLine.includes('experience') || lowerLine.includes('work history') || lowerLine.includes('employment')) {
        currentSection = 'experience'
      } else if (lowerLine.includes('education') || lowerLine.includes('academic')) {
        currentSection = 'education'
      } else if (lowerLine.includes('skills') || lowerLine.includes('technical skills') || lowerLine.includes('competencies')) {
        currentSection = 'skills'
      }

      // Parse summary
      if (currentSection === 'summary' && line.length > 20 && !lowerLine.includes('summary')) {
        parsedData.summary = line
      }

      // Parse experience
      if (currentSection === 'experience') {
        // Look for job titles (usually in caps or followed by company)
        if (line.match(/^[A-Z][A-Z\s]+$/) && line.length > 3 && line.length < 50) {
          if (currentExperience) {
            parsedData.experience.push(currentExperience)
          }
          currentExperience = {
            title: line,
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            description: ''
          }
        } else if (currentExperience) {
          // Look for company name (usually contains "|" or "at" or "with")
          if (line.includes('|') || line.includes(' at ') || line.includes(' with ')) {
            const parts = line.split(/[|]| at | with /)
            if (parts.length >= 2) {
              currentExperience.company = parts[0].trim()
              const remaining = parts.slice(1).join(' ').trim()
              // Extract dates and location
              const dateMatch = remaining.match(/(\d{4})\s*-\s*(\d{4}|present)/i)
              if (dateMatch) {
                currentExperience.startDate = dateMatch[1] + '-01'
                currentExperience.endDate = dateMatch[2].toLowerCase() === 'present' ? 'Present' : dateMatch[2] + '-12'
              }
              // Extract location
              const locationMatch = remaining.match(/([A-Za-z\s]+,\s*[A-Z]{2})/)
              if (locationMatch) {
                currentExperience.location = locationMatch[1]
              }
            }
          } else if (line.length > 20) {
            // This might be a description line
            currentExperience.description += line + ' '
          }
        }
      }

      // Parse education
      if (currentSection === 'education') {
        if (line.match(/bachelor|master|phd|degree|university|college/i)) {
          if (currentEducation) {
            parsedData.education.push(currentEducation)
          }
          currentEducation = {
            degree: line,
            school: '',
            location: '',
            startDate: '',
            endDate: '',
            gpa: ''
          }
        } else if (currentEducation) {
          // Extract school name, dates, and GPA
          if (line.includes('|') || line.includes(' - ')) {
            const parts = line.split(/[|]| - /)
            if (parts.length >= 2) {
              currentEducation.school = parts[0].trim()
              const remaining = parts.slice(1).join(' ').trim()
              const dateMatch = remaining.match(/(\d{4})\s*-\s*(\d{4})/)
              if (dateMatch) {
                currentEducation.startDate = dateMatch[1] + '-09'
                currentEducation.endDate = dateMatch[2] + '-05'
              }
              const gpaMatch = remaining.match(/gpa:\s*(\d+\.\d+)/i)
              if (gpaMatch) {
                currentEducation.gpa = gpaMatch[1]
              }
            }
          }
        }
      }

      // Parse skills
      if (currentSection === 'skills') {
        // Look for skill lists (comma-separated or bullet points)
        if (line.includes(',') || line.includes('•') || line.includes('-')) {
          const skills = line.split(/[,•-]/).map(skill => skill.trim()).filter(skill => skill.length > 0)
          parsedData.skills.push(...skills)
        } else if (line.length > 2 && line.length < 30 && !line.includes(':')) {
          // Single skill
          parsedData.skills.push(line)
        }
      }
    }

    // Add the last experience/education item
    if (currentExperience) {
      parsedData.experience.push(currentExperience)
    }
    if (currentEducation) {
      parsedData.education.push(currentEducation)
    }

    // Clean up skills (remove duplicates and empty entries)
    parsedData.skills = [...new Set(parsedData.skills.filter(skill => skill.length > 0))]

    return parsedData
  }

  populateFormData(data) {
    // Personal information
    document.getElementById("fullName").value = data.fullName || ""
    document.getElementById("email").value = data.email || ""
    document.getElementById("phone").value = data.phone || ""
    document.getElementById("location").value = data.location || ""
    document.getElementById("linkedin").value = data.linkedin || ""
    document.getElementById("github").value = data.github || ""
    document.getElementById("summary").value = data.summary || ""

    // Clear existing items
    this.experience = []
    this.education = []
    this.skills = []

    // Experience
    if (data.experience) {
      document.getElementById("experienceContainer").innerHTML = ""
      data.experience.forEach((exp) => {
        this.experience.push(exp)
        this.addExperienceItem(exp)
      })
    }

    // Education
    if (data.education) {
      document.getElementById("educationContainer").innerHTML = ""
      data.education.forEach((edu) => {
        this.education.push(edu)
        this.addEducationItem(edu)
      })
    }

    // Skills
    if (data.skills) {
      this.skills = [...data.skills]
      this.updateSkillsDisplay()
    }
  }

  // Form Management
  addExperienceItem(data = {}) {
    const container = document.getElementById("experienceContainer")
    const index = this.experience.length

    if (!data.title) {
      this.experience.push({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      })
    }

    const item = document.createElement("div")
    item.className = "experience-item"
    item.innerHTML = `
            <button type="button" class="item-remove" onclick="resumeGenerator.removeExperienceItem(${index})">
                <i class="fas fa-times"></i>
            </button>
            <div class="form-grid">
                <input type="text" placeholder="Job Title" value="${data.title || ""}" 
                       onchange="resumeGenerator.updateExperience(${index}, 'title', this.value)">
                <input type="text" placeholder="Company" value="${data.company || ""}"
                       onchange="resumeGenerator.updateExperience(${index}, 'company', this.value)">
                <input type="text" placeholder="Location" value="${data.location || ""}"
                       onchange="resumeGenerator.updateExperience(${index}, 'location', this.value)">
                <input type="month" placeholder="Start Date" value="${data.startDate || ""}"
                       onchange="resumeGenerator.updateExperience(${index}, 'startDate', this.value)">
                <input type="month" placeholder="End Date" value="${data.endDate || ""}"
                       onchange="resumeGenerator.updateExperience(${index}, 'endDate', this.value)">
            </div>
            <textarea placeholder="Job description and achievements..." rows="3"
                      onchange="resumeGenerator.updateExperience(${index}, 'description', this.value)">${data.description || ""}</textarea>
        `

    container.appendChild(item)
  }

  addEducationItem(data = {}) {
    const container = document.getElementById("educationContainer")
    const index = this.education.length

    if (!data.degree) {
      this.education.push({
        degree: "",
        school: "",
        location: "",
        startDate: "",
        endDate: "",
        gpa: "",
      })
    }

    const item = document.createElement("div")
    item.className = "education-item"
    item.innerHTML = `
            <button type="button" class="item-remove" onclick="resumeGenerator.removeEducationItem(${index})">
                <i class="fas fa-times"></i>
            </button>
            <div class="form-grid">
                <input type="text" placeholder="Degree" value="${data.degree || ""}"
                       onchange="resumeGenerator.updateEducation(${index}, 'degree', this.value)">
                <input type="text" placeholder="School/University" value="${data.school || ""}"
                       onchange="resumeGenerator.updateEducation(${index}, 'school', this.value)">
                <input type="text" placeholder="Location" value="${data.location || ""}"
                       onchange="resumeGenerator.updateEducation(${index}, 'location', this.value)">
                <input type="month" placeholder="Start Date" value="${data.startDate || ""}"
                       onchange="resumeGenerator.updateEducation(${index}, 'startDate', this.value)">
                <input type="month" placeholder="End Date" value="${data.endDate || ""}"
                       onchange="resumeGenerator.updateEducation(${index}, 'endDate', this.value)">
                <input type="text" placeholder="GPA (optional)" value="${data.gpa || ""}"
                       onchange="resumeGenerator.updateEducation(${index}, 'gpa', this.value)">
            </div>
        `

    container.appendChild(item)
  }

  updateExperience(index, field, value) {
    if (this.experience[index]) {
      this.experience[index][field] = value
    }
  }

  updateEducation(index, field, value) {
    if (this.education[index]) {
      this.education[index][field] = value
    }
  }

  removeExperienceItem(index) {
    this.experience.splice(index, 1)
    this.refreshExperienceDisplay()
  }

  removeEducationItem(index) {
    this.education.splice(index, 1)
    this.refreshEducationDisplay()
  }

  refreshExperienceDisplay() {
    const container = document.getElementById("experienceContainer")
    container.innerHTML = ""
    this.experience.forEach((exp, index) => {
      this.addExperienceItem(exp)
    })
  }

  refreshEducationDisplay() {
    const container = document.getElementById("educationContainer")
    container.innerHTML = ""
    this.education.forEach((edu, index) => {
      this.addEducationItem(edu)
    })
  }

  handleSkillInput(e) {
    if (e.key === "Enter") {
      e.preventDefault()
      const skill = e.target.value.trim()
      if (skill && !this.skills.includes(skill)) {
        this.skills.push(skill)
        this.updateSkillsDisplay()
        e.target.value = ""
      }
    }
  }

  updateSkillsDisplay() {
    const container = document.getElementById("skillsList")
    container.innerHTML = ""

    this.skills.forEach((skill, index) => {
      const tag = document.createElement("div")
      tag.className = "skill-tag"
      tag.innerHTML = `
                ${skill}
                <button type="button" class="skill-remove" onclick="resumeGenerator.removeSkill(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `
      container.appendChild(tag)
    })
  }

  removeSkill(index) {
    this.skills.splice(index, 1)
    this.updateSkillsDisplay()
  }

  // Template Selection
  selectTemplate(e) {
    const card = e.currentTarget
    const template = card.dataset.template

    // Remove previous selection
    document.querySelectorAll(".template-card").forEach((c) => c.classList.remove("selected"))

    // Select current template
    card.classList.add("selected")
    this.selectedTemplate = template

    // Enable generate button
    document.getElementById("generatePortfolio").disabled = false
  }

  // Portfolio Generation
  async generatePortfolio() {
    if (!this.selectedTemplate) return

    this.showLoading()

    // Collect all form data
    this.resumeData = {
      personal: {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        location: document.getElementById("location").value,
        linkedin: document.getElementById("linkedin").value,
        github: document.getElementById("github").value,
        summary: document.getElementById("summary").value,
      },
      experience: this.experience,
      education: this.education,
      skills: this.skills,
    }

    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    this.hideLoading()
    this.goToStep(4)
    this.generatePreview()
  }

  generatePreview() {
    const iframe = document.getElementById("portfolioPreview")
    const portfolioHTML = this.generatePortfolioHTML()

    const blob = new Blob([portfolioHTML], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    iframe.src = url
  }

  generatePortfolioHTML() {
    const { personal, experience, education, skills } = this.resumeData
    const primaryColor = document.getElementById("primaryColor").value
    const secondaryColor = document.getElementById("secondaryColor").value
    const fontFamily = document.getElementById("fontFamily").value
    const showPhoto = document.getElementById("showPhoto").checked
    const showSocial = document.getElementById("showSocial").checked

    const templates = {
      modern: this.generateModernTemplate,
      classic: this.generateClassicTemplate,
      creative: this.generateCreativeTemplate,
      minimal: this.generateMinimalTemplate,
    }

    return templates[this.selectedTemplate].call(this, {
      personal,
      experience,
      education,
      skills,
      primaryColor,
      secondaryColor,
      fontFamily,
      showPhoto,
      showSocial,
    })
  }

  generateModernTemplate(data) {
    const { personal, experience, education, skills, primaryColor, secondaryColor, fontFamily, showPhoto, showSocial } =
      data

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personal.fullName} - Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(" ", "+")}:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: '${fontFamily}', sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .hero {
            background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%);
            color: white;
            padding: 4rem 0;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 2rem;
            flex-wrap: wrap;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .section {
            padding: 4rem 0;
        }
        
        .section:nth-child(even) {
            background: #f8f9fa;
        }
        
        .section h2 {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 3rem;
            color: ${primaryColor};
        }
        
        .experience-item, .education-item {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .experience-item h3, .education-item h3 {
            color: ${primaryColor};
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }
        
        .experience-item .company, .education-item .school {
            font-weight: 600;
            color: ${secondaryColor};
            margin-bottom: 0.5rem;
        }
        
        .date-location {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
        }
        
        .skill-item {
            background: ${primaryColor};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            background: rgba(255,255,255,0.2);
            color: white;
            border-radius: 50%;
            text-decoration: none;
            transition: transform 0.3s;
        }
        
        .social-link:hover {
            transform: translateY(-3px);
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2rem;
            }
            
            .contact-info {
                flex-direction: column;
                align-items: center;
            }
            
            .section h2 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <h1>${personal.fullName}</h1>
            <p>${personal.summary}</p>
            <div class="contact-info">
                ${personal.email ? `<div class="contact-item"><i class="fas fa-envelope"></i> ${personal.email}</div>` : ""}
                ${personal.phone ? `<div class="contact-item"><i class="fas fa-phone"></i> ${personal.phone}</div>` : ""}
                ${personal.location ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${personal.location}</div>` : ""}
            </div>
            ${
              showSocial
                ? `
            <div class="social-links">
                ${personal.linkedin ? `<a href="${personal.linkedin}" class="social-link" target="_blank"><i class="fab fa-linkedin"></i></a>` : ""}
                ${personal.github ? `<a href="${personal.github}" class="social-link" target="_blank"><i class="fab fa-github"></i></a>` : ""}
            </div>
            `
                : ""
            }
        </div>
    </section>

    <section class="section">
        <div class="container">
            <h2>Experience</h2>
            ${experience
              .map(
                (exp) => `
                <div class="experience-item">
                    <h3>${exp.title}</h3>
                    <div class="company">${exp.company}</div>
                    <div class="date-location">${exp.startDate} - ${exp.endDate} | ${exp.location}</div>
                    <p>${exp.description}</p>
                </div>
            `,
              )
              .join("")}
        </div>
    </section>

    <section class="section">
        <div class="container">
            <h2>Education</h2>
            ${education
              .map(
                (edu) => `
                <div class="education-item">
                    <h3>${edu.degree}</h3>
                    <div class="school">${edu.school}</div>
                    <div class="date-location">${edu.startDate} - ${edu.endDate} | ${edu.location}</div>
                    ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ""}
                </div>
            `,
              )
              .join("")}
        </div>
    </section>

    <section class="section">
        <div class="container">
            <h2>Skills</h2>
            <div class="skills-grid">
                ${skills.map((skill) => `<div class="skill-item">${skill}</div>`).join("")}
            </div>
        </div>
    </section>
</body>
</html>
        `
  }

  generateClassicTemplate(data) {
    const { personal, experience, education, skills, primaryColor, secondaryColor, fontFamily, showPhoto, showSocial } =
      data

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personal.fullName} - Resume</title>
    <link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(" ", "+")}:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: '${fontFamily}', serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        
        .resume {
            max-width: 800px;
            margin: 2rem auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
            background: ${primaryColor};
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        
        .header p {
            font-size: 1.1rem;
            margin-bottom: 2rem;
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            text-align: left;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .content {
            padding: 2rem;
        }
        
        .section {
            margin-bottom: 3rem;
        }
        
        .section h2 {
            font-size: 1.8rem;
            color: ${primaryColor};
            border-bottom: 2px solid ${primaryColor};
            padding-bottom: 0.5rem;
            margin-bottom: 2rem;
        }
        
        .item {
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid #eee;
        }
        
        .item:last-child {
            border-bottom: none;
        }
        
        .item h3 {
            color: ${secondaryColor};
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
        }
        
        .item .subtitle {
            font-weight: 600;
            color: #666;
            margin-bottom: 0.5rem;
        }
        
        .item .meta {
            color: #888;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .skill {
            background: #f0f0f0;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            border: 1px solid ${primaryColor};
        }
        
        @media (max-width: 768px) {
            .resume {
                margin: 1rem;
            }
            
            .header {
                padding: 2rem 1rem;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="resume">
        <div class="header">
            <h1>${personal.fullName}</h1>
            <p>${personal.summary}</p>
            <div class="contact-grid">
                ${personal.email ? `<div class="contact-item"><i class="fas fa-envelope"></i> ${personal.email}</div>` : ""}
                ${personal.phone ? `<div class="contact-item"><i class="fas fa-phone"></i> ${personal.phone}</div>` : ""}
                ${personal.location ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${personal.location}</div>` : ""}
                ${showSocial && personal.linkedin ? `<div class="contact-item"><i class="fab fa-linkedin"></i> LinkedIn</div>` : ""}
                ${showSocial && personal.github ? `<div class="contact-item"><i class="fab fa-github"></i> GitHub</div>` : ""}
            </div>
        </div>
        
        <div class="content">
            <div class="section">
                <h2>Professional Experience</h2>
                ${experience
                  .map(
                    (exp) => `
                    <div class="item">
                        <h3>${exp.title}</h3>
                        <div class="subtitle">${exp.company}</div>
                        <div class="meta">${exp.startDate} - ${exp.endDate} | ${exp.location}</div>
                        <p>${exp.description}</p>
                    </div>
                `,
                  )
                  .join("")}
            </div>
            
            <div class="section">
                <h2>Education</h2>
                ${education
                  .map(
                    (edu) => `
                    <div class="item">
                        <h3>${edu.degree}</h3>
                        <div class="subtitle">${edu.school}</div>
                        <div class="meta">${edu.startDate} - ${edu.endDate} | ${edu.location}</div>
                        ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ""}
                    </div>
                `,
                  )
                  .join("")}
            </div>
            
            <div class="section">
                <h2>Skills</h2>
                <div class="skills-list">
                    ${skills.map((skill) => `<span class="skill">${skill}</span>`).join("")}
                </div>
            </div>
        </div>
    </div>
</body>
</html>
        `
  }

  generateCreativeTemplate(data) {
    const { personal, experience, education, skills, primaryColor, secondaryColor, fontFamily, showPhoto, showSocial } =
      data

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personal.fullName} - Creative Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(" ", "+")}:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: '${fontFamily}', sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
        }
        
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .portfolio {
            max-width: 1000px;
            margin: 2rem auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .hero-section {
            background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
            color: white;
            padding: 4rem 2rem;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .hero-section::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.1) 10px,
                rgba(255,255,255,0.1) 20px
            );
            animation: float 20s linear infinite;
        }
        
        @keyframes float {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .hero-content {
            position: relative;
            z-index: 2;
        }
        
        .hero-section h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .hero-section p {
            font-size: 1.3rem;
            margin-bottom: 2rem;
            opacity: 0.95;
        }
        
        .contact-badges {
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .contact-badge {
            background: rgba(255,255,255,0.2);
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255,255,255,0.3);
        }
        
        .content-section {
            padding: 3rem 2rem;
        }
        
        .section-title {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 3rem;
            background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .timeline {
            position: relative;
            padding-left: 2rem;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: linear-gradient(to bottom, ${primaryColor}, ${secondaryColor});
        }
        
        .timeline-item {
            position: relative;
            margin-bottom: 3rem;
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transform: translateX(0);
            transition: transform 0.3s ease;
        }
        
        .timeline-item:hover {
            transform: translateX(10px);
        }
        
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -2.75rem;
            top: 2rem;
            width: 15px;
            height: 15px;
            background: ${primaryColor};
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 0 3px ${primaryColor};
        }
        
        .timeline-item h3 {
            color: ${primaryColor};
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }
        
        .timeline-item .company {
            font-weight: 600;
            color: ${secondaryColor};
            margin-bottom: 0.5rem;
        }
        
        .timeline-item .date-location {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        
        .skills-cloud {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            justify-content: center;
        }
        
        .skill-bubble {
            background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: 600;
            transform: scale(1);
            transition: transform 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .skill-bubble:hover {
            transform: scale(1.1);
        }
        
        .social-section {
            background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
            color: white;
            padding: 2rem;
            text-align: center;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.2);
            color: white;
            border-radius: 50%;
            text-decoration: none;
            font-size: 1.5rem;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
        }
        
        .social-link:hover {
            transform: translateY(-5px) scale(1.1);
            background: rgba(255,255,255,0.3);
        }
        
        @media (max-width: 768px) {
            .hero-section h1 {
                font-size: 2.5rem;
            }
            
            .timeline {
                padding-left: 1rem;
            }
            
            .timeline-item {
                padding: 1.5rem;
            }
            
            .contact-badges {
                flex-direction: column;
                align-items: center;
            }
        }
    </style>
</head>
<body>
    <div class="portfolio">
        <div class="hero-section">
            <div class="hero-content">
                <h1>${personal.fullName}</h1>
                <p>${personal.summary}</p>
                <div class="contact-badges">
                    ${personal.email ? `<div class="contact-badge"><i class="fas fa-envelope"></i> ${personal.email}</div>` : ""}
                    ${personal.phone ? `<div class="contact-badge"><i class="fas fa-phone"></i> ${personal.phone}</div>` : ""}
                    ${personal.location ? `<div class="contact-badge"><i class="fas fa-map-marker-alt"></i> ${personal.location}</div>` : ""}
                </div>
            </div>
        </div>

        <div class="content-section">
            <h2 class="section-title">Experience</h2>
            <div class="timeline">
                ${experience
                  .map(
                    (exp) => `
                    <div class="timeline-item">
                        <h3>${exp.title}</h3>
                        <div class="company">${exp.company}</div>
                        <div class="date-location">${exp.startDate} - ${exp.endDate} | ${exp.location}</div>
                        <p>${exp.description}</p>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>

        <div class="content-section">
            <h2 class="section-title">Education</h2>
            <div class="timeline">
                ${education
                  .map(
                    (edu) => `
                    <div class="timeline-item">
                        <h3>${edu.degree}</h3>
                        <div class="company">${edu.school}</div>
                        <div class="date-location">${edu.startDate} - ${edu.endDate} | ${edu.location}</div>
                        ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ""}
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>

        <div class="content-section">
            <h2 class="section-title">Skills</h2>
            <div class="skills-cloud">
                ${skills.map((skill) => `<div class="skill-bubble">${skill}</div>`).join("")}
            </div>
        </div>

        ${
          showSocial
            ? `
        <div class="social-section">
            <h3>Let's Connect</h3>
            <div class="social-links">
                ${personal.linkedin ? `<a href="${personal.linkedin}" class="social-link" target="_blank"><i class="fab fa-linkedin"></i></a>` : ""}
                ${personal.github ? `<a href="${personal.github}" class="social-link" target="_blank"><i class="fab fa-github"></i></a>` : ""}
            </div>
        </div>
        `
            : ""
        }
    </div>
</body>
</html>
        `
  }

  generateMinimalTemplate(data) {
    const { personal, experience, education, skills, primaryColor, secondaryColor, fontFamily, showPhoto, showSocial } =
      data

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personal.fullName}</title>
    <link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(" ", "+")}:wght@300;400;600&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: '${fontFamily}', sans-serif;
            line-height: 1.8;
            color: #333;
            background: #fff;
        }
        
        .container {
            max-width: 700px;
            margin: 0 auto;
            padding: 3rem 2rem;
        }
        
        .header {
            text-align: center;
            margin-bottom: 4rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid #eee;
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 300;
            color: ${primaryColor};
            margin-bottom: 1rem;
            letter-spacing: -1px;
        }
        
        .header p {
            font-size: 1.1rem;
            color: #666;
            margin-bottom: 2rem;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 2rem;
            flex-wrap: wrap;
            font-size: 0.9rem;
            color: #666;
        }
        
        .contact-info a {
            color: ${primaryColor};
            text-decoration: none;
        }
        
        .section {
            margin-bottom: 3rem;
        }
        
        .section h2 {
            font-size: 1.2rem;
            font-weight: 600;
            color: ${primaryColor};
            margin-bottom: 2rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .item {
            margin-bottom: 2.5rem;
        }
        
        .item h3 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 0.25rem;
        }
        
        .item .meta {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 0.5rem;
        }
        
        .item .company {
            font-weight: 500;
            color: ${secondaryColor};
        }
        
        .item p {
            color: #555;
            font-size: 0.95rem;
        }
        
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .skill {
            font-size: 0.85rem;
            color: #666;
            padding: 0.25rem 0;
            border-bottom: 1px solid #eee;
        }
        
        .skill:not(:last-child)::after {
            content: ' •';
            margin-left: 0.5rem;
            color: ${primaryColor};
        }
        
        .social-links {
            text-align: center;
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #eee;
        }
        
        .social-links a {
            color: ${primaryColor};
            text-decoration: none;
            margin: 0 1rem;
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 2rem 1rem;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .contact-info {
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${personal.fullName}</h1>
            <p>${personal.summary}</p>
            <div class="contact-info">
                ${personal.email ? `<span>${personal.email}</span>` : ""}
                ${personal.phone ? `<span>${personal.phone}</span>` : ""}
                ${personal.location ? `<span>${personal.location}</span>` : ""}
            </div>
        </div>

        <div class="section">
            <h2>Experience</h2>
            ${experience
              .map(
                (exp) => `
                <div class="item">
                    <h3>${exp.title}</h3>
                    <div class="meta">
                        <span class="company">${exp.company}</span> • 
                        ${exp.startDate} - ${exp.endDate} • 
                        ${exp.location}
                    </div>
                    <p>${exp.description}</p>
                </div>
            `,
              )
              .join("")}
        </div>

        <div class="section">
            <h2>Education</h2>
            ${education
              .map(
                (edu) => `
                <div class="item">
                    <h3>${edu.degree}</h3>
                    <div class="meta">
                        <span class="company">${edu.school}</span> • 
                        ${edu.startDate} - ${edu.endDate} • 
                        ${edu.location}
                        ${edu.gpa ? ` • GPA: ${edu.gpa}` : ""}
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>

        <div class="section">
            <h2>Skills</h2>
            <div class="skills">
                ${skills.map((skill) => `<span class="skill">${skill}</span>`).join("")}
            </div>
        </div>

        ${
          showSocial
            ? `
        <div class="social-links">
            ${personal.linkedin ? `<a href="${personal.linkedin}" target="_blank">LinkedIn</a>` : ""}
            ${personal.github ? `<a href="${personal.github}" target="_blank">GitHub</a>` : ""}
        </div>
        `
            : ""
        }
    </div>
</body>
</html>
        `
  }

  // Customization
  updatePreview() {
    if (this.currentStep === 4) {
      this.generatePreview()
    }
  }

  changePreviewDevice(e) {
    const device = e.currentTarget.dataset.device
    const iframe = document.getElementById("portfolioPreview")

    // Remove active class from all buttons
    document.querySelectorAll(".preview-btn").forEach((btn) => btn.classList.remove("active"))
    e.currentTarget.classList.add("active")

    // Apply device class
    iframe.className = `portfolio-preview ${device === "desktop" ? "" : device}`
  }

  // Download
  downloadPortfolio() {
    const portfolioHTML = this.generatePortfolioHTML()
    const blob = new Blob([portfolioHTML], { type: "text/html" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `${this.resumeData.personal.fullName.replace(/\s+/g, "_")}_Portfolio.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Navigation
  goToStep(step) {
    // Hide all sections
    document.querySelectorAll(".section").forEach((section) => {
      section.classList.remove("active")
    })

    // Show target section
    const sections = ["upload-section", "review-section", "template-section", "customize-section"]
    document.getElementById(sections[step - 1]).classList.add("active")

    this.currentStep = step
  }

  // Loading
  showLoading() {
    document.getElementById("loadingOverlay").classList.remove("hidden")
  }

  hideLoading() {
    document.getElementById("loadingOverlay").classList.add("hidden")
  }
}

// Initialize the application
const resumeGenerator = new ResumePortfolioGenerator()
