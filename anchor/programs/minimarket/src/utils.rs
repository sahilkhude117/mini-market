use anchor_lang::{prelude::*, solana_program};
use anchor_spl::token;

pub fn sol_transfer<'a>(
    from_account: AccountInfo<'a>,
    to_account: AccountInfo<'a>,
    system_program: AccountInfo<'a>,
    amount: u64,
) -> Result<()> {
    let transfer_instruction =
        solana_program::system_instruction::transfer(from_account.key, to_account.key, amount);

    // Invoke the transfer instruction
    anchor_lang::solana_program::program::invoke_signed(
        &transfer_instruction,
        &[from_account, to_account, system_program],
        &[],
    )?;

    Ok(())
}

pub fn token_transfer<'a>(
    from_ata: AccountInfo<'a>,
    to_ata: AccountInfo<'a>,
    authority: AccountInfo<'a>,
    token_program: AccountInfo<'a>,
    singer_seed: &[&[&[u8]]; 1],
    amount: u64,
) -> Result<()> {
    let cpi_ctx: CpiContext<_> = CpiContext::new_with_signer(
        token_program,
        token::Transfer {
            from: from_ata,
            to: to_ata,
            authority: authority,
        },
        singer_seed,
    );
    token::transfer(cpi_ctx, amount)?;

    Ok(())
}
