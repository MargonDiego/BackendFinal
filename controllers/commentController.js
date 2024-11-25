const BaseController = require('./base.controller');
const { AppDataSource } = require('../config/database');

const CommentRepository = AppDataSource.getRepository('InterventionComment');
const AuditRepository = AppDataSource.getRepository('Audit');

class CommentController extends BaseController {
    static async findAll(req, res) {
        try {
            const { tipo, isPrivate, interventionId, userId, page = 1, limit = 10 } = req.query;

            let whereClause = {};

            // Filtros básicos
            if (tipo) whereClause.tipo = tipo;
            if (isPrivate !== undefined) whereClause.isPrivate = isPrivate === 'true';
            if (interventionId) whereClause.intervention = { id: parseInt(interventionId, 10) };
            if (userId) whereClause.user = { id: parseInt(userId, 10) };

            const skip = (page - 1) * limit;

            // Obtener todos los atributos del comentario
            const [comments, total] = await CommentRepository.findAndCount({
                where: whereClause,
                relations: req.query.relations ? req.query.relations.split(',') : ['intervention', 'user'],
                order: { createdAt: 'DESC' },
                skip,
                take: limit,
                select: [
                    'id', 'content', 'tipo', 'evidencias', 'isPrivate', 'createdAt', 'updatedAt'
                ],
            });

            return res.json({
                data: comments,
                total,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching intervention comments', error: error.message });
        }
    }

    static async findOne(req, res) {
        try {
            const { id } = req.params;

            const comment = await CommentRepository.findOne({
                where: { id: parseInt(id, 10) },
                relations: ['intervention', 'user'],
            });

            if (!comment) {
                return res.status(404).json({ message: 'Intervention comment not found' });
            }

            return res.json(comment);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching intervention comment', error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const newComment = CommentRepository.create(req.body);
            const result = await CommentRepository.save(newComment);

            await AuditRepository.save({
                userId: req.user?.id,
                entityName: 'InterventionComment',
                entityId: result.id,
                action: 'CREAR',
                oldValues: null,
                newValues: result,
                module: 'COMENTARIOS_INTERVENCIONES',
            });

            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating intervention comment', error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;

            const comment = await CommentRepository.findOne({ where: { id: parseInt(id, 10) } });
            if (!comment) {
                return res.status(404).json({ message: 'Intervention comment not found' });
            }

            const oldValues = { ...comment };
            const updatedComment = await CommentRepository.save({
                ...comment,
                ...req.body,
            });

            await AuditRepository.save({
                userId: req.user?.id,
                entityName: 'InterventionComment',
                entityId: updatedComment.id,
                action: 'MODIFICAR',
                oldValues,
                newValues: updatedComment,
                module: 'COMENTARIOS_INTERVENCIONES',
            });

            return res.json(updatedComment);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating intervention comment', error: error.message });
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.params;

            const comment = await CommentRepository.findOne({ where: { id: parseInt(id, 10) } });
            if (!comment) {
                return res.status(404).json({ message: 'Intervention comment not found' });
            }

            const oldValues = { ...comment };
            await CommentRepository.delete(id);

            await AuditRepository.save({
                userId: req.user?.id,
                entityName: 'InterventionComment',
                entityId: comment.id,
                action: 'ELIMINAR',
                oldValues,
                newValues: null,
                module: 'COMENTARIOS_INTERVENCIONES',
            });

            return res.json({ message: 'Intervention comment deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting intervention comment', error: error.message });
        }
    }
}

module.exports = CommentController;
