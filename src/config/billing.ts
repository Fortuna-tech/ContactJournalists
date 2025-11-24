export interface Plan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: {
      amount: number;
      priceId: string;
    };
    annual: {
      amount: number;
      priceId: string;
    };
  };
  features: string[];
  entitlements: {
    pitches: number; // 9999999 for unlimited
    users: number;
    pitchGenerator: boolean;
  };
}

export const STRIPE_PUBLISHABLE_KEY = "pk_live_S06xurWvv4TrlOZ75goSgsxk";

export const BILLING_PLANS: Record<string, Plan> = {
  starter: {
    id: "starter",
    name: "Starter",
    description: "For freelancers and solo founders.",
    price: {
      monthly: {
        amount: 45,
        priceId: "price_1SWz11H32orQYBkNHqpgl0rz", // Placeholder
      },
      annual: {
        amount: 450,
        priceId: "price_1SWz3ZH32orQYBkN2hPYlrjc", // Placeholder
      },
    },
    features: ["200 pitches/mo", "1 user", "Pitch Generator (daily sample)"],
    entitlements: {
      pitches: 200,
      users: 1,
      pitchGenerator: true, // daily sample only
    },
  },
  growth: {
    id: "growth",
    name: "Growth",
    description: "For startups and growing agencies.",
    price: {
      monthly: {
        amount: 99,
        priceId: "price_1SWz1fH32orQYBkNrkXU2IQn", // Placeholder
      },
      annual: {
        amount: 990,
        priceId: "price_1SWz3HH32orQYBkNkQxvrFpb", // Placeholder
      },
    },
    features: ["800 pitches/mo", "Up to 3 users", "Full Pitch Generator"],
    entitlements: {
      pitches: 800,
      users: 3,
      pitchGenerator: true,
    },
  },
  team: {
    id: "team",
    name: "Team",
    description: "For established agencies and marketing departments.",
    price: {
      monthly: {
        amount: 199,
        priceId: "price_1SWz29H32orQYBkNjBCd4p8b", // Placeholder
      },
      annual: {
        amount: 1990,
        priceId: "price_1SWz2tH32orQYBkNsaBMWwhN", // Placeholder
      },
    },
    features: ["Unlimited pitches", "Up to 10 users", "Priority support"],
    entitlements: {
      pitches: 9999999, // unlimited
      users: 10,
      pitchGenerator: true,
    },
  },
};
