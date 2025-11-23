#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("Count3AcZucFDPSFBAeHkQ6AvttieKUkyJ8HiQGhQwe");

#[program]
pub mod minimarket {
    use super::*;

    pub fn close(_ctx: Context<CloseMinimarket>) -> Result<()> {
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.minimarket.count = ctx.accounts.minimarket.count.checked_sub(1).unwrap();
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.minimarket.count = ctx.accounts.minimarket.count.checked_add(1).unwrap();
        Ok(())
    }

    pub fn initialize(_ctx: Context<InitializeMinimarket>) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
        ctx.accounts.minimarket.count = value.clone();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeMinimarket<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  init,
  space = 8 + Minimarket::INIT_SPACE,
  payer = payer
    )]
    pub minimarket: Account<'info, Minimarket>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseMinimarket<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  mut,
  close = payer, // close account and return lamports to payer
    )]
    pub minimarket: Account<'info, Minimarket>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub minimarket: Account<'info, Minimarket>,
}

#[account]
#[derive(InitSpace)]
pub struct Minimarket {
    count: u8,
}
