const BaseController = require('./base.controller');
const { AppDataSource } = require('../config/database');

const CommentRepository = AppDataSource.getRepository('InterventionComment');
const UserRepository = AppDataSource.getRepository('User');
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
                relations: ['intervention', 'user'],
                order: { createdAt: 'DESC' },
                skip,
                take: limit,
                select: [
                    'id', 'content', 'tipo', 'evidencias', 'isPrivate', 'createdAt', 'updatedAt'
                ],
            });

            // Asegurarse de que los datos relacionados estén completos
            const populatedComments = comments.map(comment => ({
                ...comment,
                user: {
                    id: comment.user?.id,
                    firstName: comment.user?.firstName,
                    lastName: comment.user?.lastName,
                },
                intervention: comment.intervention ? {
                    id: comment.intervention.id,
                    title: comment.intervention.title,
                    status: comment.intervention.status,
                } : null
            }));

            return res.json({
                data: populatedComments,
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
            // Usar el usuario del token JWT
            const user = await UserRepository.findOne({
                where: { id: req.user.id }
            });

            if (!user) {
                return res.status(400).json({ message: 'Usuario no encontrado' });
            }

            // Crear el comentario con la relación al usuario del token
            const newComment = CommentRepository.create({
                ...req.body,
                user: user
            });

            const result = await CommentRepository.save(newComment);

            // Cargar el comentario con todas sus relaciones
            const savedComment = await CommentRepository.findOne({
                where: { id: result.id },
                relations: ['intervention', 'user']
            });

            await AuditRepository.save({
                userId: req.user.id,
                entityName: 'InterventionComment',
                entityId: result.id,
                action: 'CREAR',
                oldValues: null,
                newValues: savedComment,
                module: 'COMENTARIOS_INTERVENCIONES',
            });

            return res.status(201).json(savedComment);
        } catch (error) {
            console.error('Error creating comment:', error);
            return res.status(500).json({ message: 'Error creating intervention comment', error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;

            // Buscar el comentario con sus relaciones
            const comment = await CommentRepository.findOne({
                where: { id: parseInt(id, 10) },
                relations: ['user', 'intervention']
            });

            if (!comment) {
                return res.status(404).json({ message: 'Intervention comment not found' });
            }

            // Verificar que el usuario que actualiza sea el autor
            if (comment.user.id !== req.user.id) {
                return res.status(403).json({ message: 'No autorizado para editar este comentario' });
            }

            const oldValues = { ...comment };

            // Mantener la relación con el usuario original
            const updatedComment = await CommentRepository.save({
                ...comment,
                ...req.body,
                user: comment.user // Mantener el usuario original
            });

            await AuditRepository.save({
                userId: req.user.id,
                entityName: 'InterventionComment',
                entityId: updatedComment.id,
                action: 'ACTUALIZAR',
                oldValues,
                newValues: updatedComment,
                module: 'COMENTARIOS_INTERVENCIONES',
            });

            // Devolver el comentario actualizado con sus relaciones
            const refreshedComment = await CommentRepository.findOne({
                where: { id: updatedComment.id },
                relations: ['intervention', 'user']
            });

            return res.json(refreshedComment);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating intervention comment', error: error.message });
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.params;

            // Buscar el comentario con sus relaciones
            const comment = await CommentRepository.findOne({
                where: { id: parseInt(id, 10) },
                relations: ['user']
            });

            if (!comment) {
                return res.status(404).json({ message: 'Intervention comment not found' });
            }

            // Verificar que el usuario que elimina sea el autor
            if (comment.user.id !== req.user.id) {
                return res.status(403).json({ message: 'No autorizado para eliminar este comentario' });
            }

            await CommentRepository.remove(comment);

            await AuditRepository.save({
                userId: req.user.id,
                entityName: 'InterventionComment',
                entityId: id,
                action: 'ELIMINAR',
                oldValues: comment,
                newValues: null,
                module: 'COMENTARIOS_INTERVENCIONES',
            });

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting intervention comment', error: error.message });
        }
    }
}

module.exports = CommentController;
