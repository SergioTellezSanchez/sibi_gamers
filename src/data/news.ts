/** Content for the News section. */

export const NEWS_CATEGORIES = [
  "All",
  "Industry",
  "Releases",
  "Patches",
  "Esports",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export type Story = {
  id: string;
  source: string;
  category: Exclude<NewsCategory, "All">;
  headline: string;
  standfirst: string;
  date: string;
  /** Bucket used to group the feed under date headings. */
  bucket: "Today" | "Yesterday" | "Earlier this week";
};

export const LEAD_STORY = {
  id: "lead",
  source: "Sibi Gamers",
  category: "Industry" as const,
  headline: "Vault Nine confirms Ashen Trials expansion for early 2027",
  standfirst:
    "The studio says the expansion is 'roughly the size of the base game's second act' and will ship simultaneously on PC and PS5, with no season pass.",
  date: "2 hours ago",
  byline: "Renata Solís",
};

export const STORIES: Story[] = [
  {
    id: "n1",
    source: "IGN",
    category: "Patches",
    headline: "Ashen Trials gets a day-one patch addressing frame pacing on PS5",
    standfirst: "The 4.2 GB update also fixes the save corruption reported in the prologue.",
    date: "2 hours ago",
    bucket: "Today",
  },
  {
    id: "n2",
    source: "Polygon",
    category: "Industry",
    headline: "Hollow Vector director discusses the decision to cut multiplayer",
    standfirst: "'We had a co-op build that worked. It just made the game worse.'",
    date: "5 hours ago",
    bucket: "Today",
  },
  {
    id: "n3",
    source: "Eurogamer",
    category: "Releases",
    headline: "Driftbound season two content roadmap detailed",
    standfirst: "Six tracks, a livery editor, and a time-trial ladder land across the autumn.",
    date: "7 hours ago",
    bucket: "Today",
  },
  {
    id: "n4",
    source: "Kotaku",
    category: "Releases",
    headline: "Cinder Watch delayed on Switch to address performance",
    standfirst: "PC and PS5 versions are unaffected; the handheld port slips to October.",
    date: "Yesterday, 18:40",
    bucket: "Yesterday",
  },
  {
    id: "n5",
    source: "GameSpot",
    category: "Industry",
    headline: "Static Fields crosses two million players in its first month",
    standfirst: "Halfmast credits word of mouth and a demo that ran for the full first season.",
    date: "Yesterday, 14:05",
    bucket: "Yesterday",
  },
  {
    id: "n6",
    source: "PC Gamer",
    category: "Patches",
    headline: "Ferrous Dawn rebalances every faction in its first major update",
    standfirst: "Anvil Grade calls the changes 'the version we wanted to ship'.",
    date: "Yesterday, 11:20",
    bucket: "Yesterday",
  },
  {
    id: "n7",
    source: "Sibi Gamers",
    category: "Esports",
    headline: "Driftbound announces a $2M invitational for the winter season",
    standfirst: "Sixteen teams, four regions, and a format that drops qualifiers entirely.",
    date: "Tue, 09:15",
    bucket: "Earlier this week",
  },
  {
    id: "n8",
    source: "Eurogamer",
    category: "Industry",
    headline: "Cortina Studio moves to a four-day week after Loam's success",
    standfirst: "The Mexico City studio says headcount and pay stay unchanged.",
    date: "Tue, 08:00",
    bucket: "Earlier this week",
  },
  {
    id: "n9",
    source: "IGN",
    category: "Releases",
    headline: "Quietstone's free 'Long Winter' chapter arrives next month",
    standfirst: "Northlight Craft adds roughly four hours of story to the game's back half.",
    date: "Mon, 16:30",
    bucket: "Earlier this week",
  },
  {
    id: "n10",
    source: "Polygon",
    category: "Esports",
    headline: "Hollow Vector speedrun record falls twice in one weekend",
    standfirst: "The any% mark now sits under nineteen minutes after a new skip was found.",
    date: "Mon, 10:45",
    bucket: "Earlier this week",
  },
];

export const TRENDING = [
  "Ashen Trials review roundup: the year's highest aggregate",
  "Every Driftbound season two track, ranked",
  "Why Static Fields' demo strategy worked",
  "The Cinder Watch Switch delay, explained",
  "Loam's four-day week, one year on",
];
