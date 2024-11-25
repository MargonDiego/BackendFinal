// src/entities/User.js
const { EntitySchema } = require('typeorm');

const User = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            comment: "Identificador único del usuario"
        },
        // Información Personal
        firstName: {
            type: "varchar",
            nullable: false,
            comment: "Nombres del funcionario"
        },
        lastName: {
            type: "varchar",
            nullable: false,
            comment: "Apellidos del funcionario"
        },
        email: {
            type: "varchar",
            unique: true,
            nullable: false,
            comment: "Correo electrónico institucional"
        },
        password: {
            type: "varchar",
            nullable: false,
            select: false,
            comment: "Contraseña encriptada del usuario"
        },
        tokens: {
            type: "simple-array",
            nullable: true,
            select: false,
            comment: "Tokens de autenticación activos"
        },
        rut: {
            type: "varchar",
            unique: true,
            nullable: false,
            comment: "RUT del funcionario con formato chileno (XX.XXX.XXX-X)"
        },

        // Roles y Permisos
        role: {
            type: "varchar",
            default: "User",
            comment: "Rol principal del usuario en el establecimiento                 \"Viewer\",\n" +
                "                \"User\",\n" +
                "                \"Admin\""
        },
        permisos: {
            type: "simple-array",
            nullable: true,
            comment: "Permisos específicos asignados al usuario"
        },

        // Información Profesional
        staffType: {
            type: "varchar",
            nullable: true,
            comment: "Tipo de personal según clasificación ministerial \n" +
                "                \"Directivo\",\n" +
                "                \"Docente\",\n" +
                "                \"Profesional PIE\",\n" +
                "                \"Asistente de la Educación\",\n" +
                "                \"Administrativo\""
        },
        subjectsTeaching: {
            type: "simple-array",
            nullable: true,
            comment: "Asignaturas que imparte (para docentes)"
        },
        position: {
            type: "varchar",
            nullable: true,
            comment: "Cargo específico en el establecimiento"
        },
        department: {
            type: "varchar",
            nullable: true,
            comment: "Departamento al que pertenece \n" +
                "                \"Dirección\",\n" +
                "                \"UTP\",\n" +
                "                \"Convivencia Escolar\",\n" +
                "                \"Orientación\",\n" +
                "                \"PIE\",\n" +
                "                \"Departamento Lenguaje\",\n" +
                "                \"Departamento Matemática\",\n" +
                "                \"Departamento Ciencias\",\n" +
                "                \"Departamento Historia\",\n" +
                "                \"Departamento Inglés\",\n" +
                "                \"Departamento Arte y Música\",\n" +
                "                \"Departamento Ed. Física\",\n" +
                "                \"Inspectoría\",\n" +
                "                \"Administración"
        },
        especialidad: {
            type: "varchar",
            nullable: true,
            comment: "Especialidad o título profesional"
        },
        registroSecreduc: {
            type: "varchar",
            nullable: true,
            comment: "Número de registro en SECREDUC (para docentes)"
        },
        mencionesExtra: {
            type: "simple-array",
            nullable: true,
            comment: "Menciones o especializaciones adicionales"
        },

        // Información de Contacto
        phoneNumber: {
            type: "varchar",
            nullable: true,
            comment: "Número de teléfono de contacto"
        },
        birthDate: {
            type: "datetime",
            nullable: true,
            comment: "Fecha de nacimiento"
        },
        address: {
            type: "varchar",
            nullable: true,
            comment: "Dirección completa del domicilio"
        },
        comuna: {
            type: "varchar",
            nullable: true,
            comment: "Comuna de residencia"
        },
        region: {
            type: "varchar",
            nullable: true,
            comment: "Región de residencia \"Arica y Parinacota\", \"Tarapacá\", \"Antofagasta\", \"Atacama\",\n" +
                "                \"Coquimbo\", \"Valparaíso\", \"Metropolitana\", \"O'Higgins\",\n" +
                "                \"Maule\", \"Ñuble\", \"Biobío\", \"Araucanía\", \"Los Ríos\",\n" +
                "                \"Los Lagos\", \"Aysén del General Carlos Ibáñez del Campo\", \"Magallanes y de la Antártica Chilena\""
        },
        emergencyContact: {
            type: "json",
            nullable: true,
            comment: "Contacto de emergencia (nombre, relación, teléfono)"
        },

        // Información Laboral
        tipoContrato: {
            type: "varchar",
            nullable: true,
            comment: "Tipo de contrato  \"Planta\", \"Contrata\", \"Honorarios\", \"Reemplazo\", \"SEP\""
        },
        horasContrato: {
            type: "int",
            nullable: true,
            comment: "Horas de contrato semanales"
        },
        fechaIngreso: {
            type: "datetime",
            nullable: true,
            comment: "Fecha de ingreso al establecimiento"
        },
        bieniosReconocidos: {
            type: "int",
            nullable: true,
            comment: "Número de bienios reconocidos"
        },
        evaluacionDocente: {
            type: "json",
            nullable: true,
            comment: "Resultados de evaluación docente"
        },

        // Estado y configuración
        isActive: {
            type: "boolean",
            default: true,
            comment: "Indica si el usuario está activo en el sistema"
        },
        configuracionNotificaciones: {
            type: "json",
            nullable: true,
            comment: "Preferencias de notificaciones del usuario"
        },
        lastLogin: {
            type: "datetime",
            nullable: true,
            comment: "Último acceso al sistema"
        },
        // Intentos de inicio de sesión
        loginAttempts: {
            type: "int",
            default: 0,
            comment: "Número de intentos fallidos de inicio de sesión"
        },
        lastLoginAttempt: {
            type: "datetime",
            nullable: true,
            comment: "Fecha y hora del último intento de inicio de sesión"
        },

        // Metadatos
        createdAt: {
            type: "datetime",
            createDate: true,
            comment: "Fecha de creación del registro"
        },
        updatedAt: {
            type: "datetime",
            updateDate: true,
            comment: "Fecha de última actualización"
        }
    },
    relations: {
        // Mantenemos solo las relaciones originales
        reportedInterventions: {
            type: "one-to-many",
            target: "Intervention",
            inverseSide: "informer",
            comment: "Intervenciones reportadas por el usuario"
        },
        assignedInterventions: {
            type: "one-to-many",
            target: "Intervention",
            inverseSide: "responsible",
            comment: "Intervenciones asignadas al usuario"
        },
        assignedStudents: {
            type: "many-to-many",
            target: "Student",
            joinTable: {
                name: "user_students",
                joinColumn: {
                    name: "userId",
                    referencedColumnName: "id"
                },
                inverseJoinColumn: {
                    name: "studentId",
                    referencedColumnName: "id"
                }
            },
            comment: "Estudiantes asignados al usuario"
        }
    },
    indices: [
        {
            name: "email_index",
            columns: ["email"],
            comment: "Índice para búsqueda por correo electrónico"
        },
        {
            name: "rut_index",
            columns: ["rut"],
            comment: "Índice para búsqueda por RUT"
        },
        {
            name: "role_index",
            columns: ["role"],
            comment: "Índice para búsqueda por rol"
        },
        {
            name: "department_index",
            columns: ["department"],
            comment: "Índice para búsqueda por departamento"
        }
    ]
});

module.exports = User;