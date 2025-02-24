"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Globe2, CheckCircle2, Languages, BookOpen, Star, GraduationCap, Phone, MessageSquare } from "lucide-react"
import dynamic from "next/dynamic"
const Confetti = dynamic(() => import("react-confetti"), { ssr: false })
import { motion } from "framer-motion"

// Payment link configuration
const PAYMENT_LINK_ID = "cm7c8wagn00034dzv71ddm09f" // You'll need to replace this with the correct payment link ID

interface PaymentStatus {
  success: boolean;
  email: string;
}

export default function TurkishCourse() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [phone, setPhone] = useState("")
  const [skypeId, setSkypeId] = useState("")

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      const normalizedEmail = email.toLowerCase();
      setEmail(normalizedEmail);
      
      try {
        await fetch('/api/check-payment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: normalizedEmail,
            phone: phone,
            skypeId: skypeId,
            paymentLinkID: PAYMENT_LINK_ID,
            action: 'register'
          }),
        });
        
        setIsEmailModalOpen(false);
        setIsPaymentModalOpen(true);
      } catch (error) {
        console.error('Error registering purchase:', error);
      }
    }
  }

  // Check for completed payment periodically
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        console.log('Checking payment status for:', email)
        const response = await fetch('/api/check-payment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email,
            paymentLinkID: PAYMENT_LINK_ID 
          }),
        })

        const data = await response.json()
        console.log('Payment status response:', data)
        
        if (data.success && data.shouldShowSuccess) {
          console.log('Payment completed and pending, updating UI')
          setIsPaymentModalOpen(false)
          setPaymentStatus({
            success: true,
            email: email
          })
          setShowConfetti(true)
          return true
        } else {
          console.log('Payment status conditions not met:', {
            success: data.success,
            shouldShow: data.shouldShowSuccess,
            isPending: data.isPending
          })
        }
        return false
      } catch (error) {
        console.error('Error checking payment status:', error)
        return false
      }
    }

    if (!email) return

    const pollInterval = setInterval(async () => {
      const completed = await checkPaymentStatus()
      if (completed) {
        clearInterval(pollInterval)
      }
    }, 2000)

    checkPaymentStatus()

    return () => {
      clearInterval(pollInterval)
    }
  }, [email])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Languages className="h-6 w-6 text-red-500" />
              <span className="font-bold text-gray-900">Turkish Course</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#about" className="text-gray-600 hover:text-red-500">About</a>
              <a href="#curriculum" className="text-gray-600 hover:text-red-500">Curriculum</a>
              <a href="#teacher" className="text-gray-600 hover:text-red-500">Teacher</a>
            </div>
          </div>
        </div>
      </nav>

      {showConfetti && <Confetti />}
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {paymentStatus?.success ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Teşekkür ederim! (Thank you!)
                  </h1>
                  <p className="text-gray-600 mb-4">
                    Your purchase was successful. Check your email ({paymentStatus.email}) for course access details.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/2">
                    <img
                      src="/TurkishCourse.png"
                      alt="Learn Turkish Online"
                      className="w-full rounded-lg mb-4 shadow-md"
                    />
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                      Master Turkish Language from Anywhere
                    </h2>
                    <div className="space-y-4 text-gray-600">
                      <p>
                        Immerse yourself in Turkish culture and language with our comprehensive
                        online course. Perfect for beginners and intermediate learners.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start space-x-2">
                          <Languages className="h-5 w-5 text-red-500 mt-1" />
                          <span>Full language immersion</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <BookOpen className="h-5 w-5 text-red-500 mt-1" />
                          <span>Structured curriculum</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Globe2 className="h-5 w-5 text-red-500 mt-1" />
                          <span>Cultural insights</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <GraduationCap className="h-5 w-5 text-red-500 mt-1" />
                          <span>Certificate included</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2">
                    <h1 className="text-3xl font-bold mb-2 text-gray-900">Turkish Language Course</h1>
                    <p className="text-4xl font-bold text-red-600 mb-4">US$49.00</p>
                    <p className="text-gray-600 mb-6">
                      Start your journey to Turkish fluency today with our comprehensive course.
                    </p>

                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                      <p className="font-bold text-red-700">🎉 Special Launch Offer!</p>
                      <p className="text-red-700">Enroll now and get lifetime access</p>
                    </div>

                    {/* Add Teacher Section before features */}
                    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop"
                            alt="Teacher"
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Ayşe Yılmaz</h3>
                          <p className="text-sm text-gray-500">Native Turkish Language Instructor</p>
                          <p className="mt-2 text-gray-600">
                            With over 10 years of experience teaching Turkish to international students, 
                            Ayşe brings a perfect blend of traditional and modern teaching methods. 
                            She's certified in Turkish language instruction and has helped hundreds of 
                            students achieve fluency.
                          </p>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center text-gray-700">
                        <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                        6 months of structured learning
                      </li>
                      <li className="flex items-center text-gray-700">
                        <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                        Native speaker video lessons
                      </li>
                      <li className="flex items-center text-gray-700">
                        <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                        Interactive exercises & quizzes
                      </li>
                      <li className="flex items-center text-gray-700">
                        <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                        Mobile-friendly platform
                      </li>
                    </ul>

                    <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="lg"
                          className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
                        >
                          <Star className="mr-2 h-5 w-5" />
                          Enroll Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Enter your details to continue</DialogTitle>
                          <DialogDescription>
                            We'll send your course access details to this email after purchase. 
                            Make sure to use the same email on the payment page.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEmailSubmit} className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email address *</Label>
                            <Input
                              id="email"
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email..."
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone number (optional)</Label>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Your phone number..."
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="skype">Skype ID (optional)</Label>
                            <div className="flex items-center space-x-2">
                              <MessageSquare className="h-4 w-4 text-gray-400" />
                              <Input
                                id="skype"
                                type="text"
                                value={skypeId}
                                onChange={(e) => setSkypeId(e.target.value)}
                                placeholder="Your Skype ID..."
                              />
                            </div>
                          </div>

                          <Button type="submit" className="w-full">Continue to Payment</Button>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                      <DialogContent className="max-w-4xl w-full !h-[90vh] p-0 bg-background">
                        <div className="relative h-full flex flex-col">
                          <div className="flex-1">
                            <iframe 
                              src={`https://app.braidpay.com/p/fTDoxCuo5Sy`}
                              className="w-full h-full border-[1px] border-gray-200 rounded-lg"
                              allow="payment"
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4">
            <div className="text-red-600 text-sm text-center border border-red-200 bg-red-50 p-2 rounded">
              This is a test page as a part of our BraidPay Use Case demos. This page does not actually sell any courses.
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-600 text-center md:text-left">
                © 2024 Turkish Language Course. All rights reserved.
              </div>
              <a href="https://braidpay.com" target="_blank" rel="noopener noreferrer">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Powered by</span>
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-24%20at%202.35.40%E2%80%AFPM-UqymRYWzvC1igf2clq8gjv0gQEvsvi.png"
                    alt="BraidPay Logo"
                    className="h-6"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 