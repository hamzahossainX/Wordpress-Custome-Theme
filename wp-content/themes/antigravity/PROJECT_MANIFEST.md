# PROJECT MANIFEST: Amira Custom Development

## 1. Project Objective
**Goal:** Convert the existing 'AmiraLtd' static/migrated site into a fully dynamic, custom WordPress theme using the 'Antigravity' framework concept.
**Design Source:** Clone the "WoodMart Minimalism" Demo layout but with custom branding.
**Tone/Style:** Professional, Corporate, Clean, Minimalist.

## 2. Tech Stack & Environment
- **OS:** Fedora Linux (Workstation 43)
- **Local Server:** XAMPP (LAMP Stack)
- **Server Path:** `/opt/lampp/htdocs/amira`
- **Database:** MariaDB (Name: `amira_db`, User: `root`, Pass: ` `)
- **CMS:** WordPress (Version 6.x)
- **Language:** PHP 8.x, JavaScript (ES6+), HTML5, CSS3
- **Framework:** Antigravity (Custom Theme Architecture) - NO Page Builders (Elementor/Divi).

## 3. Design System (Target: WoodMart Minimalism Clone)
- **Branding Name:** "AMIRA" (Uppercase, Bold).
- **Visual Style:** Minimalist, Clean, Whitespace-heavy.
- **Color Palette:**
  - Background: `#FFFFFF` (White)
  - Text Primary: `#242424` (Dark Grey - Headings)
  - Text Secondary: `#777777` (Light Grey - Body)
  - Accent: Black (`#000000`) for buttons and active states.
- **Typography:**
  - Font Family: 'Lato' or 'Spartan' (Sans-serif, Geometric).
- **Header Logic (Strict):**
  - Layout: 3-Column Flexbox.
  - Architecture: Left (Menu) & Right (Icons) must share equal space (`flex: 1`) to force the Center (Logo) to be perfectly in the middle.
  - Interaction: Menu items must have the "Animated Underline" hover effect (width 0% to 100%).

## 4. Architecture Overview
### A. Theme Structure (`/wp-content/themes/antigravity/`)
- `style.css` -> Main stylesheet with metadata.
- `functions.php` -> Bootstrapper (Loads `inc/core.php`).
- `index.php` -> Main Template (Must call `get_header()` & `get_footer()`).
- `header.php` -> Contains Nav, Logo, Icons.
- `/assets/` -> JS, CSS, Images.

### B. Plugin Architecture (`/wp-content/plugins/amira-core/`)
- **Purpose:** Critical functionality (Custom Post Types, Database Logic).

## 5. Development Workflow (Instructions for Agent)
1. **Context:** Read this Manifest before generating code.
2. **Safety:** Never edit `wp-config.php`.
3. **Prefix:** Use `antigravity_` for all functions.
4. **Sanitization:** Always use `esc_html()`, `esc_url()`, etc.

## 6. Current Task Status
- [x] Local Environment Setup (XAMPP/Fedora)
- [x] Database Migration
- [x] Theme Folder Created
- [x] Git Repository Connected
- [ ] Header Design (WoodMart Clone) - *In Progress*
- [ ] Hero Section Development

## 7. Access Control & Boundaries
- **Working Directory:** `/opt/lampp/htdocs/amira/`
- **Allowed Write Access:**
  - `/wp-content/themes/antigravity/`
  - `/wp-content/plugins/amira-core/`
- **Restricted Areas (DO NOT TOUCH):**
  - `/wp-admin/`, `/wp-includes/`, Root `.htaccess`

## 8. Useful Commands (Cheat Sheet)
- **Start XAMPP (CLI):** `sudo /opt/lampp/lampp start`
- **Start XAMPP (GUI):** `sudo /opt/lampp/manager-linux-x64.run`
- **Stop XAMPP:** `sudo /opt/lampp/lampp stop`
- **Site URL:** `http://localhost/amira`
- **Admin URL:** `http://localhost/amira/wp-admin`

## 9. Version Control & Git Strategy
**Repo URL:** `https://github.com/hamzahossainX/Wordpress-Custome-Theme.git`

**Agent Commands (Git Workflow):**
```bash
# Standard Update Routine
git status
git add .
git commit -m "Update: [Brief description of changes]"
git push origin main