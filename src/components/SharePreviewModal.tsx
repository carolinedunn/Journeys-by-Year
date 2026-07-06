import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Copy, Check, Share2, Globe, Send, MessageSquare } from "lucide-react";

interface SharePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedUrl?: string;
}

type Platform = "twitter" | "facebook" | "slack";

const travelPreview = "https://github.com/carolinedunn/Journeys-by-Year/blob/c28ce42317d0fc34e450cf53fd71ec74099daf8a/src/Travel-preview.png";

function MapPreviewGraphic() {
  return (
    <img 
      src={travelPreview} 
      alt="Travel Map Social Media Preview" 
      className="w-full h-full object-cover select-none"
    />
  );
}

export default function SharePreviewModal({ isOpen, onClose, sharedUrl = "https://travel.cdunn.org/" }: SharePreviewModalProps) {
  const [activePlatform, setActivePlatform] = useState<Platform>("twitter");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);

  const previewImage = travelPreview;
  const previewTitle = "Dunn Travels - Caroline & Paul's Travel Map";
  const previewDesc = "Explore Caroline & Paul Dunn's global travel map and route log. Browse our active travel map and trip analytics.";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const metaTagsString = `<!-- Primary Meta Tags -->
<title>Dunn Travels - Caroline & Paul's Travel Map</title>
<meta name="title" content="Dunn Travels - Caroline & Paul's Travel Map" />
<meta name="description" content="Explore Caroline & Paul Dunn's global travel map and route log. Browse our active travel map and trip analytics." />

<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${sharedUrl}" />
<meta property="og:title" content="${previewTitle}" />
<meta property="og:description" content="${previewDesc}" />
<meta property="og:image" content="${previewImage}" />

<!-- Twitter / X -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${sharedUrl}" />
<meta property="twitter:title" content="${previewTitle}" />
<meta property="twitter:description" content="${previewDesc}" />
<meta property="twitter:image" content="${previewImage}" />`;

  const handleCopyTags = () => {
    navigator.clipboard.writeText(metaTagsString);
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const cleanDomain = sharedUrl.replace("https://", "").replace("http://", "").split("/")[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          {/* Backdrop Click */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] z-10"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded text-blue-600">
                  <Share2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm tracking-tight">Social Sharing Preview</h3>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Travel Map Meta Card</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                id="close-share-modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">

              {/* Platform Selector Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setActivePlatform("twitter")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    activePlatform === "twitter" 
                      ? "bg-white text-slate-800 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Send className="h-3.5 w-3.5" />
                  X / Twitter Card
                </button>
                <button
                  onClick={() => setActivePlatform("facebook")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    activePlatform === "facebook" 
                      ? "bg-white text-slate-800 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  Facebook & LinkedIn
                </button>
                <button
                  onClick={() => setActivePlatform("slack")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    activePlatform === "slack" 
                      ? "bg-white text-slate-800 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Slack Preview
                </button>
              </div>

              {/* Realistic Simulator Renderers */}
              <div className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-200/60 flex flex-col justify-center">
                
                {activePlatform === "twitter" && (
                  <div className="bg-black text-white p-4 rounded-xl max-w-md mx-auto border border-zinc-800 font-sans shadow-md w-full">
                    {/* Twitter Header mockup */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">PD</div>
                      <div>
                        <div className="text-[11px] font-bold flex items-center gap-1">
                          Paul Dunn <span className="text-zinc-500 font-normal">@dunntravels · Just now</span>
                        </div>
                        <div className="text-[10px] text-zinc-400">Our trip logs and interactive travel maps are live! 🗺️✈️</div>
                      </div>
                    </div>
                    
                    {/* The Card */}
                    <div className="rounded-xl border border-zinc-800 overflow-hidden bg-[#16181c] cursor-pointer hover:bg-zinc-900 transition-colors">
                      <div className="aspect-[1.91/1] w-full relative overflow-hidden bg-slate-900">
                        <MapPreviewGraphic />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-blue-600 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded text-white tracking-widest">
                            Live Travel Map
                          </span>
                        </div>
                      </div>
                      <div className="p-2.5 text-[11px]">
                        <span className="text-zinc-500 text-[10px] block font-mono">{cleanDomain}</span>
                        <h4 className="font-bold text-white mt-0.5 line-clamp-1">{previewTitle}</h4>
                        <p className="text-zinc-400 text-[10px] mt-0.5 line-clamp-2 leading-tight">{previewDesc}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activePlatform === "facebook" && (
                  <div className="bg-white p-4 rounded-xl max-w-md mx-auto border border-slate-200/80 font-sans shadow-md w-full">
                    {/* Facebook Header mockup */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">CD</div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                          Caroline Dunn <span className="text-slate-500 font-normal">shared a link.</span>
                        </div>
                        <div className="text-[9px] text-slate-400">July 6 at 11:49 AM</div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-700 mb-3 leading-relaxed">Excited to share our interactive travel catalog! Explore our global travel map of trips outside of Atlanta, route densities, and stats.</p>

                    {/* The Card */}
                    <div className="border border-slate-200 rounded-b overflow-hidden cursor-pointer hover:bg-slate-50 transition-colors">
                      <div className="aspect-[1.91/1] w-full bg-[#ebf1f6] relative">
                        <MapPreviewGraphic />
                      </div>
                      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs">
                        <span className="text-slate-500 text-[9px] uppercase tracking-wider block font-medium">{cleanDomain}</span>
                        <h4 className="font-bold text-slate-800 mt-1 line-clamp-1">{previewTitle}</h4>
                        <p className="text-slate-600 text-[10px] mt-0.5 line-clamp-2 leading-normal">{previewDesc}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activePlatform === "slack" && (
                  <div className="bg-[#1a1d21] text-[#d1d2d3] p-4 rounded-xl max-w-md mx-auto border border-zinc-800 font-sans shadow-md w-full text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <span className="text-emerald-400">#travel-chat</span>
                      <span className="text-zinc-500 font-normal">11:49 AM</span>
                    </div>
                    <div className="text-zinc-300">Here's our live travel log url! {sharedUrl}</div>
                    
                    {/* Slack Rich Attachment */}
                    <div className="pl-3 border-l-4 border-slate-600 space-y-1 mt-2">
                      <span className="font-bold text-white block">Dunn Travels</span>
                      <a href="#" className="text-sky-400 hover:underline font-bold block">{previewTitle}</a>
                      <p className="text-zinc-300 text-[10px] leading-relaxed">{previewDesc}</p>
                      <div className="aspect-[1.91/1] w-full max-w-[320px] rounded overflow-hidden bg-[#ebf1f6] mt-1.5 relative">
                        <MapPreviewGraphic />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action: Copy Link */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-4 bg-slate-50 border border-slate-200/50 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Shareable Travel Log Link</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Use this URL to share directly on your social platforms.</p>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={sharedUrl} 
                    className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-600 font-mono w-48 sm:w-64 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded transition-colors flex items-center gap-1.5 shrink-0"
                    id="copy-share-link"
                  >
                    {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedLink ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                id="close-share-modal-btn"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
