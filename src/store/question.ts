import { CodeRuntime } from "@/lib/interface";
import { create } from 'zustand';

export type QuestionState = {
    id?: string
    question: string
    runtimes: CodeRuntime[]
    selectedRuntime: CodeRuntime | null
}

export type QuestionAction = {
    setQuestion: (q: QuestionState['question']) => void
    setRuntimes: (sample: QuestionState['runtimes']) => void
    setSelectedRuntime: (sample: QuestionState['selectedRuntime']) => void
}

export const useQuestionStore = create<QuestionState & QuestionAction>()((set) => ({
    question: "Custom Selection",
    runtimes: [],
    selectedRuntime: null,
    setQuestion: (d) => set(() => ({ question: d })),
    setRuntimes: (d) => set(() => ({ runtimes: d })),
    setSelectedRuntime: (d) => set(() => ({ selectedRuntime: d }))
}))


export type AvailableRuntimes = {
    runtimes: CodeRuntime[]
    setRuntimes: (sample: CodeRuntime[]) => void
}
export const useAvailableRuntimesStore = create<AvailableRuntimes>()((set) => ({
    runtimes: [],
    setRuntimes: (d) => set(() => ({ runtimes: d })),
}))

// TODO: for initial demo only, the actual questions should be added in the database
export const useSampleQuestionStore = create<{sample: {code?: string}}>()(() => ({
    sample: {},
}))

