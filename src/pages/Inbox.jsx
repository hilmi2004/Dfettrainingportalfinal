
import React from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { Search, Plus, Paperclip, Send, User, Star, Trash, ChevronRight, Mail, MailOpen } from "lucide-react";

const conversations = [
  {
    id: 1,
    user: "Dr. Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    title: "Web Development Project Feedback",
    preview: "Hi Alex, I've reviewed your project submission and wanted to provide some feedback...",
    time: "10:45 AM",
    unread: true,
    starred: true,
  },
  {
    id: 2,
    user: "Prof. Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    title: "Data Science Assignment Extension",
    preview: "Regarding your request for an extension on the assignment due this Friday...",
    time: "Yesterday",
    unread: false,
    starred: false,
  },
  {
    id: 3,
    user: "Student Services",
    avatar: "",
    title: "Registration for Fall Semester",
    preview: "This is a reminder that course registration for the fall semester will open on...",
    time: "May 20",
    unread: true,
    starred: false,
  },
  {
    id: 4,
    user: "Dr. Emma Williams",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    title: "Business Communication Group Project",
    preview: "Hello everyone, just a reminder about the group project presentation scheduled for...",
    time: "May 19",
    unread: false,
    starred: true,
  },
  {
    id: 5,
    user: "Library Services",
    avatar: "",
    title: "Overdue Book Notification",
    preview: "This is a courtesy notice that you have an overdue book: 'Advanced Programming Concepts'...",
    time: "May 18",
    unread: false,
    starred: false,
  },
];

const messages = [
  {
    id: 1,
    sender: "Dr. Sarah Johnson",
    text: "Hi Alex, I've reviewed your project submission and wanted to provide some feedback. Overall, your implementation of the responsive design elements is excellent. I particularly liked the way you handled the navigation menu on mobile devices.",
    time: "10:30 AM",
    isUser: false,
  },
  {
    id: 2,
    sender: "You",
    text: "Thank you, Dr. Johnson! I spent extra time on the mobile navigation, so I'm glad it paid off. Do you have any suggestions for improving the performance?",
    time: "10:35 AM",
    isUser: true,
  },
  {
    id: 3,
    sender: "Dr. Sarah Johnson",
    text: "Yes, I noticed a few opportunities to optimize performance. First, consider lazy loading images that are below the fold. Second, you might want to look into code splitting to reduce the initial bundle size. These changes could significantly improve your page load time.",
    time: "10:45 AM",
    isUser: false,
  },
];

const Inbox = () => {
  const [selectedConversation, setSelectedConversation] = React.useState(conversations[0]);
  const [messageText, setMessageText] = React.useState("");
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 flex page-transition">
          <div className="w-80 border-r border-gray-200 flex flex-col h-[calc(100vh-4rem)]">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Inbox</h2>
              <button className="p-1 rounded-full bg-teach-blue-500 text-white">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="pl-8 pr-4 py-2 rounded-lg bg-gray-100 border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-teach-blue-500/20 focus:border-teach-blue-500 transition-all duration-200"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedConversation.id === conversation.id ? "bg-teach-blue-50" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center gap-3">
                    {conversation.avatar ? (
                      <img
                        src={conversation.avatar}
                        alt={conversation.user}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-teach-blue-500 text-white flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className={`text-sm font-medium truncate ${conversation.unread ? "text-gray-900" : "text-gray-700"}`}>
                          {conversation.user}
                        </h3>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500 truncate">{conversation.title}</p>
                        <div className="flex items-center">
                          {conversation.starred && (
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          )}
                          {conversation.unread && (
                            <div className="h-2 w-2 rounded-full bg-teach-blue-500"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {selectedConversation.avatar ? (
                  <img
                    src={selectedConversation.avatar}
                    alt={selectedConversation.user}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-teach-blue-500 text-white flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-gray-800">{selectedConversation.user}</h2>
                  <p className="text-xs text-gray-500">{selectedConversation.title}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-1 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
                  <Star className="h-5 w-5" />
                </button>
                <button className="p-1 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
                  <Trash className="h-5 w-5" />
                </button>
                <button className="p-1 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] ${
                    message.isUser 
                      ? "bg-teach-blue-500 text-white rounded-t-lg rounded-bl-lg" 
                      : "bg-white border border-gray-200 text-gray-800 rounded-t-lg rounded-br-lg"
                  } p-4 shadow-sm`}>
                    {!message.isUser && (
                      <p className="font-medium text-sm mb-1">{message.sender}</p>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-2 text-right ${message.isUser ? "text-white/80" : "text-gray-500"}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end gap-2">
                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3">
                  <textarea
                    placeholder="Type your message..."
                    className="w-full resize-none focus:outline-none text-sm text-gray-700 max-h-32"
                    rows={1}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <button className="text-gray-500 hover:text-gray-700 transition-colors">
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <button
                      className={`rounded-full p-1.5 ${
                        messageText ? "bg-teach-blue-500 text-white" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Inbox;
