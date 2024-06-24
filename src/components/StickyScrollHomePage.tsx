"use client";
import React from "react";
import { StickyScroll } from "../components/ui/sticky-scroll-reveal";
import Image from "next/image";
import seamlessCommunication from '@/public/seamlessCommuntication.jpg'
import secureMessaging from '@/public/secureMessaging.jpg'
// const content = [
//   {
//     title: "Collaborative Editing",
//     description:
//       "Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.",
//     content: (
//       <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
//         Collaborative Editing
//       </div>
//     ),
//   },
//   {
//     title: "Real time changes",
//     description:
//       "See changes as they happen. With our platform, you can track every modification in real time. No more confusion about the latest version of your project. Say goodbye to the chaos of version control and embrace the simplicity of real-time updates.",
//     content: (
//       <div className="h-full w-full  flex items-center justify-center text-white">
//         <Image
//           src="/linear.webp"
//           width={300}
//           height={300}
//           className="h-full w-full object-cover"
//           alt="linear board demo"
//         />
//       </div>
//     ),
//   },
//   {
//     title: "Version control",
//     description:
//       "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
//     content: (
//       <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
//         Version control
//       </div>
//     ),
//   },
//   {
//     title: "Running out of content",
//     description:
//       "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
//     content: (
//       <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
//         Running out of content
//       </div>
//     ),
//   },
// ];

const content = [
    {
        title: "Seamless Communication",
        description:
            "Stay connected with your team and friends in real time. Our app ensures smooth and uninterrupted communication, allowing you to share messages, files, and ideas effortlessly.",
        content: (
            <div className="h-full w-full flex items-center justify-center text-white">
                <Image
                    src={seamlessCommunication}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover"
                    alt="Instant notifications"
                />
            </div>
        ),
    },
    {
        title: "Group Chats",
        description:
            "Create and manage group chats with ease. Whether it's for work, family, or friends, you can organize your conversations and keep everyone engaged in a single space.",
        content: (
            <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
                Group Chats
            </div>
        ),
    },
    {
        title: "Secure Messaging",
        description:
        "Your privacy is our priority. All your messages are encrypted, ensuring that your conversations remain confidential and secure.",
        content: (
            <div className="h-full w-full flex items-center justify-center text-white">
            <Image
                src={secureMessaging}
                width={300}
                height={300}
                className="h-full w-full object-cover"
                alt="Instant notifications"
            />
        </div>
        ),
    },
];




export default function StickyScrollRevealDemo() {
    return (
        <div className="py-10">
            <StickyScroll content={content} />
        </div>
    );
}
