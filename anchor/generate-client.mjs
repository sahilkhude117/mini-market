import { rootNodeFromAnchor } from '@codama/nodes-from-anchor'
import { renderVisitor } from '@codama/renderers-js'
import { readFileSync } from 'fs'
import { GILL_EXTERNAL_MODULE_MAP } from 'gill'

const idlPath = './target/idl/minimarket.json'
const outputPath = './src/client/js/generated'

const idl = JSON.parse(readFileSync(idlPath, 'utf-8'))

try {
  const codama = rootNodeFromAnchor(idl)
  const visitor = renderVisitor(outputPath, { dependencyMap: GILL_EXTERNAL_MODULE_MAP })
  codama.accept(visitor)
  console.log('✓ Successfully generated TypeScript client')
} catch (error) {
  console.error('✖ Error generating client:', error.message)
  console.error(error.stack)
  process.exit(1)
}
