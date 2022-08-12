import fs from 'fs/promises'
import loadModule from '../util/loadModule'
import extractFileStats from '../util/extractFileStats'
import loader from './couchjs-loader'

const nameRegexp = /^function[^\(]*\(/

const createDesignSectionFromFile = async (directory, fileName) => {
	let fileS = extractFileStats(directory, fileName)
	if (!fileS.isJavaScript || fileS.isLib) {
		try {
			const content = await fs.readFile(fileS.filePath, {
				encoding: 'utf8',
			})

			if (fileS.isJSON) {
				try {
					let jsonObject = JSON.parse(content.trim())
					return { [fileS.name]: jsonObject }
				} catch (err) {
					throw Error(`Bad content in ${fileS.filePath}. It must be valid json! ${err.message}`)
				}
			} else {
				return { [fileS.name]: content.trim() }
			}
		} catch (err) {
			throw Error(`Bad structure! ${fileS.filePath} must be regular file! ${err.message}`)
		}
	} else {
		try {
			const design_m = await loadModule(directory, fileS.name)

			let m_keys = Object.keys(design_m)
			if (m_keys.length === 1 && m_keys[0] === fileS.name) {
				let f_s = design_m[m_keys[0]].toString()
				f_s = await loader(f_s)
				let d_f = f_s.replace(nameRegexp, 'function (')
				return { [fileS.name]: d_f }
			} else {
				let elemenets = {}
				for (const element of m_keys) {
					if (typeof design_m[element] === 'function') {
						let functionString = design_m[element].toString()
						functionString = await loader(functionString)

						let designFunction = functionString.replace(
							nameRegexp,
							'function ('
						)
						elemenets = Object.assign(elemenets, {
							[element]: designFunction,
						})
					} else {
						elemenets = Object.assign(elemenets, {
							[element]: design_m[element],
						})
					}
				}
				return { [fileS.name]: elemenets }
			}
		} catch (err) {
			throw Error(`Can't load module from ${fileS.filePath}! ${err.message}`)
		}
	}
}

export default createDesignSectionFromFile
