
import React from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  Video, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MainLayout from '@/components/layout/MainLayout';

const Help = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-gray-500">Get assistance with the Zepmeds Ambulance Dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-purple-50 to-red-50 border-none">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-purple-500" />
                Live Support
              </CardTitle>
              <CardDescription>
                Connect with our support team for immediate assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-gray-500">Available 24/7</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-sm text-gray-500">Available 24/7</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-purple-500 hover:bg-purple-600">
                Contact Support
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="mr-2 h-5 w-5 text-red-500" />
                Training & Resources
              </CardTitle>
              <CardDescription>
                Learn how to use the dashboard effectively
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">User Guides</p>
                  <p className="text-sm text-gray-500">Comprehensive documentation</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <Video className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Video Tutorials</p>
                  <p className="text-sm text-gray-500">Step-by-step visual guides</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Explore Resources
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Find quick answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I dispatch an ambulance?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 mb-2">
                    To dispatch an ambulance, follow these steps:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-gray-600">
                    <li>Navigate to the Emergency Requests page</li>
                    <li>Select a pending emergency request</li>
                    <li>Click on "View Details" to open the request details</li>
                    <li>Select an available ambulance from the dropdown menu</li>
                    <li>Click the "Dispatch Ambulance" button</li>
                    <li>Confirm the action in the dialog that appears</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>What do the different emergency status colors mean?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 mb-2">
                    The color coding system helps quickly identify emergency status:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                      <span className="text-gray-600"><strong>Orange (Pending)</strong>: New request waiting for ambulance dispatch</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      <span className="text-gray-600"><strong>Blue (Dispatched)</strong>: Ambulance is on the way to the patient</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-gray-600"><strong>Green (Completed)</strong>: Emergency has been successfully addressed</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      <span className="text-gray-600"><strong>Red (Cancelled)</strong>: Request was cancelled for some reason</span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How do I use the navigation feature?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 mb-2">
                    The navigation feature helps ambulance drivers find the quickest route to a patient:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-gray-600">
                    <li>Open an emergency request's details page</li>
                    <li>Find the map section showing the patient's location</li>
                    <li>Click the "Navigate to Patient" button below the map</li>
                    <li>This will open Google Maps with the optimal route in a new tab</li>
                    <li>The driver can follow this route on their mobile device</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>What should I do if an ambulance is unavailable?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 mb-2">
                    If all ambulances are currently dispatched or in maintenance:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>Check the "Ambulance Status" section on the dashboard to see when one might become available</li>
                    <li>Contact nearby hospitals or ambulance services for assistance</li>
                    <li>Mark high-priority emergencies for immediate attention when an ambulance becomes available</li>
                    <li>Consider updating ambulance maintenance schedules during peak hours</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>How do I update my hospital/ambulance firm details?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 mb-2">
                    To update your hospital or ambulance firm information:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-gray-600">
                    <li>Click on your profile picture in the top-right corner</li>
                    <li>Select "Settings" from the dropdown menu</li>
                    <li>Navigate to the "Organization Details" tab</li>
                    <li>Update your information as needed</li>
                    <li>Click "Save Changes" to apply your updates</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Get in touch with our support team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-gray-600">+91 1800-ZEPMEDS (1800-937-6337)</p>
                  <p className="text-sm text-gray-500">Available 24/7 for emergency support</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-gray-600">support@zepmeds.com</p>
                  <p className="text-sm text-gray-500">Response within 2-4 hours</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-gray-600">Available on dashboard</p>
                  <p className="text-sm text-gray-500">Instant support for urgent issues</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Documentation</p>
                  <p className="text-gray-600">docs.zepmeds.com</p>
                  <p className="text-sm text-gray-500">Comprehensive user guides and tutorials</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600">
              <Phone className="mr-2 h-4 w-4" />
              Call Support
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </CardFooter>
        </Card>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-red-500 p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">Need additional help?</h3>
                <p className="text-white/80">Our team is available 24/7 to help you with any issues.</p>
              </div>
              <Button className="bg-white text-purple-600 hover:bg-gray-100">
                Request Custom Support
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Help;
