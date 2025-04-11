"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ResultsDisplay from "@/components/results-display"
import type { PatientInfo, PredictionResult } from "@/types/bone-age"
import { formatDate } from "@/lib/utils"

interface PredictionHistoryProps {
  history: Array<PredictionResult & { patientInfo: PatientInfo }>
}

export default function PredictionHistory({ history }: PredictionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPrediction, setSelectedPrediction] = useState<
    (PredictionResult & { patientInfo: PatientInfo }) | null
  >(null)

  const filteredHistory = history.filter(
    (item) =>
      item.patientInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patientInfo.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewDetails = (prediction: PredictionResult & { patientInfo: PatientInfo }) => {
    setSelectedPrediction(prediction)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Prediction History</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or ID"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-slate-500">No prediction history available</div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead className="text-right">Bone Age</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">{formatDate(item.timestamp)}</TableCell>
                  <TableCell>{item.patientInfo.name}</TableCell>
                  <TableCell>{item.patientInfo.id || "-"}</TableCell>
                  <TableCell className="capitalize">{item.patientInfo.gender}</TableCell>
                  <TableCell className="text-right">
                    {item.boneAgeMonths} months
                    <span className="text-xs text-slate-500 block">
                      ({Math.floor(item.boneAgeMonths / 12)}y, {item.boneAgeMonths % 12}m)
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{(item.confidenceScore * 100).toFixed(1)}%</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(item)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selectedPrediction} onOpenChange={(open) => !open && setSelectedPrediction(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Prediction Details</DialogTitle>
          </DialogHeader>
          {selectedPrediction && (
            <ResultsDisplay result={selectedPrediction} patientInfo={selectedPrediction.patientInfo} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
