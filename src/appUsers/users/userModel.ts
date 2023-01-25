import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize as db } from '../../config/dbconfig';

interface UserAttributes {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: "student" | "tutor" | "admin";
    referralCode: string;
    active: boolean;
    disabled: boolean;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;


export class UserModel extends Model<UserAttributes, UserCreationAttributes> {}


UserModel.init({
   id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
   },
   firstName:{
    type: DataTypes.STRING,
    allowNull: false,
    field: "first_name"
   },
   lastName:{
    type: DataTypes.STRING,
    allowNull: false,
    field: "last_name"
   },
   email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
   },
   phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "phone_number"
   },
   password: {
    type: DataTypes.STRING,
    allowNull: false
   },
   role: {
    type: DataTypes.STRING,
    allowNull: false
   },
   referralCode: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "referral_code"
   },
   active: {
    type: DataTypes.BOOLEAN,
    allowNull: false
   },
   disabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false
   }
},{
    sequelize: db,
    tableName: "users",
    modelName: "User"
})