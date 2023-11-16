const ContactsRepository = require('../repositories/ContactsRepository')
const isValidUUID = require('../../utils/isValidUUID')

class ContactController {
	async index(request, response) {
		const { orderBy } = request.query

		const contacts = await ContactsRepository.findAll(orderBy)
		response.json(contacts)
	}

	async show(request, response) {
		const { id } = request.params

		if (!isValidUUID(id)) {
			return response.status(400).json({ error: 'Invalid user id' })
		}

		const contact = await ContactsRepository.findById(id)
		if (!contact) {
			return response.status(404).json({ error: 'Contact not found' })
		}

		response.json(contact)
	}

	async store(request, response) {
		const { name, email, phone, category_id } = request.body

		if (!name) {
			return response.status(400).json({ error: 'Name is required' })
		}

		if (category_id && !isValidUUID(category_id)) {
			return response.status(400).json({ error: 'Invalid Category' })
		}

		if (email) {
			const contactExists = await ContactsRepository.findByEmail(email)
			if (contactExists) {
				return response
					.status(400)
					.json({ error: 'This email is already been use' })
			}
		}

		const contact = await ContactsRepository.create({
			name,
			email: email || null,
			phone,
			category_id: category_id || null,
		})

		response.json(contact)
	}

	async update(request, response) {
		const { id } = request.params
		const { name, email, phone, category_id } = request.body

		if (!isValidUUID(id)) {
			return response.status(400).json({ error: 'Invalid user id' })
		}

		if (!name) {
			return response.status(400).json({ error: 'Name is required' })
		}

		const contactExists = await ContactsRepository.findById(id)
		if (!contactExists) {
			return response.status(404).json({ error: 'User not found' })
		}

		if (email) {
			const contactByEmail = await ContactsRepository.findByEmail(email)
			if (contactByEmail && contactByEmail.id !== id) {
				return response
					.status(400)
					.json({ error: 'This e-mail is already in use' })
			}
		}

		const contact = await ContactsRepository.update(id, {
			name,
			email: email || null,
			phone,
			category_id: category_id || null,
		})

		response.json(contact)
	}

	async delete(request, response) {
		const { id } = request.params

		if (!isValidUUID(id)) {
			return response.status(400).json({ error: 'Invalid user id' })
		}

		await ContactsRepository.delete(id)
		// 204: No Content
		response.sendStatus(204)
	}
}

module.exports = new ContactController()
