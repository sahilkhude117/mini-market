/**
 * MiniMarket Program SDK
 * 
 * A TypeScript SDK for interacting with the MiniMarket prediction market program.
 * 
 * @example
 * ```typescript
 * import { getMinimarketProgram, createMarket, addLiquidity } from './anchor/src'
 * 
 * const program = getMinimarketProgram(provider)
 * await createMarket(program, creator, {...params})
 * ```
 */

export * from './minimarket-exports'
