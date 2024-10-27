import { SampleCodes, SampleTemplate } from "@/lib/data";
import { create } from 'zustand';

export type SubmissionState = {
    languageid: string
    sample: SampleTemplate
}
export type SubmissionAction = {
    setLanguage: (id: SubmissionState['languageid']) => void
    setSample: (sample: SubmissionState['sample']) => void
}

export const useSubmissionStore = create<SubmissionState & SubmissionAction>()((set) => ({
    languageid: "",
    sample: SampleCodes["empty"],
    setSample: (sample) => set(() => ({ sample: sample })),
    setLanguage: (id) => set(() => ({ languageid: id }))
}))