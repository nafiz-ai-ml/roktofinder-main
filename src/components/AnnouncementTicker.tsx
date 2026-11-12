const HEADER_MESSAGES = [
  '📢 RoktoFinder — "আল ফাতিহ ইসলামিক পাঠাগার"-এর একটি মানবিক উদ্যোগ',
  "🩸 ময়মনসিংহে রক্ত প্রয়োজন? এক ক্লিকে ডোনার খুঁজুন — সম্পূর্ণ ফ্রি",
  "💚 আজই ডোনার হিসেবে নিবন্ধন করুন — কারো জীবন বাঁচান",
  "📧 যোগাযোগ: roktofinder@gmail.com",
];

export function AnnouncementTicker({
  variant = "header",
  messages,
  badge = "ঘোষণা",
}: {
  variant?: "header" | "inline";
  messages?: string[];
  badge?: string;
}) {
  const list = messages && messages.length ? messages : HEADER_MESSAGES;
  const items = [...list, ...list];

  if (variant === "inline") {
    return (
      <div
        role="region"
        aria-label={badge}
        className="relative flex items-stretch overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 text-foreground shadow-sm"
      >
        <div className="flex shrink-0 items-center gap-2 bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground sm:text-sm">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          {badge}
        </div>
        <div className="group relative flex flex-1 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap py-2 text-sm font-medium group-hover:[animation-play-state:paused]">
            {items.map((msg, i) => (
              <span key={i} className="mx-6 inline-flex items-center">
                <span aria-hidden className="mr-6 text-primary/50">•</span>
                {msg}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Header (sticky)
  return (
    <div
      role="region"
      aria-label={badge}
      className="sticky top-0 z-50 flex h-7 items-stretch overflow-hidden border-b border-primary/30 bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground sm:h-8"
    >
      <div className="flex shrink-0 items-center gap-2 bg-black/20 px-3 text-[11px] font-semibold sm:text-xs">
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        {badge}
      </div>

      <div className="group relative flex flex-1 overflow-hidden">
        <div className="flex animate-marquee items-center whitespace-nowrap text-[11px] group-hover:[animation-play-state:paused] sm:text-xs">
          {items.map((msg, i) => (
            <span key={i} className="mx-8 inline-flex items-center">
              <span aria-hidden className="mr-8 opacity-60">•</span>
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
