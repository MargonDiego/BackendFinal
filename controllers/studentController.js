const BaseController = require('./base.controller');
const { AppDataSource } = require('../config/database');
const StudentRepository = AppDataSource.getRepository('Student');
const AuditRepository = AppDataSource.getRepository('Audit');

const normalizeRut = (rut) => {
    if (!rut) return '';
    // Eliminar puntos y espacios, convertir a mayúsculas
    return rut.replace(/[.\s]/g, '').toUpperCase();
};

class StudentController extends BaseController {
    static async findAll(req, res) {
        try {
            const { grade, isActive, search, page = 1, limit = 10 } = req.query;
            let whereClause = {};

            // Filtros básicos
            if (grade) whereClause.grade = grade;
            if (isActive !== undefined) whereClause.isActive = isActive === 'true';

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

            // Obtener todos los atributos del estudiante
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
                    'medidasDisciplinarias', 'reconocimientos', 'isActive', 'observaciones', 'createdAt', 'updatedAt'
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

            const student = await StudentRepository.findOne({
                where: { id: parseInt(id) },
                relations: req.query.relations ? req.query.relations.split(',') : [],
            });

            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }

            return res.json(student);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching student', error: error.message });
        }
    }

    // Función para normalizar el RUT (elimina puntos y convierte a mayúsculas)

    // Método para verificar si el RUT ya existe
    static async checkRutExists(req, res) {
        try {
            const { rut } = req.params;
            const normalizedRut = normalizeRut(rut);

            // Validar formato del RUT normalizado
            if (!/^\d{7,8}-[0-9Kk]{1}$/.test(normalizedRut)) {
                return res.status(400).json({
                    error: 'Formato de RUT inválido',
                    exists: false,
                });
            }

            const student = await StudentRepository.findOne({
                where: {
                    rut: normalizedRut,
                    isActive: true,
                },
            });

            return res.json({
                exists: !!student,
                message: student ? 'RUT ya registrado' : 'RUT disponible',
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Error al verificar RUT',
                details: error.message,
            });
        }
    }

    // Método para crear un nuevo estudiante con validación de RUT
    static async create(req, res) {
        console.log('Datos recibidos:', req.body);
        console.log('Usuario actual:', req.user);
        try {
            const { rut } = req.body;

            // Verificar si el RUT existe en el body
            if (!rut) {
                return res.status(400).json({
                    message: 'El campo RUT es obligatorio.',
                });
            }

            const normalizedRut = rut.toUpperCase();

            const existingStudent = await StudentRepository.findOne({
                where: {
                    rut: normalizedRut,
                    isActive: true,
                },
            });

            if (existingStudent) {
                return res.status(400).json({
                    message: 'Ya existe un estudiante con este RUT',
                });
            }

            const newStudent = StudentRepository.create({
                ...req.body,
                rut: normalizedRut,
            });

            const result = await StudentRepository.save(newStudent);

            await AuditRepository.save({
                userId: req.user?.id,
                entityName: 'Student',
                entityId: result.id,
                action: 'CREAR',
                details: 'Estudiante creado',
                module: 'ESTUDIANTES',
            });

            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({
                message: 'Error al crear estudiante',
                error: error.message,
            });
        }
    }

    // Método para actualizar un estudiante con validación de RUT
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { rut } = req.body;

            const student = await StudentRepository.findOne({
                where: { id: parseInt(id) },
            });

            if (!student) {
                return res.status(404).json({
                    message: 'Estudiante no encontrado',
                });
            }

            // Verificar si el RUT está siendo actualizado y si ya existe
            if (rut && rut !== student.rut) {
                const existingStudent = await StudentRepository.findOne({
                    where: {
                        rut: rut.toUpperCase(),
                        isActive: true,
                        id: Not(parseInt(id)),
                    },
                });

                if (existingStudent) {
                    return res.status(400).json({
                        message: 'Ya existe otro estudiante con este RUT',
                    });
                }
            }

            const oldValues = { ...student };
            const updatedStudent = await StudentRepository.save({
                ...student,
                ...req.body,
                rut: rut ? rut.toUpperCase() : student.rut,
            });

            await AuditRepository.save({
                userId: req.user?.id,
                entityName: 'Student',
                entityId: updatedStudent.id,
                action: 'MODIFICAR',
                oldValues,
                newValues: updatedStudent,
                module: 'ESTUDIANTES',
            });

            return res.json(updatedStudent);
        } catch (error) {
            return res.status(500).json({
                message: 'Error al actualizar estudiante',
                error: error.message,
            });
        }
    }

    // Método para eliminar (desactivar) un estudiante
    static async remove(req, res) {
        try {
            const { id } = req.params;
            const student = await StudentRepository.findOne({
                where: { id: parseInt(id) },
            });

            if (!student) {
                return res.status(404).json({
                    message: 'Estudiante no encontrado',
                });
            }

            const oldValues = { ...student };
            student.isActive = false;
            student.deletedAt = new Date();

            await StudentRepository.save(student);

            await AuditRepository.save({
                userId: req.user?.id,
                entityName: 'Student',
                entityId: student.id,
                action: 'ELIMINAR',
                oldValues,
                newValues: student,
                module: 'ESTUDIANTES',
            });

            return res.json({ message: 'Estudiante desactivado correctamente' });
        } catch (error) {
            return res.status(500).json({
                message: 'Error al eliminar estudiante',
                error: error.message,
            });
        }
    }
}

module.exports = StudentController;