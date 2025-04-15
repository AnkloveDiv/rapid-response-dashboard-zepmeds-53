import React, { useState, useRef, useEffect } from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  Video, 
  BookOpen,
  ArrowRight,
  Send,
  RefreshCw,
  Bot,
  ChevronRight
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AiService from '@/services/AiService';
import MainLayout from '@/components/layout/MainLayout';

interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Help = () => {
  const { toast } = useToast();
  const [userQuery, setUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'system',
      content: 'Hello! I\'m your emergency assistance AI. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Common questions for quick access
  const commonQuestions = [
    "How do I dispatch an ambulance?",
    "What do the different status colors mean?",
    "How do I use the live tracking feature?",
    "What should I do if a patient needs urgent care?",
    "How can I update ambulance information?"
  ];

  // Automatic scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!userQuery.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userQuery,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setUserQuery('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await AiService.generateResponse(userQuery);
      
      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommonQuestion = (question: string) => {
    setUserQuery(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6 p-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-gray-500">Get assistance with the Zepmeds Ambulance Dashboard</p>
        </div>

        <Tabs defaultValue="ai-assistant" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="resources">Help Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai-assistant" className="space-y-4 pt-4">
            <Card className="border-none shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl">
                  <Bot className="mr-2 h-5 w-5 text-purple-500" />
                  ZepMeds AI Assistant
                </CardTitle>
                <CardDescription>
                  Ask any questions about the emergency management system
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] overflow-y-auto p-4 bg-gray-50 rounded-md">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start mb-4 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role !== 'user' && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-purple-100 text-purple-600">AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`p-3 rounded-lg max-w-[80%] ${
                          message.role === 'user'
                            ? 'bg-purple-500 text-white'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs mt-1 text-gray-400">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8 ml-2">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-purple-100 text-purple-600">You</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start mb-4">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-purple-100 text-purple-600">AI</AvatarFallback>
                      </Avatar>
                      <div className="bg-white border border-gray-200 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                          <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-4">
                <div className="w-full flex flex-wrap gap-2">
                  {commonQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleCommonQuestion(question)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-full transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
                <div className="flex w-full gap-2">
                  <Input
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your question here..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isLoading || !userQuery.trim()}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-6 pt-4">
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
                    <AccordionTrigger>How do I use the live tracking feature?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-600 mb-2">
                        The live tracking feature helps monitor ambulances in real-time:
                      </p>
                      <ol className="list-decimal pl-5 space-y-1 text-gray-600">
                        <li>Navigate to the "Live Tracking" page from the sidebar</li>
                        <li>View all ambulances on the map with their current status</li>
                        <li>Click on an ambulance in the list to center the map on its location</li>
                        <li>The map updates in real-time as ambulances move</li>
                        <li>You can also see status updates for each ambulance</li>
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
                    <AccordionTrigger>How do I find the nearest hospital?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-600 mb-2">
                        To find the nearest hospital:
                      </p>
                      <ol className="list-decimal pl-5 space-y-1 text-gray-600">
                        <li>Navigate to the "Nearest Hospitals" page from the sidebar</li>
                        <li>The map will show hospitals near your current location</li>
                        <li>You can search for hospitals by name or address</li>
                        <li>Each hospital card shows distance from your current location</li>
                        <li>Click "Navigate" to get directions to the selected hospital</li>
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
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Help;
