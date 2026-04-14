Resume

POST /api/resume — upload PDF → parse with pdf-parse → save resumeText on User



ML / AI (the smart features)

POST /api/scrape — URL → puppeteer + chromium → extract job description (the "Scrape" button in the modal)
POST /api/parse — pasted description → Gemini → extract company/role/location/etc. (the "Parse with AI" button)
POST /api/match — { applicationId } → call Python ml-service with resume + job description → save matchScore, matchedSkills, missingSkills back to the application