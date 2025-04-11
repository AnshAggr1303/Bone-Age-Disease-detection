export interface PatientInfo {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  referringPhysician: string
}

export interface PredictionResult {
  boneAgeMonths: number
  confidenceScore: number
  standardDeviation: number
  timestamp: string
  imageUrl: string
}
