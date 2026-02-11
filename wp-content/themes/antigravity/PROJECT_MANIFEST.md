# PROJECT MANIFEST: Amira Custom Development

## 1. Project Objective
**Goal:** Convert the existing 'AmiraLtd' static/migrated site into a fully dynamic, custom WordPress theme using the 'Antigravity' framework concept.
**Tone/Style:** Professional, Corporate, Clean, Minimalist.
**Target Audience:** Corporate clients seeking business solutions.

## 2. Tech Stack & Environment
- **OS:** Fedora Linux (Workstation 43)
- **Local Server:** XAMPP (LAMP Stack)
- **Server Path:** `/opt/lampp/htdocs/amira`
- **Database:** MariaDB (Name: `amira_db`, User: `root`, Pass: ` `)
- **CMS:** WordPress (Version 6.x)
- **Language:** PHP 8.x, JavaScript (ES6+), HTML5, CSS3
- **Framework:** Antigravity (Custom Theme Architecture)

## 3. Design System & UI/UX
- **Color Palette:**
  - Primary: `#003366` (Navy Blue - Example)
  - Secondary: `#FF9900` (Orange - Example)
  - Background: `#FFFFFF`
  - Text: `#333333`
- **Typography:**
  - Headings: 'Montserrat', sans-serif
  - Body: 'Open Sans', sans-serif
- **Grid System:** CSS Grid & Flexbox (No Bootstrap/Tailwind unless specified)

## 4. Architecture Overview
### A. Theme Structure (`/wp-content/themes/antigravity/`)
- `style.css` -> Main stylesheet with metadata.
- `functions.php` -> Bootstrapper (Loads `inc/core.php`).
- `index.php` -> Fallback template.
- `header.php` / `footer.php` -> Global components.
- `/inc/` -> All PHP logic (Custom Post Types, AJAX, Helpers).
- `/assets/` -> JS, CSS, Images, Fonts.

### B. Plugin Architecture (`/wp-content/plugins/amira-core/`)
- **Purpose:** Critical functionality that must persist even if the theme changes.
- **Features:** Custom Database Tables, API Endpoints, Complex Calculation Logic.

## 5. Development Workflow (Instructions for Agent)
1. **Context Check:** Before writing code, always check `functions.php` to see existing hooks.
2. **Safety:** Never edit `wp-config.php` unless explicitly asked.
3. **Coding Standard:** Use WordPress Coding Standards (PSR-4 where applicable).
4. **Prefix:** Always prefix functions with `antigravity_` to avoid conflicts.
5. **Security:** Always sanitize inputs (`sanitize_text_field`) and escape outputs (`esc_html`).

## 6. Current Task Status
- [x] Local Environment Setup (XAMPP/Fedora)
- [x] Database Migration (`amira_db`)
- [x] Theme Folder Created
- [ ] Header/Footer Migration from Old Site
- [ ] Dynamic Homepage Development

## 7. Access Control & Boundaries (Strict Rules)
- **Working Directory:** `/opt/lampp/htdocs/amira/`
- **Allowed Write Access:**
  1. `/wp-content/themes/antigravity/` (Full Control)
  2. `/wp-content/plugins/amira-core/` (Full Control)
- **Read-Only Access:**
  1. `wp-config.php` (Check DB constants only)
  2. `/wp-content/uploads/` (Check assets)
- **Restricted Areas (DO NOT TOUCH):**
  - `/wp-admin/`
  - `/wp-includes/`
  - Root level `.htaccess` file.

## 8. Xampp start - 
   - sudo /opt/lampp/manager-linux-x64.run
   user -  http://localhost/amira
  admin - http://localhost/amira/wp-admin

  


  ## 9. Version Control & Git Strategy
**Objective:** Maintain a clean repository containing ONLY custom development assets (Theme & Plugin).

**Repo Structure Rules:**
- Never commit `wp-config.php` or `wp-admin` core files.
- Always check `.gitignore` before adding new files.

**Agent Commands (Git Workflow):**
Use the following commands to initialize and push updates. Replace `[YOUR_REPO_URL]` with the actual GitHub URL.

### A. First Time Setup (Initialization)
```bash
# 1. Initialize Git in the project root
git init

# 2. Add files (respecting .gitignore rules)
git add .

# 3. Commit the initial structure
git commit -m "Initial commit: Setup Antigravity theme architecture"

# 4. Connect to GitHub (Replace URL)
git branch -M main
git remote add origin [https://github.com/YOUR_USERNAME/amira-project.git](https://github.com/YOUR_USERNAME/amira-project.git)

# 5. Push to GitHub
git push -u origin main