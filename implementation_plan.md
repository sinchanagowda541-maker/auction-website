# Auction System Implementation Plan

This document outlines the proposed architecture, features, and database schema for the full-stack Auction System. 

> [!IMPORTANT]
> **User Review Required:** Please review the proposed backend technology stack and the database schema. Since only "MySQL" was specified for the backend, I am proposing **Node.js with Express** for the backend server to connect the HTML/JS frontend to the MySQL database. Please confirm if this is acceptable, or if you would prefer PHP, Python, or another backend language.

## Open Questions

> [!WARNING]
> 1. **Backend Language:** Is Node.js (with Express) acceptable for the backend API, or do you have a specific language requirement (e.g., PHP, Python, Java)?
> 2. **Authentication Method:** Are we okay using JWT (JSON Web Tokens) for secure session handling and authentication?
> 3. **Image Storage:** For product images, should we store them locally on the server (in a folder) or use a cloud storage placeholder for now?

## Architecture & Tech Stack

*   **Frontend:** HTML5, CSS3 (Vanilla, custom UI/UX), JavaScript (Vanilla).
*   **Backend:** Node.js, Express.js (RESTful API).
*   **Database:** MySQL.
*   **Authentication:** JWT-based stateless authentication.
*   **Styling:** Modern, responsive design with CSS variables, flexbox/grid, hover effects, and CSS animations.

## Database Schema (MySQL)

We will normalize the database. Here is the proposed schema:

1.  **Users:** `id`, `name`, `email`, `password_hash`, `role` (buyer, seller, admin), `created_at`
2.  **Products/Auctions:** `id`, `seller_id`, `title`, `description`, `image_url`, `starting_price`, `current_highest_bid`, `start_date`, `end_date`, `status` (active, ended, cancelled), `category`, `created_at`
3.  **Bids:** `id`, `auction_id`, `buyer_id`, `bid_amount`, `bid_time`
4.  **Watchlist:** `id`, `buyer_id`, `auction_id`, `added_at`
5.  **Payments:** `id`, `auction_id`, `buyer_id`, `amount`, `status` (pending, completed), `created_at`

*(Note: Buyers and Sellers can just be roles in the `Users` table, which simplifies the structure and foreign keys while still keeping role-specific access controls).*

## Proposed Changes & Folder Structure

### Root Directory: `c:\Users\Sinchana M Gowda\OneDrive\Desktop\auction\`
*   `README.md` - Setup instructions and project details.
*   `database.sql` - Complete MySQL schema and setup queries.

### Backend (`./backend/`)
*   `server.js` - Express server entry point.
*   `config/db.js` - MySQL connection setup.
*   `routes/` - API routes (`auth.js`, `auctions.js`, `bids.js`, `users.js`).
*   `controllers/` - Logic for routes.
*   `middlewares/` - Auth and validation middlewares.

### Frontend (`./frontend/`)
*   `index.html` - Homepage / Hero section.
*   `login.html` & `register.html` - Auth pages.
*   `buyer-dashboard.html` & `seller-dashboard.html` - Dashboards.
*   `auction-details.html` - Single product view with bidding.
*   `css/`
    *   `style.css` - Global styles, variables, typography.
    *   `components.css` - Cards, buttons, navbar, footer, toast notifications.
*   `js/`
    *   `main.js` - Global functions, toast notifications, auth checks.
    *   `auth.js` - Login/register logic.
    *   `dashboard.js` - Fetching data for dashboards.
    *   `auction.js` - Timer logic, bidding logic, real-time updates.

## UI/UX Design Approach
*   **Color Palette:** Premium dark/light theme (e.g., Deep navy blue with gold/amber accents for a luxurious feel, or clean white with vibrant indigo).
*   **Typography:** 'Inter' or 'Poppins' from Google Fonts.
*   **Components:** Glassmorphism effects for cards, smooth transition on hover (`transform: translateY(-5px)`).
*   **Animations:** Fade-in on load, pulsing animation for active auction timers.

## Verification Plan

### Automated Tests
*   Test REST API endpoints using basic fetch scripts or Postman mock instructions.

### Manual Verification
1.  Run the MySQL database scripts.
2.  Start the Node.js backend.
3.  Serve the frontend files and test user registration.
4.  Login as a seller, create an auction.
5.  Login as a buyer, place a bid, and verify the countdown timer and bid validation.
