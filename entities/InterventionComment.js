// src/entities/InterventionComment.js
const { EntitySchema } = require('typeorm');

const InterventionComment = new EntitySchema({
    name: "InterventionComment",
    tableName: "intervention_comments",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            comment: "Identificador único del comentario"
        },
        content: {
            type: "text",
            nullable: false,
            comment: "Contenido del comentario o registro"
        },
        tipo: {
            type: "varchar",
            default: "Seguimiento",
            comment: "Tipo de registro o comentario \"Seguimiento\",\n" +
                "                \"Entrevista\",\n" +
                "                \"Acuerdo\",\n" +
                "                \"Observación\",\n" +
                "                \"Derivación\",\n" +
                "                \"Contacto Apoderado\",\n" +
                "                \"Reunión Equipo\",\n" +
                "                \"Otro\""
        },
        evidencias: {
            type: "simple-array",
            nullable: true,
            comment: "Referencias a documentos o evidencias relacionadas"
        },
        isPrivate: {
            type: "boolean",
            default: false,
            comment: "Indica si el comentario es de carácter confidencial"
        },
        createdAt: {
            type: "datetime",
            createDate: true,
            comment: "Fecha y hora del registro"
        },
        updatedAt: {
            type: "datetime",
            updateDate: true,
            comment: "Fecha de última modificación"
        }
    },
    relations: {
        // Mantenemos las relaciones originales
        intervention: {
            type: "many-to-one",
            target: "Intervention",
            inverseSide: "comments",
            onDelete: "CASCADE",
            comment: "Intervención a la que pertenece el comentario"
        },
        user: {
            type: "many-to-one",
            target: "User",
            comment: "Usuario que realizó el comentario"
        }
    },
    indices: [
        {
            name: "idx_comment_date",
            columns: ["createdAt"],
            comment: "Índice para búsqueda por fecha de creación"
        },
        {
            name: "idx_comment_type",
            columns: ["tipo"],
            comment: "Índice para búsqueda por tipo de comentario"
        }
    ]
});

module.exports = InterventionComment;