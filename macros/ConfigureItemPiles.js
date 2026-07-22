// ============================================================
// RIFTS RPG - Configure Item Piles
// Run once as GM, with Item Piles enabled.
//
// Tells Item Piles where this system keeps money, prices and
// quantities. Without this, merchants can't take payment and
// sales don't credit the buyer — the trade silently does nothing.
//
// If the API isn't available, this prints the exact values to
// enter by hand under:
//   Game Settings -> Configure Settings -> Item Piles -> System Settings
// ============================================================

const INTEGRATION = {
  VERSION: "1.0.2",

  // Which actor type can own/trade items
  ACTOR_CLASS_TYPE: "character",

  // Where an item keeps its stack count and its price
  ITEM_QUANTITY_ATTRIBUTE: "system.quantity",
  ITEM_PRICE_ATTRIBUTE: "system.cost",

  // Items that are not physical goods must never appear in a pile
  ITEM_FILTERS: [
    { path: "type", filters: "skill,occ_ability" },
  ],

  // Two items count as "the same" when both match
  ITEM_SIMILARITIES: ["name", "type"],

  // Gear that should never merge into a stack
  UNSTACKABLE_ITEM_TYPES: ["weapon", "armor"],

  // Primary money. Path must match template.json exactly.
  CURRENCIES: [
    {
      type: "attribute",
      name: "Universal Credits",
      img: "icons/commodities/currency/coin-embossed-cog-silver.webp",
      abbreviation: "{#} cr",
      data: { path: "system.money.credits" },
      primary: true,
      exchangeRate: 1,
    },
  ],

  // Kept separate on purpose: black market credits are their own
  // pool, not small change for universal credits.
  SECONDARY_CURRENCIES: [
    {
      type: "attribute",
      name: "Black Market Credits",
      img: "icons/commodities/currency/coin-embossed-skull-silver.webp",
      abbreviation: "{#} bm",
      data: { path: "system.money.blackMarket" },
    },
  ],
};

const api = game.itempiles?.API;

if (!api) {
  ui.notifications.error("Item Piles isn't active — enable the module, then run this macro again.");
} else if (typeof api.addSystemIntegration !== "function") {
  // Older/newer API: show the values so they can be entered by hand.
  new Dialog({
    title: "Item Piles — Manual Settings for Rifts",
    content: `
      <p>This build of Item Piles doesn't expose <code>addSystemIntegration</code>.
         Enter these under <em>Configure Settings → Item Piles → System Settings</em>:</p>
      <ul style="font-size:12px;line-height:1.6;">
        <li><strong>Actor class type:</strong> <code>character</code></li>
        <li><strong>Item quantity attribute:</strong> <code>system.quantity</code></li>
        <li><strong>Item price attribute:</strong> <code>system.cost</code></li>
        <li><strong>Item filters:</strong> path <code>type</code>, filters <code>skill,occ_ability</code></li>
        <li><strong>Currency:</strong> attribute <code>system.money.credits</code> — "Universal Credits", abbreviation <code>{#} cr</code></li>
        <li><strong>Secondary currency:</strong> attribute <code>system.money.blackMarket</code> — "Black Market Credits", abbreviation <code>{#} bm</code></li>
      </ul>`,
    buttons: { ok: { label: "Got it" } },
  }).render(true);
  console.log("Rifts | Item Piles settings:", INTEGRATION);
} else {
  await api.addSystemIntegration(INTEGRATION);
  ui.notifications.info(
    "Item Piles configured for Rifts: credits at system.money.credits, prices at system.cost. Reload the world if merchants still misbehave."
  );
  console.log("Rifts | Item Piles integration applied:", INTEGRATION);
}
