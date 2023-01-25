import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize as db } from '../config/dbconfig';
import { UserModel } from '../appUsers/users/userModel';

interface ReferralAttributes {
    id: number;
    UserId: number;
    fullName: string;
    email: string;
    paid: boolean;
    createdAt?: string;
    updatedAt?: string;
}

type ReferralCreationAttributes = Optional<ReferralAttributes, 'id'>;

export class ReferralModel extends Model<ReferralAttributes, ReferralCreationAttributes> { }

ReferralModel.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    UserId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "reffered_by"
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "full_name"
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

}, {
    sequelize: db,
    tableName: "referrals",
    modelName: "Referral"
});

UserModel.hasMany(ReferralModel);
ReferralModel.belongsTo(UserModel);


