import React, { useState, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import SendIcon from "@mui/icons-material/Send";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import AdminBreadcrumb from "../components/AdminBreadcrumb";
import AdminTable from "../components/AdminTable";
import StatusBadge from "../components/StatusBadge";
import AdminModal from "../components/AdminModal";
import { newsletterStats, initialSubscribers } from "../data/newsletterData";

export default function NewsLetter() {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCampaignOpen, setIsCampaignOpen] = useState(false);

  const [campaignData, setCampaignData] = useState({
    subject: "",
    previewText: "",
    targetAudience: "All Subscribers",
    content: "",
  });

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(
      (sub) =>
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.source.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subscribers, searchTerm]);

  const handleDeleteSubscriber = (id) => {
    if (window.confirm("Remove this subscriber?")) {
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSendCampaign = (e) => {
    e.preventDefault();
    alert(`Campaign "${campaignData.subject}" broadcast queued for static simulation!`);
    setIsCampaignOpen(false);
    setCampaignData({
      subject: "",
      previewText: "",
      targetAudience: "All Subscribers",
      content: "",
    });
  };

  const tableColumns = [
    { label: "Subscriber Email", key: "email" },
    { label: "Name", key: "name" },
    { label: "Subscription Date", key: "date" },
    { label: "Source", key: "source" },
    { label: "Status", key: "status" },
    { label: "Actions", key: "actions", align: "right" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <AdminBreadcrumb
            items={[
              { label: "Admin", path: "/admin" },
              { label: "Newsletter", path: "/admin/newsletter" },
            ]}
          />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2342]">
            Newsletter Subscribers & Broadcasts
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage mailing lists, customer opt-ins, and broadcast communications
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCampaignOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <SendIcon className="text-sm" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#B87333]/20 border-l-4 border-l-[#B87333] shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Total Subscribers
          </p>
          <h3 className="text-2xl font-bold text-[#0A2342] mt-1">
            {newsletterStats.totalSubscribers.toLocaleString()}
          </h3>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#B87333]/20 border-l-4 border-l-[#2D5A4A] shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Active Audience
          </p>
          <h3 className="text-2xl font-bold text-[#2D5A4A] mt-1">
            {newsletterStats.activeSubscribers.toLocaleString()}
          </h3>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#B87333]/20 border-l-4 border-l-[#D4AF37] shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Average Open Rate
          </p>
          <h3 className="text-2xl font-bold text-[#0A2342] mt-1">
            {newsletterStats.averageOpenRate}
          </h3>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#B87333]/20 border-l-4 border-l-gray-400 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Unsubscribed
          </p>
          <h3 className="text-2xl font-bold text-gray-600 mt-1">
            {newsletterStats.unsubscribed}
          </h3>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#B87333]/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search email, name, or source..."
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm border border-[#0A2342]/20 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
          />
        </div>

        <button
          type="button"
          onClick={() => alert("Exporting static CSV list...")}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#0A2342]/20 bg-[#F5F3EF] hover:bg-white text-[#0A2342] text-xs font-semibold transition-colors cursor-pointer"
        >
          <FileDownloadIcon className="text-sm" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table */}
      <AdminTable
        columns={tableColumns}
        data={filteredSubscribers}
        emptyMessage="No subscribers found."
        renderRow={(sub) => (
          <tr
            key={sub.id}
            className="hover:bg-[#F5F3EF]/50 transition-colors group"
          >
            <td className="py-3.5 px-4 font-bold text-[#0A2342] text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <MailOutlinedIcon className="text-gray-400 text-sm" />
                <span>{sub.email}</span>
              </div>
            </td>
            <td className="py-3.5 px-4 text-xs font-semibold text-[#0A2342]">
              {sub.name}
            </td>
            <td className="py-3.5 px-4 text-xs text-gray-500">{sub.date}</td>
            <td className="py-3.5 px-4 text-xs text-gray-600 font-medium">
              {sub.source}
            </td>
            <td className="py-3.5 px-4">
              <StatusBadge status={sub.status} />
            </td>
            <td className="py-3.5 px-4 text-right">
              <button
                type="button"
                onClick={() => handleDeleteSubscriber(sub.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Remove Subscriber"
              >
                <DeleteOutlinedIcon className="text-lg" />
              </button>
            </td>
          </tr>
        )}
      />

      {/* Campaign Composer Modal */}
      <AdminModal
        isOpen={isCampaignOpen}
        onClose={() => setIsCampaignOpen(false)}
        title="Compose Newsletter Campaign"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSendCampaign} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
              Email Subject Line *
            </label>
            <input
              type="text"
              required
              value={campaignData.subject}
              onChange={(e) =>
                setCampaignData({ ...campaignData, subject: e.target.value })
              }
              placeholder="e.g. Unveiling Our Autumn Ritual Collection ✨"
              className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                Preview Text (Preheader)
              </label>
              <input
                type="text"
                value={campaignData.previewText}
                onChange={(e) =>
                  setCampaignData({
                    ...campaignData,
                    previewText: e.target.value,
                  })
                }
                placeholder="First line in inbox list..."
                className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                Target Segment
              </label>
              <select
                value={campaignData.targetAudience}
                onChange={(e) =>
                  setCampaignData({
                    ...campaignData,
                    targetAudience: e.target.value,
                  })
                }
                className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl bg-white text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
              >
                <option value="All Subscribers">All Active Subscribers (8,120)</option>
                <option value="VIP Buyers">VIP Buyers (1,450)</option>
                <option value="New Subscribers">Joined in Last 30 Days (320)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
              Email Body Content
            </label>
            <textarea
              rows="6"
              required
              value={campaignData.content}
              onChange={(e) =>
                setCampaignData({ ...campaignData, content: e.target.value })
              }
              placeholder="Write your email broadcast message..."
              className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCampaignOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#0A2342] text-[#0A2342] hover:bg-[#0A2342] hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <SendIcon className="text-xs" />
              <span>Simulate Send Broadcast</span>
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}