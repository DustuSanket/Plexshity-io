export default function BrandSignature({ variant = "compact", className = "" }) {
  const featured = variant === "featured";
  const home = variant === "home";
  const markSize = featured
    ? "brand-mark--animated size-20"
    : home
      ? "brand-mark--animated size-14"
      : "size-10";
  const imageSize = featured
    ? "size-16 object-contain"
    : home
      ? "size-12 object-contain"
      : "size-9 object-contain";
  const nameSize = featured
    ? "text-2xl sm:text-3xl"
    : home
      ? "text-lg"
      : "text-sm";

  return (
    <div
      className={`flex items-center justify-center ${
        featured ? "gap-4" : home ? "gap-3" : "gap-2.5"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`brand-mark grid shrink-0 place-items-center rounded-full ${markSize}`}
      >
        <img
          alt=""
          className={imageSize}
          src="/Plexshity-io.png"
        />
      </span>
      <span className={`font-semibold tracking-tight text-primary ${nameSize}`}>
        Plexshity<span className="text-accent">.io</span>
      </span>
    </div>
  );
}
