import preset_env from '@babel/preset-env'
import nullish from '@babel/plugin-proposal-nullish-coalescing-operator'
import optional from '@babel/plugin-proposal-optional-chaining'
import { transform } from '@babel/standalone'
import { minify } from 'terser'

const couchjs = async (source) => {
	try {
		source = transform(source, {
			presets: [preset_env],
			plugins: [nullish, optional],
			//@ts-ignore
			targets: 'firefox 78',
			sourceType: 'script',
			assumptions: { noDocumentAll: true },
		})
		// console.log(source)
		source = await minify({ 'file.js': source.code }, { module: false })
		// console.log(source)
		return source.code
	} catch (err) {
		throw Error(`Source '${source}' ${err.message}`)
	}
}

export default couchjs
