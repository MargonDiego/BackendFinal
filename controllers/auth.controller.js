const { AppDataSource } = require('../config/database');
const { generateToken } = require('../config/jwt');
const bcrypt = require('bcryptjs');

const UserRepository = AppDataSource.getRepository('User');
const AuditRepository = AppDataSource.getRepository('Audit');

class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await UserRepository.findOne({
                where: { email },
                select: ['id', 'email', 'password', 'role', 'firstName', 'lastName']
            });

            if (!user || !await bcrypt.compare(password, user.password)) {
                // Registrar intento fallido
                await AuditRepository.save({
                    userId: null,
                    entityName: 'Authentication',
                    entityId: null,
                    action: 'LOGIN_FAILED',
                    details: `Failed login attempt for email: ${email}`,
                    ipAddress: req.ip,
                    module: 'AUTH',
                });

                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = generateToken(user);

            // Registrar inicio de sesión exitoso
            await AuditRepository.save({
                userId: user.id,
                entityName: 'Authentication',
                entityId: user.id,
                action: 'LOGIN_SUCCESS',
                details: `User logged in successfully`,
                ipAddress: req.ip,
                module: 'AUTH',
            });

            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName,
                }
            });
        } catch (error) {
            return res.status(500).json({ message: 'Login failed', error: error.message });
        }
    }

    static async refresh(req, res) {
        try {
            const user = req.user;
            const token = generateToken(user);

            // Registrar token refrescado
            await AuditRepository.save({
                userId: user.id,
                entityName: 'Authentication',
                entityId: user.id,
                action: 'TOKEN_REFRESH',
                details: `User refreshed authentication token`,
                ipAddress: req.ip,
                module: 'AUTH',
            });

            return res.json({ token });
        } catch (error) {
            return res.status(500).json({ message: 'Token refresh failed', error: error.message });
        }
    }

    static async logout(req, res) {
        try {
            const user = req.user;

            // Registrar cierre de sesión
            await AuditRepository.save({
                userId: user.id,
                entityName: 'Authentication',
                entityId: user.id,
                action: 'LOGOUT',
                details: `User logged out`,
                ipAddress: req.ip,
                module: 'AUTH',
            });

            return res.json({ message: 'Logged out successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Logout failed', error: error.message });
        }
    }
}

module.exports = AuthController;
