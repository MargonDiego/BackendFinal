    // src/entities/Student.js
    const { EntitySchema } = require('typeorm');

    const Student = new EntitySchema({
        name: "Student",
        tableName: "students",
        columns: {
            id: {
                primary: true,
                type: "int",
                generated: true,
                comment: "Identificador único del estudiante"
            },
            // Información Personal
            firstName: {
                type: "varchar",
                nullable: false,
                comment: "Nombres del estudiante"
            },
            lastName: {
                type: "varchar",
                nullable: false,
                comment: "Apellidos del estudiante"
            },
            rut: {
                type: "varchar",
                unique: true,
                nullable: false,
                comment: "RUT del estudiante con formato chileno (XX.XXX.XXX-X)"
            },
            email: {
                type: "varchar",
                unique: true,
                nullable: true,
                comment: "Correo electrónico institucional del estudiante"
            },
            birthDate: {
                type: "datetime",
                nullable: false,
                comment: "Fecha de nacimiento del estudiante"
            },
            gender: {
                type: "varchar",
                nullable: true,
                comment: "Género del estudiante \"Masculino\", \"Femenino\", \"No Binario\", \"Otro\""
            },
            nationality: {
                type: "varchar",
                default: "Chilena",
                nullable: true,
                comment: "Nacionalidad del estudiante"
            },

            // Información Académica
            grade: {
                type: "varchar",
                nullable: false,
                comment: "Nivel educativo actual del estudiante \n" +
                    "                \"Pre-Kinder\", \"Kinder\",\n" +
                    "                \"1° Básico\", \"2° Básico\", \"3° Básico\", \"4° Básico\",\n" +
                    "                \"5° Básico\", \"6° Básico\", \"7° Básico\", \"8° Básico\",\n" +
                    "                \"1° Medio\", \"2° Medio\", \"3° Medio\", \"4° Medio\""
            },
            academicYear: {
                type: "int",
                nullable: false,
                comment: "Año académico en curso"
            },
            section: {
                type: "varchar",
                nullable: true,
                comment: "Letra de la sección o curso (A, B, C, etc.)"
            },
            matriculaNumber: {
                type: "varchar",
                unique: true,
                nullable: false,
                comment: "Número de matrícula único del estudiante"
            },
            enrollmentStatus: {
                type: "varchar",
                default: "Regular",
                comment: "Estado actual de la matrícula \"Regular\", \"Suspendido\", \"Retirado\", \"Egresado\", \"Trasladado\""
            },
            previousSchool: {
                type: "varchar",
                nullable: true,
                comment: "Establecimiento educacional anterior"
            },
            simceResults: {
                type: "json",
                nullable: true,
                comment: "Registro histórico de resultados SIMCE"
            },
            academicRecord: {
                type: "json",
                nullable: true,
                comment: "Registro de calificaciones por asignatura y período"
            },
            attendance: {
                type: "json",
                nullable: true,
                comment: "Registro de asistencia por período"
            },

            // Información de Contacto y Familia
            address: {
                type: "varchar",
                nullable: true,
                comment: "Dirección completa del domicilio"
            },
            comuna: {
                type: "varchar",
                nullable: false,
                comment: "Comuna de residencia"
            },
            region: {
                type: "varchar",
                nullable: false,
                comment: "Región de residencia \"Arica y Parinacota\", \"Tarapacá\", \"Antofagasta\", \"Atacama\",\n" +
                    "                \"Coquimbo\", \"Valparaíso\", \"Metropolitana\", \"O'Higgins\",\n" +
                    "                \"Maule\", \"Ñuble\", \"Biobío\", \"Araucanía\", \"Los Ríos\",\n" +
                    "                \"Los Lagos\", \"Aysén del General Carlos Ibáñez del Campo\", \"Magallanes y de la Antártica Chilena\""
            },
            apoderadoTitular: {
                type: "json",
                nullable: false,
                comment: "Datos completos del apoderado titular (nombre, RUT, teléfono, email, parentesco)"
            },
            apoderadoSuplente: {
                type: "json",
                nullable: true,
                comment: "Datos completos del apoderado suplente"
            },
            grupoFamiliar: {
                type: "text",
                nullable: true,
                    comment: "Descripción del grupo familiar y situación socioemocional"
            },
            contactosEmergencia: {
                type: "json",
                nullable: false,
                comment: "Lista priorizada de contactos en caso de emergencia"
            },

            // Información de Salud
            prevision: {
                type: "varchar",
                nullable: true,
                comment: "Sistema de previsión de salud \"Fonasa\", \"Isapre\", \"Ninguna\""
            },
            grupoSanguineo: {
                type: "varchar",
                nullable: true,
                comment: "Grupo sanguíneo del estudiante"
            },
            condicionesMedicas: {
                type: "json",
                nullable: true,
                comment: "Registro de condiciones médicas relevantes"
            },
            alergias: {
                type: "json",
                nullable: true,
                comment: "Registro de alergias y contraindicaciones"
            },
            medicamentos: {
                type: "json",
                nullable: true,
                comment: "Medicamentos que consume regularmente"
            },

            // Necesidades Educativas Especiales
            diagnosticoPIE: {
                type: "json",
                nullable: true,
                comment: "Diagnóstico del Programa de Integración Escolar"
            },
            necesidadesEducativas: {
                type: "json",
                nullable: true,
                comment: "Detalle de necesidades educativas especiales"
            },
            apoyosPIE: {
                type: "json",
                nullable: true,
                comment: "Registro de apoyos recibidos en el PIE"
            },

            // Información Socioeconómica
            beneficioJUNAEB: {
                type: "boolean",
                default: false,
                comment: "Indica si recibe beneficios de JUNAEB"
            },
            tipoBeneficioJUNAEB: {
                type: "simple-array",
                nullable: true,
                comment: "Tipos de beneficios JUNAEB recibidos"
            },
            prioritario: {
                type: "boolean",
                default: false,
                comment: "Indica si es alumno prioritario"
            },
            preferente: {
                type: "boolean",
                default: false,
                comment: "Indica si es alumno preferente"
            },
            becas: {
                type: "json",
                nullable: true,
                comment: "Registro de becas y beneficios adicionales"
            },

            // Registro Conductual
            registroConvivencia: {
                type: "json",
                nullable: true,
                comment: "Registro de situaciones disciplinarias y reconocimientos"
            },
            medidasDisciplinarias: {
                type: "json",
                nullable: true,
                comment: "Historial de medidas disciplinarias aplicadas"
            },
            reconocimientos: {
                type: "json",
                nullable: true,
                comment: "Registro de logros y reconocimientos obtenidos"
            },

            // Metadatos
            isActive: {
                type: "boolean",
                default: true,
                comment: "Indica si el registro está activo en el sistema"
            },
            observaciones: {
                type: "text",
                nullable: true,
                comment: "Observaciones generales sobre el estudiante"
            },
            createdAt: {
                type: "datetime",
                createDate: true,
                comment: "Fecha de creación del registro"
            },
            updatedAt: {
                type: "datetime",
                updateDate: true,
                comment: "Fecha de última actualización"
            },
            deletedAt: {
                type: "datetime",
                nullable: true,
                comment: "Fecha de eliminación lógica"
            }
        },
        relations: {
            // Solo mantenemos las relaciones originales del archivo proporcionado
            interventions: {
                type: "one-to-many",
                target: "Intervention",
                inverseSide: "student",
                cascade: true,
                comment: "Intervenciones registradas para el estudiante"
            },
            assignedUsers: {
                type: "many-to-many",
                target: "User",
                inverseSide: "assignedStudents",
                cascade: true,
                comment: "Profesionales asignados al estudiante"
            }
        },
        indices: [
            {
                name: "idx_student_rut",
                columns: ["rut"],
                unique: true
            },
            {
                name: "idx_student_matricula",
                columns: ["matriculaNumber"],
                unique: true
            },
            {
                name: "idx_student_names",
                columns: ["firstName", "lastName"]
            },
            {
                name: "idx_student_grade",
                columns: ["grade", "academicYear", "section"]
            },
            {
                name: "idx_student_status",
                columns: ["enrollmentStatus"]
            }
        ]
    });

    module.exports = Student;