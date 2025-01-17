import fs from 'fs/promises'
import createTestContext from './createTestContext'
import createMangoContext from './createMangoContext'
import { registerContext } from '../build/testing/testEnvironment'
import contextFunction from './util/contextFunction'
import defaults from './testing/defaults'
import { registerDatabase } from './testing/changes/updateDocument'
import createAllDocs from './testing/indexes/createAllDocs'
import createMangoFunctions from './testing/createMangoFunctions'
import crypto from 'crypto'
import path from 'path'

const createTestServer = (
	directoryName,
	testDatabase,
	userCtx = defaults.userCtx,
	secObj = defaults.secObj
) => {
	return new Promise((resolve, reject) => {
		let root = path.join(directoryName)
		let hasKey = Date.now().valueOf().toString()
		let contextId = crypto.createHash('md5').update(hasKey).digest('hex')
		let isDatabasePartitioned = testDatabase.partitioned ? true : false

		fs.readdir(root).then(
			(names) => {
				Promise.all(
					names.map((name) => {
						if (/.*\.json$/.test(name.toLowerCase())) {
							return createMangoContext(
								directoryName,
								name,
								isDatabasePartitioned,
								contextId
							)
						} else {
							return createTestContext(
								directoryName,
								name,
								isDatabasePartitioned,
								contextId
							)
						}
					})
				).then(
					(designContexts) => {
						let serverContext = contextFunction(contextId)

						for (let designContext of designContexts) {
							if (designContext) {
								let designName = designContext.id.split('/')[1]

								serverContext[designName] = designContext
							}
						}
						registerContext(contextId, serverContext, 'server', userCtx, secObj)
						registerDatabase(contextId, testDatabase, userCtx)
						createAllDocs(contextId)
						createMangoFunctions(contextId)
						resolve(serverContext)
					},
					(err) => reject(err)
				)
			},
			(err) => reject(err)
		)
	})
}

export default createTestServer
