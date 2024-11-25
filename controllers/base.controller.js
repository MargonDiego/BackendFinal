class BaseController {
    static repository;

    static async findAll(req, res) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const skip = (page - 1) * limit;

            const [items, total] = await this.repository.findAndCount({
                where: filters, // Aplicar filtros directamente desde los parámetros de consulta
                relations: req.query.relations ? req.query.relations.split(',') : [],
                skip,
                take: limit,
            });

            return res.json({
                data: items,
                total,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching records', error: error.message });
        }
    }

    static async findOne(req, res) {
        try {
            const item = await this.repository.findOne({
                where: { id: req.params.id },
                relations: req.query.relations ? req.query.relations.split(',') : [],
            });

            if (!item) {
                return res.status(404).json({ message: 'Record not found' });
            }

            return res.json(item);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching record', error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const newItem = this.repository.create(req.body);
            const result = await this.repository.save(newItem);
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating record', error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const item = await this.repository.findOne({
                where: { id: req.params.id },
            });

            if (!item) {
                return res.status(404).json({ message: 'Record not found' });
            }

            const updated = await this.repository.save({
                ...item,
                ...req.body,
            });

            return res.json(updated);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating record', error: error.message });
        }
    }

    static async remove(req, res) {
        try {
            const result = await this.repository.delete(req.params.id);

            if (result.affected === 0) {
                return res.status(404).json({ message: 'Record not found' });
            }

            return res.json({ message: 'Record deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting record', error: error.message });
        }
    }
}

module.exports = BaseController;
