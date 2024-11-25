const BaseController = require('./base.controller');
const { AppDataSource } = require('../config/database');
const bcrypt = require('bcryptjs');

const UserRepository = AppDataSource.getRepository('User');
const AuditRepository = AppDataSource.getRepository('Audit');

class UsuarioController extends BaseController {
    static async findOne(req, res) {
        try {
            const { id } = req.params;

            const user = await UserRepository.findOne({
                where: { id: parseInt(id) },
                relations: req.query.relations ? req.query.relations.split(',') : [],
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Excluir campos sensibles
            delete user.password;
            delete user.tokens;

            return res.json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching user', error: error.message });
        }
    }

    static async findAll(req, res) {
        try {
            const { role, department, staffType, isActive, search } = req.query;
            let whereClause = {};

            if (role) whereClause.role = role;
            if (department) whereClause.department = department;
            if (staffType) whereClause.staffType = staffType;
            if (isActive !== undefined) whereClause.isActive = isActive === 'true';

            if (search) {
                whereClause = [
                    { firstName: Like(`%${search}%`) },
                    { lastName: Like(`%${search}%`) },
                    { email: Like(`%${search}%`) },
                    { rut: Like(`%${search}%`) },
                ];
            }

            const users = await UserRepository.find({
                where: whereClause,
                relations: req.query.relations ? req.query.relations.split(',') : [],
                order: { lastName: 'ASC', firstName: 'ASC' },
                select: [
                    'id', 'firstName', 'lastName', 'email', 'rut', 'role', 'permisos', 'staffType',
                    'subjectsTeaching', 'position', 'department', 'especialidad', 'registroSecreduc', 'mencionesExtra',
                    'phoneNumber', 'birthDate', 'address', 'comuna', 'region', 'emergencyContact', 'tipoContrato',
                    'horasContrato', 'fechaIngreso', 'bieniosReconocidos', 'evaluacionDocente', 'isActive',
                    'configuracionNotificaciones', 'lastLogin', 'loginAttempts', 'lastLoginAttempt', 'createdAt', 'updatedAt'
                ],
            });

            return res.json(users);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const { password, ...userData } = req.body;

            const existingUser = await UserRepository.findOne({
                where: [{ email: userData.email }, { rut: userData.rut }],
            });

            if (existingUser) {
                return res.status(400).json({ message: 'User already exists with this email or RUT' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = UserRepository.create({
                ...userData,
                password: hashedPassword,
                tokens: [],
                loginAttempts: 0,
            });

            const result = await UserRepository.save(newUser);
            const { password: _, tokens: __, ...userWithoutPassword } = result;

            await AuditRepository.save({
                userId: req.user?.id,
                entityName: 'User',
                entityId: result.id,
                action: 'CREAR',
                oldValues: null,
                newValues: userWithoutPassword,
                module: 'USUARIOS',
            });

            return res.status(201).json(userWithoutPassword);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { password, ...updateData } = req.body;

            const user = await UserRepository.findOne({ where: { id: parseInt(id) } });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (password) {
                updateData.password = await bcrypt.hash(password, 10);
            }

            const oldValues = { ...user };
            const updated = await UserRepository.save({ ...user, ...updateData });
            const { password: _, tokens: __, ...userWithoutPassword } = updated;

            await AuditRepository.save({
                userId: req.user?.id,
                entityName: 'User',
                entityId: updated.id,
                action: 'MODIFICAR',
                oldValues,
                newValues: userWithoutPassword,
                module: 'USUARIOS',
            });

            return res.json(userWithoutPassword);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating user', error: error.message });
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.params;

            const user = await UserRepository.findOne({ where: { id: parseInt(id) } });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const oldValues = { ...user };
            user.isActive = false;
            user.deletedAt = new Date();

            await UserRepository.save(user);

            await AuditRepository.save({
                userId: req.user?.id,
                entityName: 'User',
                entityId: user.id,
                action: 'ELIMINAR',
                oldValues,
                newValues: user,
                module: 'USUARIOS',
            });

            return res.json({ message: 'User deactivated successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error removing user', error: error.message });
        }
    }
}

module.exports = UsuarioController;
