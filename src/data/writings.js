export const writings = [
  {
    slug: 'the-strange-comfort-of-an-append-only-file',
    title: 'The strange comfort of an append-only file',
    topic: 'Storage',
    teaser: 'What happens when the database is just a file, and why that constraint changes the way you think about failure.',
    lead: 'A file that only grows sounds almost too simple to be useful. That is exactly why it is worth building with one.',
    paragraphs: [
      'An append-only log asks a direct question: what actually happened? Each record is written after the last one. Nothing gets edited in place. The current picture of the system is something you derive from that sequence, rather than something you trust a mutable row to remember.',
      'The simplicity is real, but it moves the hard work elsewhere. A reader needs to find a record without scanning every line. A process needs to recover its index after a crash. A write must never leave two records tangled together. Even the difference between a character count and a byte count matters once you are seeking to an exact position in a UTF-8 file.',
      'In my event-store project, an in-memory map holds each record’s byte offset and length. Startup replays the log to rebuild that map. The file is durable; the index is disposable. That division makes the recovery story easier to explain and test.',
      'I like constraints that expose the mechanics. A tiny storage engine does not replace a mature database, but it teaches why databases do so much work on our behalf.',
    ],
    relatedProject: 'append-only-event-store',
  },
  {
    slug: 'the-second-tap-is-a-design-problem',
    title: 'The second tap is a design problem',
    topic: 'Reliability',
    teaser: 'A quick thought on retries, duplicate actions and why “the user only pressed it once” is not a safe assumption.',
    lead: 'A button can be pressed twice. A request can be retried. A response can be lost even when the work succeeded.',
    paragraphs: [
      'From the interface, these events can look identical. The user sees uncertainty and tries again. From the server, they can become two separate attempts to make the same change. That gap is not an edge case in the sense of being rare. It is part of using a network.',
      'An idempotency key gives the action an identity that survives a retry. The server can recognize the second arrival and return the first result instead of repeating the work. When money, inventory, or a shared score is involved, that distinction becomes important very quickly.',
      'Mizan’s star submissions use a client-supplied request ID and a transaction check. Row-level locking protects the jar and user totals when requests arrive together. These are backend details, but they shape the feeling of the app: the button can be trusted.',
      'Good interaction design includes the invisible response to imperfect timing. The second tap is a useful place to look for it.',
    ],
    relatedProject: 'mizan',
  },
  {
    slug: 'live-is-not-the-same-as-correct',
    title: 'Live is not the same as correct',
    topic: 'Real-time systems',
    teaser: 'Fast updates are satisfying, but a live interface needs a way to find the truth after a connection drops.',
    lead: 'Watching a status update instantly feels convincing. It does not prove the screen still knows the whole story.',
    paragraphs: [
      'Real-time interfaces usually have two jobs. They should react quickly when something changes, and they should recover cleanly when they miss a change. The first job gets the demo. The second job decides whether the interface stays useful on an unreliable connection.',
      'A stream of events can tell a dashboard that a job started, finished or failed. If the connection disappears between those messages, replay or a fresh query is needed to rejoin reality. Otherwise the screen is fast but wrong.',
      'In Memora, live updates move through a Socket.io layer for chat and notifications. When a connection drops, the interface needs to rejoin state and recover cleanly instead of trusting the last visible screen. The stream makes the experience feel immediate; the reconnect and refetch make it trustworthy.',
      'I think of live updates as a short path to the next known state, not as the only source of truth. The boring recovery path is part of the interaction.',
    ],
    relatedProject: 'memora',
  },
]
