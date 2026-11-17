import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ChatComposer from "../components/ChatComposer.jsx";
import ChatConversation from "../components/ChatConversation.jsx";
import BrandSignature from "../components/BrandSignature.jsx";
import HomeOverview from "../components/HomeOverview.jsx";
import Icon from "../components/Icon.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { setCurrentChatId } from "../chat.slice.js";
import { useChat } from "../hooks/useChat.js";
import { useAuth } from "../../auth/hooks/useAuth.js";
import "../styles/dashboard.css";

function getChatList(chats) {
  if (!chats || typeof chats !== "object") return [];

  return Object.values(chats).sort(
    (first, second) =>
      new Date(
        second.lastUpdated || second.updatedAt || second.createdAt || 0,
      ) -
      new Date(first.lastUpdated || first.updatedAt || first.createdAt || 0),
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logoutHandler } = useAuth();
  const user = useSelector((state) => state.auth.user);
  const {
    chats: chatsState,
    currentChatId,
    isLoading,
    error,
  } = useSelector((state) => state.chat);
  const {
    initializeSocketConnection,
    sendMessageHandler,
    getChatsHandler,
    openMessagesHandler,
    deleteChatHandler,
  } = useChat();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [homeActive, setHomeActive] = useState(true);
  const [theme, setTheme] = useState(() =>
    window.localStorage.getItem("plexshity-theme") === "light"
      ? "light"
      : "dark",
  );

  const chats = getChatList(chatsState);
  const activeChat =
    chats.find(
      (chat) => String(chat.id ?? chat._id) === String(currentChatId),
    ) || null;
  const messages = Array.isArray(activeChat?.messages)
    ? activeChat.messages
    : [];
  const chatTitle = activeChat?.title || "New conversation";
  const getChatsHandlerRef = useRef(getChatsHandler);
  const initializeSocketConnectionRef = useRef(initializeSocketConnection);

  useEffect(() => {
    initializeSocketConnectionRef.current();
    getChatsHandlerRef.current();
  }, []);

  function startNewChat() {
    setHomeActive(false);
    setPendingMessage(null);
    dispatch(setCurrentChatId(null));
  }

  function goHome() {
    setHomeActive(true);
    setPendingMessage(null);
    dispatch(setCurrentChatId(null));
  }

  function openChat(chat) {
    setHomeActive(false);
    setPendingMessage(null);
    openMessagesHandler({ chatId: chat.id ?? chat._id });
  }

  async function removeChat(chatId) {
    const result = await deleteChatHandler({ chatId });

    if (result?.success === false) return;
    if (String(currentChatId) === String(chatId)) {
      dispatch(setCurrentChatId(null));
    }
  }

  async function submitMessage(
    message,
    retryChatId = activeChat?.id ?? activeChat?._id,
  ) {
    const pending = {
      clientId: `pending-${Date.now()}`,
      content: message,
      role: "user",
      status: "sending",
      chatId: retryChatId,
    };
    setPendingMessage(pending);

    const result = await sendMessageHandler({
      message,
      chatId: retryChatId,
    });

    if (result?.success) {
      setPendingMessage(null);
    } else {
      setPendingMessage({
        ...pending,
        status: "failed",
        error: result?.errMsg || "That message didn’t send.",
      });
    }

    return result;
  }

  function retryPendingMessage() {
    if (!pendingMessage) return;
    return submitMessage(pendingMessage.content, pendingMessage.chatId);
  }

  function startSuggestedPrompt(prompt) {
    setHomeActive(false);
    setPendingMessage(null);
    return submitMessage(prompt, null);
  }

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("plexshity-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  async function logoutFromDashboard() {
    const result = await logoutHandler();
    if (result?.success) {
      navigate("/home", { replace: true });
    }
  }

  return (
    <div className="dashboard-app">
      <div className="flex h-svh min-h-[480px] overflow-hidden bg-canvas text-primary">
        <Sidebar
          activeChatId={currentChatId}
          chats={chats}
          collapsed={collapsed}
          homeActive={homeActive}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onDeleteChat={removeChat}
          onHome={goHome}
          onLogout={logoutFromDashboard}
          onNewChat={startNewChat}
          onSelectChat={openChat}
          onToggleCollapse={() => setCollapsed((value) => !value)}
          onToggleTheme={toggleTheme}
          theme={theme}
          user={user}
        />

        <main className="relative flex min-w-0 flex-1 flex-col">
          <button
            aria-label="Open navigation"
            className="absolute left-4 top-4 z-20 grid size-9 place-items-center rounded-lg border border-border bg-card text-muted shadow-sm transition hover:text-primary focus-visible:outline-2 focus-visible:outline-accent md:hidden"
            onClick={() => setMobileSidebarOpen(true)}
            type="button"
          >
            <Icon name="menu" />
          </button>

          {error && pendingMessage?.status !== "failed" && (
            <p
              className="dashboard-error absolute left-1/2 top-4 z-20 w-[min(90%,560px)] -translate-x-1/2 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm"
              role="alert"
            >
              {error}
            </p>
          )}

          {homeActive && !activeChat && !pendingMessage ? (
            <HomeOverview
              chats={chats}
              onNewChat={startNewChat}
              onOpenChat={openChat}
              onStartPrompt={startSuggestedPrompt}
            />
          ) : activeChat || pendingMessage ? (
            <>
              <ChatConversation
                chatTitle={chatTitle}
                loading={isLoading && !pendingMessage}
                messages={messages}
                sending={pendingMessage?.status === "sending"}
                pendingMessage={pendingMessage}
                onRetry={retryPendingMessage}
              />
              <div className="shrink-0 px-4 pb-5 pt-3 sm:px-8">
                <div className="mx-auto max-w-[780px]">
                  <ChatComposer disabled={isLoading} onSend={submitMessage} />
                </div>
              </div>
            </>
          ) : (
            <section className="flex min-h-0 flex-1 items-center justify-center px-5 pb-20 pt-6">
              <div className="w-full max-w-[760px]">
                <BrandSignature className="mb-8 sm:mb-10" variant="featured" />
                <h1 className="mb-7 text-center text-3xl font-semibold tracking-[-0.035em] text-primary sm:mb-9 sm:text-4xl">
                  Where will your curiosity take you?
                </h1>
                <ChatComposer disabled={isLoading} onSend={submitMessage} />
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
