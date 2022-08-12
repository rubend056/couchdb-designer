import fs from 'fs/promises'
import createDesignDocument from './createDesignDocument'
import createMangoDocument from './createMangoDocument'
import path from 'path'

export default async function designer(root) {
	const names = await fs.readdir(root)

	return await Promise.all(
		names.map((name) => {
			if (/.*\.json$/.test(name.toLowerCase())) {
				return createMangoDocument(root, name)
			} else {
				return createDesignDocument(path.join(root, name))
			}
		})
	).catch(err => {throw err})
}
