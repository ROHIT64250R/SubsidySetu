/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type IndustryType =
  | 'manufacturing'
  | 'services'
  | 'agriculture'
  | 'food_processing'
  | 'renewable_solar'
  | 'textiles'
  | 'it_tech';

export type EntityType = 'proprietorship' | 'partnership' | 'llp' | 'pvt_ltd' | 'cooperative';

export type StateType =
  | 'Maharashtra'
  | 'Gujarat'
  | 'Uttar Pradesh'
  | 'Tamil Nadu'
  | 'Karnataka'
  | 'Rajasthan'
  | 'Madhya Pradesh'
  | 'Haryana'
  | 'West Bengal'
  | 'Other';

export interface BusinessProfile {
  companyName: string;
  industryType: IndustryType;
  investment: number; // in INR Lakhs
  turnover: number; // in INR Lakhs
  state: StateType;
  entityType: EntityType;
  locationArea: 'urban' | 'rural';
  socialCategory: 'general' | 'obc' | 'sc' | 'st' | 'minority';
  gender: 'male' | 'female' | 'other';
  operationalStage: 'new' | 'existing';
  hasUdyam: boolean;
  powerRequiredKw?: number;
}

export interface SubsidyScheme {
  id: string;
  name: string;
  authority: string;
  description: string;
  maxBenefit: string;
  estimatedBenefit: number; // in INR Lakhs
  benefitFormula: string;
  eligibilityStatus: 'eligible' | 'conditionally_eligible' | 'not_eligible';
  eligibilityScore: number; // 0 - 100
  matchingReasons: string[];
  notEligibleReasons?: string[];
  documentChecklist: string[];
  applyProcedure: string[];
  policyLinkText?: string;
}

export interface EvaluationResult {
  profile: BusinessProfile;
  overallScore: number;
  totalEstimatedBenefit: number; // in INR Lakhs
  schemes: SubsidyScheme[];
  aiSummary?: string;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
