"use client";
import { useState, useEffect } from "react";

type Recipient = {
  email: string;
  amount: string;
  currency: string;
  wallet: string;
  note?: string;
};

export default function PayPalMassPayout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      email: "zakm1@personal.com",
      amount: "20.00",
      currency: "USD",
      wallet: "PayPal",
      note: "Affiliate payment",
    },
    {
      email: "zakm123@personal.com",
      amount: "20.00",
      currency: "USD",
      wallet: "PayPal",
      note: "Affiliate payment",
    },
  ]);
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [defaultWallet, setDefaultWallet] = useState("PayPal");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [paymentInstructions, setPaymentInstructions] = useState<{
    email: string;
    amount: string;
    directLink?: string;
  } | null>(null);

  // Add new empty recipient row
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

  // Copy to clipboard utility
  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        const result = document.execCommand("copy");
        document.body.removeChild(textarea);
        return result;
      }
    } catch (err) {
      console.error("Failed to copy:", err);
      return false;
    }
  };

  // Update recipient field
  const updateRecipient = (
    index: number,
    field: keyof Recipient,
    value: string,
  ) => {
    const updated = [...recipients];
    updated[index][field] = value;
    setRecipients(updated);
  };

  // Remove recipient
  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  // Generate CSV content
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

  // Handle individual payment
  const payIndividual = async (recipient: Recipient) => {
    setIsLoading(true);
    setError(null);

    try {
      // Copy email to clipboard
      const copySuccess = await copyToClipboard(recipient.email);
      setCopiedEmail(copySuccess ? recipient.email : null);

      // Open PayPal directly (no intermediate blank page)
      const paypalUrl =
        "https://www.sandbox.paypal.com/myaccount/transfer/homepage/pay";
      const paypalWindow = window.open(
        paypalUrl,
        "_blank",
        "noopener,noreferrer",
      );

      if (
        !paypalWindow ||
        paypalWindow.closed ||
        typeof paypalWindow.closed === "undefined"
      ) {
        // If popup blocked, show instructions with direct link
        setPaymentInstructions({
          email: recipient.email,
          amount: `${recipient.amount} ${recipient.currency}`,
          directLink: paypalUrl,
        });
        throw new Error("Popup blocked - please allow popups for this site");
      }

      // Show instructions
      setPaymentInstructions({
        email: recipient.email,
        amount: `${recipient.amount} ${recipient.currency}`,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to initiate PayPal payment",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Check clipboard availability
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.clipboard) {
      setError("Clipboard access not supported - please copy manually");
    }
  }, []);

  // Download CSV file
  const downloadCSV = () => {
    try {
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
    } catch (err) {
      setError("Failed to generate CSV file");
    }
  };

  // Redirect to PayPal with CSV ready
  const redirectToPayPal = () => {
    downloadCSV(); // Download first
    window.open("https://www.sandbox.paypal.com/mep/payoutsweb", "_blank");
  };

  return (
    <div className="border p-4 rounded-lg mb-6">
      <h2 className="text-xl font-bold mb-4">PayPal Mass Payout Manager</h2>

      {/* Default Settings */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">Default Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Default Currency
            </label>
            <select
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Default Wallet
            </label>
            <select
              value={defaultWallet}
              onChange={(e) => setDefaultWallet(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="PayPal">PayPal</option>
              <option value="Venmo">Venmo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recipients Table */}
      <div className="mb-6 overflow-x-auto">
        <h3 className="font-semibold mb-3">Recipients</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Email/Phone
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Currency
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Wallet
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Note
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recipients.map((recipient, index) => (
              <tr key={index}>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={recipient.email}
                      onChange={(e) =>
                        updateRecipient(index, "email", e.target.value)
                      }
                      className="flex-1 p-1 border rounded"
                      placeholder="email@example.com"
                    />
                    <button
                      onClick={() => copyToClipboard(recipient.email)}
                      disabled={!recipient.email}
                      className="p-1 text-gray-500 hover:text-blue-600 disabled:opacity-50"
                      title="Copy to clipboard"
                    >
                      {copiedEmail === recipient.email ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span>⎘</span>
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    step="0.01"
                    value={recipient.amount}
                    onChange={(e) =>
                      updateRecipient(index, "amount", e.target.value)
                    }
                    className="w-full p-1 border rounded"
                    placeholder="0.00"
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    value={recipient.currency}
                    onChange={(e) =>
                      updateRecipient(index, "currency", e.target.value)
                    }
                    className="w-full p-1 border rounded"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={recipient.wallet}
                    onChange={(e) =>
                      updateRecipient(index, "wallet", e.target.value)
                    }
                    className="w-full p-1 border rounded"
                  >
                    <option value="PayPal">PayPal</option>
                    <option value="Venmo">Venmo</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={recipient.note || ""}
                    onChange={(e) =>
                      updateRecipient(index, "note", e.target.value)
                    }
                    className="w-full p-1 border rounded"
                    placeholder="Payment note"
                  />
                </td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => removeRecipient(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => payIndividual(recipient)}
                    disabled={
                      !recipient.email || !recipient.amount || isLoading
                    }
                    className="text-green-600 hover:text-green-800 text-sm disabled:opacity-50"
                  >
                    {isLoading ? "Processing..." : "Pay Now"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={addRecipient}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
        >
          + Add Recipient
        </button>
      </div>

      {/* CSV Preview */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">CSV Preview</h3>
        <div className="p-4 bg-gray-50 rounded-lg font-mono text-sm whitespace-pre overflow-x-auto">
          {generateCSV()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={downloadCSV}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Download CSV
        </button>
        <button
          onClick={redirectToPayPal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Download & Open PayPal
        </button>
      </div>

      {/* Payment Instructions */}
      {paymentInstructions && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Payment Instructions</h3>
          <ol className="list-decimal pl-5 space-y-1">
            {paymentInstructions.directLink ? (
              <li>
                <span>Popup was blocked. Please </span>
                <a
                  href={paymentInstructions.directLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  click here to open PayPal
                </a>
              </li>
            ) : (
              <li>We've opened PayPal in a new tab</li>
            )}
            <li>
              Recipient email:{" "}
              <span className="font-mono bg-gray-100 px-1 rounded">
                {paymentInstructions.email}
              </span>{" "}
              {copiedEmail === paymentInstructions.email ? (
                <span className="text-green-500">✓ Copied!</span>
              ) : (
                <button
                  onClick={() => copyToClipboard(paymentInstructions.email)}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  ⎘ Copy
                </button>
              )}
            </li>
            <li>
              Enter amount: <strong>{paymentInstructions.amount}</strong>
            </li>
            <li>Complete the payment as usual</li>
          </ol>
          <button
            onClick={() => setPaymentInstructions(null)}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            Close Instructions
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg">
          {error}
          {error.includes("popup") && (
            <div className="mt-2">
              <a
                href="https://www.sandbox.paypal.com/myaccount/transfer/homepage/pay"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Click here to open PayPal manually
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
