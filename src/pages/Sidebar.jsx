// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { LayoutDashboard, BookOpen, Users, Mail, BookCopy, Settings, GraduationCap, Coins } from "lucide-react";
// const navItems = [{
//     name: "Dashboard",
//     icon: <LayoutDashboard size={20} />,
//     path: "/"
// }, {
//     name: "Courses",
//     icon: <BookOpen size={20} />,
//     path: "/courses"
// }, {
//     name: "Instructors",
//     icon: <Users size={20} />,
//     path: "/instructors"
// }, {
//     name: "Inbox",
//     icon: <Mail size={20} />,
//     path: "/inbox"
// }, {
//     name: "Library",
//     icon: <BookCopy size={20} />,
//     path: "/library"
// }, {
//     name: "Grades",
//     icon: <GraduationCap size={20} />,
//     path: "/grades"
// }, {
//     name: "Points",
//     icon: <Coins size={20} />,
//     path: "/points"
// }, {
//     name: "Settings",
//     icon: <Settings size={20} />,
//     path: "/settings"
// }];
// const Sidebar = () => {
//     const location = useLocation();
//     return <aside className="bg-teach-blue-500 w-64 min-h-screen flex flex-col py-6 fixed left-0 top-0 h-full overflow-y-auto z-40 transition-all duration-300">
//         <div className="px-6 mb-8">
//             <h1 className="text-2xl font-bold text-white">TeachMingle</h1>
//             <p className="text-white/70 text-sm mt-1">Learning Management System</p>
//         </div>
//
//         <nav className="flex-1 px-3">
//             <ul className="space-y-1">
//                 {navItems.map(item => <li key={item.name}>
//                     <Link to={item.path} className={`nav-item ${location.pathname === item.path ? "nav-item-active" : "nav-item-inactive"}`}>
//                         {item.icon}
//                         <span className="my-0 mx-0">{item.name}</span>
//                     </Link>
//                 </li>)}
//             </ul>
//         </nav>
//
//         <div className="px-3 mt-auto pt-6">
//             <div className="rounded-lg bg-teach-blue-600 p-4 text-white">
//                 <h3 className="font-medium mb-2">Need Help?</h3>
//                 <p className="text-white/80 text-sm mb-3">Our support team is ready to assist you!</p>
//                 <button className="bg-white text-teach-blue-600 px-4 py-1.5 rounded-md text-sm font-medium w-full">
//                     Contact Support
//                 </button>
//             </div>
//         </div>
//     </aside>;
// };
// export default Sidebar;