'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, MessageSquare, LayoutDashboard, HelpCircle, Share2, Music2, Target, Copyright, FileText } from 'lucide-react';

export default function TutorialsPage() {
  return (
    <div className="container mx-auto px-6 pt-24 pb-16">
      <div className="max-w-[1200px] mx-auto">
        <Breadcrumb 
          items={[{ href: '/tutorials', label: 'Tutorials' }]}
          className="mb-8" 
        />

        <div className="mb-12 max-w-3xl">
          <h1 className="text-4xl font-black mb-4">Get basic guidance and tips for your music career</h1>
          <p className="text-secondary/70 text-lg">Learn how to use KOOL's features to boost your music career</p>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="mb-12 grid grid-cols-3 gap-6">
            <TabsTrigger value="credits" className="flex items-center gap-3 data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-4">
              <Home className="h-5 w-5" />
              Add Credits
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-3 data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-4">
              <MessageSquare className="h-5 w-5" />
              Smart Chat
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-3 data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-4">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="credits">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="aspect-video mb-12">
                  <video 
                    src="/videos/add_credits.mov" 
                    controls 
                    className="w-full shadow-lg"
                  />
                </div>
                <div className="prose prose-sm max-w-none px-4 pb-4">
                  <h2 className="text-3xl font-bold mb-6">Credits System</h2>
                  <p className="text-secondary/70 text-lg mb-8">Credits are KOOL's currency that allows you to access specialized agents. Each new user receives 3 welcome credits.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-secondary/5 p-8">
                      <h3 className="text-xl font-bold mb-4">How to Get Credits</h3>
                      <ul className="space-y-3 text-secondary/70">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary flex-shrink-0" />
                          Purchase additional credits based on your needs
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary flex-shrink-0" />
                          View your current credit balance in the header
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary flex-shrink-0" />
                          Special promotions and rewards
                        </li>
                      </ul>
                    </div>
                    <div className="bg-secondary/5 p-8">
                      <h3 className="text-xl font-bold mb-4">Using Credits</h3>
                      <ul className="space-y-3 text-secondary/70">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary flex-shrink-0" />
                          Each specialized agent consumes specific credits
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary flex-shrink-0" />
                          Credits are automatically deducted
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary flex-shrink-0" />
                          Track your credit usage history
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="aspect-video mb-12">
                  <video 
                    src="/videos/chat.mov" 
                    controls 
                    className="w-full shadow-lg"
                  />
                </div>
                <div className="prose prose-sm max-w-none px-4 pb-4">
                  <h2 className="text-3xl font-bold mb-6">Specialized AI Agents</h2>
                  <p className="text-secondary/70 text-lg mb-8">Access different AI agents specialized in various aspects of the music industry, each trained with your specific artist data.</p>
                  <div className="space-y-6">
                    <div className="bg-secondary/5 p-12">
                      <h3 className="text-2xl font-black mb-12 px-4">FREE & SOCIAL</h3>
                      <div className="grid grid-cols-2 gap-24">
                        <div className="text-center">
                          <HelpCircle className="h-12 w-12 text-primary mx-auto mb-6" />
                          <h4 className="text-lg font-black uppercase mb-4">Free Agent</h4>
                          <p className="text-secondary/70 text-lg">General music industry advice</p>
                        </div>
                        <div className="text-center">
                          <Share2 className="h-12 w-12 text-primary mx-auto mb-6" />
                          <h4 className="text-lg font-black uppercase mb-4">Social Agent</h4>
                          <p className="text-secondary/70 text-lg">Social media strategies</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-secondary/5 p-12">
                      <h3 className="text-2xl font-black mb-12 px-4">GROWTH & MARKETING</h3>
                      <div className="grid grid-cols-2 gap-24">
                        <div className="text-center">
                          <Music2 className="h-12 w-12 text-primary mx-auto mb-6" />
                          <h4 className="text-lg font-black uppercase mb-4">Spotify Agent</h4>
                          <p className="text-secondary/70 text-lg">Streaming optimization</p>
                        </div>
                        <div className="text-center">
                          <Target className="h-12 w-12 text-primary mx-auto mb-6" />
                          <h4 className="text-lg font-black uppercase mb-4">Marketing Agent</h4>
                          <p className="text-secondary/70 text-lg">Promotion strategies</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-secondary/5 p-12">
                      <h3 className="text-2xl font-black mb-12 px-4">BUSINESS & LEGAL</h3>
                      <div className="grid grid-cols-2 gap-24">
                        <div className="text-center">
                          <Copyright className="h-12 w-12 text-primary mx-auto mb-6" />
                          <h4 className="text-lg font-black uppercase mb-4">Publishing Agent</h4>
                          <p className="text-secondary/70 text-lg">Copyright & licensing</p>
                        </div>
                        <div className="text-center">
                          <FileText className="h-12 w-12 text-primary mx-auto mb-6" />
                          <h4 className="text-lg font-black uppercase mb-4">Contracts Agent</h4>
                          <p className="text-secondary/70 text-lg">Legal aspects</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="aspect-video mb-12">
                  <video 
                    src="/videos/dashboard.mov" 
                    controls 
                    className="w-full shadow-lg"
                  />
                </div>
                <div className="prose prose-sm max-w-none px-4 pb-4">
                  <h2 className="text-3xl font-bold mb-6">Growth Strategy Dashboard</h2>
                  <p className="text-secondary/70 text-lg mb-8">Your control center for managing and tracking your music career growth strategy.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-secondary/5 p-8">
                      <h3 className="text-xl font-bold mb-4">Task Management</h3>
                      <ul className="space-y-3 text-secondary/70">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary flex-shrink-0" />
                          Calendar view for scheduled activities
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary flex-shrink-0" />
                          Track progress of each task
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary flex-shrink-0" />
                          Toggle between calendar and list views
                        </li>
                      </ul>
                    </div>
                    <div className="bg-secondary/5 p-8">
                      <h3 className="text-xl font-bold mb-4">Organization</h3>
                      <ul className="space-y-3 text-secondary/70">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary flex-shrink-0" />
                          Categorize by channel and goal
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary flex-shrink-0" />
                          Track metrics and progress
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary flex-shrink-0" />
                          Manage task dependencies
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 