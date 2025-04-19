type Sender = "assistant" | "user";

interface Message {
  sender: Sender;
  text: string;
  loading?: boolean;
}
