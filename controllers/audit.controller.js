const BaseController = require('./base.controller');
const { AppDataSource } = require('../config/database');

const AuditRepository = AppDataSource.getRepository('Audit');

class AuditController extends BaseController {
    static async findAll(req, res) {
        try {
            const {
                grade, isActive, search, academicYear, section, matriculaNumber,
                enrollmentStatus, comuna, region, apoderadoTitular, prevision,
                condicionesMedicas, diagnosticoPIE, beneficioJUNAEB,
                page = 1, limit = 10,
            } = req.query;

            let whereClause = {};

            // Filtros básicos
            if (grade) whereClause.grade = grade;
            if (isActive !== undefined) whereClause.isActive = isActive === 'true';
            if (academicYear) whereClause.academicYear = academicYear;
            if (section) whereClause.section = section;
            if (matriculaNumber) whereClause.matriculaNumber = matriculaNumber;
            if (enrollmentStatus) whereClause.enrollmentStatus = enrollmentStatus;
            if (comuna) whereClause.comuna = comuna;
            if (region) whereClause.region = region;
            if (apoderadoTitular) whereClause.apoderadoTitular = apoderadoTitular;
            if (prevision) whereClause.prevision = prevision;
            if (condicionesMedicas) whereClause.condicionesMedicas = condicionesMedicas;
            if (diagnosticoPIE) whereClause.diagnosticoPIE = diagnosticoPIE;
            if (beneficioJUNAEB !== undefined) whereClause.beneficioJUNAEB = beneficioJUNAEB === 'true';

            // Filtro de búsqueda por texto
            if (search) {
                whereClause = [
                    { firstName: Like(`%${search}%`) },
                    { lastName: Like(`%${search}%`) },
                    { rut: Like(`%${search}%`) },
                    { email: Like(`%${search}%`) },
                ];
            }

            const skip = (page - 1) * limit;

            const [students, total] = await StudentRepository.findAndCount({
                where: whereClause,
                relations: req.query.relations ? req.query.relations.split(',') : [],
                order: { lastName: 'ASC', firstName: 'ASC' },
                skip,
                take: limit,
                select: [
                    'id', 'firstName', 'lastName', 'rut', 'email', 'birthDate', 'gender', 'nationality',
                    'grade', 'academicYear', 'section', 'matriculaNumber', 'enrollmentStatus', 'previousSchool',
                    'simceResults', 'academicRecord', 'attendance', 'address', 'comuna', 'region',
                    'apoderadoTitular', 'apoderadoSuplente', 'grupoFamiliar', 'contactosEmergencia',
                    'prevision', 'grupoSanguineo', 'condicionesMedicas', 'alergias', 'medicamentos',
                    'diagnosticoPIE', 'necesidadesEducativas', 'apoyosPIE', 'beneficioJUNAEB',
                    'tipoBeneficioJUNAEB', 'prioritario', 'preferente', 'becas', 'registroConvivencia',
                    'medidasDisciplinarias', 'reconocimientos', 'isActive', 'observaciones', 'createdAt', 'updatedAt',
                ],
            });

            return res.json({
                data: students,
                total,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching students', error: error.message });
        }
    }

    static async findOne(req, res) {
        try {
            const { id } = req.params;

            const audit = await AuditRepository.findOne({
                where: { id: parseInt(id, 10) },
                relations: ['user'],
            });

            if (!audit) {
                return res.status(404).json({ message: 'Audit record not found' });
            }

            return res.json(audit);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching audit record', error: error.message });
        }
    }

    // No se permite la creación, edición o eliminación manual de registros de auditoría.
    static async create(req, res) {
        return res.status(403).json({ message: 'Audit records cannot be created manually' });
    }

    static async update(req, res) {
        return res.status(403).json({ message: 'Audit records cannot be updated' });
    }

    static async remove(req, res) {
        return res.status(403).json({ message: 'Audit records cannot be deleted' });
    }
}

module.exports = AuditController;
