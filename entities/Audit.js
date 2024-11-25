// src/entities/Audit.js
const { EntitySchema } = require('typeorm');

const Audit = new EntitySchema({
    name: "Audit",
    tableName: "audits",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            comment: "Identificador único del registro de auditoría"
        },
        // Añadir la columna userId que faltaba
        userId: {
            type: "int",
            nullable: true,
            comment: "ID del usuario que realizó la acción"
        },
        entityName: {
            type: "varchar",
            nullable: false,
            comment: "Nombre de la entidad o tabla afectada por la operación"
        },
        entityId: {
            type: "int",
            nullable: true,
            comment: "Identificador del registro específico afectado"
        },
        action: {
            type: "varchar",
            nullable: false,
            comment: "Tipo de operación realizada en el sistema \"CREAR\", \"MODIFICAR\", \"ELIMINAR\", \"VISUALIZAR\", \"DESCARGAR\""
        },
        oldValues: {
            type: "json",
            nullable: true,
            comment: "Valores anteriores del registro antes de la modificación"
        },
        newValues: {
            type: "json",
            nullable: true,
            comment: "Nuevos valores del registro después de la modificación"
        },
        details: {
            type: "text",
            nullable: true,
            comment: "Descripción detallada de la operación realizada"
        },
        ipAddress: {
            type: "varchar",
            nullable: true,
            comment: "Dirección IP desde donde se realizó la operación"
        },
        userAgent: {
            type: "varchar",
            nullable: true,
            comment: "Información del navegador o aplicación utilizada"
        },
        module: {
            type: "varchar",
            nullable: false,
            comment: "Módulo del sistema donde se realizó la operación \"ESTUDIANTES\", \"INTERVENCIONES\", \"USUARIOS\", \"DOCUMENTOS\", \"SISTEMA\""
        },
        createdAt: {
            type: "datetime",
            createDate: true,
            comment: "Fecha y hora exacta de la operación"
        }
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: {
                name: "userId",
                referencedColumnName: "id"
            },
            comment: "Usuario que realizó la operación en el sistema"
        }
    },
    indices: [
        {
            name: "idx_audit_entity",
            columns: ["entityName", "entityId"],
            comment: "Índice para búsquedas por entidad"
        },
        {
            name: "idx_audit_action",
            columns: ["action"],
            comment: "Índice para búsquedas por tipo de operación"
        },
        {
            name: "idx_audit_date",
            columns: ["createdAt"],
            comment: "Índice para búsquedas por fecha"
        },
        {
            name: "idx_audit_user",
            columns: ["userId"],
            comment: "Índice para búsquedas por usuario"
        },
        {
            name: "idx_audit_module",
            columns: ["module"],
            comment: "Índice para búsquedas por módulo"
        }
    ]
});

module.exports = Audit;