    // src/entities/Intervention.js
const { EntitySchema } = require('typeorm');

const Intervention = new EntitySchema({
    name: "Intervention",
    tableName: "interventions",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            comment: "Identificador único de la intervención"
        },
        // Información básica
        title: {
            type: "varchar",
            nullable: false,
            comment: "Título descriptivo de la intervención"
        },
        description: {
            type: "text",
            nullable: false,
            comment: "Descripción detallada de la situación"
        },
        type: {
            type: "varchar",
            default: "Otro",
            comment: "Tipo de intervención realizada \n" +
                "                \"Académica\",\n" +
                "                \"Conductual\",\n" +
                "                \"Emocional\",\n" +
                "                \"Social\",\n" +
                "                \"Familiar\",\n" +
                "                \"Asistencia\",\n" +
                "                \"Derivación\",\n" +
                "                \"PIE\",\n" +
                "                \"Convivencia Escolar\",\n" +
                "                \"Orientación\",\n" +
                "                \"Otro\""
        },
        status: {
            type: "varchar",
            default: "Pendiente",
            comment: "Estado actual de la intervención \n" +
                "                \"Pendiente\",\n" +
                "                \"En Proceso\",\n" +
                "                \"En Espera\",\n" +
                "                \"Finalizada\",\n" +
                "                \"Derivada\",\n" +
                "                \"Cancelada\""
        },
        priority: {
            type: "varchar",
            nullable: false,
            comment: "Nivel de prioridad de la intervención \n" +
                "                \"Baja\",\n" +
                "                \"Media\",\n" +
                "                \"Alta\",\n" +
                "                \"Urgente\""
        },

        // Fechas y plazos
        dateReported: {
            type: "datetime",
            nullable: false,
            comment: "Fecha en que se reportó la situación"
        },
        dateResolved: {
            type: "datetime",
            nullable: true,
            comment: "Fecha en que se resolvió la intervención"
        },
        followUpDate: {
            type: "datetime",
            nullable: true,
            comment: "Fecha programada para seguimiento"
        },

        // Alcance y participantes
        interventionScope: {
            type: "varchar",
            default: "Individual",
            comment: "Alcance de la intervención \n" +
                "                \"Individual\",\n" +
                "                \"Grupal\",\n" +
                "                \"Curso\",\n" +
                "                \"Nivel\",\n" +
                "                \"Establecimiento\""
        },

        // Acciones y resultados
        actionsTaken: {
            type: "simple-array",
            nullable: true,
            comment: "Lista de acciones realizadas durante la intervención"
        },
        outcomeEvaluation: {
            type: "text",
            nullable: true,
            comment: "Evaluación de los resultados obtenidos"
        },

        // Retroalimentación
        parentFeedback: {
            type: "text",
            nullable: true,
            comment: "Retroalimentación del apoderado"
        },

        // Derivación externa
        requiresExternalReferral: {
            type: "boolean",
            default: false,
            comment: "Indica si requiere derivación a especialista externo"
        },
        externalReferralDetails: {
            type: "json",
            nullable: true,
            comment: "Detalles de la derivación externa (especialista, institución, motivo)"
        },

        // Información adicional
        documentacion: {
            type: "simple-array",
            nullable: true,
            comment: "Referencias a documentos relacionados (informes, certificados)"
        },
        acuerdos: {
            type: "text",
            nullable: true,
            comment: "Acuerdos establecidos con estudiante y/o apoderado"
        },
        seguimientoPIE: {
            type: "json",
            nullable: true,
            comment: "Registro de seguimiento del Programa de Integración Escolar"
        },
        estrategiasImplementadas: {
            type: "json",
            nullable: true,
            comment: "Estrategias específicas implementadas y sus resultados"
        },
        recursos: {
            type: "simple-array",
            nullable: true,
            comment: "Recursos utilizados en la intervención"
        },
        observaciones: {
            type: "text",
            nullable: true,
            comment: "Observaciones adicionales sobre la intervención"
        },

        // Metadatos del sistema
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
        // Solo mantenemos las relaciones originales
        student: {
            type: "many-to-one",
            target: "Student",
            inverseSide: "interventions",
            onDelete: "CASCADE",
            joinColumn: true,
            eager: true,
            comment: "Estudiante al que se realiza la intervención"
        },
        informer: {
            type: "many-to-one",
            target: "User",
            inverseSide: "reportedInterventions",
            joinColumn: true,
            eager: true,
            comment: "Usuario que reporta la intervención"
        },
        responsible: {
            type: "many-to-one",
            target: "User",
            inverseSide: "assignedInterventions",
            joinColumn: true,
            eager: true,
            comment: "Profesional responsable de la intervención"
        },
        comments: {
            type: "one-to-many",
            target: "InterventionComment",
            inverseSide: "intervention",
            cascade: true,
            comment: "Comentarios relacionados con la intervención"
        }
    },
    indices: [
        {
            name: "idx_intervention_status",
            columns: ["status"],
            comment: "Índice para búsqueda por estado"
        },
        {
            name: "idx_intervention_type",
            columns: ["type"],
            comment: "Índice para búsqueda por tipo de intervención"
        },
        {
            name: "idx_intervention_date",
            columns: ["dateReported"],
            comment: "Índice para búsqueda por fecha de reporte"
        },
        {
            name: "idx_intervention_priority",
            columns: ["priority"],
            comment: "Índice para búsqueda por nivel de prioridad"
        }
    ]
});

module.exports = Intervention;