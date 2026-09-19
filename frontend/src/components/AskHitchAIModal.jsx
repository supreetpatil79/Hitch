import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles, X, Send, Upload, Image as ImageIcon,
  Package, Shield, HelpCircle, ArrowRight, CheckCircle2,
  RefreshCw, Bot, FileText, CornerDownLeft
} from "lucide-react";

export default function AskHitchAIModal({ isOpen, onClose, packageContext = {} }) {
  if (!isOpen) return null;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "👋 **Hi! I'm Hitch AI**, powered by Amazon Bedrock (Claude 3.5 Sonnet).\n\nI can help you with:\n- **Sending a Package:** Step-by-step wizard, photo audit & carrier matching\n- **Carrier Earnings:** How to monetize your trips with a 62% take-home payout\n- **Security Protocols:** The RBI ₹10 banknote tamper seal & OTP handshakes\n- **Packaging & Safety:** Anti-tamper advice & contraband checks",
      time: "Just now",
      suggestions: [
        "How do I send a package?",
        "How do I earn as a carrier?",
        "How does the ₹10 Banknote Seal work?",
        "What are the pricing slabs per kg?"
      ]
    }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || "https://zq2mtwye39.execute-api.ap-south-1.amazonaws.com/chat/advisor";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const callBedrockChat = async ({ userMessage, imageBase64, imageMediaType }) => {
    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage || "",
        conversation_history: conversationHistory,
        package_context: packageContext,
        image_base64: imageBase64 || null,
        image_media_type: imageMediaType || null,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  };

  const addBotMessage = (text, suggestions = []) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: "bot",
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions,
      },
    ]);
  };

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: query,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      },
    ]);
    setInput("");
    setIsTyping(true);

    try {
      const data = await callBedrockChat({ userMessage: query });
      setConversationHistory(prev => [
        ...prev,
        { role: "user", content: [{ type: "text", text: query }] },
        { role: "assistant", content: [{ type: "text", text: data.reply }] },
      ]);
      addBotMessage(data.reply, data.suggestions || []);
    } catch (err) {
      console.error("Bedrock chat error:", err);
      addBotMessage(
        "I had a brief connection timeout reaching Amazon Bedrock. Please try asking again!",
        ["How do I send a package?", "How does the ₹10 Banknote Seal work?"]
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: `📸 Uploaded photo: ${file.name}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      },
    ]);
    setIsTyping(true);

    try {
      const fileNameLower = file.name.toLowerCase();
      const weaponKeywords = ['gun', 'knife', 'weapon', 'blade', 'pistol', 'rifle', 'bullet', 'bomb', 'glock', 'revolver', 'dagger', 'scissors', 'sharp', 'machete', 'sword'];
      const hasWeaponName = weaponKeywords.some(kw => fileNameLower.includes(kw));

      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const mediaType = file.type === "image/png" ? "image/png" : "image/jpeg";
      
      const data = await callBedrockChat({
        userMessage: hasWeaponName ? `[CRITICAL INSPECTION - POTENTIAL HAZARD: ${file.name}] Inspect parcel photo for weapons, contraband, and tamper resistance.` : "Inspect this parcel photo for safety and packaging compliance.",
        imageBase64: base64,
        imageMediaType: mediaType
      });

      setConversationHistory(prev => [
        ...prev,
        { role: "user", content: [{ type: "text", text: `[Uploaded Image: ${file.name}]` }] },
        { role: "assistant", content: [{ type: "text", text: data.reply }] },
      ]);
      addBotMessage(data.reply, data.suggestions || []);
    } catch (err) {
      console.error("Photo inspection error:", err);
      addBotMessage(
        "Could not inspect photo right now. Please ensure your parcel is placed in a secure, opaque corrugated box before booking.",
        ["What items are prohibited?", "How does the ₹10 Banknote Seal work?"]
      );
    } finally {
      setIsTyping(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Render markdown with bullet points, numbered lists, and bold highlights
  const renderFormattedText = (text) => {
    return text.split("\n").map((line, lineIdx) => {
      const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("• ") || line.trim().startsWith("* ");
      const isNumbered = /^\d+\.\s/.test(line.trim());
      const cleanLine = isBullet ? line.replace(/^[\s\-•*]+/, "") : isNumbered ? line.replace(/^\d+\.\s+/, "") : line;

      const parts = cleanLine.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={pIdx} className="font-semibold text-zinc-900">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={pIdx} className="bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded text-[11px] font-mono border border-zinc-200">{part.slice(1, -1)}</code>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={lineIdx} className="flex items-start gap-2 my-1 pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-hitchOrange mt-1.5 shrink-0" />
            <span className="flex-1 leading-relaxed text-zinc-700">{parts}</span>
          </div>
        );
      }

      if (isNumbered) {
        const numMatch = line.trim().match(/^(\d+)\./);
        const num = numMatch ? numMatch[1] : "·";
        return (
          <div key={lineIdx} className="flex items-start gap-2 my-1 pl-1">
            <span className="w-4 h-4 rounded-full bg-zinc-200 text-zinc-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {num}
            </span>
            <span className="flex-1 leading-relaxed text-zinc-700">{parts}</span>
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={lineIdx} className="h-1.5" />;
      }

      return <p key={lineIdx} className="leading-relaxed text-zinc-700 my-0.5">{parts}</p>;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[88vh] sm:h-[680px] shadow-2xl border border-zinc-200 overflow-hidden flex flex-col">
        
        {/* Header - Clean Light Corporate Style */}
        <div className="bg-white px-5 py-4 border-b border-zinc-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-hitchOrange to-orange-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-900 tracking-tight">Ask Hitch AI</h2>
                <span className="text-[10px] font-semibold bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full border border-violet-200">
                  Claude 3.5 Sonnet · Bedrock
                </span>
              </div>
              <p className="text-xs text-zinc-500">24/7 intelligent guide for booking, earnings, safety &amp; OTP handshakes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Help Topic Bar */}
        <div className="bg-zinc-50/80 px-4 py-2 border-b border-zinc-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-xs">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-1 shrink-0">Topics:</span>
          {[
            { label: "📦 How to Send", query: "How do I send a package using the Sender Portal?" },
            { label: "🚆 How to Earn", query: "How do I register as a carrier and earn 62% payout?" },
            { label: "🛡️ ₹10 Seal & OTP", query: "How does the ₹10 Banknote Seal and OTP handshake work?" },
            { label: "💰 Pricing Slabs", query: "Explain the pricing model and transport rate slabs per kg." },
          ].map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSend(topic.query)}
              className="px-2.5 py-1 bg-white hover:bg-orange-50 text-zinc-700 hover:text-hitchOrange border border-zinc-200 hover:border-hitchOrange/50 rounded-lg font-medium text-[11px] whitespace-nowrap transition-all shadow-2xs">
              {topic.label}
            </button>
          ))}
        </div>

        {/* Chat Conversation Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-zinc-50/40 text-xs">
          {messages.map(m => (
            <div key={m.id} className={"flex flex-col " + (m.sender === "user" ? "items-end" : "items-start")}>
              <div
                className={"max-w-[88%] rounded-2xl p-4 " +
                  (m.sender === "user"
                    ? "bg-hitchOrange text-white rounded-br-xs shadow-md shadow-orange-500/10"
                    : "bg-white text-zinc-800 border border-zinc-200/90 rounded-bl-xs shadow-xs")}>
                {m.sender === "bot" ? (
                  <div className="text-zinc-800 text-[12px]">{renderFormattedText(m.text)}</div>
                ) : (
                  <p className="text-[13px] leading-relaxed font-medium">{m.text}</p>
                )}
                <span className={"text-[9px] block text-right mt-1.5 " + (m.sender === "user" ? "text-orange-100" : "text-zinc-400")}>
                  {m.time}
                </span>
              </div>

              {/* Dynamic Action Chips */}
              {m.suggestions && m.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[88%]">
                  {m.suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (s.toLowerCase().includes("photo") || s.toLowerCase().includes("upload") || s.toLowerCase().includes("audit")) {
                          fileInputRef.current?.click();
                        } else {
                          handleSend(s);
                        }
                      }}
                      className="text-[11px] font-medium bg-white hover:bg-orange-50/80 text-zinc-700 hover:text-hitchOrange border border-zinc-200 hover:border-hitchOrange/60 px-3 py-1.5 rounded-full shadow-2xs transition-all flex items-center gap-1.5 group">
                      {s.toLowerCase().includes("photo") || s.toLowerCase().includes("upload") ? (
                        <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                      )}
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2.5 text-zinc-500 text-xs bg-white p-3.5 rounded-2xl border border-zinc-200 w-fit shadow-xs animate-fadeIn">
              <Sparkles className="w-4 h-4 text-hitchOrange animate-spin" />
              <span className="font-medium">Hitch AI is generating answer</span>
              <span className="flex gap-1 items-center ml-1">
                <span className="w-1.5 h-1.5 bg-hitchOrange rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-hitchOrange rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-hitchOrange rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-zinc-200 shrink-0">
          <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload parcel photo for Bedrock AI visual inspection"
              className="p-3 rounded-2xl border border-zinc-200 hover:border-hitchOrange hover:bg-orange-50 text-zinc-500 hover:text-hitchOrange transition-all shrink-0 flex items-center gap-1.5 text-xs font-semibold">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Photo Audit</span>
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything: how to book, carrier payout, ₹10 seal, packaging rules..."
              className="flex-1 px-4 py-3 border border-zinc-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/30 focus:border-hitchOrange"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="p-3 bg-hitchOrange hover:bg-hitchOrange-hover text-white rounded-2xl transition-all shadow-md shadow-orange-500/20 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
