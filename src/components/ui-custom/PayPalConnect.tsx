"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Recipient = {
  email: string;
  amount: string;
  currency: string;
  wallet: string;
  note?: string;
};

export default function PayPalMassPayout() {
  const [recipients, setRecipients] = useState<Recipient[]>([
    { email: "", amount: "", currency: "USD", wallet: "PayPal" },
  ]);
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [defaultWallet, setDefaultWallet] = useState("PayPal");

  const addRecipient = () => {
    setRecipients([
      ...recipients,
      {
        email: "",
        amount: "",
        currency: defaultCurrency,
        wallet: defaultWallet,
      },
    ]);
  };

  const updateRecipient = (
    index: number,
    field: keyof Recipient,
    value: string,
  ) => {
    const updated = [...recipients];
    updated[index][field] = value;
    setRecipients(updated);
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const generateCSV = () => {
    const headers = "Email/Phone,Amount,Currency Code,Recipient Wallet,Note\n";
    const rows = recipients
      .map(
        (r) =>
          `${r.email},${r.amount},${r.currency},${r.wallet},${r.note || ""}`,
      )
      .join("\n");
    return headers + rows;
  };

  const downloadCSV = () => {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payouts_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Default Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Default Currency
          </label>
          <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
            <SelectTrigger affiliate={false}>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent affiliate={false}>
              <SelectItem affiliate={false} value="USD">
                USD ($)
              </SelectItem>
              <SelectItem affiliate={false} value="EUR">
                EUR (€)
              </SelectItem>
              <SelectItem affiliate={false} value="GBP">
                GBP (£)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Default Wallet
          </label>
          <Select value={defaultWallet} onValueChange={setDefaultWallet}>
            <SelectTrigger affiliate={false}>
              <SelectValue placeholder="Select wallet" />
            </SelectTrigger>
            <SelectContent affiliate={false}>
              <SelectItem affiliate={false} value="PayPal">
                PayPal
              </SelectItem>
              <SelectItem affiliate={false} value="Venmo">
                Venmo
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recipients Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email/Phone</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Note</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipients.map((recipient, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={recipient.email}
                    onChange={(e) =>
                      updateRecipient(index, "email", e.target.value)
                    }
                    placeholder="email@example.com"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={recipient.amount}
                    onChange={(e) =>
                      updateRecipient(index, "amount", e.target.value)
                    }
                    placeholder="0.00"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={recipient.currency}
                    onValueChange={(value) =>
                      updateRecipient(index, "currency", value)
                    }
                  >
                    <SelectTrigger affiliate={false}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent affiliate={false}>
                      <SelectItem affiliate={false} value="USD">
                        USD
                      </SelectItem>
                      <SelectItem affiliate={false} value="EUR">
                        EUR
                      </SelectItem>
                      <SelectItem affiliate={false} value="GBP">
                        GBP
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={recipient.wallet}
                    onValueChange={(value) =>
                      updateRecipient(index, "wallet", value)
                    }
                  >
                    <SelectTrigger affiliate={false}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent affiliate={false}>
                      <SelectItem affiliate={false} value="PayPal">
                        PayPal
                      </SelectItem>
                      <SelectItem affiliate={false} value="Venmo">
                        Venmo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    value={recipient.note || ""}
                    onChange={(e) =>
                      updateRecipient(index, "note", e.target.value)
                    }
                    placeholder="Payment note"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRecipient(index)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" onClick={addRecipient}>
            + Add Recipient
          </Button>
        </div>
      </div>

      {/* Terms and Actions */}

      <div className="flex gap-4">
        <Button variant="outline" onClick={downloadCSV}>
          Download CSV
        </Button>
        <Button
          onClick={() => {
            downloadCSV();
            window.open("https://www.paypal.com/mep/payoutsweb", "_blank");
          }}
        >
          Process Payouts
        </Button>
      </div>
    </div>
  );
}
