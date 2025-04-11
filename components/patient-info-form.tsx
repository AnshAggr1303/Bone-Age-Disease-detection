"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { PatientInfo } from "@/types/bone-age"

interface PatientInfoFormProps {
  patientInfo: PatientInfo
  onPatientInfoChange: (info: PatientInfo) => void
}

export default function PatientInfoForm({ patientInfo, onPatientInfoChange }: PatientInfoFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onPatientInfoChange({
      ...patientInfo,
      [name]: value,
    })
  }

  const handleGenderChange = (value: string) => {
    onPatientInfoChange({
      ...patientInfo,
      gender: value,
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Patient Information</h2>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="id">Patient ID</Label>
            <Input id="id" name="id" placeholder="e.g., P12345" value={patientInfo.id} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={patientInfo.dateOfBirth}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Patient's full name"
            value={patientInfo.name}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup value={patientInfo.gender} onValueChange={handleGenderChange} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="referringPhysician">Referring Physician</Label>
          <Input
            id="referringPhysician"
            name="referringPhysician"
            placeholder="Dr. Name"
            value={patientInfo.referringPhysician}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  )
}
