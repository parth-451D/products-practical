import { DataTypes } from "sequelize";
import { Tables } from "../config/tables";
import { Connection } from "../database";
import priceMappingModel from "./priceMapping";

const { sequelize } = Connection.get();

const productModel = sequelize.define(
  Tables.PRODUCTS,
  {
    id: {
      type: DataTypes.INTEGER,
      field: "id",
      primaryKey: true,
      autoIncrement: true,
      index: true,
    },
    name: {
      type: DataTypes.STRING,
      field: "name",
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
    tableName: Tables.PRODUCTS,
  }
);

productModel.hasMany(priceMappingModel, {
  as: "product_price_details",
  onDelete: "cascade",
  foreignKey: "product_id",
});

priceMappingModel.belongsTo(productModel, {
  as: "price_product_details",
  onDelete: "cascade",
  foreignKey: "product_id",
});

export default productModel;
