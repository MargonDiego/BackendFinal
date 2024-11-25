const BaseController = require('./base.controller');
const { AppDataSource } = require('../config/database');

const InterventionRepository = AppDataSource.getRepository('Intervention');
const AuditRepository = AppDataSource.getRepository('Audit');

class InterventionController extends BaseController {
    static async findAll(req, res) {
        try {
            const {
                type,
                status,
                priority,
                interventionScope,
                studentId,
                informerId,
                responsibleId,
                dateFrom,
                dateTo,
                actionsTaken,
                outcomeEvaluation,
                followUpDate,
                requiresExternalReferral,
                page = 1,
                limit = 10,
            } = req.query;

            let whereClause = {};

            // Filtros adicionales
            if (type) whereClause.type = type;
            if (status) whereClause.status = status;
            if (priority) whereClause.priority = priority;
            if (interventionScope) whereClause.interventionScope = interventionScope;
            if (studentId) whereClause.student = { id: parseInt(studentId, 10) };
            if (informerId) whereClause.informer = { id: parseInt(informerId, 10) };
            if (responsibleId) whereClause.responsible = { id: parseInt(responsibleId, 10) };
            if (actionsTaken) whereClause.actionsTaken = actionsTaken;
            if (outcomeEvaluation) whereClause.outcomeEvaluation = outcomeEvaluation;
            if (requiresExternalReferral !== undefined) {
                whereClause.requiresExternalReferral = requiresExternalReferral === 'true';
            }

            // Filtro por rango de fechas
            if (dateFrom || dateTo) {
                whereClause.dateReported = {};
                if (dateFrom) whereClause.dateReported.$gte = new Date(dateFrom);
                if (dateTo) whereClause.dateReported.$lte = new Date(dateTo);
            }

            const skip = (page - 1) * limit;

            const [interventions, total] = await InterventionRepository.findAndCount({
                where: whereClause,
                relations: req.query.relations ? req.query.relations.split(',') : ['student', 'informer', 'responsible'],
                order: { dateReported: 'DESC' },
                skip,
                take: limit,
                select: [
                    'id', 'title', 'description', 'type', 'status', 'priority', 'dateReported', 'dateResolved',
                    'followUpDate', 'interventionScope', 'actionsTaken', 'outcomeEvaluation', 'parentFeedback',
                    'requiresExternalReferral', 'externalReferralDetails', 'documentacion', 'acuerdos',
                    'seguimientoPIE', 'estrategiasImplementadas', 'recursos', 'observaciones', 'createdAt', 'updatedAt',
                ],
            });

            return res.json({
                data: interventions,
                total,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching interventions', error: error.message });
        }
    }


    static async findOne(req, res) {
        try {
            const { id } = req.params;

            const intervention = await InterventionRepository.findOne({
                where: { id: parseInt(id) },
                relations: req.query.relations ? req.query.relations.split(',') : [],
            });

            if (!intervention) {
                return res.status(404).json({ message: 'Intervention not found' });
            }

            return res.json(intervention);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching intervention', error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const newIntervention = InterventionRepository.create(req.body);
            const result = await InterventionRepository.save(newIntervention);

            await AuditRepository.save({
                userId: req.user?.id,
                entityName: 'Intervention',
                entityId: result.id,
                action: 'CREAR',
                oldValues: null,
                newValues: result,
                module: 'INTERVENCIONES',
            });

            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating intervention', error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;

            const intervention = await InterventionRepository.findOne({ where: { id: parseInt(id, 10) } });
            if (!intervention) {
                return res.status(404).json({ message: 'Intervention not found' });
            }

            const oldValues = { ...intervention };
            const updatedIntervention = await InterventionRepository.save({
                ...intervention,
                ...req.body,
            });

            await AuditRepository.save({
                userId: req.user?.id,
                entityName: 'Intervention',
                entityId: updatedIntervention.id,
                action: 'MODIFICAR',
                oldValues,
                newValues: updatedIntervention,
                module: 'INTERVENCIONES',
            });

            return res.json(updatedIntervention);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating intervention', error: error.message });
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.params;

            const intervention = await InterventionRepository.findOne({ where: { id: parseInt(id, 10) } });
            if (!intervention) {
                return res.status(404).json({ message: 'Intervention not found' });
            }

            const oldValues = { ...intervention };
            await InterventionRepository.delete(id);

            await AuditRepository.save({
                userId: req.user?.id,
                entityName: 'Intervention',
                entityId: intervention.id,
                action: 'ELIMINAR',
                oldValues,
                newValues: null,
                module: 'INTERVENCIONES',
            });

            return res.json({ message: 'Intervention deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting intervention', error: error.message });
        }
    }
}

module.exports = InterventionController;
