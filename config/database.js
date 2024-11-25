const { DataSource } = require('typeorm');
const User = require('../entities/User');
const Student = require('../entities/Student');
const Intervention = require('../entities/Intervention');
const InterventionComment = require('../entities/InterventionComment');
const Audit = require('../entities/Audit');

const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: true,
    entities: [User, Student, Intervention, InterventionComment, Audit],
});

async function initializeDatabase() {
    try {
        console.log("Starting database initialization...");
        console.log("Entities loaded:", AppDataSource.options.entities);

        await AppDataSource.initialize();

        // Verificar que los repositorios están disponibles
        const studentRepo = AppDataSource.getRepository(Student);
        console.log("Student repository initialized:", studentRepo !== undefined);

        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error initializing database:", error);
        throw error;
    }
}

AppDataSource.isConnected = async () => {
    try {
        return AppDataSource.isInitialized;
    } catch (error) {
        return false;
    }
};

module.exports = {
    AppDataSource,
    initializeDatabase
};