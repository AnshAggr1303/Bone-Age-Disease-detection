import { Stethoscope } from "lucide-react"

export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-2">
        <Stethoscope className="h-10 w-10 text-emerald-600" />
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">OsteAge</h1>
      </div>
      <p className="mt-2 text-slate-600 max-w-2xl">
        Advanced bone age prediction system for accurate skeletal maturity assessment
      </p>
    </header>
  )
}
