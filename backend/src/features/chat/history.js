import crypto from 'crypto';

// Временное хранилище в памяти (в продакшене заменить на БД)
const chatsStore = new Map();

// Создать новый чат
export const createSession = (ip) => {
  const sessionId = crypto.randomUUID();
  if (!chatsStore.has(ip)) {
    chatsStore.set(ip, []);
  }
  const session = { id: sessionId, title: 'Новый чат', messages: [], createdAt: new Date() };
  chatsStore.get(ip).push(session);
  return session;
};

// Получить все чаты по IP
export const getSessionsHandler = (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userChats = chatsStore.get(ip) || [];
  // Отдаем только метаданные (без самих сообщений, чтобы не грузить сеть)
  const meta = userChats.map(c => ({ id: c.id, title: c.title, createdAt: c.createdAt }));
  res.json(meta.reverse());
};

// Получить конкретный чат
export const getSessionByIdHandler = (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  const { id } = req.params;
  const userChats = chatsStore.get(ip) || [];
  const chat = userChats.find(c => c.id === id);

  if (!chat) return res.status(404).json({ error: 'Чат не найден' });
  res.json(chat);
};

// Функция для сохранения сообщений в хранилище (вызовем из контроллера)
export const saveMessageToSession = (ip, sessionId, message) => {
    const userChats = chatsStore.get(ip) || [];
    const chat = userChats.find(c => c.id === sessionId);
    if (chat) {
        chat.messages.push(message);
        // Если это первое сообщение пользователя, делаем его заголовком чата
        if (chat.messages.length === 1 && message.role === 'user') {
            chat.title = message.content.slice(0, 30) + '...';
        }
    }
}
// Получить сообщения сессии для формирования контекста ИИ
export const getSessionMessages = (ip, sessionId) => {
  const userChats = chatsStore.get(ip) || [];
  const chat = userChats.find(c => c.id === sessionId);
  return chat ? chat.messages : [];
};