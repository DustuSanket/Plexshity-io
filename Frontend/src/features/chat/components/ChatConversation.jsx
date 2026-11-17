import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Icon from "./Icon.jsx";

export default function ChatConversation({
  messages,
  loading,
  sending,
  chatTitle,
  pendingMessage,
  onRetry,
}) {
  const scrollContainerRef = useRef(null);
  const shouldStickToBottomRef = useRef(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const visibleMessages = pendingMessage
    ? [...messages, pendingMessage]
    : messages;

  useEffect(() => {
    if (!shouldStickToBottomRef.current) return;

    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pendingMessage?.clientId, pendingMessage?.status, sending, loading]);

  function scrollHandler(event) {
    const element = event.currentTarget;
    const isNearBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight < 120;
    shouldStickToBottomRef.current = isNearBottom;
    setShowScrollButton(!isNearBottom);
  }

  function scrollToLatest() {
    shouldStickToBottomRef.current = true;
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
    setShowScrollButton(false);
  }

  return (
    <section
      aria-label={`Conversation: ${chatTitle}`}
      className="relative flex min-h-0 flex-1 flex-col"
    >
      <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-border px-6 sm:px-10">
        <h1 className="truncate text-sm font-medium text-primary sm:text-base">
          {chatTitle}
        </h1>
        {sending && (
          <span
            aria-label="Plexshity is responding"
            className="ml-3 flex shrink-0 items-center gap-2 text-xs text-muted"
            role="status"
          >
            Thinking
            <span aria-hidden="true" className="chat-loading-dots">
              <i />
              <i />
              <i />
            </span>
          </span>
        )}
      </header>

      <div
        className="chat-scroll-area min-h-0 flex-1 overflow-y-auto px-5"
        onScroll={scrollHandler}
        ref={scrollContainerRef}
      >
        <div className="mx-auto flex w-full max-w-[780px] flex-col gap-7 py-8 sm:py-10">
          {loading ? (
            <p
              className="flex items-center justify-center gap-2 text-sm text-muted"
              role="status"
            >
              Opening this conversation
              <span aria-hidden="true" className="chat-loading-dots">
                <i />
                <i />
                <i />
              </span>
            </p>
          ) : visibleMessages.length === 0 ? (
            <p className="text-center text-sm text-muted">
              Start wherever your curiosity takes you.
            </p>
          ) : (
            visibleMessages.map((message, index) => (
              <article
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-card-hover px-4 py-3 text-primary sm:max-w-[78%]"
                    : "mr-auto w-full max-w-full text-primary"
                }
                key={
                  message._id ||
                  message.clientId ||
                  `${message.role}-${index}`
                }
              >
                {message.role === "ai" ? (
                  <div className="chat-markdown text-[15px] leading-7">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-[15px] leading-7">
                    {message.content}
                  </p>
                )}
              </article>
            ))
          )}

          {pendingMessage?.status === "sending" && (
            <p
              aria-label="Plexshity is responding"
              className="mr-auto flex min-h-8 items-center rounded-2xl bg-card-hover px-4 text-muted"
              role="status"
            >
              <img
                alt=""
                aria-hidden="true"
                className="chat-thinking-mark mr-2 size-5 object-contain"
                src="/Plexshity-favicon.png"
              />
              <span aria-hidden="true" className="chat-loading-dots">
                <i />
                <i />
                <i />
              </span>
            </p>
          )}
          {pendingMessage?.status === "failed" && (
            <div className="mr-auto flex flex-wrap items-center gap-3 text-sm">
              <p className="auth-error">
                {pendingMessage.error || "That message didn’t send."}
              </p>
              <button
                className="rounded-lg border border-border px-3 py-1.5 font-medium text-primary transition hover:bg-card-hover focus-visible:outline-2 focus-visible:outline-accent"
                onClick={onRetry}
                type="button"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>

      {showScrollButton && (
        <button
          className="absolute bottom-4 right-6 z-10 inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-primary shadow-lg transition hover:bg-card-hover focus-visible:outline-2 focus-visible:outline-accent"
          onClick={scrollToLatest}
          type="button"
        >
          <Icon name="arrowDown" />
          Latest
        </button>
      )}
    </section>
  );
}
