"use client"

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { PatientInfo, PredictionResult } from "@/types/bone-age"
import { formatDate } from "@/lib/utils"

interface ResultsDisplayProps {
  result: PredictionResult
  patientInfo: PatientInfo
}

export default function ResultsDisplay({ result, patientInfo }: ResultsDisplayProps) {
  const calculateChronologicalAge = () => {
    if (!patientInfo.dateOfBirth) return null

    const birthDate = new Date(patientInfo.dateOfBirth)
    const today = new Date()

    let months = (today.getFullYear() - birthDate.getFullYear()) * 12
    months += today.getMonth() - birthDate.getMonth()

    return months
  }

  const chronologicalAge = calculateChronologicalAge()
  const ageDifference = chronologicalAge !== null ? result.boneAgeMonths - chronologicalAge : null

  const getConfidenceColor = (score: number) => {
    if (score >= 0.95) return "text-emerald-600"
    if (score >= 0.9) return "text-emerald-500"
    if (score >= 0.8) return "text-amber-500"
    return "text-red-500"
  }

  const getAgeComparisonData = () => {
    if (chronologicalAge === null) return []

    return [
      { name: "Chronological", age: chronologicalAge },
      { name: "Bone", age: result.boneAgeMonths },
    ]
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate a PDF report
    alert("Report download functionality would be implemented here")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Analysis Results</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Predicted Bone Age</h3>
                  <Badge variant="outline" className="font-mono">
                    {formatDate(result.timestamp)}
                  </Badge>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold">{result.boneAgeMonths}</span>
                  <span className="text-slate-600">months</span>
                  <span className="text-sm text-slate-500">
                    ({Math.floor(result.boneAgeMonths / 12)} years, {result.boneAgeMonths % 12} months)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Confidence Score</p>
                    <p className={`font-semibold ${getConfidenceColor(result.confidenceScore)}`}>
                      {(result.confidenceScore * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Standard Deviation</p>
                    <p className="font-semibold">±{result.standardDeviation.toFixed(1)} months</p>
                  </div>

                  {chronologicalAge !== null && (
                    <>
                      <div>
                        <p className="text-sm text-slate-500">Chronological Age</p>
                        <p className="font-semibold">
                          {chronologicalAge} months
                          <span className="text-sm text-slate-500 ml-1">
                            ({Math.floor(chronologicalAge / 12)}y, {chronologicalAge % 12}m)
                          </span>
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-500">Age Difference</p>
                        <p
                          className={`font-semibold ${ageDifference && ageDifference > 0 ? "text-amber-600" : "text-emerald-600"}`}
                        >
                          {ageDifference && ageDifference > 0 ? "+" : ""}
                          {ageDifference} months
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {chronologicalAge !== null && (
            <Card className="mt-4">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Age Comparison</h3>
                <div className="h-64">
                  <ChartContainer
                    config={{
                      age: {
                        label: "Age (months)",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getAgeComparisonData()}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="age" fill="var(--color-age)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">X-Ray Image</h3>
              <div className="border rounded-md p-2 bg-black">
                <img src={result.imageUrl || ""} alt="X-ray" className="max-h-[400px] mx-auto" />
              </div>

              <div className="mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-slate-500">Patient:</p>
                  <p className="font-medium">{patientInfo.name}</p>

                  <p className="text-slate-500">Patient ID:</p>
                  <p className="font-medium">{patientInfo.id || "Not specified"}</p>

                  <p className="text-slate-500">Gender:</p>
                  <p className="font-medium capitalize">{patientInfo.gender}</p>

                  <p className="text-slate-500">Date of Birth:</p>
                  <p className="font-medium">{patientInfo.dateOfBirth}</p>

                  <p className="text-slate-500">Referring Physician:</p>
                  <p className="font-medium">{patientInfo.referringPhysician || "Not specified"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
