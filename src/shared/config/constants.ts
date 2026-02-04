export const GET_EVENTS_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/events/subscribe`;

/**
 * Platform's internal exchange rate: RUB per 1 Coin
 */
export const EXCHANGE_RATE_RUB_PER_COIN = 10;

/**
 * Economic rules for interactions
 */
export const INTERACTION_ECONOMY = {
  /**
   * Cost for a critic to post a single review
   */
  REVIEW_CREATION_FEE: 200,

  /**
   * Multiplier: Critic Reputation * Stake = Coins deducted from video
   */
  NEGATIVE_REVIEW_STAKE: 10,

  /**
   * Votes required for social validation
   */
  THRESHOLDS: {
    EXECUTE: 50,
    CANCEL: 30,
  },

  /**
   * Reputation gain for author from positive review
   */
  AUTHOR_REP_REWARD: 5,
};
