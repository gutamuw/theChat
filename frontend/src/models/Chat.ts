export type Chat = {
  name: string;
  message: Message[];
};

export type Message = {
  from: string;
  message: string;
  time: Date;
};
