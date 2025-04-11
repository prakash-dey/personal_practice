"use client"
import { cn } from "@/utils";
import Image from "next/image"
import { useState } from "react";

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
  }

interface SavedMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

const Agent = ({userName}:AgentProps) => {
   
    const [lastMessage, setLastMessage] = useState("");
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    const isSpeaking = false;
    const callStatus = CallStatus.ACTIVE;
  return (
    <>
    <div className="call-view">
        <div className="card-interviewer">
            <div className="avatar">
                <Image src={"/ai-avatar.png"} alt="profile image" height={54} width={65} className="object-cover"/>
                {isSpeaking && <span className="animate-speak"/>}
            </div>
            <h3>AI Interviewer</h3>
        </div>
        <div className="card-border">
            <div className="card-content">
                <Image src={"/user-avatar.png"} alt="profile image" height={150} width={150} className="rounded-full object-cover"/>
                <h3>{userName??"Prakash"}</h3>
            </div>

        </div>
    </div>

    {messages.length > 0 && (
        <div className="transcript-border">
            <div className="transcript">
            <p key={lastMessage} className={cn("transition-opacity duration-500 opacity-0","animate-fadeIn opacity-100")}>
                {lastMessage}
            </p>
            </div>

        </div>
    )}


<div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={() => console.log("call")}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => console.log("call")}>
            End
          </button>
        )}
      </div>

    </>
  )
}

export default Agent