import { DataTypes } from "sequelize";
import { Tables } from "../config/tables";
import { Connection } from "../database";

const { sequelize } = Connection.get();

const orderModel = sequelize.define(
  Tables.ORDERS,
  {
    id: {
      type: DataTypes.INTEGER,
      field: "id",
      primaryKey: true,
      autoIncrement: true,
      index: true,
    },
    email: {
      type: DataTypes.STRING,
      field: "email",
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
    coupon_used: {
      type: DataTypes.INTEGER,
      field: "coupon_used",
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
    tableName: Tables.ORDERS,
  }
);

export default orderModel;
