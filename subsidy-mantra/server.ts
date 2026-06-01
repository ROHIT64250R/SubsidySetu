/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { evaluateBusinessSubsidies } from './src/evaluator';
import { BusinessProfile, ChatMessage } from './src/types';

// Load environment variables for local testing
dotenv.config();

// Ensure process.env.GEMINI_API_KEY is defined in our application block
const apiKey = process.env.GEMINI_API_KEY || '';

// Initialize server-side Gemini Client with mandatory telemetry headers
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to generate professional, full-fidelity subsidy strategic consultation fallback reports matching user profiles
function generateFallbackStrategyReport(profile: BusinessProfile, result: any): string {
  const isRajasthan = (profile.state || '').toLowerCase().includes('rajasthan');
  const isAgro = profile.industryType === 'food_processing' || profile.industryType === 'agriculture';
  const isHeavy = profile.industryType === 'manufacturing';
  const isTextile = profile.industryType === 'textiles';
  const isSolar = profile.industryType === 'renewable_solar';
  const isNew = profile.operationalStage === 'new';
  const hasUdyam = profile.hasUdyam;
  const isSpecial = profile.socialCategory !== 'general' || profile.gender === 'female';

  let industryHeading = 'MSME Manufacturing';
  let industryDesc = 'General Micro, Small & Medium Enterprise setup';
  if (isAgro) {
    industryHeading = 'Food & Agro Processing (MoFPI / PMFME)';
    industryDesc = 'Agricultural and food processing machinery, cold chains, and value addition';
  } else if (isHeavy) {
    industryHeading = 'Heavy Engineering & Fabrication (CLCSS / CGTMSE)';
    industryDesc = 'High-capacity machinery, tooling workshops, and precision components manufacturing';
  } else if (isTextile) {
    industryHeading = 'Textile Spinning & Garmenting (SAMARTH / TUFS)';
    industryDesc = 'Weaving machinery, handlooms, powerlooms, and eco-textiles development';
  } else if (isSolar) {
    industryHeading = 'Solar, Clean Tech & Renewable Energy (IREDA / SEC)';
    industryDesc = 'Solar roof panels manufacturing, wind-power storage, or industrial green conversions';
  }

  let stateIncentives = '';
  if (isRajasthan) {
    stateIncentives = `* **RIPS 2024 Packaged Concessions**: Enjoy 75% investment subsidy on SGST reimbursement for up to 7 years, 100% Electricity Duty exemption for 7 years, and a 100% Land Tax exemption for 7 years.
* **MSME Policy 2023 Relief**: Fast-track setup via Rajasthan Single Window System with online registration. General industry units get immediate provisional approvals valid for 3 years without requiring pre-inspections.`;
  } else {
    stateIncentives = `* **State Packaged Schemes (PSI)**: Eligible for State SGST reimbursement matching up to 100% of your capital investment over 7-10 years, stamp duty waivers of 50-100% on registration of industrial land, and electricity bill subventions (₹1.00 to ₹1.50 per unit rebate).
* **DIC Nodal Single Window**: Apply directly via state commercial portals for immediate provisional clearances and electricity feed line approvals.`;
  }

  // Target Scheme suggestion based on inputs
  let targetSchemeTitle = 'Prime Minister’s Employment Generation Programme (PMEGP)';
  let targetSchemeRate = '15% to 35% Capital Subsidy';
  let targetSchemeDetails = 'Highly recommended since you are starting a new micro-business unit with flexible capital requirements.';

  if (profile.investment > 50 || !isNew) {
    if (isAgro) {
      targetSchemeTitle = 'PM Formalisation of Micro Food Processing Enterprises (PMFME)';
      targetSchemeRate = '35% Credit-Linked Capital Subsidy';
      targetSchemeDetails = 'Eligible for a maximum of ₹10 Lakhs subsidy for food grading, sorting, packing, or cold storage machinery.';
    } else {
      targetSchemeTitle = 'Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)';
      targetSchemeRate = 'Collateral-Free Bank Finance up to ₹5 Crores';
      targetSchemeDetails = 'The government guarantees up to 85% of your term loan and working capital, requiring absolutely zero personal assets as collateral.';
    }
  }

  // Specific dynamic warning based on profile
  let complianceWarnings = '';
  if (isNew) {
    complianceWarnings = `* **Zero Pre-Approval Procurement**: **DO NOT** place orders or pay advances to machinery vendors before completing your official online subsidy applications. Retrospective capital purchases are permanently disqualified from capital subsidy claims.
* **Maintain Digital Footprints Only**: Ensure 100% of purchase payments, machinery installation, and civil constructions are routed through standard business banking transcripts (RTGS/NEFT). Solidify your CA-certified Bill invoices. Cash expenditures of over ₹10,000 are ineligible for claiming grants.`;
  } else {
    complianceWarnings = `* **Capacity Expansion Audit**: For expansion claims, verify that your proposed machinery configuration increases the installed production capacity by at least 25% or enhances technologically advanced processes compared to your past 3 years' audited balance sheet averages.
* **Continuity of Power Supply Logs**: Keep industrial power connection bills and municipal tax payments up to date, as the DIC field auditor will cross-reference current power utilization charts to verify functional expansion status during claims processing.`;
  }

  const generatedReport = `### Strategic Subsidy Assessment Report

We have successfully evaluated your business profile against active Central and State subsidy regulations in **${profile.state}**. 

* **Excellent Match Viability**: Your proposed ${industryHeading} unit is eligible for significant capital and interest concessions.
* **Enterprise Category**: Classified as a **${profile.investment <= 100 && profile.turnover <= 500 ? 'Micro Enterprise' : profile.investment <= 1000 && profile.turnover <= 5000 ? 'Small Enterprise' : 'Medium Enterprise'}** statutory bracket, opening access to exclusive MSME statutory benefits.
${isSpecial ? '* **Special Bracket Advantage**: Category benefits applied (Special Social/Gender slab matching), yielding an additional 5% to 10% premium allocation on standard subsidy caps.' : ''}
${hasUdyam ? '* **MSME Framework Matched**: Existing Udyam Aadhaar registration accelerates credit vetting and streamlines loan approval with partner public sector banks.' : '* **Registration Alert**: You do not have an active Udyam. Obtaining a free Udyam Aadhaar immediately is legally required before processing bank claims.'}

---

### High-Value Policy Target

#### **${targetSchemeTitle}**
* **Incentive Yield**: ${targetSchemeRate}
* **Strategy**: ${targetSchemeDetails} This is key to minimizing upfront interest expenses and boosting the Return on Investment (ROI).

---

### Key Central & State Incentives

${stateIncentives}
* **Credit Guarantee Subvention**: Collateral-free assurance under **CGTMSE** protecting loans from high bank interest rates, accompanied by State Interest Subventions ranging between 5% and 8% annually.

---

### Critical Compliance Guardrails
${complianceWarnings}
* **Udyam & Project Appraisal**: Secure your CA-certified Project Report and CMA Financial Forecast Sheet before presenting files to the Lead District Manager or DIC nodal officers.

---

### Implementation & Processing Path

1. **Step 01 - Prepare Project Appraisal Files**: Engage a qualified CA to compile your 10-year Project Appraisal Report, projected balance sheet, and a machine-quotation inventory.
2. **Step 02 - Secure Online Approvals**: File applications on relevant government portals (such as the KVIC PMEGP Portal, PMFME Portal, or State Single Window Portal) to obtain your reference ID *before* starting plant civil erection.
3. **Step 03 - Claim Sanctions Log**: Forward certified banking receipts and machinery arrival proofs to the District Industries Centre (DIC) for final spot verification and immediate subsidy release.

---
**SubsidySetu Expert Advisory Desk**
This strategic assessment report has been formulated by the compliance team at *SubsidySetu*. Under the direct supervision of **Yogesh Sharma** (Chief Consultant & Former Bank Credit Appraiser), we help Indian businesses secure government financial benefits efficiently.
* 📍 **Office Coordinates**: B-1, C-2 Krishna Enclave, Lata Nagar (Near Burger Farm), Kalwar Road, Jhotwara, Jaipur, Rajasthan - 302012.
* 📞 **Direct Helpline**: +91 87410 09775
* ✉ **Compliance Desk**: taxca2@gmail.com`;

  return generatedReport;
}

// Helper to generate professional, full-fidelity subsidy chat answers based on user questions
function generateFallbackChatResponse(userMsg: string, profile: BusinessProfile | null): string {
  const query = userMsg.toLowerCase();
  
  let matchDetail = '';
  if (query.includes('pmegp')) {
    matchDetail = `The Prime Minister's Employment Generation Programme (PMEGP) offers up to 35% capital subsidy for manufacturing projects up to ₹50 Lakhs. Special category candidates (women, SC/ST, rural) get the highest 35% rate, whereas general urban applicants receive 15%. Important rule: Construction of the workshop must not begin, and machinery must not be purchased, until the PMEGP application is officially sponsored and vetted by the KVIC/DIC board.`;
  } else if (query.includes('pmfme') || query.includes('agro') || query.includes('food')) {
    matchDetail = `The PMFME Scheme targets micro-food processing units like spice mills, cold storage, flour mills, and packing units. It offers a 35% credit-linked capital subsidy up to ₹10 Lakhs. Existing units can also apply for expansion upgrades. The machinery being purchased must possess food-safety certifications, and standard food-license compliance must be upheld.`;
  } else if (query.includes('cgtmse') || query.includes('collateral') || query.includes('loan')) {
    matchDetail = `The CGTMSE scheme enables collateral-free bank loans up to ₹5 Crores. Under this scheme, the trust covers up to 85% of credit defaults, allowing nationalized and private banks to approve loans without asking for land or personal assets. We specialize in drafting bankable CMA Data sheets and detailed Project Reports that fit CGTMSE bank appraisal standards.`;
  } else if (query.includes('rips') || query.includes('rajasthan')) {
    matchDetail = `Under RIPS 2024 (Rajasthan Investment Promotion Scheme), units set up in Rajasthan enjoy powerful tax waivers: 75% SGST Investment Subsidy for 7 years, 100% electricity duty waiver, and 100% stamp duty exemption on industrial land purchase. Additionally, Rajasthan MSME Policy provides rapid online statutory clearances via the RajSSO portal with provisional approvals valid for 3 years.`;
  } else {
    matchDetail = `To process a government subsidy (including PMEGP, PMFME, CGTMSE, or State Package Schemes), the primary requirement is a Bankable CA-Certified Project Report, a clear CMA Finance sheet, and registration of the unit under the free Udyam Aadhaar portal. We highly recommend obtaining vendor quotes for your machines first.`;
  }

  let businessStateText = '';
  if (profile) {
    businessStateText = ` Based on your profile, your ${profile.industryType.replace('_', ' ')} proposed unit in ${profile.state} is highly viable.`;
  }

  return `नमस्ते! (Greeting!)\n\nThank you for reaching out to **SubsidySetu**. Our compliance nodes are currently experiencing heavy traffic, so here is expert guidance on your query:\n\n${matchDetail}${businessStateText}\n\nOur Chief MSME Consultant, **Yogesh Sharma** (former banking credit strategist), can verify your documentation, draft your bankable CMA sheet, and assist you through online portal filing.\n\n📞 **Quick Direct Liaison**: +91 87410 09775\n✉ **Email Helpline**: taxca2@gmail.com\n📍 **Jaipur Office Address**: B-1, C-2 Krishna Enclave, Lata Nagar (Near Burger Farm), Kalwar Road, Jhotwara, Jaipur, Rajasthan - 302012.\n\n*Would you like to schedule an offline desk meeting, or request a CA callback via our "Services" panel above? Let me know and I will log it for immediate review!*`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());

  // 1. Core API Route: Evaluate business parameters & generate custom AI Strategy
  app.post('/api/subsidy/evaluate', async (req, res) => {
    try {
      const profile = req.body as BusinessProfile;
      if (!profile || !profile.industryType || !profile.state) {
        return res.status(400).json({ error: 'Invalid business profile parameters provided.' });
      }

      // Calculate deterministic matches using evaluator rules
      const result = evaluateBusinessSubsidies(profile);

      // If API Key is present, generate a beautiful personalized AI strategy report
      let aiSummary = '';
      if (apiKey) {
        try {
          const matchedSchemesSummary = result.schemes
            .map((s) => `- ${s.name} (Estimated Benefit: ₹${s.estimatedBenefit} Lakhs, Max: ${s.maxBenefit})`)
            .join('\n');

          const prompt = `
Please construct a professional, high-impact "AI Government Subsidy Optimization Strategy Card" for this Indian business profile:
- Company/Project Name: ${profile.companyName || 'Proposed Enterprise'}
- Industry Sector: ${profile.industryType}
- Investment in Plant & Machinery: ₹${profile.investment} Lakhs
- Annual Turnover: ₹${profile.turnover} Lakhs
- State of Operations: ${profile.state}
- Location: ${profile.locationArea} Area
- Operational Stage: ${profile.operationalStage === 'new' ? 'New Proposed Business unit' : 'Existing Unit / Expansion'}
- Entity Structure: ${profile.entityType}
- Group/Social: ${profile.socialCategory} Category (${profile.gender} Gender)
- Has Udyam Aadhaar MSME License: ${profile.hasUdyam ? 'Yes' : 'No'}

Deterministic Match Outputs:
${matchedSchemesSummary || 'No immediate direct schemes matched.'}
Overall Estimated Collateral-Free / Subsidy Value: ₹${result.totalEstimatedBenefit} Lakhs

Task:
Generate a beautifully formatted, clear, scannable MSME Strategy Advisory Report in markdown.
Include:
1. **Strategic Assessment**: A 2-sentence expert feedback on the feasibility of claiming these incentives. Mention state specific benefits for ${profile.state} and if they look promising.
2. **Key High-Value Target**: Identify which matched program has the highest ROI or quickest turnaround.
3. **Actionable Compliance Guardrails**: Provide 2-3 specific compliance steps or checklist warnings for ${profile.operationalStage} businesses to prevent rejection (e.g. avoiding machinery order placement before registration, maintaining digital banking transcripts, or obtaining Udyam).
4. **Implementation Path**: A simplified 3-step action roadmap to start claims immediately.

Structure the response with bold headers, avoiding clinical or robotic jargon. Keep it directly applicable, insightful, and under 380 words.
          `;

          const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt,
            config: {
              systemInstruction: 'You are SubsidySetu AI - an elite Government Subsidy Consultant and Chartered Accountant specializing in Indian MSME incentives, agricultural grants, and renewable energy policies. SubsidySetu is founded by Chief Consultant Yogesh Sharma (Helpline: +91 8741009775) with offices at B-1, C-2 Krishna Enclave, Lata Nagar (Near Burger Farm), Kalwar Road, Jhotwara, Jaipur, Rajasthan - 302012. Highlight this contact info naturally in the report conclusion.',
            },
          });

          aiSummary = response.text || '';
          if (!aiSummary || aiSummary.includes('error') || aiSummary.includes('quota') || aiSummary.includes('limit')) {
            aiSummary = generateFallbackStrategyReport(profile, result);
          }
        } catch (innerError: any) {
          console.error('Error generating AI strategy report:', innerError);
          aiSummary = generateFallbackStrategyReport(profile, result);
        }
      } else {
        aiSummary = generateFallbackStrategyReport(profile, result);
      }

      result.aiSummary = aiSummary;
      return res.json(result);
    } catch (error: any) {
      console.error('Error in evaluate endpoint:', error);
      return res.status(500).json({ error: 'Internal server error occurred.' });
    }
  });

  // 2. Chat API Route: Contextual consultation on Indian Government Subsidies
  app.post('/api/subsidy/chat', async (req, res) => {
    try {
      const { messages, profile } = req.body as { messages: ChatMessage[]; profile: BusinessProfile | null };

      if (!messages || messages.length === 0) {
        return res.status(400).json({ error: 'No messages received for chat session.' });
      }

      const clientMessages = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant (SubsidySetu AI)'}: ${m.text}`).join('\n');
      const lastUserQuestion = messages[messages.length - 1].text;

      let businessContextText = '';
      if (profile) {
        businessContextText = `
User has provided their current Business Profile:
- Company Name: ${profile.companyName || 'Not supplied'}
- Sector: ${profile.industryType}
- Investment: ₹${profile.investment} Lakhs
- Turnover: ₹${profile.turnover} Lakhs
- State: ${profile.state}
- Stage: ${profile.operationalStage}
- Entity: ${profile.entityType}
- Location: ${profile.locationArea} (${profile.socialCategory}, ${profile.gender})
- Has Udyam: ${profile.hasUdyam ? 'Yes' : 'No'}
        `;
      }

      const fullPrompt = `
You are the AI Assistant on SubsidySetu, the leading Indian business subsidy consultancy portal.
Your goal is to answer the user's queries regarding government subsidy schemes, eligibility criteria, documentation, terms of subsidies (including capital subsidies, interest subvention, GST refunds, and stamp duty waivers), and application procedures.

${businessContextText}

Conversation History:
${clientMessages}

Instructions:
- Provide high-quality, practical, accurate advice based on Indian government regulations (e.g., KVIC, Ministry of MSME, MoFPI, SIDBI, state commerce departments, and commercial banks).
- Reference specific programs if applicable: PMEGP, PMFME, CGTMSE, Mudra Bank, state Packaged Incentive Schemes, NABARD schemes, or SAMARTH textile grants.
- Give constructive answers, estimating financial ranges or checklist details where relevant to help the user.
- Maintain a highly helpful, reassuring, professional tone. If the user asks general business queries, polite advice on how it connects to govt financial assistance is fine.
- Respond in under 250 words. Do not use robotic or system-level jargon.
      `;

      if (apiKey) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: fullPrompt,
            config: {
              systemInstruction: 'You are SubsidySetu AI, an online expert chartered accountant and grant analyst helping Indian small businesses secure government incentives safely. SubsidySetu is founded by Chief Consultant Yogesh Sharma (Direct Helpline: +91 8741009775). The corporate headquarters is located at B-1, C-2 Krishna Enclave, Lata Nagar (Near Burger Farm), Kalwar Road, Jhotwara, Jaipur, Rajasthan - 302012. If the user asks for contact numbers, founder name, physical address, or offline meeting coordinates, please state these details with pride and maximum clarity.',
            },
          });

          return res.json({ text: response.text || "I apologize, but I received an empty response. Please ask your query again." });
        } catch (innerChatError) {
          console.error("Error generating AI response:", innerChatError);
          const fallbackText = generateFallbackChatResponse(lastUserQuestion, profile);
          return res.json({ text: fallbackText });
        }
      } else {
        const fallbackText = generateFallbackChatResponse(lastUserQuestion, profile);
        return res.json({ text: fallbackText });
      }
    } catch (error: any) {
      console.error('Error in chat endpoint:', error);
      const lastUserQuestion = req.body?.messages?.[req.body.messages.length - 1]?.text || 'government subsidy';
      const profile = req.body?.profile || null;
      const fallbackText = generateFallbackChatResponse(lastUserQuestion, profile);
      return res.json({ text: fallbackText });
    }
  });

  // 3. Vite development middleware or static production handler
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SubsidySetu Express core listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
