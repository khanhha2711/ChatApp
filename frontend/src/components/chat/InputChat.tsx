import { useChatStore } from "@/stores/useChatStore";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

const InputChat = () => {
  const {
    sendDirectMessage,
    conversations,
    activeConversation,
    sendGroupMessage,
  } = useChatStore();
  const { user } = useAuthStore();

  const [message, setMessage] = useState("");

  if (!user) return;

  const conversation = conversations.find(
    (convo) => convo._id === activeConversation,
  );

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      if (conversation?.type === "direct") {
        const recipientId =
          conversation?.participants.find((p) => p._id !== user?._id)?._id ||
          "";
        await sendDirectMessage(recipientId, message);
        setMessage("");
      } else {
        await sendGroupMessage(message);
        setMessage("");
      }
    } catch (error) {
      console.error("Có lỗi khi gửi tin nhắn");
    }
  };

  const handleOnKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    e.preventDefault();
    await sendMessage();
  };
  return (
    <div className="flex gap-2 m-2">
      <Input
        placeholder="Aa"
        onKeyDown={handleOnKeyDown}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button className="cursor-pointer" onClick={() => sendMessage()}>
        Gửi
      </Button>
    </div>
  );
};

export default InputChat;
