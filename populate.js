const { AppDataSource } = require('./config/database');
const User = require('./entities/User');
const Student = require('./entities/Student');
const Intervention = require('./entities/Intervention');
const InterventionComment = require('./entities/InterventionComment');
const Audit = require('./entities/Audit');
const bcrypt = require('bcryptjs');

const hashPassword = (password) => bcrypt.hashSync(password, 10);

async function populateDatabase() {
    try {
        await AppDataSource.initialize();
        console.log("Database connected successfully");

        // Limpiar tablas antes de poblar
        await AppDataSource.manager.clear(Audit);
        await AppDataSource.manager.clear(InterventionComment);
        await AppDataSource.manager.clear(Intervention);
        await AppDataSource.manager.clear(Student);
        await AppDataSource.manager.clear(User);

        // Usuarios
        const users = Array.from({ length: 20 }, (_, i) => ({
            firstName: `Usuario${i + 1}`,
            lastName: `Apellido${i + 1}`,
            email: `usuario${i + 1}@example.com`,
            password: hashPassword("123456789"),
            rut: `${i + 12345678}-${i % 10}`,
            role: i % 2 === 0 ? 'Admin' : 'User',
            permisos: i % 2 === 0 ? ['CREATE', 'UPDATE', 'DELETE'] : ['VIEW', 'UPDATE'],
            staffType: i % 2 === 0 ? 'Directivo' : 'Docente',
            subjectsTeaching: i % 2 === 0 ? [] : ['Matemáticas', 'Lenguaje'],
            position: i % 2 === 0 ? 'Director' : 'Profesor',
            department: 'Departamento General',
            especialidad: 'Especialidad General',
            registroSecreduc: `${i + 1000}`,
            mencionesExtra: i % 2 === 0 ? ['Mención en Liderazgo'] : [],
            phoneNumber: `+56912345${i.toString().padStart(2, '0')}`,
            birthDate: new Date(1980 + i, i % 12, i % 28 + 1),
            address: `Calle Falsa ${i + 100}`,
            comuna: 'Providencia',
            region: 'Metropolitana',
            emergencyContact: {
                name: `Contacto${i + 1}`,
                relation: 'Hermano',
                phone: `+56987654${i.toString().padStart(2, '0')}`
            },
            tipoContrato: 'Planta',
            horasContrato: 44,
            fechaIngreso: new Date(2015, i % 12, i % 28 + 1),
            bieniosReconocidos: i % 5,
            evaluacionDocente: { year: 2022, result: 'Destacado' },
            isActive: true,
            configuracionNotificaciones: { email: true, sms: false },
            lastLogin: new Date(),
            loginAttempts: 0
        }));
        const savedUsers = await AppDataSource.manager.save(User, users);

        // Estudiantes
        const students = Array.from({ length: 20 }, (_, i) => ({
            firstName: `Estudiante${i + 1}`,
            lastName: `Apellido${i + 1}`,
            rut: `${i + 22033344}-${i % 10}`,
            email: `estudiante${i + 1}@example.com`,
            birthDate: new Date(2010, i % 12, i % 28 + 1),
            gender: 'Femenino',
            nationality: 'Chilena',
            grade: `${i % 4 + 1}° Medio`,
            academicYear: 2024,
            section: 'A',
            matriculaNumber: `20240${i + 1}`,
            enrollmentStatus: 'Regular',
            previousSchool: `Escuela XYZ ${i + 1}`,
            simceResults: { math: 250 + i, language: 260 + i },
            academicRecord: { math: '6.0', language: '5.5' },
            attendance: { total: 180, attended: 170 + i % 10 },
            address: `Calle Falsa ${i + 200}`,
            comuna: 'Providencia',
            region: 'Metropolitana',
            apoderadoTitular: {
                name: `Apoderado${i + 1}`,
                rut: `${i + 110222333}-${i % 10}`,
                phone: `+56912345${i.toString().padStart(2, '0')}`,
                email: `apoderado${i + 1}@example.com`,
                relation: 'Padre'
            },
            apoderadoSuplente: {
                name: `Apoderado Suplente${i + 1}`,
                rut: `${i + 22033344}-${i % 10}`,
                phone: `+56987654${i.toString().padStart(2, '0')}`,
                email: `apoderado.suplente${i + 1}@example.com`,
                relation: 'Madre'
            },
            grupoFamiliar: 'Padre, madre y dos hermanos',
            contactosEmergencia: [{ name: 'Tía Ana', phone: `+56999887${i % 10}66` }],
            prevision: 'Fonasa',
            grupoSanguineo: 'O+',
            condicionesMedicas: ['Asma'],
            alergias: ['Maní'],
            medicamentos: ['Inhalador'],
            diagnosticoPIE: { diagnosis: 'Dislexia' },
            necesidadesEducativas: ['Apoyo en lenguaje'],
            apoyosPIE: ['Apoyo en clase'],
            beneficioJUNAEB: true,
            tipoBeneficioJUNAEB: ['Beca Alimentación'],
            prioritario: false,
            preferente: true,
            becas: ['Beca Excelencia Académica'],
            isActive: true,
            observaciones: 'Estudiante con buen desempeño académico',
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        const savedStudents = await AppDataSource.manager.save(Student, students);

        // Intervenciones
        const interventions = Array.from({ length: 20 }, (_, i) => ({
            title: `Intervención ${i + 1}`,
            description: 'Seguimiento emocional del estudiante',
            type: 'Emocional',
            status: 'En Proceso',
            priority: 'Alta',
            dateReported: new Date(),
            dateResolved: null,
            followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            interventionScope: 'Individual',
            actionsTaken: ['Entrevista con apoderado', 'Derivación a psicólogo'],
            outcomeEvaluation: 'Se observa mejoría en conducta',
            student: savedStudents[i % savedStudents.length],
            informer: savedUsers[i % savedUsers.length],
            responsible: savedUsers[(i + 1) % savedUsers.length]
        }));
        const savedInterventions = await AppDataSource.manager.save(Intervention, interventions);

        // Comentarios
        const comments = Array.from({ length: 20 }, (_, i) => ({
            content: 'Se realizó contacto telefónico con el apoderado.',
            tipo: 'Contacto Apoderado',
            evidencias: ['Llamada registrada'],
            isPrivate: false,
            intervention: savedInterventions[i % savedInterventions.length],
            user: savedUsers[i % savedUsers.length]
        }));
        await AppDataSource.manager.save(InterventionComment, comments);

        console.log("Database seeded successfully with all fields populated.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

populateDatabase();
