import Icon from "./Icon.jsx";

export default function ChatComposer({ onSend, disabled }) {
  async function submitHandler(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const message = String(formData.get("message") || "").trim();

    if (!message || disabled) return;

    const request = onSend(message);
    const textarea = form.elements.namedItem("message");
    form.reset();
    textarea.style.height = "";
    await request;
  }

  function resizeHandler(event) {
    const textarea = event.currentTarget;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 192)}px`;
  }

  function keyDownHandler(event) {
    if (event.key !== "Enter") return;

    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      const textarea = event.currentTarget;
      textarea.setRangeText(
        "\n",
        textarea.selectionStart,
        textarea.selectionEnd,
        "end",
      );
      resizeHandler(event);
      return;
    }

    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }

  return (
    <form
      className="w-full rounded-2xl border border-border bg-card p-3 shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition focus-within:border-accent/40"
      onSubmit={submitHandler}
    >
      <label className="sr-only" htmlFor="chat-message">
        Ask a question
      </label>
      <textarea
        autoComplete="off"
        className="max-h-48 min-h-12 w-full resize-none overflow-y-auto bg-transparent px-2 py-2 text-[15px] leading-6 text-primary outline-none placeholder:text-muted"
        id="chat-message"
        name="message"
        onInput={resizeHandler}
        onKeyDown={keyDownHandler}
        placeholder="What are you curious about?"
        rows={2}
      />
      <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
        <p className="px-2 text-xs text-muted">
          Enter to send · Ctrl + Enter for a new line
        </p>
        <button
          aria-label="Send message"
          className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-50"
          disabled={disabled}
          type="submit"
        >
          <Icon className="size-[18px]" name="send" />
        </button>
      </div>
    </form>
  );
}
