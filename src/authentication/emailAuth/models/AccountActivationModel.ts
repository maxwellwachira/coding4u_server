import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize as db} from '../../../config/dbconfig';
import { UserModel } from '../../../appUsers/users/userModel';

interface AccountActivationAttributes {
    id: number;
    token: string;
    UserId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

type UserCreationAttributes = Optional<AccountActivationAttributes, 'id'>;


export class AccountActivationModel extends Model<AccountActivationAttributes, UserCreationAttributes> {}


AccountActivationModel.init({
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
    tableName: "account_activation",
    modelName: "AccountActivation"
});

UserModel.hasMany(AccountActivationModel);
AccountActivationModel.belongsTo(UserModel);