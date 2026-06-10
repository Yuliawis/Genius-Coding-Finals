# About Me

I am a student with some expirience in Machine Learning and algorithms. I am a participant in the 24 hour GENIUS Olympiad Coding Hackathon. Ask me a lot of questions about the project and its functions.

# Project Overview

This project is a hackathon-ready environmental web application built for the GENIUS Olympiad Coding Hackathon.

The project must be functional, clear, demoable, and easy to explain within a 10-minute judging presentation.

The main priority is not building a huge application. The main priority is building a polished MVP that works reliably and demonstrates strong environmental relevance, good technical execution, and clear innovation.

# Product Concept

This project should use coding and technology to support affected communities, improve safety, provide helpful information, mNge resouces, assist recovery, reduce risk, or strenghten disaster preparedness.

It should be easy to use and be interactive.

This website must have a 3d globe using https://www.mapcn.dev/ . 

Also it must have a lot of dashboards, so that people will understand the severity and exactly what is going on. 

People must have a button to request help and there will be form to describe what exactly you need (maybe use buttons), describe the problem and the user will take a picture so that my neural network will identify the severity.

Next step will be to make a creative game where a person is given an imaginatory situation and he must allign what he will do in that situation and then it will be checked and he will be given points acordingly. Or some task to improve social  awaredness.

Also there will be a ML algorithm to predict trends which should be shown in a graphs on a dashboard.

# Hackaton Context

This project is intended for a 24-hour hackathon. All development decisions should optimize for speed, reliability, and presentation value.

mportant constraints:

The final product must be functional.
The app should be easy to demo live.
The app should have a backup/demo mode using local sample data.
Avoid fragile or overly complex features.
Avoid authentication unless absolutely necessary.
Avoid complex databases unless required.
Avoid unfinished pages or broken buttons.
Prefer a smaller complete product over a larger incomplete one.

The judges will evaluate:

presentation skills
presentation clarity
problem-solving approach
code efficiency and innovation
functionality and correctness
overall creativity, usability, and environmental impact

All implementation choices should support these judging criteria.

# Screenshot Workflow

Puppeteer is installed.

Always screenshot from localhost

Screenshots are saved automatically to ./temporary screenshots/screenshot-N.png (auto-incremented, never overwritten).

Optional label suffix: node screenshot.mjs label -> saves as screenshot-N-label.png

screenshot.mjs lives in the project root. Use it as-is.

After screenshotting, read the PNG from temporary screenshots/ with the Read tool – Claude can see and analyze the image directly.

When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"

Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

# Recomended Tech Stack

Preferred frontend:

React
Vite
Tailwind CSS
React Router
Chart.js or Recharts
Leaflet / React Leaflet if a map is implemented

Preferred deployment:

GitHub

Preferred backend options:

Vercel serverless functions
Netlify functions
FastAPI only if Python backend/model inference is necessary

Preferred AI integration:

Gemini API or OpenAI API through a backend/serverless function
Never expose API keys in frontend code

Also in this project I may choose to use my neural networks.

Preferred data storage:

Local JSON/demo data for the MVP
Local state or browser localStorage if needed
Avoid full database unless there is enough time

# Security Rules

Never put API keys in frontend code.

ad:

const apiKey = "my-secret-key";

Good:

process.env.GEMINI_API_KEY
process.env.OPENAI_API_KEY

AI API calls must go through a backend/serverless function.

Frontend should call:

/api/recommend

The backend/serverless function should call the AI provider.

# UI/UX Guidelines

The app should feel like a clean eco-tech dashboard.

Preferred style:

modern
minimal
clear
trustworthy
data-driven
soft

Visual direction:

rounded cards
large numbers
green accents
clean typography
simple icons
charts and dashboard components
strong spacing
no clutter

Avoid:

messy gradients
too many colors
tiny text
long paragraphs on the main demo pages

The interface should be understandable in 5 seconds.

# Code Quality Guidelines

Write code that is:

readable
modular
easy to explain
not overengineered
reliable for demo

Prefer small components.

Avoid putting everything in one large file.

Use meaningful names

Handle loading and error states.

Every button visible in the UI should work.

No console errors should appear during the final demo.