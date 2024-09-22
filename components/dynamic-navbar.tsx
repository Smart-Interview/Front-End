'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Building2, Users, Briefcase, BarChart2, Menu } from 'lucide-react'

type UserRole = 'ceo' | 'rh' | 'candidate' | null

const navLinks = {
  ceo: [
    { href: '/ceo/companies', label: 'Companies', icon: Building2 },
  ],
  rh: [
    { href: '/hr/offers', label: 'Offers', icon: Briefcase },
  ],
  candidate: [
    { href: '/candidate', label: 'Applications', icon: Briefcase },
    { href: '/candidate/applications', label: 'Applications', icon: Briefcase },
    { href: '/candidate/tests', label: 'Performance', icon: BarChart2 },
  ],
}

export default function Navbar() {
  const [userRole, setUserRole] = useState<UserRole>(null)

  // Get role from localStorage when the component mounts
  useEffect(() => {
    const storedRole = localStorage.getItem('role') as UserRole || null;

    //console.log(storedRole, "hhhhhhhhhhhhhhhh");
    if (storedRole && ['ceo', 'rh', 'candidate'].includes(storedRole)) {
      setUserRole(storedRole);
    }
  }, []);

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
    </nav>
  )
}
