#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
pub mod constants;
pub mod errors;
pub mod events;
pub mod instructions;
pub mod states;
pub mod utils;

use instructions::{
    betting::*, create_market::*, deposite_liquidity::*, get_oracle_res::*, init::*, token_mint::*,
    withdraw::*,
};
use states::{
    global::GlobalParams,
    market::{BettingParams, MarketParams},
};

declare_id!("Count3AcZucFDPSFBAeHkQ6AvttieKUkyJ8HiQGhQwe");

#[program]
pub mod minimarket {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, params: GlobalParams) -> Result<()> {
        init(ctx, params)
    }
}
