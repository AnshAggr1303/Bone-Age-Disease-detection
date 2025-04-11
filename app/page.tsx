import type { Metadata } from "next"
import BoneAgePrediction from "@/components/bone-age-prediction"

export const metadata: Metadata = {
  title: "OsteAge - Advanced Bone Age Prediction",
  description: "Professional bone age prediction tool for medical professionals",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <BoneAgePrediction />
      </div>
    </main>
  )
}
