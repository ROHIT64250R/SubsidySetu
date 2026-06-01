/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BusinessProfile, SubsidyScheme, EvaluationResult } from './types';

export function evaluateBusinessSubsidies(profile: BusinessProfile): EvaluationResult {
  const schemes: SubsidyScheme[] = [];
  const {
    industryType,
    investment, // INR Lakhs
    turnover, // INR Lakhs
    state,
    entityType,
    locationArea,
    socialCategory,
    gender,
    operationalStage,
    hasUdyam,
    powerRequiredKw,
  } = profile;

  const isSpecialCategory =
    socialCategory !== 'general' || gender === 'female' || locationArea === 'rural';

  // 1. PMEGP (Prime Minister Employment Generation Programme)
  // Highly focused on new enterprises with limits on investment.
  if (operationalStage === 'new' && investment <= 50) {
    let eligible = true;
    let score = 90;
    const reasons: string[] = ['Applicable for newly proposed enterprise setups.'];
    const notEligible: string[] = [];

    // Manufacturing/Service limits
    let maxCost = 50; // default for manufacturing
    if (industryType === 'services' || industryType === 'it_tech') {
      maxCost = 20; // max ₹20 Lakhs for services
      reasons.push('Service/IT sector project limits recognized (Max PMEGP cost ₹20 Lakhs).');
    } else {
      reasons.push('Manufacturing project limits recognized (Max PMEGP cost ₹50 Lakhs).');
    }

    const applicableCost = Math.min(investment, maxCost);

    // Calculate subsidy percentage
    // Rural Special: 35%, Rural General: 25%, Urban Special: 25%, Urban General: 15%
    let percentage = 15;
    if (locationArea === 'rural') {
      percentage = isSpecialCategory ? 35 : 25;
    } else {
      percentage = isSpecialCategory ? 25 : 15;
    }

    const estimatedBenefit = (applicableCost * percentage) / 100;
    reasons.push(`Eligible for ${percentage}% capital subsidy based on Category, Gender & Location (${locationArea}).`);

    schemes.push({
      id: 'pmegp',
      name: 'Prime Minister Employment Generation Programme (PMEGP)',
      authority: 'Ministry of MSME / KVIC / State KVIB',
      description: 'Credit-linked subsidy program for setting up new micro-enterprises in manufacturing and services.',
      maxBenefit: `₹${industryType === 'services' || industryType === 'it_tech' ? '7' : '17.5'} Lakhs (${percentage}% of Project Cost)`,
      estimatedBenefit: parseFloat(estimatedBenefit.toFixed(2)),
      benefitFormula: `Project Cost (Max ₹${maxCost}L) × ${percentage}% subsidy rate`,
      eligibilityStatus: 'eligible',
      eligibilityScore: score,
      matchingReasons: reasons,
      documentChecklist: [
        'Detailed Project Report (DPR) / Business Plan',
        'Aadhaar Card & PAN Card',
        'Caste Certificate (if applying under SC/ST/OBC/Minority)',
        'Education Certificate (Minimum 8th standard pass for project > ₹5L in service / > ₹10L in manufacture)',
        'Rural Area Certificate signed by Gram Panchayat (if rural)',
        'Population Certificate of the location',
      ],
      applyProcedure: [
        'Apply online through KVIC PMEGP Portal (kviconline.gov.in).',
        'Fill out the entrepreneur profile and select sponsoring agency (DIC, KVIC, or KVIB).',
        'Upload your DPR, Caste Certificate, and photos.',
        'Submit to the agency; they forward it to the bank for sanctioning the loan.',
        'Bank releases the loan and requests the Margin Money (subsidy) from KVIC.',
      ],
    });
  }

  // 2. PMFME (Pradhan Mantri Formalisation of Micro Food Processing Enterprises)
  if (industryType === 'food_processing') {
    const reasons: string[] = ['Matches primary Food Processing sector criteria.'];
    const score = 85;
    // 35% of project cost up to max ₹10 Lakhs
    const rate = 35;
    const estimatedBenefit = Math.min((investment * rate) / 100, 10);
    reasons.push(`Matches standard food processing capital outlay. 35% subsidy calculated up to maximum limit of ₹10 Lakhs.`);

    schemes.push({
      id: 'pmfme',
      name: 'PM Formalisation of Micro Food Processing Scheme (PMFME)',
      authority: 'Ministry of Food Processing Industries (MoFPI) & State Nodal Agency',
      description: 'Provides financial, technical, and business support for the upgradation or establishment of micro food processing units under One District One Product (ODOP).',
      maxBenefit: '₹10.00 Lakhs (35% of eligible project cost)',
      estimatedBenefit: parseFloat(estimatedBenefit.toFixed(2)),
      benefitFormula: 'Investment Cost × 35% (Capped at ₹10 Lakhs)',
      eligibilityStatus: 'eligible',
      eligibilityScore: score,
      matchingReasons: reasons,
      documentChecklist: [
        'UDYAM Registration Certificate',
        'Project Report with Machinery details',
        'Invoices & Quotations from machinery suppliers',
        'Land possession proof or tenancy agreement',
        'FSSAI Licence copy / registration proof',
        'Bank statements for last 6 months (for existing units)',
      ],
      applyProcedure: [
        'Visit the PMFME portal managed by MoFPI.',
        'Register as an individual beneficiary.',
        'Select the district and your ODOP crop or general food processing activity.',
        'Fill out the application with DPR and financial projections.',
        'Appointed district resource persons (DRP) will assist in form verification and bank liaison.',
      ],
    });
  }

  // 3. CLCSS-type Tech Upgradation Support (Incentive for MSME Tech Upgradation)
  if (operationalStage === 'existing' && (industryType === 'manufacturing' || industryType === 'textiles')) {
    const score = 80;
    // 15% upfront capital subsidy on well-defined machinery purchases. Max loan of ₹1 Crore eligible, so max bonus is ₹15 Lakhs.
    const eligibleLoan = Math.min(investment * 0.8, 100); // assume loan of 80% of investment, max 100 Lakhs
    const estimatedBenefit = eligibleLoan * 0.15;
    const reasons = [
      'Applicable for technology upgradation of existing manufacturing/textile operations.',
      'Assuming institutional finance / term loan covering 80% of machinery investment.',
    ];

    schemes.push({
      id: 'clcss',
      name: 'Credit Linked Capital Subsidy for Tech Upgradation (CLCSS Tracker)',
      authority: 'Office of Development Commissioner, Ministry of MSME',
      description: 'Facilitates technology upgradation by providing a 15% capital subsidy for induction of well-established and approved technologies in specific MSME sub-sectors.',
      maxBenefit: '₹15.00 Lakhs (15% on machinery term loan up to ₹1 Crore)',
      estimatedBenefit: parseFloat(estimatedBenefit.toFixed(2)),
      benefitFormula: 'Expected Term Loan (80% of Investment) × 15% subsidy',
      eligibilityStatus: 'eligible',
      eligibilityScore: score,
      matchingReasons: reasons,
      documentChecklist: [
        'UDYAM MSME Registration Certificate',
        'Sanction letter for the Term Loan from SIDBI / scheduled public banks',
        'Proof of purchase of approved energy-efficient/modern machinery',
        'Physical Verification Report by Nodal Sponsoring Bank',
        'CA Certificate verifying investment in plant & machinery',
      ],
      applyProcedure: [
        'Avail term loan from a primary lending institution (PLI) using the approved list of machinery.',
        'The bank applies online on the CLCSS portal on behalf of the client.',
        'Uploaded documents and physical assets are verified by the nodal agencies.',
        'Subsidy is released and kept in a joint term deposit for a lock-in period of 3 years, after which it adjusts against your loan account.',
      ],
    });
  }

  // 4. CGTMSE Credit Guarantee Scheme
  if (investment > 0 && (industryType === 'manufacturing' || industryType === 'services' || industryType === 'it_tech' || industryType === 'textiles')) {
    // Collect 1.5% equivalent collateral benefit
    const estimatedBenefit = Math.min(investment * 0.8 * 0.05, 15); // Saved collateral and interest subvention equivalent value
    const reasons = [
      'Allows collateral-free bank loans for projects up to ₹5 Crore.',
      'Significant financial value unlocked by eliminating the cost and strain of mortgage collateral.',
    ];

    schemes.push({
      id: 'cgtmse',
      name: 'Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)',
      authority: 'SIDBI & Ministry of MSME',
      description: 'Provides credit guarantees to financial institutions to collateral-free and mortgage-free credit facilities to eligible micro and small enterprises.',
      maxBenefit: 'Collateral-free credit support up to ₹5.00 Crores',
      estimatedBenefit: parseFloat(estimatedBenefit.toFixed(2)),
      benefitFormula: 'Collateral Cost & Fee Waiver Equivalent (~4% of Loan amount)',
      eligibilityStatus: 'eligible',
      eligibilityScore: 92,
      matchingReasons: reasons,
      documentChecklist: [
        'UDYAM Registration Certificate',
        'Comprehensive Credit Proposal with detailed financials',
        'Income tax returns and audited balance sheet if applicable',
        'KYC of directors, partners or proprietor',
        'No-Objection Certificate (NOC) from existing lenders',
      ],
      applyProcedure: [
        'Approach a CGTMSE Member Lending Institution (MLI) - includes PSU banks, private banks, RRBs, and SIDBI.',
        'Submit business plan and apply for credit facility without offering external collateral.',
        'Bank evaluates the project viability and applies for CGTMSE coverage on their backend.',
        'Upon approval, bank sanctions the loan under the scheme protection.',
      ],
    });
  }

  // 5. PM-Surya Ghar Muft Bijli Yojana & Solar Incentives
  let hasSolarNeed = industryType === 'renewable_solar';
  if (powerRequiredKw && powerRequiredKw >= 3) {
    hasSolarNeed = true;
  }

  if (hasSolarNeed || investment >= 20) {
    // Approximate a commercial solar setup. Say 10 kW to 100 kW setup.
    // Benefit: Capital subsidy or accelerated depreciation (40%) and custom duty benefits
    const kwEstimate = powerRequiredKw || Math.min(Math.round(investment * 0.5), 100);
    const estimatedBenefit = Math.min((kwEstimate * 0.15), 15); // ₹15,000/kW assumed commercial benefit + tax depreciation value

    const reasons = [
      'Substantial electric/power requirements standard in industrial/agro processes.',
      'Access to accelerated depreciation (45%) on commercial solar equipment.',
    ];

    if (powerRequiredKw) {
      reasons.push(`Calculated based on requested power requirement of ${powerRequiredKw} kW.`);
    } else {
      reasons.push(`Estimated based on plant scale capacity potential.`);
    }

    schemes.push({
      id: 'solar_subsidy',
      name: 'PM Surya Ghar Industrial & Commercial Solar Subsidies',
      authority: 'Ministry of New & Renewable Energy (MNRE)',
      description: 'Subsidies, tax-saving accelerated depreciation, and customized credit options to install grid-connected solar power systems on factory roof spaces.',
      maxBenefit: 'Accelerated 40% depreciation + State net-metering incentives',
      estimatedBenefit: parseFloat(estimatedBenefit.toFixed(2)),
      benefitFormula: 'Estimated kW Installation Capacity × ₹15,000 (Subsidies & Tax Savings)',
      eligibilityStatus: 'eligible',
      eligibilityScore: 88,
      matchingReasons: reasons,
      documentChecklist: [
        'Electricity Bill of the commercial/industrial connection (with matching name)',
        'Rooftop structure fitness certificate / layout sketch',
        'GST registration copy',
        'Sanctioned load certificate from state DISCOM',
      ],
      applyProcedure: [
        'Register on National Portal for Rooftop Solar.',
        'Submit feasibility request to local DISCOM through portal.',
        'On approval, choose a registered vendor from the panel to execute installation.',
        'Vendor completes installation and applies for net-metering setup.',
        'DISCOM physical inspection and net-meter commissioning.',
        'State releases central/state subsidy direct to customer bank account within 30 days.',
      ],
    });
  }

  // 6. State Industrial Policy Packaged Schemes of Incentives (PSI)
  const stateIncentiveRates: Record<string, { rate: number; desc: string; link: string }> = {
    Maharashtra: {
      rate: 45,
      desc: 'Maharashtra Package Scheme of Incentives (PSI) - Offers 100% Stamp Duty exemption, SGST Refund (up to 45% of investment), and Electricity Duty Waiver in categories C, D, D+ and LUR zones.',
      link: 'MAITRI Maharashtra Single Window Portal',
    },
    Gujarat: {
      rate: 35,
      desc: 'Gujarat Industrial Policy - Capital assistance (up to 35% of machinery value), Interest subsidy of 5% to 7% for micro/small enterprises, and core electricity duty exemptions.',
      link: 'Investor Portal Gujarat (e-collab)',
    },
    'Uttar Pradesh': {
      rate: 40,
      desc: 'UP MSME Promotion Policy - Capital subsidy (10-15%), 100% stamp duty exemption in Bundelkhand and Purvanchal, interest subvention support up to 5% per annum.',
      link: 'Nivesh Mitra UP Single Window Service',
    },
    'Tamil Nadu': {
      rate: 35,
      desc: 'Tamil Nadu Needs & Back-ended Subsidies - Capital subsidy (25%), 5% interest subvention, generator subsidy, and electrical power tariff tax concessions.',
      link: 'Single Window Tamil Nadu Guidance',
    },
    Karnataka: {
      rate: 30,
      desc: 'Karnataka Industrial Policy - Investment Promotion Subsidy (capped at turnover limits), refund of stamp duty, concession on land and power duty exemptions.',
      link: 'Karnataka Udyog Mitra Single Window',
    },
  };

  // RAJASTHAN DEDICATED SCHEMES (Triggered if state is Rajasthan)
  if (state === 'Rajasthan') {
    // 6a. RIPS 2024 (Rajasthan Investment Promotion Scheme)
    const ripsBenefit = Math.min(investment * 0.35, 250); // up to 35% fixed capital subsidy
    const isSpecial = isSpecialCategory || socialCategory !== 'general';
    const ripsReasons = [
      'Matches Rajasthan state investment policy parameters under newly minted RIPS 2024.',
      `Offers ${isSpecial ? '7%' : '5%'} interest subsidy on core term loans for 5 years.`,
      '100% Exemption on Electricity duty, Land tax, Stamp duty, and Mandi market fee for 7 years.',
    ];
    schemes.push({
      id: 'rips_2024',
      name: 'Rajasthan Investment Promotion Scheme (RIPS 2024)',
      authority: 'Bureau of Investment Promotion (BIP) & Commissionerate of Industries, Government of Rajasthan',
      description: 'The flagship investment promotion scheme of Rajasthan offering massive interest subvention, electricity duty exemptions, and capital subsidies for industrial advancement.',
      maxBenefit: `35% Capital Subsidy or up to ${isSpecial ? '7%' : '5%'} Interest Subvention for 5 years`,
      estimatedBenefit: parseFloat(ripsBenefit.toFixed(2)),
      benefitFormula: 'Plant & Machinery Investment × 35% capital support quota',
      eligibilityStatus: 'eligible',
      eligibilityScore: 95,
      matchingReasons: ripsReasons,
      documentChecklist: [
        'DPR (Detailed Project Report) & Bank Sanction letter',
        'Udyam Aadhaar Registration copy',
        'CA Certified investment schedules of machinery and land',
        'State Industrial registration ID (Rajasthan Single Window System)',
        'No-Objection Certificate from Pollution Control Board',
      ],
      applyProcedure: [
        'Register on the Rajasthan Single Window Portal (rajssodis.rajasthan.gov.in).',
        'Apply for the RIPS 2024 Eligibility Certificate before commencing commercial production.',
        'Upload project appraisal report and machinery bill schedules.',
        'Commissioner checks plant layout and issues the RIPS entitlement card.',
        'File claim forms online for interest subvention, SGST refund, or electricity duty exemption.',
      ],
    });

    // 6b. Rajasthan Trade Policy (Business & Export Promotion)
    const tradeBenefit = Math.min(investment * 0.10, 15); // up to 10% helper, capped at 15 lakhs
    schemes.push({
      id: 'rajasthan_trade_policy',
      name: 'Rajasthan Trade & Export Promotion Policy',
      authority: 'Department of Industries & Commerce, Rajasthan',
      description: 'Provides critical financial benefits including transport freight subsidies, electricity waivers for trading blocks, and international trade market development assistance.',
      maxBenefit: '₹15.00 Lakhs direct refund + 100% Electricity waiver',
      estimatedBenefit: parseFloat(tradeBenefit.toFixed(2)),
      benefitFormula: 'Estimated Export logistics & Trade setup grant (capped at ₹15 Lakhs)',
      eligibilityStatus: 'eligible',
      eligibilityScore: 85,
      matchingReasons: [
        'Promotes trading, logistics, warehousing, or handicraft export in Rajasthan.',
        'Provides up to 25% refund on sea & air freight from Jaipur/Jodhpur ICD dry ports.',
        '100% electricity duty waiver for registered warehouses.',
      ],
      documentChecklist: [
        'Importer-Exporter Code (IEC) certificate copy',
        'Proof of Shipping / Bill of Lading matching Rajasthan shipping hubs',
        'Udyam Registration Certificate',
        'Trade licensing papers from JDA / local Municipal Corporation',
        'Receipt copies of actual paid electricity bills',
      ],
      applyProcedure: [
        'Obtain an IEC (Import Export Code) from DGFT.',
        'File transport subsidy application with the local District Industries Centre (DIC).',
        'Provide shipping logs, original freight invoices, and customs clearance documents.',
        'The Department of Industries direct-credits the transport incentive to the bank account.',
      ],
    });

    // 6c. Vishwakarma Yuva Protsahan Yojana
    // Capped at 5 Lakhs project, 25% subsidy + 5k toolkit
    const vYukaBenefit = Math.min(investment * 0.25, 1.25) + 0.05; // 25% capped at 1.25L + 5000 toolkit
    schemes.push({
      id: 'vishwakarma_yuva_yojana',
      name: 'Vishwakarma Yuva Protsahan Yojana',
      authority: 'Rajasthan Skill & Livelihoods Development Corporation (RSLDC) & DIC, Govt of Rajasthan',
      description: 'Promotes micro-entrepreneurship among standard youths. Offers free industrial toolkits, self-employment capital subsidies, and interest discounts for small business machinery.',
      maxBenefit: '₹1.30 Lakhs (25% Machinery Subsidy + ₹5,000 Free Toolkit)',
      estimatedBenefit: parseFloat(vYukaBenefit.toFixed(2)),
      benefitFormula: 'Machinery Investment × 25% (Max ₹1.25 Lakhs) + ₹5k tool coupon',
      eligibilityStatus: 'eligible',
      eligibilityScore: 90,
      matchingReasons: [
        'Designed for youth-led startup units setting up micro fabrication, craft, or tech repair units.',
        'Interest subvention of up to 8% per annum on startup term loans.',
        'Includes a flat ₹5,000 toolkit grant for modern equipment purchasing.',
      ],
      documentChecklist: [
        'Age proof certificate (Applicant must be between 18 and 40 years of age)',
        'Bonafide Rajasthan domicile certificate',
        'Udyam Registration copy',
        'Estimated quote / price list for the toolkit and machinery to purchase',
        'Caste certificate, if applicable',
      ],
      applyProcedure: [
        'Apply online on the official Rajasthan SSO Board or through DIC Jaipur/local branch.',
        'Submit the age certificate, domicile status, and the list of desired machinery/tools.',
        'DIC conducts verification and issues an approval voucher for the machinery and tool-kit.',
        'Incentives are credited directly to the supplier to deliver the tools / subsidized machines.',
      ],
    });

    // 6d. Nari Shakti Yojana (Mahila Nidhi Interest Support)
    const isFemale = gender === 'female';
    const nariBenefit = isFemale ? Math.min(investment * 0.30, 10) : 0;
    schemes.push({
      id: 'nari_shakti_yojana',
      name: 'Rajasthan Nari Shakti Yojana (Mahila Nidhi Support)',
      authority: 'Rajasthan Grameen Aajeevika Vikas Parishad (Rajeevika) & State Cooperative Bank',
      description: 'Empowers women entrepreneurs with highly subsidized business loans, zero collateral bottlenecks, and margin grants.',
      maxBenefit: '8% Interest Discount on Loans + up to 25% capital margin support (Max ₹10.00 Lakhs)',
      estimatedBenefit: parseFloat(nariBenefit.toFixed(2)),
      benefitFormula: isFemale ? 'Investment Cost × 25% margin support (Capped at ₹10 Lakhs)' : '₹0.00 (Requires Female head or female-led partnership)',
      eligibilityStatus: isFemale ? 'eligible' : 'conditionally_eligible',
      eligibilityScore: isFemale ? 98 : 40,
      matchingReasons: isFemale 
        ? [
            'Highly matched for female-headed proprietors or majority female-led partnership firms.',
            'Direct 8% interest waiver on cooperative bank loans up to ₹40 Lakhs.',
            'Full collateral requirement waived under state credit safety guidelines.'
          ]
        : ['Requires a female promoter/proprietor to unlock 100% eligibility.'],
      notEligibleReasons: !isFemale ? ['Promoter gender list shows male/other. Adjust promoter to female-partner or female director to unlock 8% discount.'] : undefined,
      documentChecklist: [
        'Aadhaar and Domicile proof of the female promoter(s)',
        'Partnership Deed or Company MoA establishing 51%+ female equity holding',
        'Detailed business plan (DPR)',
        'Udyam Registration Certificate',
        'Cooperative bank account passbook copy',
      ],
      applyProcedure: [
        'Submit a loan request under Mahila Nidhi via Rajeevika or the cooperative bank branch.',
        'A female-led business profile and credential validation is completed online.',
        'Cooperative bank processes and releases the credit with an incorporated 8% interest concession.',
        'Capital margin money is directly credited to the business account.',
      ],
    });

    // 6e. Dr. Bhim Rao Ambedkar Rajasthan Dalit Adiwasi Udyam Protsahan Yojana (2022-26)
    const isDalitAdiwasi = socialCategory === 'sc' || socialCategory === 'st';
    const ambedkarBenefit = isDalitAdiwasi ? Math.min(investment * 0.25, 25) + Math.min(investment * 0.09 * 3, 15) : 0;
    schemes.push({
      id: 'bheem_rao_ambedkar_yojana',
      name: 'Dr. B.R. Ambedkar Rajasthan Dalit Adiwasi Udyam Protsahan Yojana',
      authority: 'Commissionerate of Industries & Commerce, Government of Rajasthan',
      description: 'A historic state promotion scheme dedicated to motivating SC and ST community members to start new factories, services, and trade businesses.',
      maxBenefit: '9% Interest Subsidy + 25% Capital Margin Money Subsidy (Max ₹25.00 Lakhs)',
      estimatedBenefit: parseFloat(ambedkarBenefit.toFixed(2)),
      benefitFormula: isDalitAdiwasi ? 'Capital Subsidy (25%) + Interest savings (9% per annum over 3 years)' : '₹0.00 (Requires SC/ST promoter status)',
      eligibilityStatus: isDalitAdiwasi ? 'eligible' : 'conditionally_eligible',
      eligibilityScore: isDalitAdiwasi ? 99 : 35,
      matchingReasons: isDalitAdiwasi
        ? [
            'Highly matched with SC / ST promoter category designation.',
            'Provides massive 9% interest discount for loans up to ₹25 Lakhs (and 7% interest discount for loans up to ₹5 Crore).',
            'Offers 25% upfront margin money / capital grant capped at ₹25 Lakhs per project.'
          ]
        : ['Available to SC/ST entrepreneurs. Promoter category change required to unlock.'],
      notEligibleReasons: !isDalitAdiwasi ? ['Promoter social category is General/OBC/Minority. Scheme requires SC / ST caste certificate state registration.'] : undefined,
      documentChecklist: [
        'State-issued Caste Certificate (SC/ST category proof)',
        'Bonafide Rajasthan Domicile Certificate',
        'Udyam Registration Certificate',
        'DPR (Detailed Project Report) for bank submission',
        'Land ownership or lease document matching the industrial unit',
      ],
      applyProcedure: [
        'Apply online on the SSO portal (rajssodis.rajasthan.gov.in) under the DIC application section.',
        'Select Dr. Ambedkar Udyam Protsahan Yojana and upload Caste & Domicile papers with DPR.',
        'The DIC reviews compliance and forwards the subsidized loan request to the partner bank.',
        'Bank releases the term loan and cash credit collateral-free.',
        'DIC credits the 25% margin capital subsidy and applies the 9% or 7% annual interest discount to your loan account.',
      ],
    });
  }

  const selectedStatePolicy = stateIncentiveRates[state];
  if (selectedStatePolicy) {
    const rate = selectedStatePolicy.rate;
    // Calculate state reimbursement value: approx 15% of investment in general as an immediate direct benefit
    const estimatedBenefit = Math.min((investment * rate) / 100 * 0.5, investment * 0.4); // adjusted factor

    schemes.push({
      id: `state_psi_${state.toLowerCase().replace(' ', '_')}`,
      name: `${state} Package Scheme of Industrial Incentives`,
      authority: `Directorate of Industries, Government of ${state}`,
      description: selectedStatePolicy.desc,
      maxBenefit: `Up to ${rate}% of Eligible Fixed Capital Investment`,
      estimatedBenefit: parseFloat(estimatedBenefit.toFixed(2)),
      benefitFormula: `Eligible Capital Investment × state-allocated percentage rate`,
      eligibilityStatus: 'eligible',
      eligibilityScore: 90,
      matchingReasons: [
        `Operational/Proposed in the State of ${state}.`,
        'Includes major manufacturing or eligible services with electricity/stamp needs.',
        'Increases with projects setting up in rural or backward blocks (Tier C / D / D+).',
      ],
      documentChecklist: [
        'IEM Certificate or UDYAM MSME Registration',
        'State Industrial Registration Certificate',
        'Chartered Accountant certificate of Fixed Assets Addition',
        'First Sale Invoice and commission certificate',
        'Electricity release and first structural electricity bill',
        'Registered sale deed/lease deed of land',
      ],
      applyProcedure: [
        `Register on the respective state single-window portal (e.g. ${selectedStatePolicy.link}).`,
        'Submit industrial application for grant of eligibility certificate.',
        'File claim forms online for the respective incentives (e.g., SGST reimbursement, stamp duty waiver).',
        'Incentive claims undergo inspection by district general manager representation.',
        'Eligible funds are credited to the business accounts annually or upfront.',
      ],
    });
  } else {
    // General scheme fallback for other states (only if not Raj, since Raj is hand-coded above)
    if (state !== 'Rajasthan') {
      const estimatedBenefit = Math.min((investment * 10) / 100, 20);
      schemes.push({
        id: 'state_psi_other',
        name: `State Industrial Promotion Assistance (${state || 'General Block'})`,
        authority: 'State Directorate of Industries & Commerce',
        description: `Incentives offered under local State MSME policies including local stamp duty concessions, electricity duty exemptions, and capital subsidies.`,
        maxBenefit: 'Up to 15% of Plant and Machinery investments',
        estimatedBenefit: parseFloat(estimatedBenefit.toFixed(2)),
        benefitFormula: 'Investment Cost × 10% average state incentive rate',
        eligibilityStatus: 'conditionally_eligible',
        eligibilityScore: 70,
        matchingReasons: [
          `Evaluated for local state execution in ${state}.`,
          'Requires functional MSME / Industry local licensing.',
        ],
        documentChecklist: [
          'UDYAM Registration Card',
          'State Single-Window registration confirmation',
          'CA audited land & machinery ledger schedules',
        ],
        applyProcedure: [
          'Approach the local District Industries Centre (DIC) office.',
          'Submit application for industrial eligibility and file for local incentives.',
        ],
      });
    }
  }

  // Calculate overall metrics
  const totalEstimatedBenefit = schemes.reduce((sum, s) => sum + s.estimatedBenefit, 0);
  const eligibleSchemesCount = schemes.filter(s => s.eligibilityStatus === 'eligible').length;
  let overallScore = 0;
  if (schemes.length > 0) {
    overallScore = Math.min(
      Math.round(schemes.reduce((sum, s) => sum + s.eligibilityScore, 0) / schemes.length),
      100
    );
  }

  // Final compilation
  const result: EvaluationResult = {
    profile,
    overallScore: overallScore || 80,
    totalEstimatedBenefit: parseFloat(totalEstimatedBenefit.toFixed(2)),
    schemes: schemes.sort((a, b) => b.estimatedBenefit - a.estimatedBenefit),
    timestamp: new Date().toISOString(),
  };

  return result;
}
