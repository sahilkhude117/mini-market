use anchor_lang::prelude::*;
use crate::constants::MARKET_SEED;
use crate::errors::ContractError;

#[account]
#[derive(InitSpace, Debug)]
pub struct Market {
    pub value: f64,
    pub range: u8,
    pub creator: Pubkey,
    pub feed: Pubkey,
    pub token_a: Pubkey,
    pub token_b: Pubkey,
    pub market_status: MarketStatus,
    pub token_a_amount: u64,
    pub token_b_amount: u64,
    pub token_price_a: u64,
    pub token_price_b: u64,
    pub total_reserve: u64,
    pub yes_amount: u64,
    pub no_amount: u64,
    pub result: bool,
    pub bump: u8,
    pub date: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, Eq, InitSpace)]
pub enum MarketStatus {
    Created,
    Prepare,
    Active,
    Resolved,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct MarketParams {
    pub market_id: String,
    pub value: f64,
    pub range: u8,
    pub token_amount: u64,
    pub token_price: u64,
    pub date: i64,
    pub name_a: Option<String>,
    pub symbol_a: Option<String>,
    pub url_a: Option<String>,
    pub name_b: Option<String>,
    pub symbol_b: Option<String>,
    pub url_b: Option<String>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct BettingParams {
    pub market_id: String,
    pub amount: u64,
    pub is_yes: bool,
}

impl Market {
    pub fn update_market_settings(
        &mut self,
        value: f64,
        range: u8,
        creator: Pubkey,
        feed: Pubkey,
        token_a: Pubkey,
        token_b: Pubkey,
        token_amount: u64,
        token_price: u64,
        date: i64,
    ) {
        self.value = value;
        self.range = range;
        self.creator = creator;
        self.feed = feed;
        self.token_a = token_a;
        self.token_b = token_b;
        self.market_status = MarketStatus::Created;
        self.token_a_amount = token_amount;
        self.token_b_amount = token_amount;
        self.token_price_a = token_price;
        self.token_price_b = token_price;
        self.total_reserve = 0;
        self.yes_amount = 0;
        self.no_amount = 0;
        self.result = false;
        self.date = date;
    }

    pub fn update_market_status(&mut self, status: MarketStatus) {
        self.market_status = status;
    }

    pub fn set_token_price(&mut self, amount: u64, is_yes: bool) -> Result<()> {
        // Calculate new prices based on constant product formula (x * y = k)
        // This implements an automated market maker (AMM) pricing mechanism
        
        if is_yes {
            // Buying token A (yes)
            self.yes_amount = self.yes_amount.checked_add(amount).ok_or(ContractError::ArithmeticError)?;
            
            // Calculate constant k
            let k = (self.token_a_amount as u128)
                .checked_mul(self.token_b_amount as u128)
                .ok_or(ContractError::ArithmeticError)?;
            
            // New token_a_amount after purchase
            let new_token_a = self.token_a_amount
                .checked_sub(amount)
                .ok_or(ContractError::ArithmeticError)?;
            
            // Calculate new token_b_amount to maintain constant k
            let new_token_b = k.checked_div(new_token_a as u128)
                .ok_or(ContractError::ArithmeticError)? as u64;
            
            // Update token amounts
            self.token_a_amount = new_token_a;
            self.token_b_amount = new_token_b;
            
            // Calculate prices based on ratio
            let total_liquidity = self.token_a_amount
                .checked_add(self.token_b_amount)
                .ok_or(ContractError::ArithmeticError)?;
            
            if total_liquidity > 0 {
                self.token_price_a = (self.token_b_amount as u128)
                    .checked_mul(1000000)
                    .ok_or(ContractError::ArithmeticError)?
                    .checked_div(total_liquidity as u128)
                    .ok_or(ContractError::ArithmeticError)? as u64;
                
                self.token_price_b = (self.token_a_amount as u128)
                    .checked_mul(1000000)
                    .ok_or(ContractError::ArithmeticError)?
                    .checked_div(total_liquidity as u128)
                    .ok_or(ContractError::ArithmeticError)? as u64;
            }
        } else {
            // Buying token B (no)
            self.no_amount = self.no_amount.checked_add(amount).ok_or(ContractError::ArithmeticError)?;
            
            // Calculate constant k
            let k = (self.token_a_amount as u128)
                .checked_mul(self.token_b_amount as u128)
                .ok_or(ContractError::ArithmeticError)?;
            
            // New token_b_amount after purchase
            let new_token_b = self.token_b_amount
                .checked_sub(amount)
                .ok_or(ContractError::ArithmeticError)?;
            
            // Calculate new token_a_amount to maintain constant k
            let new_token_a = k.checked_div(new_token_b as u128)
                .ok_or(ContractError::ArithmeticError)? as u64;
            
            // Update token amounts
            self.token_a_amount = new_token_a;
            self.token_b_amount = new_token_b;
            
            // Calculate prices based on ratio
            let total_liquidity = self.token_a_amount
                .checked_add(self.token_b_amount)
                .ok_or(ContractError::ArithmeticError)?;
            
            if total_liquidity > 0 {
                self.token_price_a = (self.token_b_amount as u128)
                    .checked_mul(1000000)
                    .ok_or(ContractError::ArithmeticError)?
                    .checked_div(total_liquidity as u128)
                    .ok_or(ContractError::ArithmeticError)? as u64;
                
                self.token_price_b = (self.token_a_amount as u128)
                    .checked_mul(1000000)
                    .ok_or(ContractError::ArithmeticError)?
                    .checked_div(total_liquidity as u128)
                    .ok_or(ContractError::ArithmeticError)? as u64;
            }
        }
        
        Ok(())
    }

    pub fn get_signer<'a>(bump: &'a u8, market_id: &'a [u8]) -> [&'a [u8]; 3] {
        [MARKET_SEED.as_bytes(), market_id, std::slice::from_ref(bump)]
    }
}
