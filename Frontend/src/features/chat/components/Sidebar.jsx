import { useState } from "react";
import Icon from "./Icon.jsx";

export default function Sidebar({
  chats,
  activeChatId,
  homeActive,
  user,
  collapsed,
  mobileOpen,
  theme,
  onToggleCollapse,
  onToggleTheme,
  onNewChat,
  onHome,
  onSelectChat,
  onDeleteChat,
  onLogout,
  onCloseMobile,
}) {
  const [chatMenuId, setChatMenuId] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const fullName =
    user?.fullname || user?.fullName || user?.email || "Your account";
  const initials = fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  function handleDelete(chat) {
    const chatId = chat.id ?? chat._id;
    const confirmed = window.confirm(
      `Delete "${chat.title || "this chat"}"? This cannot be undone.`,
    );
    setChatMenuId(null);
    if (confirmed) onDeleteChat?.(chatId);
  }

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onCloseMobile}
          type="button"
        />
      )}

      <aside
        className={`dashboard-sidebar fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-surface transition-all duration-200 md:relative md:z-auto md:translate-x-0 ${
          collapsed ? "w-[76px]" : "w-[272px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`flex h-[68px] shrink-0 items-center ${
            collapsed ? "justify-center px-2" : "justify-between px-5"
          }`}
        >
          {!collapsed && (
            <span className="truncate text-[15px] font-semibold tracking-tight text-primary">
              Plexshity<span className="text-accent">.io</span>
            </span>
          )}
          <button
            aria-label={collapsed ? "Expand sidebar" : "Minimize sidebar"}
            className="grid size-9 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-card-hover hover:text-primary focus-visible:outline-2 focus-visible:outline-accent"
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Minimize sidebar"}
            type="button"
          >
            <Icon
              className="size-4"
              name={collapsed ? "arrowRight" : "sidebar"}
            />
          </button>
        </div>

        <div className={`space-y-2 px-3 ${collapsed ? "px-2" : ""}`}>
          <button
            className={`flex min-h-11 w-full items-center gap-3 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-foreground transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              collapsed ? "justify-center px-0" : ""
            }`}
            onClick={() => {
              onNewChat();
              onCloseMobile();
            }}
            title={collapsed ? "New chat" : undefined}
            type="button"
          >
            <Icon name="plus" />
            {!collapsed && <span>New chat</span>}
          </button>
          <button
            aria-current={homeActive ? "page" : undefined}
            className={`flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm transition focus-visible:outline-2 focus-visible:outline-accent ${
              homeActive
                ? "bg-card-hover font-medium text-primary"
                : "text-muted hover:bg-card-hover hover:text-primary"
            } ${collapsed ? "justify-center px-0" : ""}`}
            onClick={() => {
              onHome();
              onCloseMobile();
            }}
            title={collapsed ? "Home" : undefined}
            type="button"
          >
            <Icon name="home" />
            {!collapsed && <span>Home</span>}
          </button>
        </div>

        {!collapsed && (
          <section className="mt-8 flex min-h-0 flex-1 flex-col px-3">
            <div className="mb-2 flex items-center justify-between px-2">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                Your chats
              </h2>
              <span className="text-xs tabular-nums text-muted">
                {chats.length}
              </span>
            </div>
            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pb-3">
              {chats.length === 0 ? (
                <p className="px-2 py-3 text-xs leading-5 text-muted">
                  Your conversations will show up here.
                </p>
              ) : (
                chats.map((chat) => (
                  <div
                    className="group relative flex items-center"
                    key={chat.id ?? chat._id}
                  >
                    <button
                      aria-current={
                        String(activeChatId) === String(chat.id ?? chat._id)
                          ? "page"
                          : undefined
                      }
                      className={`min-w-0 flex-1 truncate rounded-xl border px-2.5 py-2.5 pr-9 text-left text-[13px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/70 ${
                        String(activeChatId) === String(chat.id ?? chat._id)
                          ? "border-accent/35 bg-card-hover font-medium text-primary shadow-[0_3px_12px_rgba(0,0,0,0.16)]"
                          : "border-transparent text-muted hover:border-border hover:bg-card-hover hover:text-primary hover:shadow-sm"
                      }`}
                      onClick={() => {
                        onSelectChat(chat);
                        setChatMenuId(null);
                        onCloseMobile();
                      }}
                      title={chat.title || "Untitled chat"}
                      type="button"
                    >
                      {chat.title || "Untitled chat"}
                    </button>
                    <button
                      aria-expanded={chatMenuId === (chat.id ?? chat._id)}
                      aria-label={`Options for ${chat.title || "chat"}`}
                      className={`absolute right-1 grid size-8 place-items-center rounded-lg text-muted transition hover:bg-surface hover:text-primary focus-visible:outline-2 focus-visible:outline-accent ${
                        chatMenuId === (chat.id ?? chat._id)
                          ? "visible bg-surface"
                          : "invisible group-hover:visible group-focus-within:visible"
                      }`}
                      onClick={() =>
                        setChatMenuId(
                          chatMenuId === (chat.id ?? chat._id)
                            ? null
                            : (chat.id ?? chat._id),
                        )
                      }
                      type="button"
                    >
                      <Icon name="dots" />
                    </button>
                    {chatMenuId === (chat.id ?? chat._id) && (
                      <div className="absolute right-0 top-10 z-20 w-40 rounded-xl border border-border bg-card p-1.5 shadow-xl">
                        <button
                          className="flex min-h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-sm text-red-500 transition hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={!onDeleteChat}
                          onClick={() => handleDelete(chat)}
                          title={
                            !onDeleteChat
                              ? "Connect the delete handler in useChat first"
                              : undefined
                          }
                          type="button"
                        >
                          <Icon name="trash" />
                          Delete chat
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        <div
          className={`relative mt-auto border-t border-border p-3 ${
            collapsed ? "px-2" : ""
          }`}
        >
          <div
            className={`flex items-center rounded-2xl border border-border bg-card ${
              collapsed ? "flex-col gap-2 p-2" : "gap-3 px-3 py-3"
            }`}
          >
            <div
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-accent/20 text-sm font-semibold text-accent"
            >
              {initials}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-medium text-primary"
                  title={fullName}
                >
                  {fullName}
                </p>
                <p className="mt-0.5 text-xs text-muted">Plexshity member</p>
              </div>
            )}
            <button
              aria-expanded={settingsOpen}
              aria-label="Profile and settings"
              className="grid size-9 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-card-hover hover:text-primary focus-visible:outline-2 focus-visible:outline-accent"
              onClick={() => {
                setSettingsOpen(!settingsOpen);
                setChatMenuId(null);
              }}
              title="Settings"
              type="button"
            >
              <Icon name="settings" />
            </button>
          </div>
          {settingsOpen && (
            <div
              className={`absolute bottom-full z-30 mb-2 rounded-xl border border-border bg-card p-2 shadow-xl ${
                collapsed ? "left-[calc(100%+0.5rem)] w-56" : "left-3 right-3"
              }`}
            >
              <button
                className="flex min-h-10 w-full items-center gap-3 rounded-lg px-2.5 text-left text-sm text-primary transition hover:bg-card-hover"
                onClick={() => {
                  onToggleTheme();
                  setSettingsOpen(false);
                }}
                type="button"
              >
                <Icon name={theme === "dark" ? "sun" : "moon"} />
                {theme === "dark" ? "Light theme" : "Dark theme"}
              </button>
              <button
                className="flex min-h-10 w-full items-center gap-3 rounded-lg px-2.5 text-left text-sm text-primary transition hover:bg-card-hover"
                onClick={() => {
                  setSettingsOpen(false);
                  onLogout();
                }}
                type="button"
              >
                <Icon name="logout" />
                Log out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
