import React, { useState } from "react";
import {
  sendImageToEmailList,
  parseEmailList,
  isValidEmail,
} from "../services/emailService";
import { sendSimpleEmailToList } from "../services/simpleEmailService";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageName?: string;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageName = "Generated Logo",
}) => {
  const [emailList, setEmailList] = useState("");
  const [subject, setSubject] = useState("Check out this amazing logo!");
  const [message, setMessage] = useState(
    "Hi! I created this dynamic logo using Logo Reactivator and wanted to share it with you. What do you think?"
  );
  const [senderName, setSenderName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const handleSendEmails = async () => {
    if (!emailList.trim()) {
      alert("Please enter at least one email address!");
      return;
    }

    const recipients = parseEmailList(emailList);
    if (recipients.length === 0) {
      alert("Please enter valid email addresses!");
      return;
    }

    setIsSending(true);
    setSendStatus("idle");

    try {
      // Try sending with compressed image first
      let success = false;

      try {
        success = await sendImageToEmailList({
          recipients,
          subject,
          message:
            message +
            "\n\nP.S. If the image doesn't appear, the file was too large for email. You can always regenerate it at Logo Reactivator!",
          imageUrl,
          senderName: senderName || "Logo Reactivator User",
        });
      } catch (imageError) {
        console.log("Image email failed, trying simple email:", imageError);

        // Fallback to simple email without image
        success = await sendSimpleEmailToList({
          recipients,
          subject: subject + " (Visit Logo Reactivator to see image)",
          message:
            message +
            "\n\nI created an amazing dynamic logo using Logo Reactivator! The image was too large to include in this email, but you can see similar results by visiting Logo Reactivator and trying it yourself!\n\nLogo Reactivator creates logos that change based on user behavior - just like Duolingo's owl!",
          senderName: senderName || "Logo Reactivator User",
        });
      }

      if (success) {
        setSendStatus("success");
        setTimeout(() => {
          onClose();
          // Reset form
          setEmailList("");
          setSubject("Check out this amazing logo!");
          setMessage(
            "Hi! I created this dynamic logo using Logo Reactivator and wanted to share it with you. What do you think?"
          );
          setSenderName("");
          setSendStatus("idle");
        }, 2000);
      } else {
        setSendStatus("error");
      }
    } catch (error) {
      console.error("Email sending failed:", error);
      setSendStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  const recipientCount = parseEmailList(emailList).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full max-h-[90vh] overflow-y-auto transform rotate-1">
        {/* Header */}
        <div className="bg-blue-400 border-b-8 border-black p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform rotate-12 hover:rotate-0"
          >
            <span className="text-black font-black text-xl">✕</span>
          </button>

          <h2 className="text-3xl font-black text-black transform -rotate-1">
            📧 SEND TO EMAIL LIST!
          </h2>
          <p className="text-black font-bold mt-2">
            Share your amazing generated logo with your contacts! 🚀
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Image Preview */}
          <div className="bg-yellow-400 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 transform -rotate-1">
            <h3 className="font-black text-black mb-3">📸 IMAGE TO SEND:</h3>
            <div className="bg-white border-4 border-black p-4 flex items-center justify-center">
              <img
                src={imageUrl}
                alt={imageName}
                className="max-w-32 max-h-32 object-contain border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </div>

          {/* Sender Name */}
          <div className="space-y-2">
            <label className="block font-black text-black text-lg">
              👤 YOUR NAME (OPTIONAL):
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Your name..."
              className="w-full px-4 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-black placeholder-gray-600 focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all transform rotate-1 focus:rotate-0"
            />
          </div>

          {/* Email List */}
          <div className="space-y-2">
            <label className="block font-black text-black text-lg">
              📮 EMAIL ADDRESSES:
            </label>
            <textarea
              value={emailList}
              onChange={(e) => setEmailList(e.target.value)}
              placeholder="Enter email addresses separated by commas or new lines:&#10;john@example.com, jane@example.com&#10;bob@example.com"
              rows={4}
              className="w-full px-4 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-black placeholder-gray-600 focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all transform rotate-1 focus:rotate-0 resize-none"
            />
            {recipientCount > 0 && (
              <p className="text-green-600 font-bold">
                ✅ {recipientCount} valid email{recipientCount > 1 ? "s" : ""}{" "}
                found!
              </p>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="block font-black text-black text-lg">
              📝 EMAIL SUBJECT:
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-black focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all transform rotate-1 focus:rotate-0"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="block font-black text-black text-lg">
              💬 MESSAGE:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-black focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all transform rotate-1 focus:rotate-0 resize-none"
            />
          </div>

          {/* Status Messages */}
          {sendStatus === "success" && (
            <div className="bg-green-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 transform rotate-1">
              <p className="font-black text-black text-center">
                🎉 EMAILS SENT SUCCESSFULLY!
              </p>
            </div>
          )}

          {sendStatus === "error" && (
            <div className="bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 transform -rotate-1">
              <p className="font-black text-black text-center">
                💥 FAILED TO SEND EMAILS! Please try again.
              </p>
            </div>
          )}

          {/* Send Button */}
          <button
            onClick={handleSendEmails}
            disabled={isSending || recipientCount === 0}
            className="w-full bg-green-400 text-black py-4 px-6 border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all transform rotate-1 hover:rotate-0 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-xl"
          >
            {isSending ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>SENDING EMAILS...</span>
              </div>
            ) : (
              `🚀 SEND TO ${recipientCount} RECIPIENT${
                recipientCount !== 1 ? "S" : ""
              }!`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
