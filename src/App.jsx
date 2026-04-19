import React, { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   JANI SALES AI COMMAND CENTER
   5 interactive modules — single-file simulation
   Built by ARQ ONE AI Labs
   ───────────────────────────────────────────────────────────── */

// ─── THEME ────────────────────────────────────────────────────
const C = {
  forest: "#0B4F3C",
  forestL: "#1A6B54",
  forestDk: "#083528",
  kraft: "#C17A3F",
  kraftL: "#E8A668",
  cream: "#F7F3ED",
  paperBg: "#FBFAF7",
  white: "#FFFFFF",
  dark: "#1A1F1B",
  charcoal: "#2C3330",
  muted: "#6B7670",
  subtle: "#A0A8A3",
  line: "#E5E7EB",
  lineSoft: "#F3F4F6",
  green: "#059669",
  greenBg: "#ECFDF5",
  greenBd: "#A7F3D0",
  amber: "#D97706",
  amberBg: "#FEF3C7",
  amberBd: "#FDE68A",
  red: "#DC2626",
  redBg: "#FEF2F2",
  redBd: "#FECACA",
  blue: "#1E3A5F",
  blueBg: "#EFF6FB"
};

// ─── TRANSLATIONS ─────────────────────────────────────────────
const T = {
  en: {
    brand: "ARQ ONE AI LABS",
    appName: "Jani AI Command Center",
    appSub: "One AI operating platform for paper, trading & packaging",
    live: "Live",
    savingsTicker: "Value saved today (simulated)",
    tryLabel: "Try the modules:",
    reset: "Reset demo",
    modules: {
      copilot: {
        title: "PaperOps Copilot",
        desc: "Ask anything on WhatsApp or web. Answers pulled from YOUR SOPs, specs, certificates — in English, Hindi, or Gujarati.",
        saving: "Saves 2+ hours per person per day"
      },
      quality: {
        title: "Reel Quality AI",
        desc: "Reads GSM, brightness, moisture, and process signals. Flags quality drift during the run — not after.",
        saving: "₹30–50 L / year in avoidable waste"
      },
      dispatch: {
        title: "Dispatch & ETA Engine",
        desc: "Connects stock across locations with QA release and truck readiness. Confidence score on every promise date.",
        saving: "15–20% better dispatch reliability"
      },
      docs: {
        title: "Certificate & Doc AI",
        desc: "Auto-generate mill test certificates, customer questionnaires, and compliance packs from your production + QA data.",
        saving: "60–70% faster documentation"
      },
      sourcing: {
        title: "Sourcing Radar",
        desc: "Tracks waste paper prices, vendor lot consistency, and lead times 7–21 days ahead.",
        saving: "₹25–60 L / year margin protected"
      }
    },
    sop: {
      intro: "Ask any question about Jani's paper grades, quality, or SOPs. I'll answer from your own documents.",
      suggestions: [
        "What is the GSM spec for MG Kraft 80?",
        "Moisture limit for tissue export orders?",
        "Export documentation for Saudi Arabia order?",
        "Which MSDS applies to virgin tissue?"
      ],
      answers: [
        "📄  MG Kraft 80 specification:\n• Basis weight: 80 ± 3 GSM\n• Tensile (MD): min 5.2 kN/m\n• Burst: min 280 kPa\n• Moisture: 6–8%\nSource: QA-SPEC-MGK-R7.pdf, page 3",
        "📄  Tissue export orders — moisture limit:\n• Soft Crepe Tissue: 5.5–7.0% (max 7.5% at shipping)\n• Virgin Tissue: 5.0–6.5%\nExceeding 7.5% triggers automatic hold.\nSource: EXPORT-QC-SOP-v4.pdf",
        "📄  Saudi Arabia export pack requires:\n• SASO Certificate of Conformity\n• MTC in Arabic + English\n• Halal declaration (for tissue)\n• Bill of Lading + Packing List\n• Certificate of Origin (APEDA)\nLast shipment template: Order #JS-EXP-2189",
        "📄  Virgin Tissue MSDS:\nMSDS-VT-2024-R3.pdf covers:\n• Composition: 100% virgin bleached pulp\n• No hazardous classification (GHS)\n• Storage: RH 50–65%, away from direct sunlight\n• Food-contact grade: FDA 21 CFR 176.170 compliant"
      ]
    },
    quality: {
      title: "Live Reel — PM2 Tissue Line, Sarigam",
      grade: "Grade: Soft Crepe Tissue 17 GSM",
      runtime: "Runtime: 2h 14m",
      scan: "Analyze reel",
      scanning: "Reading sensors & lab data...",
      resultOk: "✓ Reel within spec",
      resultWarn: "⚠ Quality drift detected",
      params: [
        { name: "GSM (Basis Weight)", val: 17.3, unit: "g/m²", min: 16.5, max: 17.5, trend: "stable" },
        { name: "Moisture", val: 7.8, unit: "%", min: 5.0, max: 7.0, trend: "rising", flag: true },
        { name: "Brightness", val: 86.2, unit: "ISO", min: 84, max: 90, trend: "stable" },
        { name: "Tensile (MD)", val: 142, unit: "N/m", min: 135, max: null, trend: "stable" },
        { name: "Caliper", val: 165, unit: "µm", min: 155, max: 175, trend: "stable" },
        { name: "Ash content", val: 12.8, unit: "%", min: null, max: 14, trend: "stable" }
      ],
      aiVerdict: "Moisture trending above spec (7.8% vs 7.0% max). Dryer steam pressure on section 3 has dropped 8% in last 45 min. Recommended action: increase steam to section-3 dryer to 4.2 bar before the next 600m of reel exits spec.",
      actions: ["Alert operator on shift", "Raise QC ticket", "Pause run if >7.5%"],
      impact: "Intervening now: saves ~420 kg of off-spec tissue = ₹42,000 avoided waste on this reel alone."
    },
    dispatch: {
      title: "Open Orders — Next 72 Hours",
      subtitle: "Stock × QA release × truck readiness",
      statusCol: "Status",
      promise: "Promised",
      etaCol: "AI ETA",
      confidence: "Confidence",
      orders: [
        { id: "JS-1847", customer: "Hindustan Foods", grade: "MG Kraft 80", qty: "12 MT", loc: "Sarigam", promise: "Today 6 PM", eta: "Today 5:30 PM", conf: 94, state: "ok", note: "Truck at gate. QA released." },
        { id: "JS-1852", customer: "Emirates Trading (Dubai)", grade: "Soft Tissue 17", qty: "8 MT", loc: "Sarigam", promise: "Tomorrow AM", eta: "Tomorrow 2 PM", conf: 62, state: "risk", note: "QA hold on 3 reels — moisture. Export docs 80% ready." },
        { id: "JS-1855", customer: "Godrej Consumer", grade: "Virgin Tissue 14", qty: "15 MT", loc: "Sarigam", promise: "Tomorrow PM", eta: "Tomorrow PM", conf: 88, state: "ok", note: "Stock ready. Truck assigned." },
        { id: "JS-1861", customer: "Sri Lanka Paper Co.", grade: "MG Poster 90", qty: "24 MT", loc: "Baddi", promise: "Thu AM", eta: "Fri AM", conf: 41, state: "alert", note: "Production short by 6 MT. Pull 6 MT from Panchkula?" },
        { id: "JS-1864", customer: "ITC Foods", grade: "Brown Tissue 22", qty: "5 MT", loc: "Mumbai", promise: "Fri PM", eta: "Fri 11 AM", conf: 91, state: "ok", note: "Trading stock. Ready to load." }
      ],
      aiSummary: "2 orders at risk today. The Sri Lanka export (JS-1861) is the biggest concern — confidence 41%. Recommended: allocate 6 MT MG Poster 90 from Panchkula to Baddi this evening. This moves confidence from 41% to 86%.",
      act: "Apply AI recommendation"
    },
    docs: {
      title: "Generate Mill Test Certificate",
      subtitle: "Order: JS-1852 · Emirates Trading · Soft Tissue 17 GSM · 8 MT",
      gen: "Generate MTC",
      generating: "Pulling production, QA, and batch data...",
      steps: [
        "Reading QA lab records (Batch SRG-TS-2406-118)",
        "Reading production parameters (PM2 run 2024-04-19)",
        "Matching against Saudi SASO + customer spec",
        "Filling MTC fields (EN + AR)",
        "Cross-checking signatures & seals",
        "Ready for QC manager review"
      ],
      mtc: {
        header: "MILL TEST CERTIFICATE",
        cert: "MTC No: JS/MTC/2024/1852",
        date: "Date: 19-Apr-2026",
        customer: "Customer: Emirates Trading LLC, Dubai",
        grade: "Grade: Soft Crepe Tissue, 17 GSM",
        order: "Order Ref: JS-1852  |  Batch: SRG-TS-2406-118",
        qty: "Quantity: 8,000 kg (8 MT)",
        tests: [
          { k: "Basis Weight (g/m²)", v: "17.2", spec: "17 ± 0.5", pass: true },
          { k: "Moisture (%)", v: "6.4", spec: "5.0 – 7.0", pass: true },
          { k: "Brightness (ISO)", v: "86.8", spec: "≥ 84", pass: true },
          { k: "Tensile MD (N/m)", v: "148", spec: "≥ 135", pass: true },
          { k: "Caliper (µm)", v: "163", spec: "155 – 175", pass: true },
          { k: "Ash content (%)", v: "11.9", spec: "≤ 14", pass: true }
        ],
        footer: "This material has been manufactured and tested in accordance with customer specification and meets all requirements.\nInspected by: QC Manager, Jani Sales — Sarigam Plant"
      },
      postGen: "✓ MTC generated in 12 seconds. Ready for QC signature. English + Arabic versions available."
    },
    sourcing: {
      title: "Waste Paper — 14-Day AI Forecast",
      subtitle: "Tracking 8 vendors · 3 grades · price + delay + consistency signals",
      vendors: [
        { name: "Shakti Waste Papers", grade: "OCC A", lotScore: 94, priceRisk: "low", delayRisk: "low", state: "ok", note: "Consistent last 6 months. Best option for PM1 next week." },
        { name: "Gupta Traders", grade: "OCC B", lotScore: 71, priceRisk: "rising", delayRisk: "med", state: "watch", note: "3 lots in last 30 days below target fibre length. Price up 6% WoW." },
        { name: "Mumbai Recyclers Pvt Ltd", grade: "Mixed", lotScore: 82, priceRisk: "low", delayRisk: "low", state: "ok", note: "Stable vendor. Good for Sarigam PM2." },
        { name: "Ganesh Paper Mart", grade: "OCC A", lotScore: 58, priceRisk: "rising", delayRisk: "high", state: "alert", note: "Shipment #4491 delayed 4 days. Predicted 9-day delay on next order." },
        { name: "Ahmedabad Fibre", grade: "OCC B", lotScore: 87, priceRisk: "low", delayRisk: "low", state: "ok", note: "Strong alternative if Ganesh slips." },
        { name: "Surat Pulp Co.", grade: "Virgin Pulp", lotScore: 91, priceRisk: "low", delayRisk: "low", state: "ok", note: "Premium pricing holds. Good for tissue PM2." }
      ],
      priceSeries: [
        { d: "Apr 5", p: 18.4 }, { d: "Apr 7", p: 18.6 }, { d: "Apr 9", p: 18.5 },
        { d: "Apr 11", p: 19.1 }, { d: "Apr 13", p: 19.4 }, { d: "Apr 15", p: 19.8 },
        { d: "Apr 17", p: 20.2 }, { d: "Apr 19", p: 20.5 }
      ],
      aiBrief: "OCC A price up 11% in 14 days — trend continues. Three signals suggest another 4–6% rise by end of April. Recommended: front-load 60% of May requirement from Shakti Waste Papers this week. Avoid Ganesh Paper Mart for next 3 weeks.",
      applyAction: "Create purchase recommendation"
    }
  },

  hi: {
    brand: "ARQ ONE AI LABS",
    appName: "Jani AI Command Center",
    appSub: "Paper, trading, aur packaging ke liye ek AI operating platform",
    live: "Live",
    savingsTicker: "Aaj bacha hua value (simulation)",
    tryLabel: "Modules try karein:",
    reset: "Demo reset karein",
    modules: {
      copilot: {
        title: "PaperOps Copilot",
        desc: "WhatsApp ya web par kuch bhi poochho. Jawab aapke SOPs, specs, certificates se aayega — English, Hindi, ya Gujarati mein.",
        saving: "Har vyakti 2+ ghanta rozana bachata hai"
      },
      quality: {
        title: "Reel Quality AI",
        desc: "GSM, brightness, moisture, aur process signals padhta hai. Quality drift run ke dauran pakadta hai — baad mein nahi.",
        saving: "₹30–50 L / saal waste bachat"
      },
      dispatch: {
        title: "Dispatch & ETA Engine",
        desc: "Sabhi locations ka stock, QA release, aur truck readiness ek jagah. Har promise date par confidence score.",
        saving: "15–20% behtar dispatch reliability"
      },
      docs: {
        title: "Certificate & Doc AI",
        desc: "Mill test certificates, customer questionnaires, aur compliance packs automatic generate karein.",
        saving: "60–70% tez documentation"
      },
      sourcing: {
        title: "Sourcing Radar",
        desc: "Waste paper prices, vendor consistency, aur lead times 7–21 din pehle track karein.",
        saving: "₹25–60 L / saal margin bacha"
      }
    },
    sop: {
      intro: "Jani ke paper grades, quality, ya SOPs ke baare mein kuch bhi poochho. Main aapke documents se jawab doonga.",
      suggestions: [
        "MG Kraft 80 ka GSM spec kya hai?",
        "Tissue export orders ke liye moisture limit?",
        "Saudi Arabia order ke liye export docs?",
        "Virgin tissue ke liye konsa MSDS?"
      ],
      answers: [
        "📄  MG Kraft 80 specification:\n• Basis weight: 80 ± 3 GSM\n• Tensile (MD): min 5.2 kN/m\n• Burst: min 280 kPa\n• Moisture: 6–8%\nSource: QA-SPEC-MGK-R7.pdf, page 3",
        "📄  Tissue export orders — moisture limit:\n• Soft Crepe Tissue: 5.5–7.0% (max 7.5% shipping par)\n• Virgin Tissue: 5.0–6.5%\n7.5% se upar automatic hold.\nSource: EXPORT-QC-SOP-v4.pdf",
        "📄  Saudi Arabia export pack ke liye chahiye:\n• SASO Certificate of Conformity\n• MTC (Arabic + English)\n• Halal declaration (tissue ke liye)\n• Bill of Lading + Packing List\n• Certificate of Origin (APEDA)\nPichhla shipment template: Order #JS-EXP-2189",
        "📄  Virgin Tissue MSDS:\nMSDS-VT-2024-R3.pdf mein:\n• Composition: 100% virgin bleached pulp\n• Hazardous classification nahi hai (GHS)\n• Storage: RH 50–65%, direct sunlight se door\n• Food-contact grade: FDA 21 CFR 176.170 compliant"
      ]
    },
    quality: {
      title: "Live Reel — PM2 Tissue Line, Sarigam",
      grade: "Grade: Soft Crepe Tissue 17 GSM",
      runtime: "Runtime: 2h 14m",
      scan: "Reel analyze karein",
      scanning: "Sensors aur lab data padh raha hoon...",
      resultOk: "✓ Reel spec ke andar hai",
      resultWarn: "⚠ Quality drift detect hua hai",
      params: [
        { name: "GSM (Basis Weight)", val: 17.3, unit: "g/m²", min: 16.5, max: 17.5, trend: "stable" },
        { name: "Moisture", val: 7.8, unit: "%", min: 5.0, max: 7.0, trend: "rising", flag: true },
        { name: "Brightness", val: 86.2, unit: "ISO", min: 84, max: 90, trend: "stable" },
        { name: "Tensile (MD)", val: 142, unit: "N/m", min: 135, max: null, trend: "stable" },
        { name: "Caliper", val: 165, unit: "µm", min: 155, max: 175, trend: "stable" },
        { name: "Ash content", val: 12.8, unit: "%", min: null, max: 14, trend: "stable" }
      ],
      aiVerdict: "Moisture spec se upar trend kar raha hai (7.8% vs 7.0% max). Dryer section 3 ka steam pressure pichhle 45 min mein 8% gira hai. Recommended action: section-3 dryer ka steam 4.2 bar karein, warna agla 600m reel spec se bahar jaayega.",
      actions: ["Shift operator ko alert karein", "QC ticket raise karein", ">7.5% hone par run pause karein"],
      impact: "Abhi intervene karne se ~420 kg off-spec tissue bachega = ₹42,000 ka waste avoid."
    },
    dispatch: {
      title: "Open Orders — Agle 72 Ghante",
      subtitle: "Stock × QA release × truck readiness",
      statusCol: "Status",
      promise: "Promised",
      etaCol: "AI ETA",
      confidence: "Confidence",
      orders: [
        { id: "JS-1847", customer: "Hindustan Foods", grade: "MG Kraft 80", qty: "12 MT", loc: "Sarigam", promise: "Aaj 6 PM", eta: "Aaj 5:30 PM", conf: 94, state: "ok", note: "Truck gate par hai. QA release ho gaya." },
        { id: "JS-1852", customer: "Emirates Trading (Dubai)", grade: "Soft Tissue 17", qty: "8 MT", loc: "Sarigam", promise: "Kal AM", eta: "Kal 2 PM", conf: 62, state: "risk", note: "3 reels par QA hold — moisture. Export docs 80% ready." },
        { id: "JS-1855", customer: "Godrej Consumer", grade: "Virgin Tissue 14", qty: "15 MT", loc: "Sarigam", promise: "Kal PM", eta: "Kal PM", conf: 88, state: "ok", note: "Stock ready. Truck assign ho gaya." },
        { id: "JS-1861", customer: "Sri Lanka Paper Co.", grade: "MG Poster 90", qty: "24 MT", loc: "Baddi", promise: "Guru AM", eta: "Shukra AM", conf: 41, state: "alert", note: "Production 6 MT short. Panchkula se 6 MT khinch sakte hain?" },
        { id: "JS-1864", customer: "ITC Foods", grade: "Brown Tissue 22", qty: "5 MT", loc: "Mumbai", promise: "Shukra PM", eta: "Shukra 11 AM", conf: 91, state: "ok", note: "Trading stock. Load ke liye ready." }
      ],
      aiSummary: "Aaj 2 orders risk par hain. Sri Lanka export (JS-1861) sabse badi problem hai — confidence sirf 41%. Recommendation: aaj shaam Panchkula se 6 MT MG Poster 90 Baddi transfer karein. Isse confidence 41% se 86% ho jaayega.",
      act: "AI recommendation apply karein"
    },
    docs: {
      title: "Mill Test Certificate Generate Karein",
      subtitle: "Order: JS-1852 · Emirates Trading · Soft Tissue 17 GSM · 8 MT",
      gen: "MTC generate karein",
      generating: "Production, QA aur batch data kheench raha hoon...",
      steps: [
        "QA lab records padh raha hoon (Batch SRG-TS-2406-118)",
        "Production parameters padh raha hoon (PM2 run 2024-04-19)",
        "Saudi SASO + customer spec ke against match kar raha hoon",
        "MTC fields bhar raha hoon (EN + AR)",
        "Signatures aur seals cross-check kar raha hoon",
        "QC manager review ke liye ready"
      ],
      mtc: {
        header: "MILL TEST CERTIFICATE",
        cert: "MTC No: JS/MTC/2024/1852",
        date: "Date: 19-Apr-2026",
        customer: "Customer: Emirates Trading LLC, Dubai",
        grade: "Grade: Soft Crepe Tissue, 17 GSM",
        order: "Order Ref: JS-1852  |  Batch: SRG-TS-2406-118",
        qty: "Quantity: 8,000 kg (8 MT)",
        tests: [
          { k: "Basis Weight (g/m²)", v: "17.2", spec: "17 ± 0.5", pass: true },
          { k: "Moisture (%)", v: "6.4", spec: "5.0 – 7.0", pass: true },
          { k: "Brightness (ISO)", v: "86.8", spec: "≥ 84", pass: true },
          { k: "Tensile MD (N/m)", v: "148", spec: "≥ 135", pass: true },
          { k: "Caliper (µm)", v: "163", spec: "155 – 175", pass: true },
          { k: "Ash content (%)", v: "11.9", spec: "≤ 14", pass: true }
        ],
        footer: "Ye material customer specification ke hisaab se manufacture aur test kiya gaya hai aur sabhi requirements poori karta hai.\nInspected by: QC Manager, Jani Sales — Sarigam Plant"
      },
      postGen: "✓ MTC 12 seconds mein generate ho gaya. QC signature ke liye ready. English + Arabic versions available."
    },
    sourcing: {
      title: "Waste Paper — 14-Din AI Forecast",
      subtitle: "8 vendors · 3 grades · price + delay + consistency signals",
      vendors: [
        { name: "Shakti Waste Papers", grade: "OCC A", lotScore: 94, priceRisk: "low", delayRisk: "low", state: "ok", note: "Pichhle 6 mahine consistent. Agle week PM1 ke liye best option." },
        { name: "Gupta Traders", grade: "OCC B", lotScore: 71, priceRisk: "rising", delayRisk: "med", state: "watch", note: "Pichhle 30 din mein 3 lots target fibre length se neeche. Price 6% WoW upar." },
        { name: "Mumbai Recyclers Pvt Ltd", grade: "Mixed", lotScore: 82, priceRisk: "low", delayRisk: "low", state: "ok", note: "Stable vendor. Sarigam PM2 ke liye accha." },
        { name: "Ganesh Paper Mart", grade: "OCC A", lotScore: 58, priceRisk: "rising", delayRisk: "high", state: "alert", note: "Shipment #4491 mein 4 din delay. Agle order par 9-din delay predicted." },
        { name: "Ahmedabad Fibre", grade: "OCC B", lotScore: 87, priceRisk: "low", delayRisk: "low", state: "ok", note: "Agar Ganesh slip kare toh strong alternative." },
        { name: "Surat Pulp Co.", grade: "Virgin Pulp", lotScore: 91, priceRisk: "low", delayRisk: "low", state: "ok", note: "Premium pricing stable. Tissue PM2 ke liye accha." }
      ],
      priceSeries: [
        { d: "Apr 5", p: 18.4 }, { d: "Apr 7", p: 18.6 }, { d: "Apr 9", p: 18.5 },
        { d: "Apr 11", p: 19.1 }, { d: "Apr 13", p: 19.4 }, { d: "Apr 15", p: 19.8 },
        { d: "Apr 17", p: 20.2 }, { d: "Apr 19", p: 20.5 }
      ],
      aiBrief: "OCC A price 14 din mein 11% badha — trend chal raha hai. Teen signals batate hain ki April end tak 4–6% aur badhega. Recommendation: is week May requirement ka 60% Shakti Waste Papers se front-load karein. Ganesh Paper Mart ko agle 3 weeks avoid karein.",
      applyAction: "Purchase recommendation banayein"
    }
  },

  gu: {
    brand: "ARQ ONE AI LABS",
    appName: "Jani AI Command Center",
    appSub: "Paper, trading અને packaging માટે એક AI operating platform",
    live: "Live",
    savingsTicker: "આજે બચાવેલું value (simulation)",
    tryLabel: "Modules ઉપયોગ કરો:",
    reset: "Demo reset કરો",
    modules: {
      copilot: {
        title: "PaperOps Copilot",
        desc: "WhatsApp કે web પર કંઈ પણ પૂછો. જવાબ તમારા SOPs, specs, certificates માંથી — English, Hindi કે Gujarati માં.",
        saving: "દરેક વ્યક્તિના 2+ કલાક રોજ બચે"
      },
      quality: {
        title: "Reel Quality AI",
        desc: "GSM, brightness, moisture અને process signals વાંચે છે. Quality drift run દરમિયાન પકડે — પછીથી નહીં.",
        saving: "₹30–50 L / વર્ષ waste બચત"
      },
      dispatch: {
        title: "Dispatch & ETA Engine",
        desc: "બધી locations નો stock, QA release અને truck readiness એક જગ્યાએ. દરેક promise date પર confidence score.",
        saving: "15–20% સારી dispatch reliability"
      },
      docs: {
        title: "Certificate & Doc AI",
        desc: "Mill test certificates, customer questionnaires અને compliance packs ઓટોમેટિક generate.",
        saving: "60–70% ઝડપી documentation"
      },
      sourcing: {
        title: "Sourcing Radar",
        desc: "Waste paper price, vendor consistency અને lead times 7–21 દિવસ પહેલાં track કરે.",
        saving: "₹25–60 L / વર્ષ margin બચાવે"
      }
    },
    sop: {
      intro: "Jani ના paper grades, quality કે SOPs વિશે કંઈ પણ પૂછો. તમારા documents માંથી જવાબ આપીશ.",
      suggestions: [
        "MG Kraft 80 નો GSM spec શું છે?",
        "Tissue export orders માટે moisture limit?",
        "Saudi Arabia order માટે export docs?",
        "Virgin tissue માટે કયું MSDS?"
      ],
      answers: [
        "📄  MG Kraft 80 specification:\n• Basis weight: 80 ± 3 GSM\n• Tensile (MD): ઓછામાં ઓછું 5.2 kN/m\n• Burst: ઓછામાં ઓછું 280 kPa\n• Moisture: 6–8%\nSource: QA-SPEC-MGK-R7.pdf, page 3",
        "📄  Tissue export orders — moisture limit:\n• Soft Crepe Tissue: 5.5–7.0% (shipping પર max 7.5%)\n• Virgin Tissue: 5.0–6.5%\n7.5% થી વધુ હોય તો automatic hold.\nSource: EXPORT-QC-SOP-v4.pdf",
        "📄  Saudi Arabia export pack માટે જોઈએ:\n• SASO Certificate of Conformity\n• MTC (Arabic + English)\n• Halal declaration (tissue માટે)\n• Bill of Lading + Packing List\n• Certificate of Origin (APEDA)\nગયું shipment template: Order #JS-EXP-2189",
        "📄  Virgin Tissue MSDS:\nMSDS-VT-2024-R3.pdf:\n• Composition: 100% virgin bleached pulp\n• Hazardous classification નથી (GHS)\n• Storage: RH 50–65%, direct sunlight થી દૂર\n• Food-contact grade: FDA 21 CFR 176.170 compliant"
      ]
    },
    quality: {
      title: "Live Reel — PM2 Tissue Line, Sarigam",
      grade: "Grade: Soft Crepe Tissue 17 GSM",
      runtime: "Runtime: 2h 14m",
      scan: "Reel analyze કરો",
      scanning: "Sensors અને lab data વાંચી રહ્યો છું...",
      resultOk: "✓ Reel spec ની અંદર છે",
      resultWarn: "⚠ Quality drift detect થયું છે",
      params: [
        { name: "GSM (Basis Weight)", val: 17.3, unit: "g/m²", min: 16.5, max: 17.5, trend: "stable" },
        { name: "Moisture", val: 7.8, unit: "%", min: 5.0, max: 7.0, trend: "rising", flag: true },
        { name: "Brightness", val: 86.2, unit: "ISO", min: 84, max: 90, trend: "stable" },
        { name: "Tensile (MD)", val: 142, unit: "N/m", min: 135, max: null, trend: "stable" },
        { name: "Caliper", val: 165, unit: "µm", min: 155, max: 175, trend: "stable" },
        { name: "Ash content", val: 12.8, unit: "%", min: null, max: 14, trend: "stable" }
      ],
      aiVerdict: "Moisture spec થી ઉપર જઈ રહ્યું છે (7.8% vs 7.0% max). Section 3 dryer નું steam pressure છેલ્લા 45 min માં 8% ઘટ્યું છે. Recommended action: section-3 dryer નું steam 4.2 bar કરો, નહીં તો પછીના 600m reel spec થી બહાર જશે.",
      actions: ["Shift operator ને alert કરો", "QC ticket raise કરો", ">7.5% થાય તો run pause કરો"],
      impact: "હમણાં intervene કરવાથી ~420 kg off-spec tissue બચશે = ₹42,000 નું waste avoid."
    },
    dispatch: {
      title: "Open Orders — આગળના 72 કલાક",
      subtitle: "Stock × QA release × truck readiness",
      statusCol: "Status",
      promise: "Promised",
      etaCol: "AI ETA",
      confidence: "Confidence",
      orders: [
        { id: "JS-1847", customer: "Hindustan Foods", grade: "MG Kraft 80", qty: "12 MT", loc: "Sarigam", promise: "આજે 6 PM", eta: "આજે 5:30 PM", conf: 94, state: "ok", note: "Truck gate પર છે. QA release થઈ ગયું." },
        { id: "JS-1852", customer: "Emirates Trading (Dubai)", grade: "Soft Tissue 17", qty: "8 MT", loc: "Sarigam", promise: "કાલે AM", eta: "કાલે 2 PM", conf: 62, state: "risk", note: "3 reels પર QA hold — moisture. Export docs 80% ready." },
        { id: "JS-1855", customer: "Godrej Consumer", grade: "Virgin Tissue 14", qty: "15 MT", loc: "Sarigam", promise: "કાલે PM", eta: "કાલે PM", conf: 88, state: "ok", note: "Stock ready. Truck assign થઈ ગયું." },
        { id: "JS-1861", customer: "Sri Lanka Paper Co.", grade: "MG Poster 90", qty: "24 MT", loc: "Baddi", promise: "ગુરુ AM", eta: "શુક્ર AM", conf: 41, state: "alert", note: "Production 6 MT ઓછું. Panchkula થી 6 MT ખેંચી શકાય?" },
        { id: "JS-1864", customer: "ITC Foods", grade: "Brown Tissue 22", qty: "5 MT", loc: "Mumbai", promise: "શુક્ર PM", eta: "શુક્ર 11 AM", conf: 91, state: "ok", note: "Trading stock. Load માટે ready." }
      ],
      aiSummary: "આજે 2 orders risk પર છે. Sri Lanka export (JS-1861) સૌથી મોટી ચિંતા છે — confidence માત્ર 41%. Recommendation: આજે સાંજે Panchkula થી 6 MT MG Poster 90 Baddi transfer કરો. આથી confidence 41% થી 86% થશે.",
      act: "AI recommendation apply કરો"
    },
    docs: {
      title: "Mill Test Certificate Generate કરો",
      subtitle: "Order: JS-1852 · Emirates Trading · Soft Tissue 17 GSM · 8 MT",
      gen: "MTC generate કરો",
      generating: "Production, QA અને batch data ખેંચી રહ્યો છું...",
      steps: [
        "QA lab records વાંચી રહ્યો છું (Batch SRG-TS-2406-118)",
        "Production parameters વાંચી રહ્યો છું (PM2 run 2024-04-19)",
        "Saudi SASO + customer spec સામે match કરી રહ્યો છું",
        "MTC fields ભરી રહ્યો છું (EN + AR)",
        "Signatures અને seals cross-check કરી રહ્યો છું",
        "QC manager review માટે ready"
      ],
      mtc: {
        header: "MILL TEST CERTIFICATE",
        cert: "MTC No: JS/MTC/2024/1852",
        date: "Date: 19-Apr-2026",
        customer: "Customer: Emirates Trading LLC, Dubai",
        grade: "Grade: Soft Crepe Tissue, 17 GSM",
        order: "Order Ref: JS-1852  |  Batch: SRG-TS-2406-118",
        qty: "Quantity: 8,000 kg (8 MT)",
        tests: [
          { k: "Basis Weight (g/m²)", v: "17.2", spec: "17 ± 0.5", pass: true },
          { k: "Moisture (%)", v: "6.4", spec: "5.0 – 7.0", pass: true },
          { k: "Brightness (ISO)", v: "86.8", spec: "≥ 84", pass: true },
          { k: "Tensile MD (N/m)", v: "148", spec: "≥ 135", pass: true },
          { k: "Caliper (µm)", v: "163", spec: "155 – 175", pass: true },
          { k: "Ash content (%)", v: "11.9", spec: "≤ 14", pass: true }
        ],
        footer: "આ material customer specification મુજબ manufacture અને test કરવામાં આવ્યું છે અને બધી requirements પૂરી કરે છે.\nInspected by: QC Manager, Jani Sales — Sarigam Plant"
      },
      postGen: "✓ MTC 12 seconds માં generate થઈ ગયું. QC signature માટે ready. English + Arabic versions available."
    },
    sourcing: {
      title: "Waste Paper — 14-દિવસ AI Forecast",
      subtitle: "8 vendors · 3 grades · price + delay + consistency signals",
      vendors: [
        { name: "Shakti Waste Papers", grade: "OCC A", lotScore: 94, priceRisk: "low", delayRisk: "low", state: "ok", note: "છેલ્લા 6 મહિના consistent. આવતા week PM1 માટે best option." },
        { name: "Gupta Traders", grade: "OCC B", lotScore: 71, priceRisk: "rising", delayRisk: "med", state: "watch", note: "છેલ્લા 30 દિવસમાં 3 lots target fibre length થી નીચે. Price 6% WoW ઉપર." },
        { name: "Mumbai Recyclers Pvt Ltd", grade: "Mixed", lotScore: 82, priceRisk: "low", delayRisk: "low", state: "ok", note: "Stable vendor. Sarigam PM2 માટે સારું." },
        { name: "Ganesh Paper Mart", grade: "OCC A", lotScore: 58, priceRisk: "rising", delayRisk: "high", state: "alert", note: "Shipment #4491 માં 4 દિવસ delay. Next order પર 9-દિવસ delay predicted." },
        { name: "Ahmedabad Fibre", grade: "OCC B", lotScore: 87, priceRisk: "low", delayRisk: "low", state: "ok", note: "જો Ganesh slip કરે તો strong alternative." },
        { name: "Surat Pulp Co.", grade: "Virgin Pulp", lotScore: 91, priceRisk: "low", delayRisk: "low", state: "ok", note: "Premium pricing stable. Tissue PM2 માટે સારું." }
      ],
      priceSeries: [
        { d: "Apr 5", p: 18.4 }, { d: "Apr 7", p: 18.6 }, { d: "Apr 9", p: 18.5 },
        { d: "Apr 11", p: 19.1 }, { d: "Apr 13", p: 19.4 }, { d: "Apr 15", p: 19.8 },
        { d: "Apr 17", p: 20.2 }, { d: "Apr 19", p: 20.5 }
      ],
      aiBrief: "OCC A price 14 દિવસમાં 11% વધ્યો — trend ચાલુ છે. ત્રણ signals બતાવે છે કે April end સુધીમાં 4–6% વધુ વધશે. Recommendation: આ week May requirement નો 60% Shakti Waste Papers થી front-load કરો. Ganesh Paper Mart ને આવતા 3 weeks avoid કરો.",
      applyAction: "Purchase recommendation બનાવો"
    }
  }
};

// ─── MODULE METADATA ──────────────────────────────────────────
const MODULE_KEYS = ["copilot", "quality", "dispatch", "docs", "sourcing"];
const MODULE_ICONS = {
  copilot: "💬",
  quality: "🛡️",
  dispatch: "🚚",
  docs: "📄",
  sourcing: "🔍"
};

// ═══════════════════════════════════════════════════════════════
// MODULE 1: PAPEROPS COPILOT
// ═══════════════════════════════════════════════════════════════
function CopilotModule({ t }) {
  const [msgs, setMsgs] = useState([]);
  const [typing, setTyping] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [msgs, typing]);

  const ask = (i) => {
    if (typing) return;
    setMsgs((p) => [...p, { role: "user", text: t.sop.suggestions[i] }]);
    setTyping(true);
    setTimeout(() => {
      setMsgs((p) => [...p, { role: "ai", text: t.sop.answers[i] }]);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const reset = () => { setMsgs([]); setTyping(false); };

  return (
    <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.line}`, overflow: "hidden" }}>
      {/* Chat area */}
      <div ref={ref} style={{ minHeight: 320, maxHeight: 460, overflowY: "auto", padding: 20, background: "#FBFCFA" }}>
        {msgs.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted, fontSize: 14, fontStyle: "italic" }}>
            👆 {t.sop.intro}
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 12,
            animation: "slideUp 0.3s ease"
          }}>
            <div style={{
              maxWidth: "82%",
              padding: "12px 16px",
              borderRadius: 14,
              fontSize: 14,
              lineHeight: 1.65,
              whiteSpace: "pre-wrap",
              ...(m.role === "user"
                ? { background: C.forest, color: "#fff", borderBottomRightRadius: 4 }
                : { background: C.cream, color: C.charcoal, border: `1px solid ${C.amberBd}`, borderBottomLeftRadius: 4 })
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", gap: 4, padding: "8px 14px", animation: "slideUp 0.3s ease" }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: C.kraft, animation: "pulse 1.2s infinite" }} />
            <span style={{ width: 8, height: 8, borderRadius: 4, background: C.kraft, animation: "pulse 1.2s infinite 0.2s" }} />
            <span style={{ width: 8, height: 8, borderRadius: 4, background: C.kraft, animation: "pulse 1.2s infinite 0.4s" }} />
          </div>
        )}
      </div>

      {/* Suggestion chips */}
      <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.line}`, background: C.white, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {t.sop.suggestions.map((s, i) => (
          <button key={i} onClick={() => ask(i)} disabled={typing} style={{
            padding: "8px 14px", fontSize: 12.5, fontWeight: 500,
            background: C.white, color: C.forest,
            border: `1px solid ${C.forest}`, borderRadius: 20,
            cursor: typing ? "not-allowed" : "pointer", opacity: typing ? 0.5 : 1,
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => !typing && (e.currentTarget.style.background = C.forest, e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.white, e.currentTarget.style.color = C.forest)}>
            {s}
          </button>
        ))}
        {msgs.length > 0 && (
          <button onClick={reset} style={{
            padding: "8px 14px", fontSize: 12, color: C.muted,
            background: "transparent", border: `1px solid ${C.line}`, borderRadius: 20, cursor: "pointer"
          }}>
            ↺
          </button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODULE 2: REEL QUALITY AI
// ═══════════════════════════════════════════════════════════════
function QualityModule({ t }) {
  const [phase, setPhase] = useState("idle");
  const [scanLine, setScanLine] = useState(0);

  const startScan = () => {
    setPhase("scanning"); setScanLine(0);
    let line = 0;
    const iv = setInterval(() => {
      line += 3;
      setScanLine(line);
      if (line >= 100) { clearInterval(iv); setTimeout(() => setPhase("done"), 300); }
    }, 50);
  };

  const reset = () => { setPhase("idle"); setScanLine(0); };

  const check = (p) => {
    if (p.min !== null && p.val < p.min) return false;
    if (p.max !== null && p.val > p.max) return false;
    return true;
  };

  return (
    <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.line}`, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", background: C.forestDk, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, color: C.kraftL, textTransform: "uppercase" }}>{t.quality.title}</div>
          <div style={{ fontSize: 12.5, marginTop: 4, opacity: 0.85 }}>{t.quality.grade}  ·  {t.quality.runtime}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: "#10B981", animation: "pulse 1.5s infinite" }} />
          <span style={{ fontSize: 11, color: "#A7F3D0", fontWeight: 600 }}>RUNNING</span>
        </div>
      </div>

      {phase === "idle" && (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 54, marginBottom: 14 }}>📜</div>
          <div style={{ fontSize: 14, color: C.muted, marginBottom: 20, maxWidth: 420, margin: "0 auto 20px" }}>
            Tap to read live sensor values, lab data, and run parameters for this reel.
          </div>
          <button onClick={startScan} style={{
            padding: "12px 28px", fontSize: 14, fontWeight: 600,
            background: C.forest, color: "#fff",
            border: "none", borderRadius: 10, cursor: "pointer"
          }}>
            {t.quality.scan} →
          </button>
        </div>
      )}

      {phase === "scanning" && (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>{t.quality.scanning}</div>
          <div style={{ maxWidth: 420, margin: "0 auto", height: 8, background: C.lineSoft, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${scanLine}%`, height: "100%", background: C.kraft, transition: "width 0.1s" }} />
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>{Math.floor(scanLine)}%</div>
        </div>
      )}

      {phase === "done" && (
        <div style={{ padding: 20, animation: "slideUp 0.4s ease" }}>
          {/* AI verdict banner */}
          <div style={{ padding: "14px 16px", background: C.amberBg, border: `1px solid ${C.amberBd}`, borderRadius: 10, marginBottom: 16, borderLeft: `4px solid ${C.amber}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.amber, marginBottom: 6, letterSpacing: 0.5 }}>{t.quality.resultWarn}</div>
            <div style={{ fontSize: 13.5, color: C.charcoal, lineHeight: 1.6 }}>{t.quality.aiVerdict}</div>
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {t.quality.actions.map((a, i) => (
                <button key={i} style={{
                  padding: "6px 12px", fontSize: 11.5, fontWeight: 600,
                  background: "#fff", color: C.amber,
                  border: `1px solid ${C.amberBd}`, borderRadius: 6, cursor: "pointer"
                }}>{a}</button>
              ))}
            </div>
          </div>

          {/* Parameter grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 16 }}>
            {t.quality.params.map((p, i) => {
              const ok = check(p);
              return (
                <div key={i} style={{
                  padding: "12px 14px", background: ok ? C.greenBg : C.redBg,
                  borderRadius: 8, border: `1px solid ${ok ? C.greenBd : C.redBd}`,
                  borderLeft: `3px solid ${ok ? C.green : C.red}`
                }}>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 3 }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: ok ? C.green : C.red }}>{p.val}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>{p.unit}</span>
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>
                    Spec: {p.min ?? "—"} to {p.max ?? "—"} · {p.trend}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Impact */}
          <div style={{ padding: "12px 14px", background: C.greenBg, borderRadius: 8, border: `1px solid ${C.greenBd}`, marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.green, marginBottom: 4 }}>💰  AI IMPACT</div>
            <div style={{ fontSize: 13, color: C.charcoal, lineHeight: 1.55 }}>{t.quality.impact}</div>
          </div>

          <button onClick={reset} style={{
            padding: "8px 16px", fontSize: 12, color: C.muted,
            background: "transparent", border: `1px solid ${C.line}`, borderRadius: 8, cursor: "pointer"
          }}>
            ↺ {t.reset}
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODULE 3: DISPATCH & ETA ENGINE
// ═══════════════════════════════════════════════════════════════
function DispatchModule({ t }) {
  const [applied, setApplied] = useState(false);
  const [orders, setOrders] = useState(t.dispatch.orders);

  // Sync when language changes
  useEffect(() => {
    setOrders(t.dispatch.orders);
    setApplied(false);
  }, [t]);

  const stateStyle = (s) => ({
    ok: { bg: C.greenBg, bd: C.greenBd, dot: C.green, label: "ON TRACK" },
    risk: { bg: C.amberBg, bd: C.amberBd, dot: C.amber, label: "AT RISK" },
    alert: { bg: C.redBg, bd: C.redBd, dot: C.red, label: "CRITICAL" }
  }[s]);

  const confBar = (n) => n >= 80 ? C.green : n >= 60 ? C.amber : C.red;

  const applyFix = () => {
    setOrders((prev) =>
      prev.map((o) => o.id === "JS-1861"
        ? { ...o, conf: 86, state: "ok", note: "6 MT transferred from Panchkula. On track." }
        : o
      )
    );
    setApplied(true);
  };

  return (
    <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.line}`, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", background: C.forestDk, color: "#fff" }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, color: C.kraftL, textTransform: "uppercase" }}>{t.dispatch.title}</div>
        <div style={{ fontSize: 12.5, marginTop: 4, opacity: 0.85 }}>{t.dispatch.subtitle}</div>
      </div>

      {/* AI summary */}
      <div style={{ padding: 16, background: applied ? C.greenBg : C.amberBg, borderBottom: `1px solid ${applied ? C.greenBd : C.amberBd}` }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ fontSize: 22, lineHeight: 1 }}>{applied ? "✅" : "⚡"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: applied ? C.green : C.amber, marginBottom: 4, letterSpacing: 0.5 }}>AI BRIEF</div>
            <div style={{ fontSize: 13.5, color: C.charcoal, lineHeight: 1.6 }}>
              {applied ? "Recommendation applied. Sri Lanka order back on track. Confidence lifted to 86%." : t.dispatch.aiSummary}
            </div>
            {!applied && (
              <button onClick={applyFix} style={{
                marginTop: 10, padding: "7px 14px", fontSize: 12, fontWeight: 600,
                background: C.forest, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer"
              }}>
                {t.dispatch.act} →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div style={{ padding: 12, overflowX: "auto" }}>
        <div style={{ minWidth: 760 }}>
          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "90px 1.8fr 1.4fr 0.7fr 1fr 1fr 0.9fr", gap: 10, padding: "8px 12px", fontSize: 10.5, fontWeight: 700, color: C.muted, letterSpacing: 0.8, textTransform: "uppercase" }}>
            <div>Order</div><div>Customer</div><div>Grade / Qty</div><div>Loc</div><div>{t.dispatch.promise}</div><div>{t.dispatch.etaCol}</div><div>{t.dispatch.confidence}</div>
          </div>
          {orders.map((o, i) => {
            const st = stateStyle(o.state);
            return (
              <div key={o.id} style={{
                display: "grid", gridTemplateColumns: "90px 1.8fr 1.4fr 0.7fr 1fr 1fr 0.9fr",
                gap: 10, padding: "12px", fontSize: 12.5,
                background: i % 2 === 0 ? "#fff" : "#FAFBFA",
                borderLeft: `3px solid ${st.dot}`,
                borderBottom: `1px solid ${C.lineSoft}`,
                alignItems: "center",
                animation: "slideUp 0.3s ease"
              }}>
                <div style={{ fontWeight: 700, color: C.forest, fontSize: 12 }}>{o.id}</div>
                <div>
                  <div style={{ fontWeight: 600, color: C.charcoal }}>{o.customer}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{o.note}</div>
                </div>
                <div>
                  <div style={{ color: C.charcoal, fontSize: 12 }}>{o.grade}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{o.qty}</div>
                </div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{o.loc}</div>
                <div style={{ color: C.charcoal }}>{o.promise}</div>
                <div style={{ color: C.charcoal, fontWeight: 600 }}>{o.eta}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, height: 6, background: C.lineSoft, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${o.conf}%`, height: "100%", background: confBar(o.conf), transition: "width 0.6s" }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: confBar(o.conf), minWidth: 28 }}>{o.conf}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODULE 4: CERTIFICATE & DOC AI
// ═══════════════════════════════════════════════════════════════
function DocsModule({ t }) {
  const [phase, setPhase] = useState("idle");
  const [step, setStep] = useState(0);

  const start = () => {
    setPhase("generating"); setStep(0);
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= t.docs.steps.length) {
        clearInterval(iv);
        setTimeout(() => setPhase("done"), 400);
      }
    }, 700);
  };

  const reset = () => { setPhase("idle"); setStep(0); };

  return (
    <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.line}`, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", background: C.forestDk, color: "#fff" }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, color: C.kraftL, textTransform: "uppercase" }}>{t.docs.title}</div>
        <div style={{ fontSize: 12.5, marginTop: 4, opacity: 0.85 }}>{t.docs.subtitle}</div>
      </div>

      {phase === "idle" && (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 54, marginBottom: 14 }}>📄</div>
          <div style={{ fontSize: 14, color: C.muted, marginBottom: 20, maxWidth: 460, margin: "0 auto 20px" }}>
            AI will pull production, QA, and batch data — then generate a ready-to-sign MTC.
          </div>
          <button onClick={start} style={{
            padding: "12px 28px", fontSize: 14, fontWeight: 600,
            background: C.forest, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer"
          }}>
            {t.docs.gen} →
          </button>
        </div>
      )}

      {phase === "generating" && (
        <div style={{ padding: "30px 24px" }}>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 18, textAlign: "center" }}>{t.docs.generating}</div>
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            {t.docs.steps.map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
                opacity: i < step ? 1 : i === step ? 0.8 : 0.3,
                transition: "opacity 0.3s"
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 11,
                  background: i < step ? C.green : i === step ? C.kraft : C.lineSoft,
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700,
                  animation: i === step ? "pulse 1.2s infinite" : "none"
                }}>{i < step ? "✓" : i + 1}</div>
                <div style={{ fontSize: 13, color: C.charcoal }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === "done" && (
        <div style={{ padding: 20, animation: "slideUp 0.4s ease" }}>
          {/* Success banner */}
          <div style={{ padding: "10px 14px", background: C.greenBg, border: `1px solid ${C.greenBd}`, borderRadius: 8, marginBottom: 16, fontSize: 13, color: C.green, fontWeight: 600 }}>
            {t.docs.postGen}
          </div>

          {/* MTC document */}
          <div style={{
            background: "#fff", padding: 24,
            border: `2px solid ${C.forest}`, borderRadius: 6,
            fontFamily: "'Georgia', serif"
          }}>
            <div style={{ textAlign: "center", borderBottom: `2px solid ${C.forest}`, paddingBottom: 10, marginBottom: 14 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: C.kraft, fontWeight: 700 }}>JANI SALES PVT. LTD.</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.forest, margin: "6px 0", letterSpacing: 1 }}>{t.docs.mtc.header}</div>
              <div style={{ fontSize: 10, color: C.muted }}>Sarigam · Mumbai · Baddi · Panchkula</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12, color: C.charcoal, marginBottom: 16 }}>
              <div><b>{t.docs.mtc.cert}</b></div>
              <div style={{ textAlign: "right" }}><b>{t.docs.mtc.date}</b></div>
              <div>{t.docs.mtc.customer}</div>
              <div style={{ textAlign: "right" }}>{t.docs.mtc.qty}</div>
              <div style={{ gridColumn: "1/-1" }}>{t.docs.mtc.grade}</div>
              <div style={{ gridColumn: "1/-1" }}>{t.docs.mtc.order}</div>
            </div>

            {/* Test results table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              <thead>
                <tr style={{ background: C.cream }}>
                  <th style={{ padding: "8px 10px", textAlign: "left", border: `1px solid ${C.kraftL}`, fontSize: 11, color: C.forest }}>Property</th>
                  <th style={{ padding: "8px 10px", textAlign: "center", border: `1px solid ${C.kraftL}`, fontSize: 11, color: C.forest }}>Result</th>
                  <th style={{ padding: "8px 10px", textAlign: "center", border: `1px solid ${C.kraftL}`, fontSize: 11, color: C.forest }}>Spec</th>
                  <th style={{ padding: "8px 10px", textAlign: "center", border: `1px solid ${C.kraftL}`, fontSize: 11, color: C.forest }}>Pass</th>
                </tr>
              </thead>
              <tbody>
                {t.docs.mtc.tests.map((tr, i) => (
                  <tr key={i}>
                    <td style={{ padding: "7px 10px", border: `1px solid ${C.line}`, color: C.charcoal }}>{tr.k}</td>
                    <td style={{ padding: "7px 10px", border: `1px solid ${C.line}`, textAlign: "center", fontWeight: 600, color: C.forest }}>{tr.v}</td>
                    <td style={{ padding: "7px 10px", border: `1px solid ${C.line}`, textAlign: "center", color: C.muted }}>{tr.spec}</td>
                    <td style={{ padding: "7px 10px", border: `1px solid ${C.line}`, textAlign: "center", color: tr.pass ? C.green : C.red, fontWeight: 700 }}>{tr.pass ? "✓" : "✗"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 16, padding: "10px 0", borderTop: `1px solid ${C.line}`, fontSize: 11.5, color: C.muted, lineHeight: 1.65, whiteSpace: "pre-line", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              {t.docs.mtc.footer}
            </div>
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
            <button style={{ padding: "8px 14px", fontSize: 12, fontWeight: 600, background: C.forest, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>📥 Download PDF</button>
            <button style={{ padding: "8px 14px", fontSize: 12, fontWeight: 600, background: "#fff", color: C.forest, border: `1px solid ${C.forest}`, borderRadius: 6, cursor: "pointer" }}>🌐 Arabic version</button>
            <button onClick={reset} style={{ padding: "8px 14px", fontSize: 12, color: C.muted, background: "transparent", border: `1px solid ${C.line}`, borderRadius: 6, cursor: "pointer" }}>↺ {t.reset}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODULE 5: SOURCING RADAR
// ═══════════════════════════════════════════════════════════════
function SourcingModule({ t }) {
  const stateColor = (s) => ({ ok: C.green, watch: C.amber, alert: C.red }[s]);
  const stateBg = (s) => ({ ok: C.greenBg, watch: C.amberBg, alert: C.redBg }[s]);
  const stateBd = (s) => ({ ok: C.greenBd, watch: C.amberBd, alert: C.redBd }[s]);

  const { priceSeries } = t.sourcing;
  const minP = Math.min(...priceSeries.map(p => p.p));
  const maxP = Math.max(...priceSeries.map(p => p.p));
  const chartW = 560, chartH = 160, pad = 30;

  const pathD = priceSeries.map((pt, i) => {
    const x = pad + (i / (priceSeries.length - 1)) * (chartW - pad * 2);
    const y = chartH - pad - ((pt.p - minP) / (maxP - minP)) * (chartH - pad * 2);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  return (
    <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.line}`, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", background: C.forestDk, color: "#fff" }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, color: C.kraftL, textTransform: "uppercase" }}>{t.sourcing.title}</div>
        <div style={{ fontSize: 12.5, marginTop: 4, opacity: 0.85 }}>{t.sourcing.subtitle}</div>
      </div>

      {/* AI brief */}
      <div style={{ padding: 16, background: C.amberBg, borderBottom: `1px solid ${C.amberBd}` }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ fontSize: 22, lineHeight: 1 }}>📈</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.amber, marginBottom: 4, letterSpacing: 0.5 }}>AI PRICE FORECAST</div>
            <div style={{ fontSize: 13.5, color: C.charcoal, lineHeight: 1.6 }}>{t.sourcing.aiBrief}</div>
            <button style={{
              marginTop: 10, padding: "7px 14px", fontSize: 12, fontWeight: 600,
              background: C.forest, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer"
            }}>
              {t.sourcing.applyAction} →
            </button>
          </div>
        </div>
      </div>

      {/* Price chart */}
      <div style={{ padding: "20px 20px 10px", background: "#FBFCFA", borderBottom: `1px solid ${C.lineSoft}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: 0.8, marginBottom: 8, textTransform: "uppercase" }}>OCC A — 14-day trend (₹/kg)</div>
        <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="xMidYMid meet" style={{ maxWidth: 560 }}>
          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((f, i) => {
            const y = pad + f * (chartH - pad * 2);
            return <line key={i} x1={pad} y1={y} x2={chartW - pad} y2={y} stroke={C.lineSoft} strokeWidth="1" />;
          })}
          {/* Price line */}
          <path d={pathD} stroke={C.kraft} strokeWidth="2.5" fill="none" />
          {/* Area under */}
          <path d={`${pathD} L ${chartW - pad} ${chartH - pad} L ${pad} ${chartH - pad} Z`} fill={C.kraft} opacity="0.1" />
          {/* Dots */}
          {priceSeries.map((pt, i) => {
            const x = pad + (i / (priceSeries.length - 1)) * (chartW - pad * 2);
            const y = chartH - pad - ((pt.p - minP) / (maxP - minP)) * (chartH - pad * 2);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="3.5" fill={C.kraft} stroke="#fff" strokeWidth="1.5" />
                {(i === 0 || i === priceSeries.length - 1) && (
                  <text x={x} y={y - 10} fontSize="10" fill={C.forest} textAnchor="middle" fontWeight="700">₹{pt.p}</text>
                )}
                <text x={x} y={chartH - 8} fontSize="9" fill={C.muted} textAnchor="middle">{pt.d}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Vendor scorecard */}
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: 0.8, marginBottom: 10, textTransform: "uppercase" }}>Vendor scorecard</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
          {t.sourcing.vendors.map((v, i) => (
            <div key={i} style={{
              padding: 14, background: stateBg(v.state),
              border: `1px solid ${stateBd(v.state)}`, borderRadius: 10,
              borderLeft: `4px solid ${stateColor(v.state)}`,
              animation: `slideUp 0.3s ease ${i * 0.05}s both`
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.charcoal }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{v.grade}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: stateColor(v.state), lineHeight: 1 }}>{v.lotScore}</div>
                  <div style={{ fontSize: 9, color: C.muted, letterSpacing: 0.5 }}>LOT SCORE</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: C.charcoal, lineHeight: 1.5, margin: "8px 0" }}>{v.note}</div>
              <div style={{ display: "flex", gap: 6, fontSize: 10, flexWrap: "wrap" }}>
                <span style={{ padding: "3px 8px", background: "#fff", border: `1px solid ${stateBd(v.state)}`, borderRadius: 4, fontWeight: 600 }}>Price: {v.priceRisk}</span>
                <span style={{ padding: "3px 8px", background: "#fff", border: `1px solid ${stateBd(v.state)}`, borderRadius: 4, fontWeight: 600 }}>Delay: {v.delayRisk}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [lang, setLang] = useState("en");
  const [active, setActive] = useState("copilot");
  const [savings, setSavings] = useState(284736);
  const t = T[lang];

  useEffect(() => {
    const iv = setInterval(() => setSavings((p) => p + Math.floor(Math.random() * 85 + 25)), 2500);
    return () => clearInterval(iv);
  }, []);

  const RENDER = {
    copilot: <CopilotModule t={t} />,
    quality: <QualityModule t={t} />,
    dispatch: <DispatchModule t={t} />,
    docs: <DocsModule t={t} />,
    sourcing: <SourcingModule t={t} />
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(180deg, ${C.paperBg} 0%, #F3EEE5 100%)`,
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      color: C.charcoal
    }}>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        * { box-sizing: border-box; }
        body { margin: 0; }
        button:active { transform: scale(0.97); }
      `}</style>

      {/* TOP HEADER */}
      <div style={{
        background: C.forest,
        color: "#fff",
        padding: "14px 24px",
        borderBottom: `3px solid ${C.kraft}`
      }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.kraft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📜</div>
            <div>
              <div style={{ fontSize: 10.5, color: C.kraftL, fontWeight: 700, letterSpacing: 2 }}>{t.brand}</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>{t.appName}</div>
            </div>
          </div>

          {/* Language toggle */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: 3 }}>
            {[["en", "EN"], ["hi", "हि"], ["gu", "ગુ"]].map(([k, lbl]) => (
              <button key={k} onClick={() => setLang(k)} style={{
                padding: "6px 14px", fontSize: 13, fontWeight: 600, minWidth: 42,
                background: lang === k ? C.kraft : "transparent",
                color: lang === k ? "#fff" : "rgba(255,255,255,0.75)",
                border: "none", borderRadius: 6, cursor: "pointer", transition: "all 0.2s"
              }}>{lbl}</button>
            ))}
          </div>
        </div>
      </div>

      {/* SAVINGS TICKER */}
      <div style={{ background: C.forestDk, padding: "10px 24px", color: "#fff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: "#10B981", animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: 11, color: C.kraftL, fontWeight: 600, letterSpacing: 1 }}>{t.live}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>·  {t.savingsTicker}</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "'Georgia', serif" }}>
            ₹ {savings.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 24px 0" }}>
        <div style={{ fontSize: 15, color: C.muted, fontStyle: "italic", marginBottom: 16 }}>{t.appSub}</div>
      </div>

      {/* MODULE TABS */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px", display: "flex", gap: 8, flexWrap: "wrap", borderBottom: `1px solid ${C.line}` }}>
        {MODULE_KEYS.map((k) => (
          <button key={k} onClick={() => setActive(k)} style={{
            padding: "12px 18px",
            background: active === k ? C.white : "transparent",
            color: active === k ? C.forest : C.muted,
            border: "none",
            borderBottom: active === k ? `3px solid ${C.kraft}` : "3px solid transparent",
            fontSize: 13.5,
            fontWeight: active === k ? 700 : 500,
            cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            transition: "all 0.2s"
          }}>
            <span style={{ fontSize: 18 }}>{MODULE_ICONS[k]}</span>
            {t.modules[k].title}
          </button>
        ))}
      </div>

      {/* MODULE HEADER + CONTENT */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "22px 24px 60px" }}>
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.forest, margin: "0 0 4px", fontFamily: "'Georgia', serif" }}>{t.modules[active].title}</h2>
          <p style={{ fontSize: 14, color: C.muted, margin: "0 0 10px", lineHeight: 1.55, maxWidth: 780 }}>{t.modules[active].desc}</p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 12px", background: C.cream, border: `1px solid ${C.kraftL}`,
            borderRadius: 18, fontSize: 12, fontWeight: 700, color: C.kraft
          }}>💰 {t.modules[active].saving}</div>
        </div>

        {RENDER[active]}
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${C.line}`, padding: "18px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, fontSize: 12, color: C.muted }}>
          <div>ARQ ONE AI Labs  ·  Simulation for Jani Sales  ·  Not a live system</div>
          <div>arqoneailabs.space</div>
        </div>
      </div>
    </div>
  );
}
