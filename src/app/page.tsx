import Link from "next/link";
import { School, LogIn, Search, Calendar, Info, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { t } from "@/lib/i18n";

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col bg-slate-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <School className="h-6 w-6 text-primary-600" />
            <span className="font-moul text-lg text-slate-900">អនុវិទ្យាល័យ សង្គ្រោះជាតិ</span>
          </div>
          <Link href="/login">
            <Button variant="primary" className="gap-2">
              <LogIn className="h-4 w-4" />
              {t("auth.login")}
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative bg-primary-900 py-20 text-white overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          
          <div className="relative mx-auto max-w-4xl px-4 text-center space-y-6">
            <h1 className="font-moul text-4xl md:text-5xl leading-tight">
              សូមស្វាគមន៍មកកាន់<br />ប្រព័ន្ធគ្រប់គ្រងសាលា
            </h1>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto">
              ស្វែងរកលទ្ធផលសិក្សា ពិនិត្យកាលវិភាគ និងទទួលបានព័ត៌មានសាលាយ៉ាងរហ័ស
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/check">
                <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
                  <Search className="mr-2 h-5 w-5" />
                  {t("nav.reports")}
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white">
                  ចូលប្រើប្រាស់សម្រាប់បុគ្គលិក
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Link href="/check" className="group">
              <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-transparent hover:border-primary-100">
                <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-primary-50 rounded-2xl group-hover:bg-primary-100 transition-colors">
                    <Search className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="font-moul text-xl">ពិនិត្យលទ្ធផលសិក្សា</h3>
                  <p className="text-slate-500 text-sm">សម្រាប់សិស្ស និងអាណាព្យាបាល ពិនិត្យពិន្ទុប្រចាំឆមាស</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-transparent hover:border-accent-100">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-orange-50 rounded-2xl">
                  <Calendar className="h-8 w-8 text-accent-500" />
                </div>
                <h3 className="font-moul text-xl">តារាងកាលវិភាគ</h3>
                <p className="text-slate-500 text-sm">មើលកាលវិភាគបង្រៀន និងកាលវិភាគប្រឡង</p>
              </CardContent>
            </Card>

            <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-transparent hover:border-success-100">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-green-50 rounded-2xl">
                  <Info className="h-8 w-8 text-success-500" />
                </div>
                <h3 className="font-moul text-xl">ព័ត៌មានសាលា</h3>
                <p className="text-slate-500 text-sm">ស្វែងយល់ពីប្រវត្តិសាលា និងទំនាក់ទំនង</p>
              </CardContent>
            </Card>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500">
          <p>© ២០២៦-២០២៧ រក្សាសិទ្ធិគ្រប់យ៉ាងដោយ អនុវិទ្យាល័យ សង្គ្រោះជាតិ</p>
        </div>
      </footer>
    </div>
  );
}