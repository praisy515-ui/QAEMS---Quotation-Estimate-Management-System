import React, { useState, useEffect, useRef } from "react";
import { storage } from "../utils/storage";
import { quotationService } from "../services/quotationService";
import { Bot, Send, User, Sparkles, MessageSquare, ArrowRight } from "lucide-react";

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load chat history or seed initial welcome message
    const history = storage.get("qaems_ai_chat");
    if (history && history.length > 0) {
      setMessages(history);
    } else {
      const welcome = [
        {
          id: "1",
          sender: "ai",
          text: "Hello! I am your Glory Simon Interiors Assistant. I can recommend material grades, lighting layouts, furniture choices, and budget estimates for your design projects. What room type are we looking at today?",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(welcome);
      storage.set("qaems_ai_chat", welcome);
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = (textToSend) => {
    const userMsgText = textToSend.trim();
    if (!userMsgText) return;

    // 1. Add User Message
    const userMsg = {
      id: `USR-${Date.now()}`,
      sender: "user",
      text: userMsgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    storage.set("qaems_ai_chat", updated);
    setInput("");
    setTyping(true);

    // 2. Trigger AI Response after delay
    setTimeout(() => {
      const aiReplyText = getBotReply(userMsgText);
      const aiMsg = {
        id: `AI-${Date.now()}`,
        sender: "ai",
        text: aiReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const finalMessages = [...updated, aiMsg];
      setMessages(finalMessages);
      storage.set("qaems_ai_chat", finalMessages);
      setTyping(false);
    }, 1000);
  };

  // Rule-based keyword matching responder
  const getBotReply = (text) => {
    const val = text.toLowerCase();
    
    if (val.includes("summary") || val.includes("estimate summary")) {
      const quotes = quotationService.getQuotations();
      if (quotes && quotes.length > 0) {
        const latest = quotes[quotes.length - 1];
        return `Latest Estimate Summary (${latest.id}):
- Client Name: ${latest.clientName}
- Space Config: ${latest.numRooms}x ${latest.roomType} (${latest.area} sq ft)
- Material Quality: ${latest.materialQuality} Tier
- Base Framing Cost: ${latest.costBreakdown?.roomCost ? `$${latest.costBreakdown.roomCost.toLocaleString()}` : "N/A"}
- Material Supply Cost: ${latest.costBreakdown?.materialCost ? `$${latest.costBreakdown.materialCost.toLocaleString()}` : "N/A"}
- Furniture Cost: ${latest.costBreakdown?.furnitureCost ? `$${latest.costBreakdown.furnitureCost.toLocaleString()}` : "N/A"}
- Labour Cost: ${latest.costBreakdown?.labourCost ? `$${latest.costBreakdown.labourCost.toLocaleString()}` : "N/A"}
- Tax (${latest.costBreakdown?.taxPercentage}%): ${latest.costBreakdown?.taxAmount ? `$${latest.costBreakdown.taxAmount.toLocaleString()}` : "N/A"}
- Discount (${latest.discountPercentage}%): ${latest.costBreakdown?.discountAmount ? `-$${latest.costBreakdown.discountAmount.toLocaleString()}` : "N/A"}
- Grand Total: ${latest.costBreakdown?.grandTotal ? `$${latest.costBreakdown.grandTotal.toLocaleString()}` : "N/A"}
- Approval Status: ${latest.status}`;
      } else {
        return "Estimate Summary:\nCurrently, there are no active quotations in the database. Please go to the 'New Quotation' page to build your first dynamic design estimate.";
      }
    }
    
    if (val.includes("recommend") || val.includes("material")) {
      return `Material Recommendations Catalog Tiers:
1. Basic: Suitable for budget-friendly rental units. Uses HDF/Commercial MDF carcass frames ($15/sq ft) with glossy solid color laminates.
2. Standard: Great balance for family homes. Uses Boiling Water Resistant (BWR) Plywood ($30/sq ft) with acrylic or textured laminate finishes. Recommended for kitchens.
3. Premium: Elegant residential layouts. Uses solid Teak wood veneers ($55/sq ft) with premium quartz stone surfaces ($65/sq ft) and PU matte finish coats.
4. Luxury: High-end bespoke commercial or luxury residential properties. Uses Bespoke Solid Mahogany & Walnut Cabinetry ($90/sq ft) and imported Italian Statuario marble ($120/sq ft).`;
    }
    
    if (val.includes("optimize") || val.includes("saving") || val.includes("optimization")) {
      return `Cost Optimization Suggestions:
- Material Grade Swap: Downgrade from Luxury ($90/sq ft) to Premium ($55/sq ft) or Standard ($30/sq ft) to save between 30% and 60% on carcass fabrications.
- Simplify Lighting: Choosing a 'Decorative' lighting layout ($1,200) instead of a fully-automated 'Smart' lighting setup ($2,500) saves $1,300 flat per room.
- Deliverable Optimization: Limit custom false ceilings to living areas only and use standard spot downlights in bedrooms (saves ~$6/sq ft).
- Scope Selection: Re-evaluate optional storage units or modular accessories in guest rooms.`;
    }
    
    if (val.includes("follow") || val.includes("message") || val.includes("email")) {
      const quotes = quotationService.getQuotations();
      const clientName = quotes.length > 0 ? quotes[quotes.length - 1].clientName : "Valued Client";
      const quoteId = quotes.length > 0 ? quotes[quotes.length - 1].id : "Q-2026-XXX";
      const total = quotes.length > 0 && quotes[quotes.length - 1].costBreakdown ? `$${quotes[quotes.length - 1].costBreakdown.grandTotal.toLocaleString()}` : "$X,XXX";
      return `Professional Client Follow-up Draft:
--------------------------------------------------
Subject: Proposal Follow-up - Glory Simon Interiors - ${quoteId}

Dear ${clientName},

I hope you are doing well. 

I am writing to follow up on the interior design estimate proposal (${quoteId}) we shared recently for your space. The grand total came to ${total}, which includes all itemized charges, professional labour, and tax.

Please let us know if you would like to schedule a walk-through at our studio to explore material samples or refine the scope deliverables.

Looking forward to creating a beautiful space with you.

Best regards,
Glory Simon
Glory Simon Interiors
--------------------------------------------------`;
    }
    
    if (val.includes("kitchen")) {
      return "For a modular kitchen layout, we recommend Boiling Water Resistant (BWR) plywood carcass structure topped with high-gloss laminates or acrylic facings. Countertops are best finished with Premium Quartz (approx. $65/sq ft) or Luxury Italian Statuario Marble ($120/sq ft) for ultimate durability. Standard modular kitchen accessories package ranges from $3,500 to $5,000 flat rate.";
    }
    if (val.includes("bedroom") || val.includes("wardrobe")) {
      return "For luxury bedrooms, we advise setting up a 3-door sliding wardrobe (approx. $1,200 base rate per room) using standard MDF or BWR ply. Combine it with decorative false ceilings and warm profile LED ribbons ($1,200) to create a relaxed, cozy ambiance. Total bedroom estimates usually range between $2,500 and $5,000 depending on material quality.";
    }

    return "I can help you evaluate interior layouts! Ask me about:\n- 'generate estimate summary'\n- 'material recommendations'\n- 'cost optimization suggestions'\n- 'generate client follow-up message'\n- 'modular kitchen accessories'";
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear chat history?")) {
      storage.remove("qaems_ai_chat");
      const welcome = [
        {
          id: "1",
          sender: "ai",
          text: "Hello! I am your Glory Simon Interiors Assistant. I can recommend material grades, lighting layouts, furniture choices, and budget estimates for your design projects. What room type are we looking at today?",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(welcome);
    }
  };

  // Pre-defined quick prompt buttons
  const prompts = [
    "Generate estimate summary",
    "Material recommendations",
    "Cost optimization suggestions",
    "Generate client follow-up message"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto space-y-4 animate-fade-in select-none">
      {/* Header controls */}
      <div className="flex justify-between items-center border-b pb-3 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-gold/15 text-brand-bronze dark:text-brand-gold rounded-lg">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-brand-bronze dark:text-brand-gold">
              AI Interior Assistant
            </h1>
            <p className="text-[10px] text-gray-400 font-medium">
              SaaS AI design consultation simulation for materials and cost estimations.
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="text-xxs font-bold text-gray-400 hover:text-red-500 uppercase tracking-wider focus:outline-none"
        >
          Clear History
        </button>
      </div>

      {/* Chat Messages Feed Container */}
      <div className="flex-1 overflow-y-auto glass-panel border dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-sm bg-white/40 dark:bg-brand-charcoal/40">
        {messages.map((m) => {
          const isAI = m.sender === "ai";
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 max-w-[85%] ${isAI ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              {/* Avatar */}
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center border shrink-0 ${
                  isAI
                    ? "bg-brand-gold/10 border-brand-gold/30 text-brand-bronze dark:text-brand-gold"
                    : "bg-brand-bronze/10 border-brand-bronze/30 text-brand-bronze dark:bg-white/10 dark:text-white"
                }`}
              >
                {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              {/* Text Bubble */}
              <div
                className={`p-4 rounded-2xl text-xs font-medium leading-relaxed ${
                  isAI
                    ? "bg-white border dark:bg-brand-darkgray/25 dark:border-white/5 text-brand-charcoal/90 dark:text-brand-cream/90 rounded-tl-none shadow-sm"
                    : "bg-brand-bronze text-white dark:bg-brand-gold dark:text-brand-charcoal rounded-tr-none shadow-sm shadow-brand-bronze/10"
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <span className={`block text-[9px] mt-1 text-right ${isAI ? "text-gray-400" : "text-white/60"}`}>
                  {m.time}
                </span>
              </div>
            </div>
          );
        })}

        {/* Simulated Typing Indicator */}
        {typing && (
          <div className="flex items-start gap-3 max-w-[70%] mr-auto">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center border bg-brand-gold/10 border-brand-gold/30 text-brand-bronze dark:text-brand-gold">
              <Bot className="h-4 w-4" />
            </div>
            <div className="p-4 rounded-2xl bg-white border dark:bg-brand-darkgray/25 dark:border-white/5 rounded-tl-none flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion prompt pills (hidden when typing) */}
      {!typing && (
        <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
          {prompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-xxs font-semibold bg-white border dark:bg-brand-darkgray/30 dark:border-white/5 px-3 py-1.5 rounded-full hover:border-brand-gold/50 hover:bg-gray-50 dark:hover:bg-brand-darkgray/65 text-gray-500 dark:text-gray-400 transition-all shrink-0 focus:outline-none flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3 text-brand-gold" />
              <span>{p}</span>
            </button>
          ))}
        </div>
      )}

      {/* Chat Input form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex gap-2 shrink-0 border-t pt-3 dark:border-white/10"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about cabinet wood types, smart lighting prices, bedroom layout budgets..."
          className="flex-1 glass-input text-xs"
          id="ai-chat-input"
        />
        <button
          type="submit"
          className="glass-btn-primary p-2.5 rounded-lg flex items-center justify-center shrink-0 shadow-md"
          id="ai-chat-send-btn"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
