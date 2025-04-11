export async function predictBoneAge(imageFile: File): Promise<number> {
    const formData = new FormData();
    formData.append("file", imageFile);
  
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error("Prediction failed");
    }
  
    const data = await response.json();
    return data.boneAgeMonths;
  }
  