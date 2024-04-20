import { DataTypes } from "sequelize";
import { Tables } from "../config/tables";
import { Connection } from "../database";

const { sequelize } = Connection.get();

const priceMappingModel = sequelize.define(
  Tables.PRICE_MAPPING,
  {
    id: {
      type: DataTypes.INTEGER,
      field: "id",
      primaryKey: true,
      autoIncrement: true,
      index: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      field: "product_id",
    },
    color_id: {
      type: DataTypes.INTEGER,
      field: "color_id",
    },
    size_id: {
      type: DataTypes.INTEGER,
      field: "size_id",
    },
    price: {
      type: DataTypes.INTEGER,
      field: "price",
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
    tableName: Tables.PRICE_MAPPING,
  }
);

export default priceMappingModel;
