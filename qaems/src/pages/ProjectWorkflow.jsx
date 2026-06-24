import React, { useEffect, useState } from "react";
import { quotationService } from "../services/quotationService";
import { Kanban, ArrowRight, ArrowLeft, PlusCircle, Calendar, DollarSign, Trash2 } from "lucide-react";

export default function ProjectWorkflow() {
  const [board, setBoard] = useState(null);

  // Expanded 9-stage pipeline definition
  const columns = [
    { key: "enquiry", title: "New Enquiry", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
    { key: "siteVisitScheduled", title: "Site Visit Scheduled", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    { key: "siteVisitCompleted", title: "Site Visit Completed", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
    { key: "designApproval", title: "Design Approval", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
    { key: "quotationGenerated", title: "Quotation Generated", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
    { key: "quotationSent", title: "Quotation Sent", color: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
    { key: "approved", title: "Approved", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    { key: "execution", title: "Execution", color: "bg-teal-500/10 text-teal-500 border-teal-500/20" },
    { key: "completed", title: "Completed", color: "bg-green-500/10 text-green-500 border-green-500/20" }
  ];

  useEffect(() => {
    loadWorkflow();
  }, []);

  const loadWorkflow = () => {
    const data = quotationService.getWorkflow();
    setBoard(data);
  };

  const saveWorkflow = (newBoard) => {
    setBoard(newBoard);
    quotationService.saveWorkflow(newBoard);
  };

  // Drag and Drop handlers
  const handleDragStart = (e, cardId, sourceCol) => {
    e.dataTransfer.setData("cardId", cardId);
    e.dataTransfer.setData("sourceCol", sourceCol);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetCol) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");
    const sourceCol = e.dataTransfer.getData("sourceCol");

    if (sourceCol === targetCol) return;

    moveCard(cardId, sourceCol, targetCol);
  };

  const moveCard = async (cardId, sourceCol, targetCol) => {
    const updatedBoard = { ...board };
    
    // Find card
    const cardIndex = updatedBoard[sourceCol].findIndex((c) => c.id === cardId);
    if (cardIndex === -1) return;
    
    const [card] = updatedBoard[sourceCol].splice(cardIndex, 1);
    
    // Ensure array exists in target column
    if (!updatedBoard[targetCol]) updatedBoard[targetCol] = [];
    
    updatedBoard[targetCol].push(card);
    saveWorkflow(updatedBoard);

    // Trigger Notification
    try {
      await quotationService.addNotification({
        type: "system",
        title: "Workflow Stage Shifted",
        message: `Project "${card.title}" shifted to ${columns.find((c) => c.key === targetCol).title}.`
      });
    } catch (err) {
      console.error("Failed to add notification:", err);
    }
  };

  // Fallback triggers for mobile / accessibility
  const handleMoveLeft = (cardId, sourceColIdx) => {
    if (sourceColIdx === 0) return;
    const sourceCol = columns[sourceColIdx].key;
    const targetCol = columns[sourceColIdx - 1].key;
    moveCard(cardId, sourceCol, targetCol);
  };

  const handleMoveRight = (cardId, sourceColIdx) => {
    if (sourceColIdx === columns.length - 1) return;
    const sourceCol = columns[sourceColIdx].key;
    const targetCol = columns[sourceColIdx + 1].key;
    moveCard(cardId, sourceCol, targetCol);
  };

  const handleAddCard = (colKey) => {
    const title = window.prompt("Enter Project/Client Title:");
    if (!title) return;
    const budget = window.prompt("Enter Project Budget (optional e.g. $5,000):", "TBD");
    
    const updatedBoard = { ...board };
    if (!updatedBoard[colKey]) updatedBoard[colKey] = [];
    
    const newCard = {
      id: `KB-${Date.now()}`,
      title,
      budget: budget || "TBD",
      date: "Today"
    };
    
    updatedBoard[colKey].push(newCard);
    saveWorkflow(updatedBoard);
  };

  const handleDeleteCard = (cardId, colKey) => {
    if (window.confirm("Delete this workflow card?")) {
      const updatedBoard = { ...board };
      updatedBoard[colKey] = updatedBoard[colKey].filter((c) => c.id !== cardId);
      saveWorkflow(updatedBoard);
    }
  };

  if (!board) return <div className="p-8 text-center text-gray-500">Loading Workflow Board...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b pb-4 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-gold/15 text-brand-bronze dark:text-brand-gold rounded-lg">
            <Kanban className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-brand-bronze dark:text-brand-gold">
              Project Workflow Board
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Manage client onboarding stages, design status, and execution progress.
            </p>
          </div>
        </div>
      </div>

      {/* Kanban Scroll container */}
      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-210px)] select-none">
        {columns.map((col, colIdx) => (
          <div
            key={col.key}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.key)}
            className="flex flex-col w-72 shrink-0 bg-gray-50/50 dark:bg-brand-darkgray/10 border rounded-2xl p-4 space-y-4"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between border-b pb-2 dark:border-white/5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${col.color}`}>
                {col.title}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xxs font-bold text-gray-400">
                  {(board[col.key] || []).length}
                </span>
                <button
                  onClick={() => handleAddCard(col.key)}
                  className="p-1 text-gray-400 hover:text-brand-bronze dark:hover:text-brand-gold rounded focus:outline-none"
                  title="Add card"
                >
                  <PlusCircle className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Cards Deck */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {(board[col.key] || []).map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card.id, col.key)}
                  className="p-4 rounded-xl border bg-white dark:bg-brand-charcoal dark:border-white/10 shadow-sm cursor-grab active:cursor-grabbing hover:border-brand-gold/45 transition-colors space-y-3 relative group"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-brand-charcoal dark:text-brand-cream leading-tight">
                      {card.title}
                    </span>
                    <button
                      onClick={() => handleDeleteCard(card.id, col.key)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                      title="Delete card"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xxs text-gray-400 font-semibold border-t pt-2 dark:border-white/5">
                    <span className="flex items-center gap-0.5 text-brand-bronze dark:text-brand-gold">
                      <DollarSign className="h-3 w-3" />
                      {card.budget}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Calendar className="h-3 w-3" />
                      {card.date}
                    </span>
                  </div>

                  {/* Mobile navigation fallback arrows */}
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed dark:border-white/5 lg:hidden">
                    <button
                      onClick={() => handleMoveLeft(card.id, colIdx)}
                      disabled={colIdx === 0}
                      className="p-1 border rounded hover:bg-gray-50 dark:border-white/5 dark:hover:bg-brand-darkgray disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move left"
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </button>
                    <span className="text-xxxxs uppercase tracking-widest text-gray-400">Shift Stage</span>
                    <button
                      onClick={() => handleMoveRight(card.id, colIdx)}
                      disabled={colIdx === columns.length - 1}
                      className="p-1 border rounded hover:bg-gray-50 dark:border-white/5 dark:hover:bg-brand-darkgray disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move right"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
              {(board[col.key] || []).length === 0 && (
                <div className="py-12 border border-dashed rounded-xl text-center text-xxs text-gray-400 dark:border-white/5">
                  Drag items here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
