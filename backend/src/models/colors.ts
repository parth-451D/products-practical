import { DataTypes } from "sequelize";
import { Tables } from "../config/tables";
import { Connection } from "../database";
import priceMappingModel from "./priceMapping";

const { sequelize } = Connection.get();

const colorModel = sequelize.define(
  Tables.COLORS,
  {
    id: {
      type: DataTypes.INTEGER,
      field: "id",
      primaryKey: true,
      autoIncrement: true,
      index: true,
    },
    color: {
      type: DataTypes.STRING,
      field: "color",
    },
    color_code: {
      type: DataTypes.STRING,
      field: "color_code",
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "createdAt",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updatedAt",
    },
  },
  {
    tableName: Tables.COLORS,
  }
);

colorModel.hasMany(priceMappingModel, {
  as: "colort_price_details",
  onDelete: "cascade",
  foreignKey: "color_id",
});

priceMappingModel.belongsTo(colorModel, {
  as: "price_color_details",
  onDelete: "cascade",
  foreignKey: "color_id",
});

export default colorModel;
