"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import ImageUploader from "@/components/image-uploader"
import ResultsDisplay from "@/components/results-display"
import PatientInfoForm from "@/components/patient-info-form"
import PredictionHistory from "@/components/prediction-history"
import type { PatientInfo, PredictionResult } from "@/types/bone-age"

export default function BoneAgePrediction() {
  const { toast } = useToast()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    id: "",
    name: "",
    dateOfBirth: "",
    gender: "",
    referringPhysician: "",
  })
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)
  const [predictionHistory, setPredictionHistory] = useState<Array<PredictionResult & { patientInfo: PatientInfo }>>([])

  const handleImageUpload = (imageDataUrl: string) => {
    setSelectedImage(imageDataUrl)
    setPredictionResult(null)
  }

  const handlePatientInfoChange = (info: PatientInfo) => {
    setPatientInfo(info)
  }

  const handlePrediction = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an X-ray image first",
        variant: "destructive",
      })
      return
    }

    if (!patientInfo.name || !patientInfo.dateOfBirth || !patientInfo.gender) {
      toast({
        title: "Incomplete patient information",
        description: "Please fill in all required patient information",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    try {
      // Simulate API call to the bone age prediction model
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock prediction result
      const mockResult: PredictionResult = {
        boneAgeMonths: Math.floor(Math.random() * 216) + 12, // 1-18 years in months
        confidenceScore: Math.random() * 0.2 + 0.8, // 0.8-1.0
        standardDeviation: Math.random() * 3 + 1, // 1-4 months
        timestamp: new Date().toISOString(),
        imageUrl: selectedImage,
      }

      setPredictionResult(mockResult)

      // Add to history
      setPredictionHistory((prev) => [{ ...mockResult, patientInfo: { ...patientInfo } }, ...prev])

      toast({
        title: "Analysis complete",
        description: `Predicted bone age: ${mockResult.boneAgeMonths} months`,
      })
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was an error processing the image",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const clearData = () => {
    setSelectedImage(null)
    setPredictionResult(null)
    setPatientInfo({
      id: "",
      name: "",
      dateOfBirth: "",
      gender: "",
      referringPhysician: "",
    })
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Header />

      <Tabs defaultValue="predict" className="mt-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="predict">Predict</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="predict" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-1">
              <CardContent className="pt-6">
                <PatientInfoForm patientInfo={patientInfo} onPatientInfoChange={handlePatientInfoChange} />
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardContent className="pt-6">
                <ImageUploader
                  selectedImage={selectedImage}
                  onImageUpload={handleImageUpload}
                  onPrediction={handlePrediction}
                  isAnalyzing={isAnalyzing}
                  onClear={clearData}
                />
              </CardContent>
            </Card>
          </div>

          {predictionResult && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <ResultsDisplay result={predictionResult} patientInfo={patientInfo} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <PredictionHistory history={predictionHistory} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
