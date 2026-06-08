import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import { ImagePlus, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { toast } from "sonner";
const MessagesInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
  const { user } = useAuthStore();
  const [value, setValue] = useState("");
  const { sendDirectMessage, sendGroupMessage } = useChatStore();
  if (!user) return null;
  const sendMessage = async () => {
    if (!value.trim()) return;

    try {
      if (selectedConvo?.type === "direct") {
        const participant = selectedConvo?.participants;
        const otherUser = participant?.filter((p) => p._id !== user._id)[0];
        await sendDirectMessage(otherUser?._id, value);
      } else {
        await sendGroupMessage(selectedConvo?._id, value);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi gửi tin nhắn");
    } finally {
      setValue("");
    }
  };

  return (
    <div className=" relative flex items-center gap-2 p-3 min-h-[56px] bg-background">
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-primary/10 transition-smooth"
      >
        <ImagePlus className="size-4" />
      </Button>
      <div className="flex-1">
        <Input
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Soạn tin nhắn..."
          className="pr-20 h-9 bg-white border-border/50 focus:border-primary/50 transition-smooth resize-none"
        />
      </div>

      <Button
        onClick={sendMessage}
        className="bg-gradient-chat hover:shadow-glow transition-smooth hover:scale-105"
        disabled={!value.trim()}
      >
        <Send className="size-4 text-white" />
      </Button>
    </div>
  );
};

export default MessagesInput;
