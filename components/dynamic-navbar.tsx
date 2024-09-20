'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Building2, Users, FileText, Briefcase, BarChart2, Menu } from 'lucide-react'

type UserRole = 'ceo' | 'hr' | 'candidate' | null

const navLinks = {
  ceo: [
    { href: '/companies', label: 'Companies', icon: Building2 },
    { href: '/hr', label: 'HR', icon: Users },
  ],
  hr: [
    { href: '/offers', label: 'Offers', icon: Briefcase },
    { href: '/reports', label: 'Reports', icon: FileText },
  ],
  candidate: [
    { href: '/applications', label: 'Applications', icon: Briefcase },
    { href: '/performance', label: 'Performance', icon: BarChart2 },
  ],
}

export default function Navbar() {
  // In a real application, you'd get the user role from your auth system
  const [userRole, setUserRole] = useState<UserRole>(null)

  const links = userRole ? navLinks[userRole] : []

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                SmartInterview
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <link.icon className="inline-block w-5 h-5 mr-1" />
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <link.icon className="w-5 h-5 mr-2" />
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      {/* Role switcher for demonstration purposes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-center gap-2">
        <Button onClick={() => setUserRole('ceo')}>CEO View</Button>
        <Button onClick={() => setUserRole('hr')}>HR View</Button>
        <Button onClick={() => setUserRole('candidate')}>Candidate View</Button>
      </div>
    </nav>
  )
}