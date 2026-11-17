import BrandSignature from "./BrandSignature.jsx";

const starterPrompts = [
  "Explain a difficult idea in simple terms",
  "Help me plan a productive week",
  "Compare two options I'm considering",
];

export default function HomeOverview({
  chats,
  onOpenChat,
  onStartPrompt,
  onNewChat,
}) {
  const recentChats = chats.slice(0, 4);

  return (
    <section className="min-h-0 flex-1 overflow-y-auto px-5 py-10 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-11 flex flex-col items-center text-center sm:mb-14">
          <BrandSignature className="mb-4 sm:mb-5" variant="home" />
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-accent">
            Your space to explore
          </p>
          <h1 className="max-w-[720px] text-3xl font-semibold tracking-[-0.035em] text-primary sm:text-4xl">
            Where will your curiosity take you?
          </h1>
          <p className="mt-3 max-w-[600px] text-sm leading-6 text-muted sm:text-base">
            Ask a question, explore an idea, or pick a starting point below.
          </p>
        </div>

        <section>
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-primary">
              Try a conversation starter
            </h2>
            <p className="mt-1 text-xs text-muted">
              Choose one to send it as your first message.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {starterPrompts.map((prompt) => (
              <button
                className="min-h-28 rounded-2xl border border-border bg-card p-4 text-left text-sm leading-6 text-primary shadow-sm transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-accent"
                key={prompt}
                onClick={() => onStartPrompt(prompt)}
                type="button"
              >
                {prompt}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-primary">
              Recent conversations
            </h2>
            <span className="text-xs tabular-nums text-muted">
              {chats.length}
            </span>
          </div>
          {recentChats.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {recentChats.map((chat) => (
                <button
                  className="truncate rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-primary shadow-sm transition hover:border-accent/35 hover:bg-card-hover hover:shadow-md focus-visible:outline-2 focus-visible:outline-accent"
                  key={chat.id ?? chat._id}
                  onClick={() => onOpenChat(chat)}
                  title={chat.title || "Untitled chat"}
                  type="button"
                >
                  {chat.title || "Untitled chat"}
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 px-5 py-6">
              <p className="text-sm text-muted">
                Your conversations will appear here after you start chatting.
              </p>
              <button
                className="mt-3 text-sm font-medium text-accent transition hover:underline"
                onClick={onNewChat}
                type="button"
              >
                Start a new chat
              </button>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
