import { DataTypes } from "sequelize";
import { Tables } from "../config/tables";
import { Connection } from "../database";
import priceMappingModel from "./priceMapping";
import orderModel from "./orders";

const { sequelize } = Connection.get();

const sizeModel = sequelize.define(
  Tables.SIZES,
  {
    id: {
      type: DataTypes.INTEGER,
      field: "id",
      primaryKey: true,
      autoIncrement: true,
      index: true,
    },
    size: {
      type: DataTypes.STRING,
      field: "size",
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
    tableName: Tables.SIZES,
  }
);

sizeModel.hasMany(priceMappingModel, {
  as: "size_price_details",
  onDelete: "cascade",
  foreignKey: "size_id",
});

priceMappingModel.belongsTo(sizeModel, {
  as: "price_size_details",
  onDelete: "cascade",
  foreignKey: "size_id",
});

sizeModel.hasMany(orderModel, {
  as: "size_order_details",
  onDelete: "cascade",
  foreignKey: "size_id",
});

orderModel.belongsTo(sizeModel, {
  as: "order_size_details",
  onDelete: "cascade",
  foreignKey: "size_id",
});

export default sizeModel;
