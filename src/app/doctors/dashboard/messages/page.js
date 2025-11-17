"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  
  // 1. Initialize doctorId as state, starting as null
  const [doctorId, setDoctorId] = useState(null); 
  
  // Effect 1: Authenticate and retrieve user ID
  useEffect(() => {
    const getUserId = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Set the doctorId state with the user's actual UUID
          setDoctorId(user.id);
        } else {
          setError("Doctor not logged in.");
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to check authentication status.");
        setLoading(false);
      }
    };
    getUserId();
  }, []); // Runs only once on mount

  // Effect 2: Fetch and Subscribe to messages once doctorId is available
  useEffect(() => {
    // 2. Guard clause: Do not proceed until doctorId is set
    if (!doctorId) {
      if (!error) setLoading(true); // Keep loading if not yet authenticated
      return; 
    }

    const fetchMessages = async () => {
      setLoading(true);
      setError("");

      try {
        const { data, error: dbError } = await supabase
          .from("messages")
          .select("*")
          .eq("doctor_id", doctorId) // Correctly uses the UUID
          .order("created_at", { ascending: true });

        if (dbError) {
          setError(dbError.message);
        } else {
          setMessages(data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Real-time subscription to new messages
    const subscription = supabase
      .channel("messages_channel")
      .on(
        "postgres_changes",
        { 
          event: "INSERT", 
          schema: "public", 
          table: "messages", 
          // 3. Subscription filter uses the dynamic doctorId
          filter: `doctor_id=eq.${doctorId}` 
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    // Cleanup function to remove the subscription when the component unmounts
    return () => supabase.removeChannel(subscription);
  }, [doctorId, error]); // Reruns when doctorId changes

  // Use useCallback to memoize the function, preventing unnecessary re-renders
  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !doctorId) return; // Also checks for doctorId

    try {
      // 4. Send function uses the dynamic doctorId
      await supabase.from("messages").insert([
        {
          doctor_id: doctorId,
          // NOTE: You'll likely need to fetch or determine the patient_id/name here
          patient_name: "Doctor", // Placeholder for the sender's name
          message: newMessage,
        },
      ]);

      setNewMessage("");
    } catch (err) {
      console.error(err);
      setError("Failed to send message.");
    }
  }, [newMessage, doctorId]);

  return (
    <div className="flex flex-col h-full bg-gray-50 p-6 rounded-xl shadow-lg">
      <h2 className="text-3xl font-extrabold text-blue-800 mb-6">Patient Messages</h2>

      {/* Loading & Error Indicators */}
      {loading && <p className="text-blue-600 font-medium">Loading messages...</p>}
      {error && <p className="text-red-500 font-medium p-3 bg-red-100 rounded-lg border border-red-300">Error: {error}</p>}

      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-6 p-4 border border-gray-200 rounded-xl bg-white h-[60vh]">
        {messages.length === 0 && !loading && !error && <p className="text-gray-500 italic text-center py-10">No messages yet. Start a new conversation.</p>}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.doctor_id === doctorId ? 'items-end' : 'items-start'}`}
          >
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-md ${
              msg.doctor_id === doctorId // Assuming message direction logic
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-800 rounded-tl-none'
            }`}>
              <span className="font-bold text-sm block mb-1">
                {msg.doctor_id === doctorId ? 'You' : msg.patient_name || 'Patient'}
              </span>
              <span className="text-sm">{msg.message}</span>
            </div>
            <span className={`text-xs mt-1 ${msg.doctor_id === doctorId ? 'text-gray-500 pr-1' : 'text-gray-500 pl-1'}`}>
              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>

      {/* Send new message Form */}
      <form onSubmit={handleSendMessage} className="flex gap-3">
        <input
          type="text"
          placeholder={doctorId ? "Type your message..." : "Awaiting authentication..."}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-100"
          disabled={!doctorId || loading}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          disabled={!doctorId || loading || !newMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
