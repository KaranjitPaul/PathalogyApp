// packageData.ts

export type Category =
  | 'Neurologist'
  | 'Heart'
  | 'Full Body'
  | 'Thyroid'
  | 'Histopathology'
  | 'Blood Test'
  | 'Eye Test'
  | 'Liver Test';

export interface Package {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
}

export const ALL_PACKAGES: Package[] = [
  // Neurologist
  {
    id: 'neuro1',
    name: 'Neurological Disorder Panel',
    category: 'Neurologist',
    description: 'Comprehensive screening for common neurological disorders.',
    price: 2400,
  },
  {
    id: 'neuro2',
    name: 'Epilepsy Diagnostic Package',
    category: 'Neurologist',
    description: 'Tests for epilepsy markers and related neurological conditions.',
    price: 2100,
  },
  // Heart
  {
    id: 'heart1',
    name: 'Basic Cardiac Profile',
    category: 'Heart',
    description: 'Includes cholesterol, lipid profile, and ECG markers.',
    price: 1800,
  },
  {
    id: 'heart2',
    name: 'Advanced Cardiovascular Risk Assessment',
    category: 'Heart',
    description: 'Advanced panel for cardiovascular risk, including Troponin T and CRP.',
    price: 3200,
  },
  // Full Body
  {
    id: 'fullbody1',
    name: 'Preventive Full Body Checkup',
    category: 'Full Body',
    description: 'Extensive test covering all major organs, including blood, urine, and imaging.',
    price: 4200,
  },
  {
    id: 'fullbody2',
    name: 'Executive Full Body Profile',
    category: 'Full Body',
    description: 'Includes thyroid, liver, kidney, lipid, blood tests, and vitamin screenings.',
    price: 5900,
  },
  // Thyroid
  {
    id: 'thyroid1',
    name: 'Basic Thyroid Profile',
    category: 'Thyroid',
    description: 'TSH, T3, T4 for basic thyroid assessment.',
    price: 600,
  },
  {
    id: 'thyroid2',
    name: 'Comprehensive Thyroid Panel',
    category: 'Thyroid',
    description: 'Includes Free T3, Free T4, TSH, Anti-TPO, and Thyroglobulin Antibody.',
    price: 1200,
  },
  // Histopathology
  {
    id: 'histopath1',
    name: 'Routine Biopsy Analysis',
    category: 'Histopathology',
    description: 'Microscopic examination of tissue for abnormal growth.',
    price: 2500,
  },
  {
    id: 'histopath2',
    name: 'Special Stains Panel',
    category: 'Histopathology',
    description: 'Special stains used for detailed cell and tissue diagnosis.',
    price: 1600,
  },
  // Blood Test
  {
    id: 'blood1',
    name: 'Complete Blood Count (CBC)',
    category: 'Blood Test',
    description: 'Measures different components of blood including WBC, RBC, and Platelets.',
    price: 350,
  },
  {
    id: 'blood2',
    name: 'Anemia Profile',
    category: 'Blood Test',
    description: 'Evaluates the most common causes of anemia.',
    price: 750,
  },
  // Eye Test
  {
    id: 'eye1',
    name: 'Basic Vision Assessment',
    category: 'Eye Test',
    description: 'Includes visual acuity, color vision, and field test.',
    price: 700,
  },
  {
    id: 'eye2',
    name: 'Glaucoma Screening Profile',
    category: 'Eye Test',
    description: 'Tests for early signs of glaucoma and optic nerve damage.',
    price: 1100,
  },
  // Liver Test
  {
    id: 'liver1',
    name: 'Basic Liver Function Test (LFT)',
    category: 'Liver Test',
    description: 'Evaluates enzymes and proteins to assess liver health.',
    price: 650,
  },
  {
    id: 'liver2',
    name: 'Hepatitis Screening Panel',
    category: 'Liver Test',
    description: 'Screens for hepatitis viruses and associated liver issues.',
    price: 1400,
  },
];
