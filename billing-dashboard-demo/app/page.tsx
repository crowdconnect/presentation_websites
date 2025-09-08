import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Users, Car, UserCheck } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#274366" }}>
      <div className="bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Image
                src="/mawacon-logo.png"
                alt="mawacon"
                width={120}
                height={32}
                className="h-8 w-auto cursor-pointer"
              />
            </Link>
          </div>
          <div className="text-gray-700 text-sm font-medium">EW</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        {/* Welcome Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 shadow-xl max-w-2xl w-full mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Willkommen bei NetOffice 2025</h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-blue-600 font-semibold mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                Verwaltung
              </h2>
              <div className="space-y-2">
                <Link href="/fuhrpark">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                  >
                    <Car className="w-4 h-4 mr-2" />
                    Fuhrpark
                  </Button>
                </Link>
                <Link href="/billing-overview">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Rechnungslauf
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <h2 className="text-blue-600 font-semibold mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                Administration
              </h2>
              <div className="space-y-2">
                <Link href="/users">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Users
                  </Button>
                </Link>
                <Link href="/customers">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Kunden
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6">
        <div className="text-white/90 text-8xl font-light mb-2">12:35</div>
        <div className="text-white/70 text-lg tracking-wider">26/08/2025</div>
      </div>
    </div>
  )
}
