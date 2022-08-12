import path from 'path'

export default async function loadModule(directory, name) {
	let jsModule = false

	if (process.env.JEST_WORKER_ID) {
		jest.useFakeTimers()
	}
	jsModule = require(path.resolve(process.env.PWD, directory, name))
	if (process.env.JEST_WORKER_ID) {
		jest.useRealTimers()
	}
	if (Object.keys(jsModule).length > 0) {
		return jsModule
	} else {
		throw new Error(
			`The module ${path.join(
				directory,
				name
			)} doesn't export anything! You must export function/s with module.exports = {...}`
		)
	}
}
