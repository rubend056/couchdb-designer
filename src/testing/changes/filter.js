import { getTestContext } from '../../../build/testing/testEnvironment'
import supplementRequest from '../../util/supplementRequest'

const getDocument = (database, id) => {
	for (let document of database) {
		if (document._id === id) {
			return document
		}
	}
}

const filter = (contextId, req) => {
	if (typeof req === 'object') {
		let { filter, request } = req
		if (filter) {
			let { changes, database, context, type } = getTestContext(contextId)
			let filterError = false
			let result = changes.filter((sequence) => {
				let filterRequest = supplementRequest(
					request,
					sequence.id,
					contextId,
					'testdatabase/_changes',
					true
				)
				let doc = getDocument(database.data, sequence.id)
				let ddocName = filter.split('/')[0]
				let filterName = filter.split('/')[1]
				try {
					let filterResult = ''
					if (type === 'context') {
						if (context.filters && context.filters[filterName]) {
							filterResult = context.filters[filterName](doc, filterRequest)
						} else {
							throw {
								filterError: `It is not ${filterName} filter in ${context.id}!`,
							}
						}
					} else {
						if (context[ddocName]) {
							if (
								context[ddocName].filters &&
								context[ddocName].filters[filterName]
							) {
								filterResult = context[ddocName].filters[filterName](
									doc,
									filterRequest
								)
							} else {
								throw {
									filterError: `It is not ${filterName} filter in ${context[ddocName].id}!`,
								}
							}
						} else {
							throw {
								filterError: `It is not ${ddocName} design document in testdatabase!`,
							}
						}
					}
					if (typeof filterResult === 'boolean') {
						return filterResult
					} else {
						throw {
							filterError: `Filter function must return boolean result. Yours is ${typeof filterResult}!`,
						}
					}
				} catch (err) {
					filterError = err
				}
			})

			if (filterError) {
				if (filterError.filterError) {
					throw filterError.filterError
				} else {
					throw `Your ${filterName} filter function throw: ${filterError.message}`
				}
			} else {
				return { results: result, last_seq: changes[changes.length - 1].seq }
			}
		} else {
			throw 'The request object must contain a filter field to specify the filter.'
		}
	} else {
		throw 'After the "_changes" you have to give an object or leave its spot empty.'
	}
}

export default filter
