"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { PredictionResult } from "@/types/bone-age"

interface ImageUploaderProps {
  selectedImage: string | null
  onImageUpload: (imageDataUrl: string) => void
  onPrediction: (result: PredictionResult) => void
  isAnalyzing: boolean
  onClear: () => void
}

export default function ImageUploader({
  selectedImage,
  onImageUpload,
  onPrediction,
  isAnalyzing,
  onClear,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageFileRef = useRef<File | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0])
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPEG, PNG, etc.)")
      return
    }

    imageFileRef.current = file
    const reader = new FileReader()
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        onImageUpload(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleButtonClick = () => fileInputRef.current?.click()

  const handlePrediction = async () => {
    if (!imageFileRef.current) return

    const formData = new FormData()
    formData.append("file", imageFileRef.current)

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Prediction request failed.")

      const data = await response.json()
      console.log("🔁 Backend Response:", data)

      if (typeof data.bone_age_months === "number") {
        const prediction: PredictionResult = {
          boneAgeMonths: parseFloat(data.bone_age_months.toFixed(2)), // 👈 convert snake_case to camelCase
          confidenceScore: data.confidenceScore ?? 0.95,
          standardDeviation: data.standardDeviation ?? 4.2,
          imageUrl: selectedImage || "",
          timestamp: new Date().toISOString(),
        }

        console.log("📊 Sending to parent:", prediction)
        onPrediction(prediction)

        // Send to terminal logging route (for frontend terminal view)
        await fetch("/api/log-prediction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prediction),
        })
      } else {
        alert("Unexpected server response format.")
      }
    } catch (err) {
      console.error("Prediction error:", err)
      alert("An error occurred while predicting bone age.")
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Upload X-Ray Image</h2>

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          isDragging ? "border-emerald-500 bg-emerald-50" : "border-slate-300 hover:border-emerald-400",
          selectedImage ? "h-auto" : "h-64"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {selectedImage ? (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full z-10"
              onClick={(e) => {
                e.stopPropagation()
                onClear()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            <img
              src={selectedImage}
              alt="Selected X-ray"
              className="max-h-[400px] mx-auto rounded-md"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Upload className="h-10 w-10 text-slate-400 mb-2" />
            <p className="text-slate-600">Drag and drop or click to upload an X-ray image</p>
            <p className="text-xs text-slate-500 mt-1">Supported formats: JPEG, PNG</p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handlePrediction}
          disabled={!selectedImage || isAnalyzing}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Predict Bone Age"
          )}
        </Button>
      </div>
    </div>
  )
}
