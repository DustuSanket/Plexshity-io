export default function LoadingScreen() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="fixed inset-0 z-50 grid min-h-screen place-items-center bg-canvas px-6 text-primary"
      role="status"
    >
      <div className="flex flex-col items-center gap-6">
        <span className="loading-screen__pulse" aria-hidden="true">
          <img
            alt=""
            className="loading-screen__logo"
            src="/Plexshity-io.png"
          />
        </span>
        <p className="text-sm font-medium tracking-wide text-muted">
          Have some patience
        </p>
      </div>
    </main>
  );
}