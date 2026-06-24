import os
import subprocess

# Ensure scratch directory exists
scratch_dir = r"e:\shubdeeplabs\scratch"
if not os.path.exists(scratch_dir):
    os.makedirs(scratch_dir)

html_file = os.path.join(scratch_dir, "portfolio.html")
pdf_file = r"e:\shubdeeplabs\shubdeep_labs_portfolio.pdf"

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Shubdeep Labs Portfolio Brochure</title>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Patrick+Hand&family=Outfit:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Outfit', sans-serif;
      background-color: #FAF6EE;
      color: #2C2C2C;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .a4-page {
      width: 210mm;
      height: 297mm;
      position: relative;
      overflow: hidden;
      background-color: #FCF9F2;
      page-break-after: always;
      page-break-inside: avoid;
      break-after: page;
      padding: 40px 40px 40px 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .ruled-paper {
      background-color: #FCF9F2;
      background-image: 
        linear-gradient(rgba(33, 150, 243, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(44, 44, 44, 0.04) 1px, transparent 1px);
      background-size: 24px 24px;
    }
    .binder-rings {
      position: absolute;
      top: 0;
      left: 20px;
      bottom: 0;
      width: 20px;
      background-image: 
        radial-gradient(circle, #FAF6EE 5px, transparent 6px),
        linear-gradient(to right, #2C2C2C, #2C2C2C);
      background-size: 20px 32px, 2px 100%;
      background-repeat: repeat-y, no-repeat;
      background-position: center top, center top;
      opacity: 0.25;
      z-index: 10;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .font-sans { font-family: 'Outfit', sans-serif !important; }
    .font-hand { font-family: 'Caveat', cursive !important; font-weight: 700; }
    .font-marker { font-family: 'Patrick Hand', sans-serif !important; }
    
    .marker-yellow {
      background: linear-gradient(100deg, rgba(255, 235, 59, 0.3) 0%, rgba(255, 235, 59, 0.8) 45%, rgba(255, 235, 59, 0.45) 100%);
      padding: 0.1em 0.35em;
      border-radius: 5px 15px 6px 12px/8px 6px 10px 4px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .marker-green {
      background: linear-gradient(102deg, rgba(129, 199, 132, 0.3) 0%, rgba(129, 199, 132, 0.8) 50%, rgba(129, 199, 132, 0.4) 100%);
      padding: 0.1em 0.35em;
      border-radius: 6px 12px 4px 14px/6px 8px 4px 10px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .marker-blue {
      background: linear-gradient(98deg, rgba(100, 181, 246, 0.3) 0%, rgba(100, 181, 246, 0.8) 40%, rgba(100, 181, 246, 0.4) 100%);
      padding: 0.1em 0.35em;
      border-radius: 8px 10px 6px 12px/4px 10px 8px 6px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .marker-red {
      background: linear-gradient(101deg, rgba(255, 138, 128, 0.3) 0%, rgba(255, 138, 128, 0.8) 55%, rgba(255, 138, 128, 0.4) 100%);
      padding: 0.1em 0.35em;
      border-radius: 10px 8px 12px 6px/10px 4px 6px 8px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .marker-purple {
      background: linear-gradient(103deg, rgba(186, 104, 200, 0.3) 0%, rgba(186, 104, 200, 0.8) 50%, rgba(186, 104, 200, 0.4) 100%);
      padding: 0.1em 0.35em;
      border-radius: 6px 12px 8px 10px/8px 6px 10px 4px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .marker-orange {
      background: linear-gradient(104deg, rgba(255, 183, 77, 0.3) 0%, rgba(255, 183, 77, 0.8) 50%, rgba(255, 183, 77, 0.45) 100%);
      padding: 0.1em 0.35em;
      border-radius: 8px 6px 12px 10px/4px 10px 6px 8px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .sketch-card {
      background: #FFFFFF;
      border: 3px solid #2C2C2C;
      border-radius: 20px 15px 20px 15px/15px 20px 15px 20px;
      box-shadow: 4px 5px 0px #2C2C2C;
      padding: 18px;
    }
    
    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-img {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      border: 2px solid #2C2C2C;
      box-shadow: 2px 2px 0px #2C2C2C;
    }
    .logo-text {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }

    .header-border {
      border-bottom: 2px dashed rgba(44, 44, 44, 0.2);
      padding-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-border {
      border-top: 3px solid #2C2C2C;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      font-family: 'Patrick Hand', sans-serif;
      color: #6A6A6A;
    }

    .contact-chalkboard {
      background-color: #1E2E2A;
      border: 3px solid #2C2C2C;
      border-radius: 12px;
      padding: 20px;
      color: #EBE5D9;
      text-align: center;
      box-shadow: 4px 4px 0px #2C2C2C;
    }
    
    .polaroid-card {
      background: #FFF;
      border: 2.5px solid #2C2C2C;
      padding: 10px 10px 18px 10px;
      box-shadow: 3px 4px 0px rgba(44, 44, 44, 0.15);
      height: 160px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
    }

    .study-area-card {
      border: 2px solid #2C2C2C;
      background: #FFF;
      padding: 12px;
      border-radius: 10px;
      display: flex;
      gap: 10px;
      height: 85px;
      box-shadow: 2px 2px 0px #2C2C2C;
    }
    .study-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid #2C2C2C;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #FAF6EE;
      flex-shrink: 0;
    }
    
    .flex-center {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      flex-grow: 1;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: COVER PAGE -->
  <div class="a4-page ruled-paper">
    <div class="binder-rings"></div>
    <div class="header-border">
      <div class="logo-container">
        <div class="logo-text">
          <span class="font-hand" style="font-size: 28px; color: #2C2C2C;">Shubdeep Labs</span>
          <span class="font-marker" style="font-size: 11px; color: #6A6A6A; letter-spacing: 1px; margin-top: 2px;">BUILDING INTELLIGENT SOLUTIONS</span>
        </div>
      </div>
      <div class="font-marker" style="background: #FFF59D; border: 2px solid #2C2C2C; border-radius: 6px; padding: 4px 8px; font-size: 13px; transform: rotate(2deg); box-shadow: 2px 2px 0px #2C2C2C;">
        Academic Portfolio
      </div>
    </div>

    <div class="flex-center">
      <div class="font-marker" style="background: #FFF59D; border: 2px solid #2C2C2C; padding: 6px 14px; border-radius: 10px; font-size: 14px; box-shadow: 2px 2.5px 0px #2C2C2C; transform: rotate(-1.5deg); margin-bottom: 20px;">
        SIMPLE PROJECTS. SMART SOLUTIONS.
      </div>
      
      <h1 class="font-marker" style="font-size: 44px; margin: 0 0 16px 0; line-height: 1.15; max-w: 500px;">
        Academic Project Portfolio & System Blueprints
      </h1>
      
      <p class="font-sans" style="font-size: 16px; color: #5A5A5A; max-width: 420px; font-weight: 600; line-height: 1.6; margin: 0 auto 30px auto;">
        From Idea to Implementation, We Build Intelligent Academic Solutions. Next-generation web portals, machine learning algorithms, and IoT prototypes built with clean, premium codebases.
      </p>

      <div style="width: 100%; max-width: 360px; text-align: left;" class="sketch-card">
        <span class="marker-yellow font-marker" style="font-size: 12px; font-weight: bold; border: 1px solid #2C2C2C; border-radius: 4px;">WHAT WE DO</span>
        <ul class="font-marker" style="margin: 12px 0 0 0; padding-left: 0; list-style-type: none; font-size: 15px; line-height: 1.6; color: #2C2C2C;">
          <li style="margin-bottom: 6px;">✓ Full Syllabus-Compliant Codebase Designs</li>
          <li style="margin-bottom: 6px;">✓ Complete Project Thesis Reports (Syllabus-aligned)</li>
          <li style="margin-bottom: 6px;">✓ Full PowerPoint (PPT) Presentation Slides</li>
          <li style="margin-bottom: 6px;">✓ 1-on-1 Zoom Code Setup & Viva Guidance</li>
        </ul>
      </div>
    </div>

    <div class="footer-border">
      <div>📞 +91 90288 33275</div>
      <div>✉ shubdeeplabs@gmail.com</div>
      <div>📍 Solapur, Maharashtra</div>
    </div>
  </div>


  <!-- PAGE 2: WHY TRUST US & ACADEMIC AREAS -->
  <div class="a4-page ruled-paper">
    <div class="binder-rings"></div>
    <div style="border-bottom: 2px dashed rgba(44, 44, 44, 0.2); padding-bottom: 12px;">
      <h2 class="font-hand" style="font-size: 30px; margin: 0 0 4px 0;">Why Students Trust Shubdeep Labs</h2>
      <p class="font-marker" style="font-size: 13px; color: #6A6A6A; margin: 0;">We supply top-grade code resources alongside explanation tools to help you verify logic.</p>
    </div>

    <div class="grid-2" style="margin: 20px 0;">
      <div class="sketch-card" style="border-top: 5px solid #66BB6A; height: 115px;">
        <h3 class="font-marker" style="font-size: 15px; margin: 0 0 4px 0;"><span class="marker-green">100% Original Work</span></h3>
        <p class="font-sans" style="font-size: 11px; margin: 0; color: #5A5A5A; font-weight: 600; line-height: 1.4;">No copy-pasted templates. Every codebase is structured freshly according to your specific college needs.</p>
      </div>
      <div class="sketch-card" style="border-top: 5px solid #42A5F5; height: 115px;">
        <h3 class="font-marker" style="font-size: 15px; margin: 0 0 4px 0;"><span class="marker-blue">On-Time Delivery</span></h3>
        <p class="font-sans" style="font-size: 11px; margin: 0; color: #5A5A5A; font-weight: 600; line-height: 1.4;">We are extremely strict with dates. Get your complete setup, reports, and slides well before your final submit day.</p>
      </div>
      <div class="sketch-card" style="border-top: 5px solid #FFCA28; height: 115px;">
        <h3 class="font-marker" style="font-size: 15px; margin: 0 0 4px 0;"><span class="marker-yellow">PPT & Reports Ready</span></h3>
        <p class="font-sans" style="font-size: 11px; margin: 0; color: #5A5A5A; font-weight: 600; line-height: 1.4;">Syllabus-compliant, fully formatted presentation drafts and comprehensive project reports included.</p>
      </div>
      <div class="sketch-card" style="border-top: 5px solid #EF5350; height: 115px;">
        <h3 class="font-marker" style="font-size: 15px; margin: 0 0 4px 0;"><span class="marker-red">Clean Documented Code</span></h3>
        <p class="font-sans" style="font-size: 11px; margin: 0; color: #5A5A5A; font-weight: 600; line-height: 1.4;">Neat model structures, clean controllers, and comprehensive code comments that make logic review easy.</p>
      </div>
    </div>

    <div style="border-bottom: 2px dashed rgba(44, 44, 44, 0.2); padding-bottom: 8px;">
      <h2 class="font-hand" style="font-size: 26px; margin: 0 0 4px 0;">Academic Study Areas & Syllabus Levels</h2>
      <p class="font-marker" style="font-size: 13px; color: #6A6A6A; margin: 0;">We customize project directories to comply exactly with your review parameters.</p>
    </div>

    <div class="grid-2" style="margin: 16px 0;">
      <div class="study-area-card" style="border-color: #FFCA28;">
        <div class="study-icon"><span style="font-size: 14px;">💻</span></div>
        <div>
          <h4 class="font-marker" style="font-size: 13px; margin: 0 0 2px 0;">Diploma Projects</h4>
          <p class="font-sans" style="font-size: 10px; margin: 0; color: #5A5A5A; font-weight: 600; line-height: 1.3;">Syllabus-compliant, core-logic driven applications scaled perfectly for diploma review parameters.</p>
        </div>
      </div>
      <div class="study-area-card" style="border-color: #66BB6A;">
        <div class="study-icon"><span style="font-size: 14px;">⚙</span></div>
        <div>
          <h4 class="font-marker" style="font-size: 13px; margin: 0 0 2px 0;">Engineering Projects</h4>
          <p class="font-sans" style="font-size: 10px; margin: 0; color: #5A5A5A; font-weight: 600; line-height: 1.3;">Full-stack architectures, neat database structures, and comprehensive data flows built for B.E. / B.Tech.</p>
        </div>
      </div>
      <div class="study-area-card" style="border-color: #42A5F5;">
        <div class="study-icon"><span style="font-size: 14px;">🧩</span></div>
        <div>
          <h4 class="font-marker" style="font-size: 13px; margin: 0 0 2px 0;">M.Tech Projects</h4>
          <p class="font-sans" style="font-size: 10px; margin: 0; color: #5A5A5A; font-weight: 600; line-height: 1.3;">High-grade algorithm modeling, data analysis, and advanced codebase executions for research thesis.</p>
        </div>
      </div>
      <div class="study-area-card" style="border-color: #AB47BC;">
        <div class="study-icon"><span style="font-size: 14px;">📊</span></div>
        <div>
          <h4 class="font-marker" style="font-size: 13px; margin: 0 0 2px 0;">BCA / MCA Projects</h4>
          <p class="font-sans" style="font-size: 10px; margin: 0; color: #5A5A5A; font-weight: 600; line-height: 1.3;">Interactive management portals, dashboard consoles, cloud databases, and clean system layouts.</p>
        </div>
      </div>
      <div class="study-area-card" style="border-color: #EF5350;">
        <div class="study-icon"><span style="font-size: 14px;">🧠</span></div>
        <div>
          <h4 class="font-marker" style="font-size: 13px; margin: 0 0 2px 0;">AI / ML Projects</h4>
          <p class="font-sans" style="font-size: 10px; margin: 0; color: #5A5A5A; font-weight: 600; line-height: 1.3;">TensorFlow / PyTorch models, visual scans, NLP conversational bots, and predictive analytics pipelines.</p>
        </div>
      </div>
      <div class="study-area-card" style="border-color: #FFA726;">
        <div class="study-icon"><span style="font-size: 14px;">✨</span></div>
        <div>
          <h4 class="font-marker" style="font-size: 13px; margin: 0 0 2px 0;">Web Projects</h4>
          <p class="font-sans" style="font-size: 10px; margin: 0; color: #5A5A5A; font-weight: 600; line-height: 1.3;">Stunning responsive portals, custom dashboards, single page interfaces, and rich administrative panels.</p>
        </div>
      </div>
    </div>

    <div style="border-top: 1px solid rgba(44, 44, 44, 0.1); padding-top: 8px; text-align: right;" class="font-marker">
      <span style="font-size: 12px; color: #6A6A6A;">Page 2 of 5</span>
    </div>
  </div>


  <!-- PAGE 3: PORTFOLIO BLUEPRINTS CATALOG - PART 1 -->
  <div class="a4-page ruled-paper">
    <div class="binder-rings"></div>
    <div style="border-bottom: 2px dashed rgba(44, 44, 44, 0.2); padding-bottom: 12px;">
      <h2 class="font-hand" style="font-size: 30px; margin: 0 0 4px 0;">Academic System Blueprints</h2>
      <p class="font-marker" style="font-size: 13px; color: #6A6A6A; margin: 0;">Explore pre-configured logic outlines. We establish secure databases and layouts.</p>
    </div>

    <div style="display: flex; flex-direction: column; justify-content: space-around; flex-grow: 1; margin: 16px 0;">
      <!-- Project 1 -->
      <div class="sketch-card" style="border-top: 5px solid #66BB6A;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="marker-green font-marker" style="font-size: 14px; font-weight: bold; border: 1px solid #2C2C2C; border-radius: 4px; box-shadow: 1px 1px 0px #2C2C2C;">AI Plant Disease Detector</span>
          <span class="font-hand" style="font-size: 14px; color: #6A6A6A; border: 1px solid #6A6A6A; border-radius: 3px; padding: 1px 4px; transform: rotate(-2deg);">Verified Stack</span>
        </div>
        <div style="margin-bottom: 8px;">
          <span class="font-marker" style="font-size: 10px; color: #6A6A6A; display: block;">TECH SPECIFICATION:</span>
          <p class="font-marker" style="font-size: 12px; font-weight: bold; color: #2C2C2C; margin: 0;">Python, Next.js, TensorFlow, FastAPI</p>
        </div>
        <p class="font-sans" style="font-size: 11px; margin: 0; color: #5A5A5A; line-height: 1.5; font-weight: 600;">
          A neural-network visual scanning web application detecting agricultural leaf diseases with detailed metric analytics. Auto-generates diagnostic summary grids.
        </p>
      </div>

      <!-- Project 2 -->
      <div class="sketch-card" style="border-top: 5px solid #AB47BC;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="marker-purple font-marker" style="font-size: 14px; font-weight: bold; border: 1px solid #2C2C2C; border-radius: 4px; box-shadow: 1px 1px 0px #2C2C2C;">Advanced AI Customer Care Chatbot</span>
          <span class="font-hand" style="font-size: 14px; color: #6A6A6A; border: 1px solid #6A6A6A; border-radius: 3px; padding: 1px 4px; transform: rotate(1deg);">Verified Stack</span>
        </div>
        <div style="margin-bottom: 8px;">
          <span class="font-marker" style="font-size: 10px; color: #6A6A6A; display: block;">TECH SPECIFICATION:</span>
          <p class="font-marker" style="font-size: 12px; font-weight: bold; color: #2C2C2C; margin: 0;">React, Node.js, Express, OpenAI API</p>
        </div>
        <p class="font-sans" style="font-size: 11px; margin: 0; color: #5A5A5A; line-height: 1.5; font-weight: 600;">
          Intelligent messaging center with customizable document indexing (RAG) and interactive dashboard console log views. Complete with user session logging database.
        </p>
      </div>

      <!-- Project 3 -->
      <div class="sketch-card" style="border-top: 5px solid #42A5F5;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="marker-blue font-marker" style="font-size: 14px; font-weight: bold; border: 1px solid #2C2C2C; border-radius: 4px; box-shadow: 1px 1px 0px #2C2C2C;">Face Recognition Attendance system</span>
          <span class="font-hand" style="font-size: 14px; color: #6A6A6A; border: 1px solid #6A6A6A; border-radius: 3px; padding: 1px 4px; transform: rotate(-1deg);">Verified Stack</span>
        </div>
        <div style="margin-bottom: 8px;">
          <span class="font-marker" style="font-size: 10px; color: #6A6A6A; display: block;">TECH SPECIFICATION:</span>
          <p class="font-marker" style="font-size: 12px; font-weight: bold; color: #2C2C2C; margin: 0;">Python, OpenCV, Tkinter, SQLite</p>
        </div>
        <p class="font-sans" style="font-size: 11px; margin: 0; color: #5A5A5A; line-height: 1.5; font-weight: 600;">
          Real-time face detection tracker featuring automated CSV sheets generation and attendance log exports. Designed for high accuracy review parameters.
        </p>
      </div>
    </div>

    <div style="border-top: 1px solid rgba(44, 44, 44, 0.1); padding-top: 8px; text-align: right;" class="font-marker">
      <span style="font-size: 12px; color: #6A6A6A;">Page 3 of 5</span>
    </div>
  </div>


  <!-- PAGE 4: PORTFOLIO BLUEPRINTS CATALOG - PART 2 -->
  <div class="a4-page ruled-paper">
    <div class="binder-rings"></div>
    <div style="border-bottom: 2px dashed rgba(44, 44, 44, 0.2); padding-bottom: 12px;">
      <h2 class="font-hand" style="font-size: 30px; margin: 0 0 4px 0;">Academic System Blueprints (Contd.)</h2>
      <p class="font-marker" style="font-size: 13px; color: #6A6A6A; margin: 0;">Explore pre-configured logic outlines. We establish secure databases and layouts.</p>
    </div>

    <div style="display: flex; flex-direction: column; justify-content: space-around; flex-grow: 1; margin: 16px 0;">
      <!-- Project 4 -->
      <div class="sketch-card" style="border-top: 5px solid #FFA726;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="marker-orange font-marker" style="font-size: 14px; font-weight: bold; border: 1px solid #2C2C2C; border-radius: 4px; box-shadow: 1px 1px 0px #2C2C2C;">Hospital Management Core Desk</span>
          <span class="font-hand" style="font-size: 14px; color: #6A6A6A; border: 1px solid #6A6A6A; border-radius: 3px; padding: 1px 4px; transform: rotate(2deg);">Verified Stack</span>
        </div>
        <div style="margin-bottom: 8px;">
          <span class="font-marker" style="font-size: 10px; color: #6A6A6A; display: block;">TECH SPECIFICATION:</span>
          <p class="font-marker" style="font-size: 12px; font-weight: bold; color: #2C2C2C; margin: 0;">Next.js, MongoDB, Tailwind, Node.js</p>
        </div>
        <p class="font-sans" style="font-size: 11px; margin: 0; color: #5A5A5A; line-height: 1.5; font-weight: 600;">
          Full clinic portal with scheduling grids, active invoice trackers, and secure digital prescription vaults. Styled with a premium dark-mode interface dashboard.
        </p>
      </div>

      <!-- Project 5 -->
      <div class="sketch-card" style="border-top: 5px solid #FFCA28;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="marker-yellow font-marker" style="font-size: 14px; font-weight: bold; border: 1px solid #2C2C2C; border-radius: 4px; box-shadow: 1px 1px 0px #2C2C2C;">Expense Tracker with AI Insights</span>
          <span class="font-hand" style="font-size: 14px; color: #6A6A6A; border: 1px solid #6A6A6A; border-radius: 3px; padding: 1px 4px; transform: rotate(-2deg);">Verified Stack</span>
        </div>
        <div style="margin-bottom: 8px;">
          <span class="font-marker" style="font-size: 10px; color: #6A6A6A; display: block;">TECH SPECIFICATION:</span>
          <p class="font-marker" style="font-size: 12px; font-weight: bold; color: #2C2C2C; margin: 0;">React, Node.js, MongoDB, Gemini API</p>
        </div>
        <p class="font-sans" style="font-size: 11px; margin: 0; color: #5A5A5A; line-height: 1.5; font-weight: 600;">
          Personal finance portal offering automated category tagging, monthly budget forecasting, and AI-driven spending recommendations with beautiful chart summaries.
        </p>
      </div>

      <!-- Project 6 -->
      <div class="sketch-card" style="border-top: 5px solid #EF5350;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="marker-red font-marker" style="font-size: 14px; font-weight: bold; border: 1px solid #2C2C2C; border-radius: 4px; box-shadow: 1px 1px 0px #2C2C2C;">Smart Notes Summarizer</span>
          <span class="font-hand" style="font-size: 14px; color: #6A6A6A; border: 1px solid #6A6A6A; border-radius: 3px; padding: 1px 4px; transform: rotate(1deg);">Verified Stack</span>
        </div>
        <div style="margin-bottom: 8px;">
          <span class="font-marker" style="font-size: 10px; color: #6A6A6A; display: block;">TECH SPECIFICATION:</span>
          <p class="font-marker" style="font-size: 12px; font-weight: bold; color: #2C2C2C; margin: 0;">React, FastAPI, Python, Hugging Face</p>
        </div>
        <p class="font-sans" style="font-size: 11px; margin: 0; color: #5A5A5A; line-height: 1.5; font-weight: 600;">
          Collaborative document pad that auto-generates structured summaries, highlights action items, and generates flashcards using NLP algorithms.
        </p>
      </div>
    </div>

    <div style="border-top: 1px solid rgba(44, 44, 44, 0.1); padding-top: 8px; text-align: right;" class="font-marker">
      <span style="font-size: 12px; color: #6A6A6A;">Page 4 of 5</span>
    </div>
  </div>


  <!-- PAGE 5: COSTING, TESTIMONIALS & CONTACT -->
  <div class="a4-page ruled-paper">
    <div class="binder-rings"></div>
    <div style="border-bottom: 2px dashed rgba(44, 44, 44, 0.2); padding-bottom: 12px;">
      <h2 class="font-hand" style="font-size: 30px; margin: 0 0 4px 0;">Costing & Student Stories</h2>
      <p class="font-marker" style="font-size: 13px; color: #6A6A6A; margin: 0;">Transparent starting reference and verified reviews from diploma & degree final years.</p>
    </div>

    <div style="border: 2.5px solid #2C2C2C; background: #white; border-radius: 12px; padding: 12px; box-shadow: 2px 2px 0px #2C2C2C; margin: 10px 0;">
      <h3 class="font-marker" style="font-size: 14px; margin: 0 0 6px 0; text-decoration: underline; text-decoration-color: #FFCA28;"><span class="marker-yellow">Academic Project Pricing</span></h3>
      <div class="grid-2" style="font-size: 11px; font-family: 'Patrick Hand', sans-serif;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(44,44,44,0.1); padding-bottom: 2px;">
          <span>🎓 Diploma Projects</span>
          <span style="font-weight: bold;">Free 🌿</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(44,44,44,0.1); padding-bottom: 2px;">
          <span>⚙️ Engineering Projects</span>
          <span style="font-weight: bold;">₹3,999+</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(44,44,44,0.1); padding-bottom: 2px;">
          <span>📊 BCA / MCA Projects</span>
          <span style="font-weight: bold;">₹2,999+</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(44,44,44,0.1); padding-bottom: 2px;">
          <span>🌐 Web Development</span>
          <span style="font-weight: bold;">₹3,999+</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(44,44,44,0.1); padding-bottom: 2px;">
          <span>📱 Android Projects</span>
          <span style="font-weight: bold;">₹4,999+</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(44,44,44,0.1); padding-bottom: 2px;">
          <span>🔌 IoT Projects</span>
          <span style="font-weight: bold;">₹4,999+</span>
        </div>
      </div>
    </div>

    <div style="margin: 10px 0;">
      <h3 class="font-marker" style="font-size: 14px; margin: 0 0 10px 0;"><span class="marker-yellow">Verified Student Testimonials</span></h3>
      <div class="grid-3">
        <!-- T1 -->
        <div class="polaroid-card" style="transform: rotate(-1.5deg);">
          <p class="font-sans" style="font-size: 9px; margin: 0; color: #5A5A5A; font-weight: 600; line-height: 1.35; font-style: italic;">
            "Excellent research algorithm modeling! The Shubdeep Labs team helped me build the GreenMind AI plant disease detector app for my M.Tech thesis. The codebase was clean and well-documented. Got full support during reviews."
          </p>
          <div style="border-top: 1px solid rgba(44,44,44,0.1); padding-top: 4px;">
            <h4 class="font-marker" style="font-size: 10px; margin: 0; line-height: 1;">Miss Yelgonde</h4>
            <p class="font-marker" style="font-size: 8px; margin: 0; color: #6A6A6A;">M.Tech Student</p>
          </div>
        </div>
        <!-- T2 -->
        <div class="polaroid-card" style="transform: rotate(1.5deg);">
          <p class="font-sans" style="font-size: 9px; margin: 0; color: #5A5A5A; font-weight: 600; line-height: 1.35; font-style: italic;">
            "Highly professional service. They custom-tailored the Agrovision machine learning model and backend integration for my project. The detailed thesis report and presentation slides saved me months of revision."
          </p>
          <div style="border-top: 1px solid rgba(44,44,44,0.1); padding-top: 4px;">
            <h4 class="font-marker" style="font-size: 10px; margin: 0; line-height: 1;">Miss Pogul</h4>
            <p class="font-marker" style="font-size: 8px; margin: 0; color: #6A6A6A;">M.Tech Student</p>
          </div>
        </div>
        <!-- T3 -->
        <div class="polaroid-card" style="transform: rotate(-1deg);">
          <p class="font-sans" style="font-size: 9px; margin: 0; color: #5A5A5A; font-weight: 600; line-height: 1.35; font-style: italic;">
            "Amazing explanation and Zoom support! They built a beautiful e-commerce website for my business, helped configure the database, and explained the administration panels perfectly. Strongly recommended!"
          </p>
          <div style="border-top: 1px solid rgba(44,44,44,0.1); padding-top: 4px;">
            <h4 class="font-marker" style="font-size: 10px; margin: 0; line-height: 1;">Miss Saina</h4>
            <p class="font-marker" style="font-size: 8px; margin: 0; color: #6A6A6A;">Client</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Chalkboard Contact -->
    <div class="contact-chalkboard" style="margin: 10px 0;">
      <h3 class="font-hand" style="font-size: 24px; color: #FFF; margin: 0 0 6px 0; line-height: 1;">Discuss Your Scope with Our Desk</h3>
      <p class="font-sans" style="font-size: 9.5px; color: rgba(255,255,255,0.7); line-height: 1.4; margin: 0 auto 12px auto; max-width: 380px;">
        Connect directly to clarify details, branch requirements, deadlines, or to custom design modules for your college viva reviewers.
      </p>
      <div style="display: flex; justify-content: space-around; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 8px;" class="font-marker">
        <div style="font-size: 12px;">📞 +91 90288 33275</div>
        <div style="font-size: 12px;">✉ shubdeeplabs@gmail.com</div>
        <div style="font-size: 12px;">🌐 <a href="https://shubh-deep-labs.vercel.app" target="_blank" style="color: #FFF; text-decoration: underline;">shubh-deep-labs.vercel.app</a></div>
      </div>
    </div>

    <div style="border-top: 1px solid rgba(44, 44, 44, 0.1); padding-top: 8px; text-align: right;" class="font-marker">
      <span style="font-size: 12px; color: #6A6A6A;">Page 5 of 5</span>
    </div>
  </div>

</body>
</html>
"""

with open(html_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Standalone HTML generated at: {html_file}")

print("Running Google Chrome headless to print PDF...")
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

try:
    result = subprocess.run([
        chrome_path,
        "--headless",
        "--disable-gpu",
        f"--print-to-pdf={pdf_file}",
        html_file
    ], check=True, capture_output=True)
    
    if os.path.exists(pdf_file):
        print(f"SUCCESS! Portfolio PDF saved successfully at: {pdf_file}")
    else:
        print("Error: Chrome executed, but the PDF file was not created.")
except Exception as e:
    print(f"Failed to generate PDF: {e}")
