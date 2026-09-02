const openings = {
  friendly: ["We need to talk.", "Okay, let's look at this together.", "So, about your last 20 games..."],
  brutal: ["We need to talk.", "This is going to sting.", "Buckle up."],
  nuclear: ["We NEED to talk.", "Nobody is safe from these stats.", "This is a public execution."],
};

const weaknessLines = {
  lowKD: {
    friendly: ["Your K/D is a little below one, but every fragger has a rough patch."],
    brutal: ["Your K/D is doing its best to stay below one.", "Your enemies have started considering you free XP."],
    nuclear: ["Your K/D isn't a stat, it's a cry for help.", "Statistically, you are the enemy team's favorite teammate."],
  },
  lowWinRate: {
    friendly: ["The win rate could use some work, but the team probably shares the blame."],
    brutal: ["Your win rate suggests the scoreboard and the scoreline agree on very little.", "You're winning fewer than half your games, and it shows."],
    nuclear: ["Your win rate is basically a coin flip that hates you.", "At this win rate, losing has become a personality trait."],
  },
  lowHeadshot: {
    friendly: ["Your headshot rate has room to grow, no judgment."],
    brutal: ["Your bullets seem personally offended by heads.", "Your crosshair has never met a head it could locate."],
    nuclear: ["Your bullets treat the head hitbox like a rumor.", "Somewhere, a headshot percentage is crying for attention, and it's yours."],
  },
  highFirstDeaths: {
    friendly: ["You're dying early a bit more than you'd like — entry timing is a work in progress."],
    brutal: ["You don't entry frag. You provide enemy information.", "First death speedrun, any%."],
    nuclear: ["You're not an entry fragger, you're an early-access spectator.", "You've entered so many afterlifes, Valorant should give you a season pass."],
  },
  lowACS: {
    friendly: ["Your ACS is a little quiet this stretch."],
    brutal: ["Your ACS suggests you're present in the match, technically.", "That combat score is doing the bare minimum."],
    nuclear: ["Your ACS is basically a participation trophy.", "Your combat score has filed for unemployment."],
  },
  lowADR: {
    friendly: ["Your damage per round could use a boost."],
    brutal: ["Your ADR says you're bringing a knife to a gunfight, emotionally.", "You deal about as much damage as a strongly worded message."],
    nuclear: ["Your ADR is basically decorative at this point.", "Enemies survive your damage output out of pure boredom."],
  },
};

const strengthLines = {
  highKD: ["Your K/D is actually solid.", "Your kill count is legitimately doing work."],
  highWinRate: ["Your win rate is genuinely respectable.", "You're winning more than you're losing, credit where it's due."],
  highHeadshot: ["Your aim is legitimately dangerous.", "Your headshot rate is one of the few things going right."],
  strongEntry: ["Your entry timing is actually good.", "You open sites better than most."],
  highACS: ["Your combat score is carrying weight.", "That ACS is genuinely impressive."],
  highADR: ["Your damage output is legit.", "You're dealing real damage every round."],
};

const verdicts = {
  friendly: [
    "Your teammates appreciate the effort.",
    "There's a good player in there somewhere.",
    "Room to grow, but nothing fatal.",
  ],
  brutal: [
    "Your teammates deserve financial compensation.",
    "Your crosshair placement is currently on a sightseeing tour.",
    "Your rank is doing more work than you are.",
  ],
  nuclear: [
    "Your teammates deserve hazard pay.",
    "Riot should send you a cease and desist for these stats.",
    "You are, statistically, a hostage situation for your team.",
  ],
};

const noWeaknessLines = [
  "Honestly, there isn't much to work with here.",
  "Your stats are frustratingly solid.",
  "You're annoyingly hard to roast.",
];

module.exports = { openings, weaknessLines, strengthLines, verdicts, noWeaknessLines };
