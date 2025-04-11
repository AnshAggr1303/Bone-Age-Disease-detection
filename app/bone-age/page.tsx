"use client"

import { useState } from "react"
import ImageUploader from "@/components/image-uploader"
import type { PredictionResult } from "@/types/bone-age"

export default function BoneAgePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)

  const handleImageUpload = (imageDataUrl: string) => {
    setSelectedImage(imageDataUrl)
    setPrediction(null)
  }

  const handlePrediction = (result: PredictionResult) => {
    console.log("Frontend received prediction:", result)
    setPrediction(result)
  }

  const handleClear = () => {
    setSelectedImage(null)
    setPrediction(null)
  }

  return (
    <main className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-emerald-700">Bone Age Prediction</h1>

      <ImageUploader
        selectedImage={selectedImage}
        onImageUpload={handleImageUpload}
        onPrediction={handlePrediction}
        isAnalyzing={isAnalyzing}
        onClear={handleClear}
      />

      {prediction && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
          <p className="text-lg font-semibold text-emerald-700">
            Predicted Bone Age: <span className="font-bold">{prediction.boneAgeMonths.toFixed(2)}</span> months
          </p>
          <p className="text-sm text-emerald-600">
            Confidence Score: <span className="font-medium">{(prediction.confidenceScore * 100).toFixed(1)}%</span>
          </p>
          <p className="text-sm text-emerald-600">
            Std Deviation: <span className="font-medium">{prediction.standardDeviation.toFixed(2)}</span>
          </p>
          <p className="text-xs text-slate-500">
            Prediction Time: <span className="font-medium">{new Date(prediction.timestamp).toLocaleString()}</span>
          </p>
        </div>
      )}
    </main>
  )
}
