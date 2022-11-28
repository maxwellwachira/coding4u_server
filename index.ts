import express, { Application, Request, Response } from 'express';
import cors from "cors";
import fileUpload from 'express-fileupload';
import path from "path";
import dotenv from 'dotenv';

//Sequelize Database Connector
import { dbAuthenticate } from "./src/config/dbconfig";
//Authentication Routes
import authRoutes from "./src/authentication/emailAuth/authRoutes";
//User Routes
import userRoutes from "./src/appUsers/users/userRoutes";
//zoom routes
import ZoomRoutes from "./src/zoom/zoomRoutes";
//email routes
import emailRoutes from "./src/email/emailRoutes";
//upload routes
import uploadRoutes from "./src/lms/uploads/uploadsRoutes";
//Enrolment ROutes
import enrolmentRoutes from "./src/lms/enrolments/enrolmentRoutes";

dotenv.config();

const app: Application = express();
const port = process.env.PORT;

app.use(cors({}));
app.options('*', cors());
app.use(express.json()); 
app.use(express.urlencoded({extended: false}));
app.use(fileUpload({
    createParentPath: true
}));

app.get('/image', (req: Request, res: Response) => {
    const filePath = req.query.filePath as string;
    const fullPath = path.join(__dirname, `../${filePath}`);
    console.log(fullPath);
    res.sendFile(fullPath);
})

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/zoom', ZoomRoutes);
app.use('/email',emailRoutes);    
app.use('/upload', uploadRoutes);
app.use('/enrolment', enrolmentRoutes);

app.listen(port,() => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    dbAuthenticate();
});