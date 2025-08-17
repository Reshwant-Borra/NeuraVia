import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Assessment {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  lastCompleted?: Date;
}

interface AppState {
  assessments: Assessment[];
  isOnline: boolean;
  setOnlineStatus: (status: boolean) => void;
  toggleAssessment: (id: string) => void;
  completeAssessment: (id: string) => void;
}

const defaultAssessments: Assessment[] = [
  {
    id: 'tremor',
    name: 'Tremor',
    description: 'Assess hand tremor patterns',
    enabled: false,
  },
  {
    id: 'finger-tap',
    name: 'Finger Tap',
    description: 'Measure finger tapping speed',
    enabled: false,
  },
  {
    id: 'hand-open-close',
    name: 'Hand Open/Close',
    description: 'Evaluate hand coordination',
    enabled: false,
  },
  {
    id: 'sway',
    name: 'Sway',
    description: 'Analyze postural stability',
    enabled: false,
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      assessments: defaultAssessments,
      isOnline: true,
      
      setOnlineStatus: (status: boolean) => 
        set({ isOnline: status }),
      
      toggleAssessment: (id: string) =>
        set((state) => ({
          assessments: state.assessments.map((assessment) =>
            assessment.id === id
              ? { ...assessment, enabled: !assessment.enabled }
              : assessment
          ),
        })),
      
      completeAssessment: (id: string) =>
        set((state) => ({
          assessments: state.assessments.map((assessment) =>
            assessment.id === id
              ? { ...assessment, lastCompleted: new Date() }
              : assessment
          ),
        })),
    }),
    {
      name: 'neuro-lens-storage',
      partialize: (state) => ({
        assessments: state.assessments,
      }),
    }
  )
);
