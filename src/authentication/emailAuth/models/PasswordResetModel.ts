import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize as db} from '../../../config/dbconfig';
import { UserModel } from '../../../appUsers/users/userModel';

interface PasswordResetAttributes {
    id: number;
    token: string;
    UserId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

type UserCreationAttributes = Optional<PasswordResetAttributes, 'id'>;


export class PasswordResetModel extends Model<PasswordResetAttributes, UserCreationAttributes> {}


PasswordResetModel.init({
   id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
   },
   token:{
    type: DataTypes.STRING,
    allowNull: false
   },
   UserId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: "user_id"
   }
},{
    sequelize: db,
    tableName: "password_reset",
    modelName: "PasswordReset"
});

UserModel.hasMany(PasswordResetModel);
PasswordResetModel.belongsTo(UserModel);