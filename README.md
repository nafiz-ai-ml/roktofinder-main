# Rokto Finder

Build a modern, scalable web application called RoktoFinder – a local blood donor finder platform.

🎯 Project Goal

Help people quickly find nearby blood donors based on blood group and location, starting with Mymensingh, Bangladesh, with the ability to expand across Bangladesh in the future.

⚠️ Important Requirements

All website content, including headings, labels, buttons, messages, notifications, and descriptions, MUST be in Bengali (Bangla).

Use Hind Siliguri as the primary font throughout the entire application.

Ensure proper Bengali typography, readability, spacing, and visual consistency.

The application must provide a fully localized Bengali user experience.

🧱 Core Features

1. Donor Registration System

Create a clean, user-friendly donor registration form with the following fields. All field labels and UI text must be in Bengali.

নাম: Full Name

মোবাইল নম্বর: Mobile Number (WhatsApp-enabled)

রক্তের গ্রুপ: Blood Group (A+, A-, B+, B-, O+, O-, AB+, AB-)

ঠিকানা: Address (Default: Kewatkhali, Mymensingh)

সর্বশেষ রক্তদানের তারিখ: Last Blood Donation Date

বর্তমানে রক্ত দিতে আগ্রহী?: Availability Status (Available / Not Available toggle, displayed in Bengali)

Store all donor information securely in a Supabase database.

2. Smart Search & Filter System (Main Feature)

Build a powerful search interface that allows users to:

Search donors by blood group.

Filter donors by location or area.

Prioritize nearby donors in search results.

Sort donors based on relevance and availability.

Display search results using clean and modern donor cards containing:

Donor Name

Highlighted Blood Group

Location / Area

Last Blood Donation Date

Current Availability Status

Contact Buttons (Phone Call and WhatsApp)

3. Emergency Blood Request System

Create an emergency blood request feature that allows users to submit urgent blood requirements.

Required information:

Required Blood Group

Location

Contact Number

Additional Message

Display emergency blood requests in a separate, clearly identifiable section.

4. Homepage Design

Design a modern, clean, and visually appealing homepage featuring:

Main Heading:
"ময়মনসিংহের প্রথম রক্তদাতা প্ল্যাটফর্ম"

Hero Section:
"আপনার কাছাকাছি রক্তদাতা খুঁজুন"

Main Search Interface:
Make the donor search interface the primary focus of the homepage.

Call-to-Action Buttons:

"ডোনার খুঁজুন"

"ডোনার হিসেবে যুক্ত হন"

Emergency CTA:

"জরুরি রক্ত প্রয়োজন" (Use a prominent red highlight to make it stand out.)

📱 5. Responsive Design

Fully responsive across mobile, tablet, and desktop devices.

Mobile-first design approach.

Clean layouts with intuitive navigation.

Ensure excellent usability on smaller screens.

🎨 6. Design Requirements

Follow a modern SaaS design approach inspired by high-quality products like Stripe and Notion.

Design characteristics:

Clean and minimal interface.

Modern card-based layouts.

Soft shadows and rounded corners.

Red accent color inspired by the blood donation theme.

Consistent use of Hind Siliguri typography.

Proper Bengali typography and spacing.

Clear visual hierarchy.

Professional and trustworthy appearance.

🧠 7. Smart Business Logic

Implement the following logic:

Donation Eligibility Warning:

If a donor has donated blood within the last 90 days, display an appropriate warning.

Clearly indicate that the donor may not yet be eligible to donate again.

Availability Prioritization:

Show available donors before unavailable donors.

Relevance-Based Sorting:

Prioritize search results based on blood group, location relevance, and availability.

Location-Based Filtering:

Implement simulated nearby-donor logic using location or area-based matching.

Structure the system so that real GPS-based distance calculations can be added in the future.

🔒 8. Basic Safety & Disclaimer

Display the following safety messages prominently where appropriate:

Disclaimer:
"যোগাযোগের আগে দাতাকে যাচাই করুন"

Health Notice:
"শুধুমাত্র শারীরিকভাবে সক্ষম হলে রক্ত দিন"

Make sure users understand that RoktoFinder is a donor discovery platform, not a medical authority.

⚙️ 9. Technical Requirements

Use Supabase or Firebase as the backend and database.

Do NOT use Lovable Cloud.

Use a scalable and well-structured database schema.

Follow clean and maintainable project architecture.

Design an API-friendly backend structure to support future integrations and automation.

Implement appropriate database security and access controls.

Prepare the application for future expansion across Bangladesh.

👤 10. Donor Dashboard & Profile Management

Add a dedicated donor dashboard.

Donors should be able to:

Look up their existing profile using their registered mobile number.

View their registered information.

Update their personal details.

Change their blood donation availability status.

Update their last blood donation date.

Manage their donor profile without registering again.

Implement appropriate verification before allowing profile updates. Do not allow users to modify someone else's donor profile simply by entering their phone number.

🚀 11. Additional UI & UX Enhancements

Improve the overall application to look like a modern startup SaaS product, inspired by Stripe and Notion.

Include the following enhancements:

Realistic Demo Data

Do NOT create any demo donors or dummy donor records.

Do NOT insert fake donor information into the database.

Keep the donor database completely empty initially.

I will personally register real donors after the website is fully developed and deployed.

Availability Indicators

Add clear donor availability badges:

Green badge for available donors.

Red badge for unavailable donors.

Recent Activity Indicators

Add a "Last Active" or "Recently Available" indicator where relevant.

Only display these indicators when actual activity data is available.

Never generate fake activity information.

Location-Based Search

Implement simulated location-based filtering.

Prioritize donors from the selected area.

Keep the architecture ready for future GPS-based proximity searches.

UI/UX Improvements

Improve spacing, typography, and visual hierarchy.

Ensure excellent mobile responsiveness.

Add smooth loading states.

Add meaningful empty states when no donors are found.

Provide clear success and error messages.

Add appropriate form validation and feedback.

🎯 Final Deliverables

Build a complete, functional MVP of RoktoFinder with:

A fully Bengali-language user interface.

A modern and responsive homepage.

A functional donor registration system.

Supabase database integration.

A working donor search and filtering system.

Location-based donor filtering.

An emergency blood request system.

A donor dashboard with secure profile lookup and update functionality.

Smart availability and donation-date logic.

Phone call and WhatsApp contact integration.

Proper loading, error, success, and empty states.

Secure and scalable backend architecture.

Deployment-ready configuration.

🚨 Final Instructions – Read Carefully

Do not create any demo, dummy, sample, or fake donor profiles.

Do not insert any fictional donor records into Supabase.

The initial donor database must remain completely empty.

Do not use fake last-active timestamps, fake availability information, or fabricated donor activity.

Build all features to work with real donor data once I start registering donors.

All visible website content MUST be in Bengali.

Use Hind Siliguri consistently across the entire application.

Prioritize functionality, security, performance, and mobile usability.

The objective is to build a production-ready, trustworthy, and scalable blood donor discovery platform that initially serves Mymensingh and can eventually expand throughout Bangladesh.