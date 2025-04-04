import { Button } from "../components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center relative">
        <div className="space-y-12">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 animate-fade-in drop-shadow-sm">
            Dyslexia Progress Tracker
          </h1>

          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Empower every learning journey. Log daily observations, analyze trends, and review progress — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button
              asChild
              className="px-8 py-4 text-base sm:text-lg font-medium shadow-lg hover:shadow-xl transition-shadow bg-blue-600 text-white hover:bg-blue-700"
            >
              <Link href="/profiles" className="flex items-center">
                <span className="mr-2">👤</span>
                Manage Profiles
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="px-8 py-4 text-base sm:text-lg font-medium border-gray-300 bg-white/70 backdrop-blur-md hover:bg-white"
            >
              <Link href="/summaries" className="flex items-center text-gray-800">
                <span className="mr-2">📈</span>
                View Reports
              </Link>
            </Button>
          </div>

          <div className="border-t border-gray-200 my-12 w-3/4 mx-auto"></div>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
            <FeatureCard
              icon="📝"
              title="Daily Notes"
              description="Capture daily behavior, thoughts, and progress without hassle."
            />
            <FeatureCard
              icon="🧠"
              title="AI Analysis"
              description="AI summarizes patterns, surfaces trends, and makes sense of scattered notes."
            />
            <FeatureCard
              icon="📊"
              title="Progress Reports"
              description="Transform entries into structured weekly or monthly insights."
            />
          </section>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 border border-white/30">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
