import { INTENTS, UNKNOWN } from '../shared/intents';

type Turn = { from: 'u' | 'b'; text: string };
/** Contrato del asistente. Para conectar una IA, implementa ChatProvider y llama setChatProvider(). */
export interface ChatProvider { reply(question: string, history: Turn[]): Promise<string>; }

export const localProvider: ChatProvider = {
  async reply(question) {
    const q = question.toLowerCase();
    return INTENTS.find((i) => i.keywords.some((k) => q.includes(k)))?.answer ?? UNKNOWN;
  },
};

let provider: ChatProvider = localProvider;
export const setChatProvider = (p: ChatProvider) => { provider = p; };
export const getReply = (q: string, history: Turn[]) => provider.reply(q, history);
