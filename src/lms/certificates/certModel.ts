import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize as db } from '../../config/dbconfig';
import { UserModel } from '../../appUsers/users/userModel';

interface CertificateAttributes {
    id: number;
    UserId: number;
    CourseId: number;
    fullName: string;
    createdAt?: string;
    updatedAt?:string;
}

type CertificateCreationAttributes = Optional<CertificateAttributes, 'id'>;

export class CertificateModel extends Model<CertificateAttributes, CertificateCreationAttributes> {}

CertificateModel.init({
   id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
   },
   UserId: {
    type: DataTypes.BIGINT,
    field: "student_id"
   },
   CourseId: {
    type: DataTypes.INTEGER,
    field: "course_id"
   },
   fullName: {
    type: DataTypes.STRING,
    allowNull: true
   },
  
},{
    sequelize: db,
    tableName: "certificates",
    modelName: "Certificate"
});

UserModel.hasMany(CertificateModel);
CertificateModel.belongsTo(UserModel);



