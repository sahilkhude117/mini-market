"use client";

import { useState } from "react";
import { useWalletUi } from "@wallet-ui/react";
import { marketAPI, oracleAPI } from "@/lib/api-client";
import { uploadToPinata } from "@/lib/prediction-utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProposePage() {
  const { account } = useWalletUi();
  const publicKey = account?.address;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [formData, setFormData] = useState({
    question: "",
    description: "",
    feedName: "",
    date: "",
    value: "",
    range: "",
    imageFile: null as File | null,
    marketField: 0,
    apiType: 0,
    task: "",
    dataLink: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
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

      // Register oracle feed
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
      const response = await marketAPI.create({
        isChecked: true,
        data: {
          marketField: formData.marketField,
          apiType: formData.apiType,
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">Propose a Market</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="question">Market Question *</Label>
            <Input
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="e.g., Will Bitcoin reach $100,000 by end of year?"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your market..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="feedName">Feed Name *</Label>
            <Input
              id="feedName"
              value={formData.feedName}
              onChange={(e) => setFormData({ ...formData, feedName: e.target.value })}
              placeholder="e.g., BTC Price Feed"
              maxLength={32}
              required
            />
            <p className="text-sm text-gray-500 mt-1">Max 32 characters</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="value">Target Value *</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="e.g., 100000"
                required
              />
            </div>

            <div>
              <Label htmlFor="range">Range *</Label>
              <Input
                id="range"
                type="number"
                value={formData.range}
                onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                placeholder="e.g., 5000"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="date">Expiry Date *</Label>
            <Input
              id="date"
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="dataLink">Data Feed URL (Optional)</Label>
            <Input
              id="dataLink"
              value={formData.dataLink}
              onChange={(e) => setFormData({ ...formData, dataLink: e.target.value })}
              placeholder="e.g., https://api.coingecko.com/..."
            />
          </div>

          <div>
            <Label htmlFor="task">JSON Path (Optional)</Label>
            <Input
              id="task"
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              placeholder="e.g., $.bitcoin.usd"
            />
          </div>

          <div>
            <Label htmlFor="image">Market Image (Optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFormData({ ...formData, imageFile: file });
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="terms" className="cursor-pointer">
              I agree to the terms and conditions
            </Label>
          </div>

          <Button type="submit" disabled={loading || !publicKey} className="w-full">
            {loading ? "Creating..." : "Create Market"}
          </Button>

          {!publicKey && (
            <p className="text-sm text-center text-red-500">
              Please connect your wallet to create a market
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}
