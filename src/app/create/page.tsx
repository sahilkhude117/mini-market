"use client";

import { useState } from "react";
import { useWalletUi } from "@wallet-ui/react";
import { marketAPI, oracleAPI } from "@/lib/api-client";
import { uploadToPinata } from "@/lib/prediction-utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateMarketPage() {
  const { account } = useWalletUi();
  const publicKey = account?.address;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    question: "",
    description: "",
    feedName: "",
    date: "",
    value: "",
    range: "",
    imageFile: null as File | null,
    task: "",
    dataLink: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setLoading(true);

      // Upload image to IPFS
      let imageUrl = "";
      if (formData.imageFile) {
        const uploaded = await uploadToPinata(formData.imageFile);
        if (uploaded) {
          imageUrl = uploaded;
        }
      }

      // Register oracle feed if provided
      if (formData.dataLink && formData.task) {
        await oracleAPI.registFeed({
          isChecked: true,
          data: {
            feedName: formData.feedName,
            dataLink: formData.dataLink,
            task: formData.task,
          },
        });
      }

      // Create market
      await marketAPI.create({
        isChecked: true,
        data: {
          marketField: 0,
          apiType: 0,
          question: formData.question,
          task: formData.task || "$.price",
          date: formData.date,
          value: parseFloat(formData.value),
          range: parseFloat(formData.range),
          imageUrl: imageUrl || "https://via.placeholder.com/400",
          creator: publicKey.toString(),
          feedName: formData.feedName,
          description: formData.description,
        },
      });

      toast.success("Market created successfully!");
      router.push("/markets");
    } catch (error: any) {
      console.error("Failed to create market:", error);
      toast.error(error.response?.data?.error || "Failed to create market");
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="p-[3px] rounded-2xl bg-gradient-to-r from-[#0b1f3a] via-[#174a8c] to-[#6b5b95] max-w-md w-full">
          <div className="bg-white rounded-[calc(1rem-3px)] border-4 border-black p-8 text-center">
            <h2 className="text-2xl font-bold text-[#0b1f3a] mb-4">Connect Your Wallet</h2>
            <p className="text-[#0b1f3a] opacity-70">Please connect your wallet to create a market</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-[#0b1f3a] mb-6">Create New Market</h1>

      <div className="p-[3px] rounded-2xl bg-gradient-to-r from-[#0b1f3a] via-[#174a8c] to-[#6b5b95]">
        <div className="bg-white rounded-[calc(1rem-3px)] border-4 border-black p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="question" className="text-base font-bold text-[#0b1f3a]">
                Market Question *
              </Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="e.g., Will Bitcoin reach $100,000 by end of year?"
                className="mt-2 border-2 border-black rounded-lg"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-base font-bold text-[#0b1f3a]">
                Description *
              </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your market and resolution criteria..."
                className="mt-2 w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174a8c]"
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="feedName" className="text-base font-bold text-[#0b1f3a]">
                Feed Name *
              </Label>
              <Input
                id="feedName"
                value={formData.feedName}
                onChange={(e) => setFormData({ ...formData, feedName: e.target.value })}
                placeholder="e.g., BTC Price Feed"
                maxLength={32}
                className="mt-2 border-2 border-black rounded-lg"
                required
              />
              <p className="text-sm text-[#0b1f3a] opacity-60 mt-1">Max 32 characters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="value" className="text-base font-bold text-[#0b1f3a]">
                  Target Value *
                </Label>
                <Input
                  id="value"
                  type="number"
                  step="any"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="100000"
                  className="mt-2 border-2 border-black rounded-lg"
                  required
                />
              </div>

              <div>
                <Label htmlFor="range" className="text-base font-bold text-[#0b1f3a]">
                  Range *
                </Label>
                <Input
                  id="range"
                  type="number"
                  step="any"
                  value={formData.range}
                  onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                  placeholder="5000"
                  className="mt-2 border-2 border-black rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="date" className="text-base font-bold text-[#0b1f3a]">
                Resolution Date *
              </Label>
              <Input
                id="date"
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-2 border-2 border-black rounded-lg"
                required
              />
            </div>

            <div>
              <Label htmlFor="dataLink" className="text-base font-bold text-[#0b1f3a]">
                Data Link (Optional)
              </Label>
              <Input
                id="dataLink"
                value={formData.dataLink}
                onChange={(e) => setFormData({ ...formData, dataLink: e.target.value })}
                placeholder="https://api.example.com/data"
                className="mt-2 border-2 border-black rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="task" className="text-base font-bold text-[#0b1f3a]">
                Task/Path (Optional)
              </Label>
              <Input
                id="task"
                value={formData.task}
                onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                placeholder="$.price"
                className="mt-2 border-2 border-black rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="image" className="text-base font-bold text-[#0b1f3a]">
                Market Image (Optional)
              </Label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                className="mt-2 w-full px-4 py-3 border-2 border-black rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#0b1f3a] file:text-white hover:file:bg-[#174a8c]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-4 rounded-xl font-bold border-2 border-black text-lg transition-colors ${
                loading
                  ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "bg-[#0b1f3a] text-white hover:bg-[#174a8c]"
              }`}
            >
              {loading ? "Creating Market..." : "Create Market"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
