import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize as db } from '../config/dbconfig';

interface NewsletterAttributes {
    id: number;
    email: string;
    subscribed: boolean;
}

type NewsletterCreationAttributes = Optional<NewsletterAttributes, 'id'>;


export class NewsletterModel extends Model<NewsletterAttributes, NewsletterCreationAttributes> {}


NewsletterModel.init({
   id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
   },
   email:{
    type: DataTypes.STRING,
    allowNull: false,
   },
   subscribed:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
   }
},{
    sequelize: db,
    tableName: "newsletters",
    modelName: "Newsletter"
});
